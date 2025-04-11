import { FileManager } from "@wrtnlabs/connector-shared/lib";

export namespace IMarpService {
  export type IProps = {
    fileManager: FileManager;
  };

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

    /**
     * S3 object path.
     */
    filePath?: string;
  }

  /**
   * @title Marp conversion output
   */
  export interface IConvertOutput {
    /**
     * S3 link for the converted PPT.
     *
     * @title S3 link
     */
    s3Link: string;
  }
}
