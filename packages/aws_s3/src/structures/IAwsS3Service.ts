import { tags } from "typia";
import { SnakeToCamel } from "@wrtnlabs/connector-shared";

/**
 * Write the environment variables that are required for the AWS S3 service.
 */
export const ENV_LIST = [
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_S3_BUCKET",
  "AWS_S3_REGION",
] as const;

export namespace IAwsS3Service {
  export type IProps = {
    [key in SnakeToCamel<(typeof ENV_LIST)[number]>]: string;
  };

  export interface IGetPutObjectUrlInput {
    /**
     * File extension.
     *
     * @title File extension
     */
    extension: string;

    /**
     * Presigned URL expiration time in minutes.
     *
     * @title Presigned URL expiration time
     */
    expirationInMinute: number;
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

  export interface IGetObjectUrlInput {
    /**
     * File URL.
     *
     * @title file url
     */
    url: string;

    /**
     * Presigned URL expiration time in minutes.
     *
     * @title Presigned URL expiration time
     */
    expirationInMinute: number;
  }

  export interface IExtractS3InfoFromUrlInput {
    /**
     * File URL.
     *
     * @title file url
     */
    url: string;
  }

  export interface IExtractS3InfoFromUrlOutput {
    /**
     * Bucket name.
     *
     * @title bucket name
     */
    bucket: string;

    /**
     * Key name.
     *
     * @title key name
     */
    key: string;
  }
  export interface IGetFileSizeInput {
    /**
     * File URL.
     *
     * @title file url
     */
    url: string;
  }

  export interface IGetFileSizeOutput {
    /**
     * File size.
     *
     * @title file size
     */
    size: number;
  }

  export interface IAddBucketPrefixInput {
    /**
     * Key name.
     *
     * @title key name
     */
    key: string;
  }

  export interface IAddBucketPrefixOutput {
    /**
     * URL.
     *
     * @title url
     */
    url: string;
  }
}
