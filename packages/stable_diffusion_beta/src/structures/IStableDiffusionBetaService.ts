import { IAwsS3Service } from "@wrtnlabs/connector-aws-s3";
import { tags } from "typia";

export namespace IStableDiffusionBetaService {
  export interface IProps {
    /**
     * Stable Diffusion Engine ID.
     */
    engineId: string;

    /**
     * Stable Diffusion Host.
     */
    host: string;

    /**
     * Stable Diffusion API Key.
     */
    apiKey: string;

    /**
     * Default Step.
     */
    defaultStep: number;

    /**
     * CFG Scale.
     */
    cfgScale: number;

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
   * @title Image Generator Settings
   */
  export interface IRequest {
    /**
     * Please be specific about the elements, styles, and subjects you want to include in the image you want to generate. This prompt will instruct the model to reflect the desired features and details when generating the image.
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
      | tags.Constant<"square", { title: "정사각형"; description: "512x512" }>
      | tags.Constant<"landscape", { title: "풍경"; description: "896x512" }>
      | tags.Constant<"portrait", { title: "인물"; description: "512x896" }>;

    /**
     * Generates an image in a specific style.
     *
     * There are only 16 possible values: "3d-model", "analog-film", "anime", "cinematic", "comic-book", "digital-art", "enhance", "fantasy-art", "isometric", "line-art", "low-poly", "modeling-compound", "neon-punk", "origami", "photographic", "pixel-art", "tile-texture".
     *
     * @title Style Preset
     */
    style_preset?:
      | tags.Constant<"3d-model", { title: "3D 모델" }>
      | tags.Constant<"analog-film", { title: "아날로그 필름" }>
      | tags.Constant<"anime", { title: "에니메이션" }>
      | tags.Constant<"cinematic", { title: "영화" }>
      | tags.Constant<"comic-book", { title: "만화" }>
      | tags.Constant<"digital-art", { title: "디지털 아트" }>
      | tags.Constant<"enhance", { title: "보정" }>
      | tags.Constant<"fantasy-art", { title: "판타지 아트" }>
      | tags.Constant<"isometric", { title: "등각뷰" }>
      | tags.Constant<"line-art", { title: "라인 아트" }>
      | tags.Constant<"low-poly", { title: "로우 폴리곤" }>
      | tags.Constant<"modeling-compound", { title: "클레이 아트" }>
      | tags.Constant<"neon-punk", { title: "네온 펑크" }>
      | tags.Constant<"origami", { title: "종이 접기" }>
      | tags.Constant<"photographic", { title: "사진" }>
      | tags.Constant<"pixel-art", { title: "픽셀 아트" }>
      | tags.Constant<"tile-texture", { title: "타일 텍스쳐" }>;

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

  /**
   * @internal
   */
  export interface ISDXLBetaPromptRequest {
    text: string;
    weight: number;
  }

  /**
   * @internal
   */
  export interface ISDXLBetaPromptResponse {
    base64: string;
    seed: number;
    finishReason: string;
  }
}
