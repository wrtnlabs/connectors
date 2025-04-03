import { tags } from "typia";

export namespace IFileManager {
  /**
   * Upload file by object input.
   */
  export interface IUploadByObjectInput {
    /**
     * Type of upload.
     */
    type: "object";

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
  }

  /**
   * Upload File input.
   */
  export type IUploadInput = {
    props: IUploadByObjectInput;
  };

  export interface IUploadOutput {
    /**
     * File uri.
     * URI includes the file path and scheme.
     */
    uri: string & tags.Format<"iri">;
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
    url: string & tags.Format<"iri">;
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
