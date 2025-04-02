export namespace IFileManager {
  /**
   * Upload file by object input.
   */
  export interface IUploadByObjectInput {
    /**
     * Data of file.
     */
    data: Buffer;

    /**
     * Path that include the file name to save file.
     */
    path: string;

    /**
     * Content type of file.
     */
    contentType: string;

    /**
     * Type of upload.
     */
    type: "object";
  }

  /**
   * Upload File input.
   */
  export type IUploadInput = {
    props: IUploadByObjectInput;
  };

  export interface IUploadOutput {
    /**
     * File url.
     */
    url: string;
  }

  /**
   * Read file by url input.
   */
  export interface IReadByUrlInput {
    /**
     * Type of read.
     */
    type: "url";

    /**
     * File url.
     */
    url: string;
  }

  /**
   * Read file by local input.
   */
  export interface IReadByLocalInput {
    /**
     * Type of read.
     */
    type: "local";

    /**
     * Path of file including the file name and extension.
     */
    path: string;
  }

  /**
   * Read file input.
   */
  export type IReadInput = {
    props: IReadByUrlInput | IReadByLocalInput;
  };

  /**
   * Read file by url output.
   */
  export interface IReadOutput {
    /**
     * Data of file.
     */
    data: Buffer;
  }
}
