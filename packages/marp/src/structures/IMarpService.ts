export namespace IMarpService {
  /**
   * @title Parameters for Marp conversion
   */
  export interface IConvertInput {
    /**
     * Marp markdown input string.
     *
     * @title Marp markdown
     */
    markdown: string;
  }

  /**
   * @title Marp conversion output
   */
  export interface IConvertOutput {
    /**
     * Base64 of the converted PPT.
     */
    pptBase64: string;
  }
}
