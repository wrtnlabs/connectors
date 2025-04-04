import axios from "axios";
import { v4 } from "uuid";
import sharp from "sharp";
import typia from "typia";
import { FileManager, imageExtensions } from "@wrtnlabs/connector-shared";
import { GoogleDriveService } from "@wrtnlabs/connector-google-drive";
import { IGoogleSlidesService } from "../structures/IGoogleSlidesService";
import { google } from "googleapis";

export class GoogleSlidesService {
  constructor(
    private readonly props: IGoogleSlidesService.IProps,
    private readonly fileManager: FileManager,
  ) {}

  uploadPrefix: string = "google-slides-connector";

  /**
   * Google Slides Service.
   *
   * Export Google Slides presentations to Hanshow format
   */
  async createHanshow(input: {
    presentationId: string;
  }): Promise<IGoogleSlidesService.IExportHanshowOutput> {
    try {
      const accessToken = await this.refreshAccessToken();

      const mimeType = `application/vnd.openxmlformats-officedocument.presentationml.presentation`;
      const url = `https://www.googleapis.com/drive/v3/files/${input.presentationId}/?mimeType=${mimeType}`;
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: "arraybuffer",
      });

      const upload = await this.fileManager.upload({
        props: {
          type: "object",
          data: res.data,
          contentType: mimeType,
          path: `${this.uploadPrefix}/${v4()}.show`,
        },
      });

      return { hanshowUrl: upload.uri };
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Google Slides Service.
   *
   * Export Google Slides presentations to PowerPoint format
   *
   * A connector that can be used when creating stories or picture books.
   */
  async createPowerPoint(input: {
    presentationId: string;
  }): Promise<IGoogleSlidesService.IExportPresentationOutput> {
    try {
      const accessToken = await this.refreshAccessToken();

      const mimeType = `application/vnd.openxmlformats-officedocument.presentationml.presentation`;
      const url = `https://www.googleapis.com/drive/v3/files/${input.presentationId}/?mimeType=${mimeType}`;
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: "arraybuffer",
      });

      const upload = await this.fileManager.upload({
        props: {
          type: "object",
          data: res.data,
          contentType: mimeType,
          path: `${this.uploadPrefix}/${v4()}.pptx`,
        },
      });

