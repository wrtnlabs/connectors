import axios from "axios";
import { IStableDiffusionBetaService } from "../structures/IStableDiffusionBetaService";
import { AwsS3Service } from "@wrtnlabs/connector-aws-s3";

export class StableDiffusionBetaService {
  constructor(private readonly props: IStableDiffusionBetaService.IProps) {}

  /**
   * Stable Diffusion Beta Service.
   *
   * Generate an image using the stable diffusion model
   */
  async generateImage(
    input: IStableDiffusionBetaService.IRequest,
  ): Promise<IStableDiffusionBetaService.IResponse> {
    try {
      // const { category, englishText } = await this.imageCompletion(
      //   this.props.engineId,
      //   input.prompt,
      // );

      const img = await this.generateTextToImage(
        input.prompt,
        input.image_ratio,
        input.style_preset,
      );
      const { imgUrl } = await this.uploadImageToS3(img, {
        ...input.s3,
      });
      return { imgUrl: imgUrl };
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  private async uploadImageToS3(
    img: Buffer[],
    input: IStableDiffusionBetaService.IRequest["s3"],
  ) {
    if (!this.props.aws?.s3) {
      throw new Error("AWS S3 Not Applied.");
    }

    try {
      const s3 = new AwsS3Service({
        ...this.props.aws.s3,
      });

      const imgUrl = await Promise.all(
        img.map(async (img) => {
          return await s3.uploadObject({
            key: input.key,
            data: img,
            contentType: input.contentType ?? "image/png",
          });
        }),
      );

      return {
        imgUrl: imgUrl[0]!,
      };
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  private async generateTextToImage(
    text: string,
    image_ratio: string,
    style_preset?: string,
  ) {
    const inputs: { prompts: { text: string; weight: number }[] }[] = [];
    const prompts = [{ text, weight: 1 }];
    // const additionalPrompt = getAdditionalImagePrompt(category);
    // if (additionalPrompt) prompts.push(additionalPrompt);
    inputs.push({ prompts });

    return await this.generateImg(prompts, image_ratio, style_preset);
  }

  private async generateImg(
    prompts: IStableDiffusionBetaService.ISDXLBetaPromptRequest[],
    image_ratio: string,
    style_preset?: string,
  ) {
    const imageDimensions: {
      [key: string]: { width: number; height: number };
    } = {
      square: { width: 1024, height: 1024 },
      landscape: { width: 1344, height: 768 },
      portrait: { width: 768, height: 1344 },
    };

    const { width, height } = imageDimensions[image_ratio]!;
    try {
      const response = await axios.post(
        `${this.props.host}/v1/generation/${this.props.engineId}/text-to-image`,
        {
          text_prompts: prompts,
          cfg_scale: Number(this.props.cfgScale),
          height: height,
          width: width,
          steps: Number(this.props.defaultStep),
          samples: 1,
          ...(style_preset && { style_preset: style_preset }),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${this.props.apiKey}`,
          },
        },
      );
      if (!response.data || !Array.isArray(response.data.artifacts)) {
        throw new Error("image result not found");
      }

      const output = response.data
        .artifacts as IStableDiffusionBetaService.ISDXLBetaPromptResponse[];
      const img = output.map((image) => Buffer.from(image.base64, "base64"));
      return img;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  // async imageCompletion(model: string, message: string) {
  //   /**
  //    * 프롬프트 변환
  //    */
  //   const gptPrompt = generateGptPromptTranslateForImageGenerate(
  //     model,
  //     message,
  //   );
  //   const content = gptPrompt.messages[0]?.content!;

  //   console.log(`content: ${content}`);

  //   /**
  //    * 햄릿 통해서 한글 입력 영어로 변환
  //    */
  //   try {
  //     return {
  //       ...handleImagePrompt(content),
  //     };
  //   } catch (err) {
  //     console.error(JSON.stringify(err));
  //     throw err;
  //   }
  // }
}
