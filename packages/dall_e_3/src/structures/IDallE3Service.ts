import { IAwsS3Service } from "@wrtnlabs/connector-aws-s3";
import { tags } from "typia";
import { OpenAI } from "openai";

export namespace IDallE3Service {
  export interface IProps {
    /**
     * OpenAI.
     */
    openai: OpenAI;

    /**
     * AWS
     */
    aws: {
      /**
       * S3
       */
      s3: IAwsS3Service.IProps;
    };
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

    s3: {
      /**
       * S3 Bucket Key(path).
       */
      key: string;

      /**
       * Content Type.
       *
       * @default "image/png"
       */
      contentType?: string;
    };
  }

  /**
   * @title Image creation result
   */
  export interface IResponse {
    /**
     * Generated image url
     *
     * @title Generated image Url
     */
    imgUrl: string & tags.Format<"iri"> & tags.ContentMediaType<"image/*">;
  }
}
