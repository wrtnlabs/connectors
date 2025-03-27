export namespace IImage {
  export interface GetImageFileInput {
    /**
     * @title Image url.
     */
    imageUrl: string;

    /**
     * @title Target ratio of image.
     */
    ratio: 1.91 | 1 | 0.8;
  }

  export interface GetImageFileOutput {
    /**
     * Encoded image in base64 format.
     */
    base64Image: string;

    /**
     * Size of image after cropping.
     */
    size: Size;
  }

  export interface Size {
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

  export interface GetSizeInput extends Size {
    /**
     * @title Target Ratio of image
     */
    ratio: 1.91 | 1 | 0.8;
  }
}
