import axios from "axios";
import { IDallE3Service } from "../structures/IDallE3Service";
import { AwsS3Service } from "@wrtnlabs/connector-aws-s3";

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

      const { imgUrl } = await this.uploadDallE3ToS3(data.data, {
        ...input.s3,
      });

      return { imgUrl };
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  private async uploadDallE3ToS3(
    img: Buffer,
    input: IDallE3Service.IRequest["s3"],
  ) {
    if (!this.props.aws?.s3) {
      throw new Error("AWS S3 Not Applied.");
    }

    try {
      const s3 = new AwsS3Service({
        ...this.props.aws.s3,
      });

      const imgUrl = await s3.uploadObject({
        key: input.key,
        data: img,
        contentType: input.contentType ?? "image/png",
      });

      return {
        imgUrl: imgUrl,
      };
    } catch (err) {
      console.log("err", err);
      throw err;
    }
  }
}
