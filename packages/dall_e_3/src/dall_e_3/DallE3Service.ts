import axios from "axios";
import { IDallE3Service } from "../structures/IDallE3Service";

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

      //TODO: Currently limited to 200 generations per minute. Need to implement handling logic.
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

      const img: Buffer = data.data;

      const imgBuffer = img.toString("base64");

      return { imgBuffer };
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }
}
