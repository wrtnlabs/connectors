import { tags } from "typia";
import { OpenAI } from "openai";
import { FileManager } from "@wrtnlabs/connector-shared";

export namespace IDallE3Service {
  export interface IProps {
    /**
     * OpenAI.
     */
    openai: OpenAI;

    /**
     * FileManager.
     */
    fileManager?: FileManager;
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

    /**
     * Path to save the image including the file name.
     *
     * @title File Path with File Name
     */
    path: string;
  }

  /**
   * @title Image creation result
   */
  export interface IResponse {
    /**
     * Generated image URI.
     *
     * @title Generated image URI
     */
    uri?: string & tags.Format<"iri">;

    /**
     * Generated image URL in OpenAI.
     *
     * This URL will be expired within some hours.
     *
     * @title Generated image URL in OpenAI
     */
    expiringUrl?: string & tags.Format<"iri">;
  }
}
