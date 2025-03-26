import { tags } from "typia";

export namespace IAwsS3Service {
  export interface IProps {
    /**
     * AWS Access Key ID.
     */
    awsAccessKeyId: string;

    /**
     * AWS Secret Aeccess Key.
     */
    awsSecretAccessKey: string;

    /**
     * AWS S3 Bucket name.
     */
    awsS3Bucket: string;

    /**
     * AWS Region.
     */
    awsS3Region: string;
  }

  export interface IGetPutObjectUrlInput {
    /**
     * File extension.
     *
     * @title File extension
     */
    extension: string;
  }

  export interface IGetPutObjectUrlOutput {
    /**
     * This is the file uuid.
     *
     * @title file uuid
     */
    uuid: string & tags.Format<"uuid">;

    /**
     * This is the url for uploading the file.
     *
     * @title upload url
     */
    uploadUrl: string;

    /**
     * url expiration time.
     *
     * @title url expiration time
     */
    urlExpTsMillis: number;
  }

  export interface IUploadObjectInput {
    key: string;
    data: Buffer;
    contentType: string;
  }
}
