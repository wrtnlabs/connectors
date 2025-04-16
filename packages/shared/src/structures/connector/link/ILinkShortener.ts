export namespace ILinkShortener {
  /**
   * Shorten URL input.
   */
  export interface IShortenInput {
    /**
     * URL to shorten.
     */
    url: string;
  }

  /**
   * Shortened URL output.
   */
  export interface IShortenOutput {
    /**
     * Shortened URL.
     */
    url: string;
  }
}