      return { powerPointUrl: upload.uri };
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Google Slides Service.
   *
   * Retrieve a Google Slides presentation
   */
  async getPresentation(
    input: IGoogleSlidesService.IGetPresentationInput,
  ): Promise<IGoogleSlidesService.ISimplePresentationIdOutput> {
    try {
      const { presentationId } = input;

      const accessToken = await this.refreshAccessToken();

      const res = await axios.get(
        `https://slides.googleapis.com/v1/presentations/${presentationId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const data: IGoogleSlidesService.IPresentation = res.data;
      return {
        presentationId: data.presentationId,
        pageSize: data.pageSize,
        title: data.title,
      };
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * quick fix for s3 urls - need a more centralized solution
   * s3 bucket에 있는 이미지인 경우 presigned url 형식으로 변경
   *
   * @param input
   * @returns
   */
  async transformUrl(
    input: IGoogleSlidesService.IAppendSlideInput,
  ): Promise<IGoogleSlidesService.IAppendSlideInput> {
    // if there are s3 buckets urls, get presigned url
    const matched = Array.from(
      new Set(
        JSON.stringify(input).match(
          /https?:\/\/([^.]+)\.s3(?:\.([^.]+))?\.amazonaws\.com\/([a-zA-Z0-9\/.\-_%]+)/gu, // 여기는 gu 플래그, 특히 무조건 g를 써야 한다.
        ),
      ),
    );

    if (!matched) {
      return input;
    }

    const transformed = await Promise.all(matched.map((match) => match));

    // let stringified = JSON.stringify(input);
    // matched.forEach((match, index) => {
    //   stringified = stringified.replaceAll(match, transformed[index]);
    // });

    // return typia.assert<IGoogleSlidesService.AppendSlideInput>(
    //   JSON.parse(stringified),
    // );

    matched.forEach((matchedUrl, index) => {
      for (const template of input.templates) {
        if (template.contents instanceof Array) {
          template.contents.forEach((content) => {
            if (content.url.includes(matchedUrl)) {
              content.url = transformed[index]!;
            }
          });
        } else {
          if (template.contents.url.includes(matchedUrl)) {
            template.contents.url = transformed[index]!;
          }
        }
      }
    });

    return input;
  }

  /**
   * Google Slides Service.
   *
   * Add slides to a Google Slides presentation
   *
   * Use this connector with connector/google-slides/presentations when creating a story or picture book.
   * When creating a story or picture book, insert the story and pictures created using this connector into the presentation created from connector/google-slides/presentations connector.
   * Be careful not to use this connector when creating a story or picture book, as it may result in an empty picture book.
   * Slide type must be one of: "Vertical", "Square", "Landscape", "Entire", "QuarterDivision".
   * It is common to choose a "Square" type when there is one image.
   *
   * You may need an image when the user asks you to add a slide.
   * In this case, rather than inserting any image, you should first secure the image using a search connector or an image creation connector.
   * It is safe to ask the user for consent to this process.
   */
  async appendImageSlide(
    input: IGoogleSlidesService.IAppendSlideInput,
  ): Promise<IGoogleSlidesService.ISimplePresentationIdOutput> {
    try {
      input = await this.transformUrl(input);

      const presentation = await this.getPresentation({
        presentationId: input.id,
      });

      const size = this.getSize(presentation);
      const body = this.createSlide({ ...input, size });

      await this.appendSlide({ presentationId: input.id, body });

      return {
        presentationId: presentation.presentationId,
        pageSize: presentation.pageSize,
        title: presentation.title,
      };
    } catch (err) {
      console.error(JSON.stringify((err as any).response.data));
      throw err;
    }
  }

  /**
   * Google Slides Service.
   *
   * Add "QuarterDivision" type slides to a Google Slides presentation
   *
   * The "QuarterDivision" type slides are templates that are designed to place images and text in the upper left, upper right, lower left, and lower right, like a four-cut cartoon.
   * Four images are required for this template, and the text is located right under each image.
   *
   * You may need an image when the user asks you to add a slide.
   * In this case, rather than inserting any image, you should first secure the image using a search connector or an image creation connector.
   * It is safe to ask the user for consent to this process.
   */
  async appendQuarterDivisionImageSlide(
    input: IGoogleSlidesService.IAppendQuarterDivisionSlideInput & {
      presentationId: string;
    },
  ): Promise<IGoogleSlidesService.ISimplePresentationIdOutput> {
    return this.appendSlidesByType({ ...input, type: "QuarterDivision" });
  }

  /**
   * Google Slides Service.
   *
   * Add "Entire" type slides to a Google Slides presentation
   *
   * The "Entire" type of slide is a template that packs an image all over, and you can't put any extra text in it. Maybe it's usually suitable for putting a cover.
   * Because ordinary presentations have longer horizontal lengths, if you put a square image, gaps on the left and right can appear large.
   *
   * You may need an image when the user asks you to add a slide.
   * In this case, rather than inserting any image, you should first secure the image using a search connector or an image creation connector.
   * It is safe to ask the user for consent to this process.
   */
  async appendEntireImageSlide(
    input: IGoogleSlidesService.IAppendEntireSlideInput & {
      presentationId: string;
    },
  ): Promise<IGoogleSlidesService.ISimplePresentationIdOutput> {
    return this.appendSlidesByType({ ...input, type: "Entire" });
  }

  /**
   * Google Slides Service.
   *
   * Add "Landscape" type slides to a Google Slides presentation
   *
   * The "Landscape" type template fits text underneath with a longer horizontal image tightly packed like a background.
   * It is suitable when the image is highlighted and the text is short.
   * It is suitable for marking images and titles as if they were on display.
   *
   * You may need an image when the user asks you to add a slide.
   * In this case, rather than inserting any image, you should first secure the image using a search connector or an image creation connector.
   * It is safe to ask the user for consent to this process.
   */
  async appendLandscapeImageSlide(
    input: IGoogleSlidesService.IAppendLandscapeSlideInput & {
      presentationId: string;
    },
  ): Promise<IGoogleSlidesService.ISimplePresentationIdOutput> {
    return this.appendSlidesByType({ ...input, type: "Landscape" });
  }

  /**
   * Google Slides Service.
   *
   * Add "Square" type slides to a Google Slides presentation
   *
   * The "Square" type slides put square images and text. In this case, you should put at least four to five lines of text, because there is so much space to put text.
   * The picture is on the left, and the text is on the right.
   *
   * You may need an image when the user asks you to add a slide.
   * In this case, rather than inserting any image, you should first secure the image using a search connector or an image creation connector.
   * It is safe to ask the user for consent to this process.
   */
  async appendSquareImageSlide(
    input: IGoogleSlidesService.IAppendSquareSlideInput & {
      presentationId: string;
    },
  ): Promise<IGoogleSlidesService.ISimplePresentationIdOutput> {
    return this.appendSlidesByType({ ...input, type: "Square" });
  }

  /**
   * Google Slides Service.
   *
   * Add "Vertical" type slides to a Google Slides presentation
   *
   * The "Vertical" type is like a square type slide, with an image on the left and text on the right.
   * In this case, unlike the square type, the image is filled to the height of the presentation while maintaining the proportion.
   * This also allows for enough text.
   *
   * You may need an image when the user asks you to add a slide.
   * In this case, rather than inserting any image, you should first secure the image using a search connector or an image creation connector.
   * It is safe to ask the user for consent to this process.
   */
  async appendVerticalImageSlide(
    input: IGoogleSlidesService.IAppendVerticalSlideInput & {
      presentationId: string;
    },
  ): Promise<IGoogleSlidesService.ISimplePresentationIdOutput> {
    return this.appendSlidesByType({ ...input, type: "Vertical" });
  }

  private async appendSlidesByType(
    input: (
      | IGoogleSlidesService.IAppendQuarterDivisionSlideInput
      | IGoogleSlidesService.IAppendEntireSlideInput
      | IGoogleSlidesService.IAppendLandscapeSlideInput
      | IGoogleSlidesService.IAppendVerticalSlideInput
      | IGoogleSlidesService.IAppendSquareSlideInput
    ) & {
      presentationId: string;
      type: "QuarterDivision" | "Entire" | "Landscape" | "Square" | "Vertical";
    },
  ): Promise<IGoogleSlidesService.ISimplePresentationIdOutput> {
    const { templates } = input;
    const presentation = await this.getPresentation({
      presentationId: input.presentationId,
    });

    const size = this.getSize(presentation);
    const typed = {
      templates: templates.map((el) => ({ ...el, type: input.type })),
    };
    const body = this.createSlide({ ...(typed as any), size });

    await this.appendSlide({ body, presentationId: input.presentationId });

    return presentation;
  }

  /**
   * Google Slides Service.
   *
   * Create a Google Slides presentation
   *
   * This connector can be used when creating a story or picture book.
   * Please use it with the connector/google-slides/image-slide connector when creating a story or picture book.
   * When creating a story or picture book, create a new presentation with this connector and insert the created story and picture into the slide using other connector.
   * This creates a blank presentation file, which is basically created with the first slide with no text.
   */
  async createPresentation(): Promise<IGoogleSlidesService.ISimplePresentationIdOutput> {
    try {
      const accessToken = await this.refreshAccessToken();

      const res = await axios.post(
        "https://slides.googleapis.com/v1/presentations",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const data: IGoogleSlidesService.IPresentation = res.data;
      return {
        presentationId: data.presentationId,
        pageSize: data.pageSize,
        title: data.title,
      };
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  private createQuarterDivisionImageSlide(input: {
    templates: IGoogleSlidesService.Template.QuarterDivision[];
    presentationSize: {
      height: number; // heigh와 width의 크기가 같다.
      width: number;
      unit?: IGoogleSlidesService.Unit | null;
    };
  }): IGoogleSlidesService.BatchUpdateInput[] {
    const { templates, presentationSize } = input;
    const slideId = v4();
    const firstImageId = v4();
    const firstShapeId = v4();

    const secondImageId = v4();
    const secondShapeId = v4();

    const thirdImageId = v4();
    const thirdShapeId = v4();

    const fourthImageId = v4();
    const fourthShapeId = v4();

    const imageWidthSize = presentationSize.width * 0.25;
    const imageHeightSize = presentationSize.width * 0.25;
    const textBoxWidthSize = imageWidthSize * 0.75;
    const blank = {
      width:
        (presentationSize.width - (imageWidthSize + textBoxWidthSize) * 2) / 3,
      height: (presentationSize.height - imageHeightSize * 2) / 3,
    };

    return templates.flatMap(
      (template): IGoogleSlidesService.BatchUpdateInput[] => {
        return [
          /**
           * 1번 이미지와 텍스트 필드.
           */
          {
            createSlide: { objectId: slideId },
          },
          {
            createImage: {
              objectId: firstImageId,
              elementProperties: {
                pageObjectId: slideId,
                size: {
                  height: {
                    magnitude: imageWidthSize,
                    unit: presentationSize.unit,
                  },
                  width: {
                    magnitude: imageHeightSize,
                    unit: presentationSize.unit,
                  },
                },
                transform: {
                  translateX: blank.width,
                  translateY: blank.height,
                  scaleX: 1,
                  scaleY: 1,
                  shearX: 0,
                  shearY: 0,
                  unit: presentationSize.unit,
                },
              },
              url: template.contents[0]?.url,
            },
          },
          {
            createShape: {
              objectId: firstShapeId,
              elementProperties: {
                pageObjectId: slideId,
                size: {
                  height: {
                    magnitude: imageHeightSize,
                    unit: presentationSize.unit,
                  },
                  width: {
                    magnitude: textBoxWidthSize,
                    unit: presentationSize.unit,
                  },
                },
                transform: {
                  translateX: blank.width + imageWidthSize,
                  translateY: blank.height,
                  scaleX: 1,
                  scaleY: 1,
                  shearX: 0,
                  shearY: 0,
                  unit: presentationSize.unit,
                },
              },
              shapeType: "TEXT_BOX",
            },
          },
          {
            insertText: {
              text: template.contents[0]?.text.text,
              objectId: firstShapeId,
            },
          },
          {
            updateTextStyle: {
              fields: "*",
              style: {
                baselineOffset: "SUPERSCRIPT",
                fontFamily: "Arial",
                fontSize: {
                  magnitude: 18,
                  unit: "PT",
                },
              },
              objectId: firstShapeId,
            },
          },

          /**
           * 2번 이미지와 텍스트 필드.
           */
          {
            createImage: {
              objectId: secondImageId,
              elementProperties: {
                pageObjectId: slideId,
                size: {
                  height: {
                    magnitude: imageWidthSize,
                    unit: presentationSize.unit,
                  },
                  width: {
                    magnitude: imageHeightSize,
                    unit: presentationSize.unit,
                  },
                },
                transform: {
                  translateX:
                    blank.width +
                    imageWidthSize +
                    textBoxWidthSize +
                    blank.width,
                  translateY: blank.height,
                  scaleX: 1,
                  scaleY: 1,
                  shearX: 0,
                  shearY: 0,
                  unit: presentationSize.unit,
                },
              },
              url: template.contents[1]?.url,
            },
          },
          {
            createShape: {
              objectId: secondShapeId,
              elementProperties: {
                pageObjectId: slideId,
                size: {
                  height: {
                    magnitude: imageHeightSize,
                    unit: presentationSize.unit,
                  },
                  width: {
                    magnitude: textBoxWidthSize,
                    unit: presentationSize.unit,
                  },
                },
                transform: {
                  translateX:
                    blank.width +
                    imageWidthSize +
                    imageWidthSize +
                    textBoxWidthSize +
                    blank.width,
                  translateY: blank.height,
                  scaleX: 1,
                  scaleY: 1,
                  shearX: 0,
                  shearY: 0,
                  unit: presentationSize.unit,
                },
              },
              shapeType: "TEXT_BOX",
            },
          },
          {
            insertText: {
              text: template.contents[1]?.text.text,
              objectId: secondShapeId,
            },
          },
          {
            updateTextStyle: {
              fields: "*",
              style: {
                baselineOffset: "SUPERSCRIPT",
                fontFamily: "Arial",
                fontSize: {
                  magnitude: 18,
                  unit: "PT",
                },
              },
              objectId: secondShapeId,
            },
          },

          /**
           * 3번 이미지와 텍스트 필드.
           */
          {
            createImage: {
              objectId: thirdImageId,
              elementProperties: {
                pageObjectId: slideId,
                size: {
                  height: {
                    magnitude: imageWidthSize,
                    unit: presentationSize.unit,
                  },
                  width: {
                    magnitude: imageHeightSize,
                    unit: presentationSize.unit,
                  },
                },
                transform: {
                  translateX: blank.width,
                  translateY: blank.height + imageHeightSize + blank.height,
                  scaleX: 1,
                  scaleY: 1,
                  shearX: 0,
                  shearY: 0,
                  unit: presentationSize.unit,
                },
              },
              url: template.contents[2]?.url,
            },
          },
          {
            createShape: {
              objectId: thirdShapeId,
              elementProperties: {
                pageObjectId: slideId,
                size: {
                  height: {
                    magnitude: imageHeightSize,
                    unit: presentationSize.unit,
                  },
                  width: {
                    magnitude: textBoxWidthSize,
                    unit: presentationSize.unit,
                  },
                },
                transform: {
                  translateX: blank.width + imageWidthSize,
                  translateY: blank.height + imageHeightSize + blank.height,
                  scaleX: 1,
                  scaleY: 1,
                  shearX: 0,
                  shearY: 0,
                  unit: presentationSize.unit,
                },
              },
              shapeType: "TEXT_BOX",
            },
          },
          {
            insertText: {
              text: template.contents[2]?.text.text,
              objectId: thirdShapeId,
            },
          },
          {
            updateTextStyle: {
              fields: "*",
              style: {
                baselineOffset: "SUPERSCRIPT",
                fontFamily: "Arial",
                fontSize: {
                  magnitude: 18,
                  unit: "PT",
                },
              },
              objectId: thirdShapeId,
            },
          },

          /**
           * 4번째 이미지와 텍스트 필드.
           */
          {
            createImage: {
              objectId: fourthImageId,
              elementProperties: {
                pageObjectId: slideId,
                size: {
                  height: {
                    magnitude: imageWidthSize,
                    unit: presentationSize.unit,
                  },
                  width: {
                    magnitude: imageHeightSize,
                    unit: presentationSize.unit,
                  },
                },
                transform: {
                  translateX:
                    blank.width +
                    imageWidthSize +
                    textBoxWidthSize +
                    blank.width,
                  translateY: blank.height + imageHeightSize + blank.height,
                  scaleX: 1,
                  scaleY: 1,
                  shearX: 0,
                  shearY: 0,
                  unit: presentationSize.unit,
                },
              },
              url: template.contents[3]?.url,
            },
          },
          {
            createShape: {
              objectId: fourthShapeId,
              elementProperties: {
                pageObjectId: slideId,
                size: {
                  height: {
                    magnitude: imageHeightSize,
                    unit: presentationSize.unit,
                  },
                  width: {
                    magnitude: textBoxWidthSize,
                    unit: presentationSize.unit,
                  },
                },
                transform: {
                  translateX:
                    blank.width +
                    imageWidthSize +
                    imageWidthSize +
                    textBoxWidthSize +
                    blank.width,
                  translateY: blank.height + imageHeightSize + blank.height,
                  scaleX: 1,
                  scaleY: 1,
                  shearX: 0,
                  shearY: 0,
                  unit: presentationSize.unit,
                },
              },
              shapeType: "TEXT_BOX",
            },
          },
          {
            insertText: {
              text: template.contents[3]?.text.text,
              objectId: fourthShapeId,
            },
          },
          {
            updateTextStyle: {
              fields: "*",
              style: {
                baselineOffset: "SUPERSCRIPT",
                fontFamily: "Arial",
                fontSize: {
                  magnitude: 18,
                  unit: "PT",
                },
              },
              objectId: fourthShapeId,
            },
          },
        ];
      },
    );
  }

  private createEntireImageSlide(input: {
    templates: IGoogleSlidesService.Template.Entire[];
    presentationSize: {
      height: number; // heigh와 width의 크기가 같다.
      width: number;
      unit?: IGoogleSlidesService.Unit | null;
    };
  }): IGoogleSlidesService.BatchUpdateInput[] {
    const { templates, presentationSize } = input;
    const slideId = v4();
    const imageId = v4();

    return templates.flatMap(
      (template): IGoogleSlidesService.BatchUpdateInput[] => {
        return [
          {
            createSlide: { objectId: slideId },
          },
          {
            createImage: {
              objectId: imageId,
              elementProperties: {
                pageObjectId: slideId,
                size: {
                  height: {
                    magnitude: presentationSize.height,
                    unit: presentationSize.unit,
                  },
                  width: {
                    magnitude: presentationSize.width,
                    unit: presentationSize.unit,
                  },
                },
              },
              url: template.contents.url,
            },
          },
        ];
      },
    );
  }

  private createLandscapeImageSlide(input: {
    templates: IGoogleSlidesService.Template.Landscape[];
    presentationSize: {
      height: number; // heigh와 width의 크기가 같다.
      width: number;
      unit?: IGoogleSlidesService.Unit | null;
    };
  }): IGoogleSlidesService.BatchUpdateInput[] {
    const { templates, presentationSize } = input;
    const slideId = v4();
    const imageId = v4();
    const shapeId = v4();

    return templates.flatMap(
      (template): IGoogleSlidesService.BatchUpdateInput[] => {
        return [
          {
            createSlide: { objectId: slideId },
          },
          {
            createImage: {
              objectId: imageId,
              elementProperties: {
                pageObjectId: slideId,
                size: {
                  height: {
                    magnitude: presentationSize.height * 0.75,
                    unit: presentationSize.unit,
                  },
                  width: {
                    magnitude: presentationSize.width,
                    unit: presentationSize.unit,
                  },
                },
              },
              url: template.contents.url,
            },
          },
          {
            createShape: {
              objectId: shapeId,
              elementProperties: {
                pageObjectId: slideId,
                size: {
                  height: {
                    magnitude: presentationSize.height * 0.25,
                    unit: presentationSize.unit,
                  },
                  width: {
                    magnitude: presentationSize.width,
                    unit: presentationSize.unit,
                  },
                },
                transform: {
                  translateX: 0,
                  translateY: presentationSize.height * 0.75,
                  scaleX: 1,
                  scaleY: 1,
                  shearX: 0,
                  shearY: 0,
                  unit: presentationSize.unit,
                },
              },
              shapeType: "TEXT_BOX",
            },
          },
          {
            insertText: {
              text: template.contents.text.text,
              objectId: shapeId,
            },
          },
          {
            updateTextStyle: {
              fields: "*",
              style: {
                baselineOffset: "SUPERSCRIPT",
                fontFamily: "Arial",
                fontSize: {
                  magnitude: 18,
                  unit: "PT",
                },
              },
              objectId: shapeId,
            },
          },
        ];
      },
    );
  }

  private createVerticalImageSlide(input: {
    templates: IGoogleSlidesService.Template.Vertical[];
    presentationSize: {
      height: number; // heigh와 width의 크기가 같다.
      width: number;
      unit?: IGoogleSlidesService.Unit | null;
    };
  }): IGoogleSlidesService.BatchUpdateInput[] {
    const { templates, presentationSize } = input;
    const slideId = v4();
    const imageId = v4();
    const shapeId = v4();

    return templates.flatMap(
      (template): IGoogleSlidesService.BatchUpdateInput[] => {
        return [
          {
            createSlide: { objectId: slideId },
          },
          {
            createImage: {
              objectId: imageId,
              elementProperties: {
                pageObjectId: slideId,
                size: {
                  height: {
                    magnitude: presentationSize.height,
                    unit: presentationSize.unit,
                  },
                  width: {
                    magnitude: presentationSize.width / 2,
                    unit: presentationSize.unit,
                  },
                },
              },
              url: template.contents.url,
            },
          },
          {
            createShape: {
              objectId: shapeId,
              elementProperties: {
                pageObjectId: slideId,
                size: {
                  height: {
                    magnitude: presentationSize.height,
                    unit: presentationSize.unit,
                  },
                  width: {
                    magnitude: presentationSize.width / 2,
                    unit: presentationSize.unit,
                  },
                },
                transform: {
                  translateX: presentationSize.width / 2,
                  translateY: 0,
                  scaleX: 1,
                  scaleY: 1,
                  shearX: 0,
                  shearY: 0,
                  unit: presentationSize.unit,
                },
              },
              shapeType: "TEXT_BOX",
            },
          },
          {
            insertText: {
              text: template.contents.text.text,
              objectId: shapeId,
            },
          },
          {
            updateTextStyle: {
              fields: "*",
              style: {
                baselineOffset: "SUPERSCRIPT",
                fontFamily: "Arial",
                fontSize: {
                  magnitude: 18,
                  unit: "PT",
                },
              },
              objectId: shapeId,
            },
          },
        ];
      },
    );
  }

  private createSqaureImageSlide(input: {
    templates: IGoogleSlidesService.Template.Square[];
    presentationSize: {
      height: number; // heigh와 width의 크기가 같다.
      width: number;
      unit?: IGoogleSlidesService.Unit | null;
    };
  }): IGoogleSlidesService.BatchUpdateInput[] {
    const { templates, presentationSize } = input;
    const slideId = v4();
    const imageId = v4();
    const shapeId = v4();

    return templates.flatMap(
      (template): IGoogleSlidesService.BatchUpdateInput[] => {
        return [
          { createSlide: { objectId: slideId } },
          {
            createImage: {
              objectId: imageId,
              elementProperties: {
                pageObjectId: slideId,
                size: {
                  height: {
                    magnitude: presentationSize.height,
                    unit: presentationSize.unit,
                  },
                  width: {
                    magnitude: presentationSize.height,
                    unit: presentationSize.unit,
                  },
                },
              },
              url: template.contents.url,
            },
          },
          {
            createShape: {
              objectId: shapeId,
              elementProperties: {
                pageObjectId: slideId,
                size: {
                  height: {
                    magnitude: presentationSize.height,
                    unit: presentationSize.unit,
                  },
                  width: {
                    magnitude: presentationSize.width - presentationSize.height,
                    unit: presentationSize.unit,
                  },
                },
                transform: {
                  translateX: presentationSize.height,
                  translateY: 0,
                  scaleX: 1,
                  scaleY: 1,
                  shearX: 0,
                  shearY: 0,
                  unit: presentationSize.unit,
                },
              },
              shapeType: "TEXT_BOX",
            },
          },
          {
            insertText: {
              text: template.contents.text.text,
              objectId: shapeId,
            },
          },
          {
            updateTextStyle: {
              fields: "*",
              style: {
                baselineOffset: "SUPERSCRIPT",
                fontFamily: "Arial",
                fontSize: {
                  magnitude: 18,
                  unit: "PT",
                },
              },
              objectId: shapeId,
            },
          },
        ];
      },
    );
  }

  private getSize(presentation: IGoogleSlidesService.IPresentation) {
    const height = presentation.pageSize?.height?.magnitude as number;
    const unit = presentation.pageSize?.height?.unit;
    const width = presentation.pageSize?.width?.magnitude as number;

    return { height, width, unit };
  }

  private createSlide(
    input: Pick<IGoogleSlidesService.IAppendSlideInput, "templates"> & {
      size: {
        height: number;
        width: number;
        unit?: IGoogleSlidesService.Unit | null;
      };
    },
  ): Pick<IGoogleSlidesService.IUpdatePresentationInput, "requests"> {
    const body: Pick<
      IGoogleSlidesService.IUpdatePresentationInput,
      "requests"
    > = {
      requests: input.templates
        .flatMap((template): IGoogleSlidesService.BatchUpdateInput[] => {
          if (template.type === "Vertical") {
            return this.createVerticalImageSlide({
              templates: [template],
              presentationSize: input.size,
            });
          } else if (template.type === "Square") {
            return this.createSqaureImageSlide({
              templates: [template],
              presentationSize: input.size,
            });
          } else if (template.type === "Landscape") {
            return this.createLandscapeImageSlide({
              templates: [template],
              presentationSize: input.size,
            });
          } else if (template.type === "Entire") {
            return this.createEntireImageSlide({
              templates: [template],
              presentationSize: input.size,
            });
          } else if (template.type === "QuarterDivision") {
            return this.createQuarterDivisionImageSlide({
              templates: [template],
              presentationSize: input.size,
            });
          }

          return null!;
        })
        .filter(Boolean),
    };

    return body;
  }

  private async appendSlide(input: {
    presentationId: string;
    body: Pick<IGoogleSlidesService.IUpdatePresentationInput, "requests">;
  }): Promise<void> {
    const accessToken = await this.refreshAccessToken();

    const is = typia.createIs<{
      createImage: IGoogleSlidesService.ICreateImageRequest;
    }>();

    const name = "connector/google-slides";

    const googleDriveService = new GoogleDriveService({
      ...this.props,
    });

    let googleSlideFolderId = await googleDriveService.getFolderByName({
      name: name,
    });

    if (googleSlideFolderId === null) {
      googleSlideFolderId = (
        await googleDriveService.createFolder({
          name,
        })
      ).id;
    }

    // 이미지가 저장된 적 없는 이미지인 경우, 즉 s3 저장소가 아닌 경우 저장을 하여 대치한다.
    await Promise.all(
      input.body.requests.map(async (request) => {
        if (is(request)) {
          if (request.createImage.url) {
            const res = await axios.get(request.createImage.url, {
              responseType: "arraybuffer",
            });

            const originalImage = sharp(res.data);
            const format = (await originalImage.metadata()).format;
            if (imageExtensions.some((ext) => ext === format)) {
              const jpg = await originalImage.jpeg({ quality: 100 }).toBuffer();
              const saved = await this.fileManager.upload({
                props: {
                  contentType: "image/jpg",
                  data: jpg,
                  path: `${v4()}.jpg`,
                  type: "object",
                },
              });

              request.createImage.url = saved.uri;
            }
          }
        }
      }),
    );

    try {
      await axios.post(
        `https://slides.googleapis.com/v1/presentations/${input.presentationId}:batchUpdate`,
        input.body,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    } catch (err) {
      console.error(JSON.stringify((err as any).response.data));
      throw err;
    }
  }

  /**
   * Google Auth Service.
   *
   * Request to reissue Google access token
   */
  private async refreshAccessToken(): Promise<string> {
    const client = new google.auth.OAuth2(
      this.props.googleClientId,
      this.props.googleClientSecret,
    );

    client.setCredentials({
      refresh_token: decodeURIComponent(this.props.googleRefreshToken),
    });
    const { credentials } = await client.refreshAccessToken();
    const accessToken = credentials.access_token;

    if (!accessToken) {
      throw new Error("Failed to refresh access token");
    }

    return accessToken;
  }
}
