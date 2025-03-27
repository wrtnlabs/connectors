import axios from "axios";
import { IDallE3Service } from "../structures/IDallE3Service";
import { bufferToBase64 } from "@wrtnlabs/connector-shared";

export class DallE3Service {
  constructor(private readonly props: IDallE3Service.IProps) {}

  /**
   * DallE3 Service.
   *
   * Generate an image using the dall-e-3 model
   */
  async generateImage(
    input: IDallE3Service.IRequest,
  ): Promise<IDallE3Service.IResponse> {
    try {
      let size: "1024x1024" | "1792x1024" | "1024x1792" = "1024x1024";

      if (input.image_ratio) {
        const imageDimensions: {
          [key: string]: "1024x1024" | "1792x1024" | "1024x1792";
        } = {
          square: "1024x1024",
          landscape: "1792x1024",
          portrait: "1024x1792",
        };

        size = imageDimensions[input.image_ratio]!;
      }

      //TODO: 현재 분당 200회 생성 제한. 처리 로직 필요.
      const response = await this.props.openai.images.generate({
        prompt: input.prompt,
        // TODO: different models have different options
        //       so make option selection more refined later
        size: size,
        quality: "hd",
        model: "dall-e-3",
        n: 1,
      });
      const res = response.data[0];

      const data = await axios.get(res?.url!, { responseType: "arraybuffer" });

      const { imageBase64 } = await this.uploadDallE3ToS3(data.data);

      return { imageBase64 };
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  private async uploadDallE3ToS3(img: Buffer) {
    try {
      return {
        imageBase64: bufferToBase64(img),
      };
    } catch (err) {
      console.log("err", err);
      throw err;
    }
  }
}
