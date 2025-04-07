export namespace IImage {
  export interface IGetImageFileInput {
    /**
     * @title Image url.
     */
    imageUrl: string;

    /**
     * @title Target ratio of image.
     */
    ratio: 1.91 | 1 | 0.8;
  }

  export interface IGetImageFileOutput {
    /**
     * Encoded image in base64 format.
     */
    base64Image: string;

    /**
     * Size of image after cropping.
     */
    size: ISize;
  }

  export interface ISize {
    /**
     * @title The y-axis coordinate that becomes the starting point of the image crop
     */
    top: number;

    /**
     * @title The x-axis coordinate that becomes the starting point of the image crop
     */
    left: number;

    /**
     * @title Width after cropping from original
     */
    width: number;

    /**
     * @title Height after cropping from original
     */
    height: number;
  }

  export interface IGetSizeInput extends ISize {
    /**
     * @title Target Ratio of image
     */
    ratio: 1.91 | 1 | 0.8;
  }
}
