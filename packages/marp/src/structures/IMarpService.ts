import { IAwsS3Service } from "@wrtnlabs/connector-aws-s3";

export namespace IMarpService {
  export interface IProps {
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
     * AWS S3 Properties.
     */
    s3: {
      /**
       * S3 Bucket Key(path).
       */
      key: string;
    };
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
