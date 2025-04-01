export namespace IImage {
  export interface Size {
    /**
     * @title The x-axis coordinate that becomes the starting point of the image crop
     */
    left: number;

    /**
     * @title The y-axis coordinate that becomes the starting point of the image crop
     */
    top: number;

    /**
     * @title Width after cropping from original
     */
    width: number;

    /**
     * @title Height after cropping from original
     */
    height: number;
  }
}
