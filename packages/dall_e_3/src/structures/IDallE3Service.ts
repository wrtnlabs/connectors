import { tags } from "typia";
import { OpenAI } from "openai";

export namespace IDallE3Service {
  export interface IProps {
    /**
     * OpenAI.
     */
    openai: OpenAI;
  }

  /**
   * @title Information for image creation
   */
  export interface IRequest {
    /**
     * Prompt to create an image
     *
     * @title prompt
     */
    prompt: string;

    /**
     * Preset image size to generate.
     *
     * Only three possible values are available: "square", "landscape", and "portrait".
     *
     * @title Image Size
     */
    image_ratio:
      | tags.Constant<"square", { title: "정사각형"; description: "1024x1024" }>
      | tags.Constant<"landscape", { title: "풍경"; description: "1792x1024" }>
      | tags.Constant<"portrait", { title: "인물"; description: "1024x1792" }>;
  }

  /**
   * @title Image creation result
   */
  export interface IResponse {
    /**
     * Generated image buffer in base64 format.
     *
     * @title Generated image Buffer
     */
    imgBuffer: string & tags.Format<"byte">;
  }
}
