import axios from "axios";
import { v4 } from "uuid";
import sharp from "sharp";
import { GoogleService } from "@wrtnlabs/connector-google";
import { AwsS3Service } from "@wrtnlabs/connector-aws-s3";
import typia from "typia";
import { imageExtensions } from "@wrtnlabs/connector-shared";
import { GoogleDriveService } from "@wrtnlabs/connector-google-drive";
import { IGoogleSlidesService } from "../structures/IGoogleSlidesService";

export class GoogleSlidesService {
  private readonly s3: AwsS3Service;

  constructor(private readonly props: IGoogleSlidesService.IProps) {
    this.s3 = new AwsS3Service({
      ...this.props.aws.s3,
    });
  }

  uploadPrefix: string = "google-slides-connector";

  async createHanshow(input: {
    presentationId: string;
  }): Promise<IGoogleSlidesService.IExportHanshowOutput> {
    try {
      const googleService = new GoogleService({
        clientId: this.props.clientId,
        clientSecret: this.props.clientSecret,
        secret: this.props.secret,
      });

      const accessToken = await googleService.refreshAccessToken();

      const mimeType = `application/vnd.openxmlformats-officedocument.presentationml.presentation`;
      const url = `https://www.googleapis.com/drive/v3/files/${input.presentationId}/?mimeType=${mimeType}`;
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: "arraybuffer",
      });

      const hanshow = await this.s3.uploadObject({
        contentType: mimeType,
        data: res.data,
        key: `${this.uploadPrefix}/${v4()}.show`,
      });
      return { hanshow };
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  async createPowerPoint(input: {
    presentationId: string;
  }): Promise<IGoogleSlidesService.IExportPresentationOutput> {
    try {
      const googleService = new GoogleService({
        clientId: this.props.clientId,
        clientSecret: this.props.clientSecret,
        secret: this.props.secret,
      });

      const accessToken = await googleService.refreshAccessToken();

      const mimeType = `application/vnd.openxmlformats-officedocument.presentationml.presentation`;
      const url = `https://www.googleapis.com/drive/v3/files/${input.presentationId}/?mimeType=${mimeType}`;
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: "arraybuffer",
      });

      const powerPoint = await this.s3.uploadObject({
        contentType: mimeType,
        data: res.data,
        key: `${this.uploadPrefix}/${v4()}.pptx`,
      });
      return { powerPoint };
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  async getPresentation(
    input: IGoogleSlidesService.IGetPresentationInput,
  ): Promise<IGoogleSlidesService.ISimplePresentationIdOutput> {
    try {
      const googleService = new GoogleService({
        clientId: this.props.clientId,
        clientSecret: this.props.clientSecret,
        secret: this.props.secret,
      });

      const { presentationId } = input;

      const accessToken = await googleService.refreshAccessToken();

      const res = await axios.get(
        `https://slides.googleapis.com/v1/presentations/${presentationId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const data: IGoogleSlidesService.Presentation = res.data;
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
    input: IGoogleSlidesService.AppendSlideInput,
  ): Promise<IGoogleSlidesService.AppendSlideInput> {
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

    const transformed = await Promise.all(
      matched.map(async (match) => this.s3.getGetObjectUrl({ fileUrl: match })),
    );

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

  async appendImageSlide(
    input: IGoogleSlidesService.AppendSlideInput,
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

  async appendSlidesByType(
    input: (
      | IGoogleSlidesService.AppendQuarterDivisionSlideInput
      | IGoogleSlidesService.AppendEntireSlideInput
      | IGoogleSlidesService.AppendLandscapeSlideInput
      | IGoogleSlidesService.AppendVerticalSlideInput
      | IGoogleSlidesService.AppendSquareSlideInput
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

  async createPresentation(): Promise<IGoogleSlidesService.ISimplePresentationIdOutput> {
    try {
      const googleService = new GoogleService({
        clientId: this.props.clientId,
        clientSecret: this.props.clientSecret,
        secret: this.props.secret,
      });

      const accessToken = await googleService.refreshAccessToken();

      const res = await axios.post(
        "https://slides.googleapis.com/v1/presentations",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const data: IGoogleSlidesService.Presentation = res.data;
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

  createQuarterDivisionImageSlide(input: {
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

  createEntireImageSlide(input: {
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

  createLandscapeImageSlide(input: {
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

  createVerticalImageSlide(input: {
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

  createSqaureImageSlide(input: {
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

  getSize(presentation: IGoogleSlidesService.Presentation) {
    const height = presentation.pageSize?.height?.magnitude as number;
    const unit = presentation.pageSize?.height?.unit;
    const width = presentation.pageSize?.width?.magnitude as number;

    return { height, width, unit };
  }

  createSlide(
    input: Pick<IGoogleSlidesService.AppendSlideInput, "templates"> & {
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

  async appendSlide(input: {
    presentationId: string;
    body: Pick<IGoogleSlidesService.IUpdatePresentationInput, "requests">;
  }): Promise<void> {
    const googleService = new GoogleService({
      clientId: this.props.clientId,
      clientSecret: this.props.clientSecret,
      secret: this.props.secret,
    });

    const accessToken = await googleService.refreshAccessToken();

    const is = typia.createIs<{
      createImage: IGoogleSlidesService.CreateImageRequest;
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
              const saved = await this.s3.uploadObject({
                contentType: "image/jpg",
                data: jpg,
                key: `${v4()}.jpg`,
              });

              request.createImage.url = await this.s3.getGetObjectUrl({
                fileUrl: saved,
              });
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
}
