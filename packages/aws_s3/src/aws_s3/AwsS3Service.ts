import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { Readable } from "stream";
import { IAwsS3Service } from "../structures/IAwsS3Service";

export class AwsS3Service {
  private readonly s3: S3Client;
  private readonly expirationInMinute: number;
  private readonly S3BucketURL =
    /https?:\/\/([^.]+)\.s3(?:\.([^.]+))?\.amazonaws\.com\/([a-zA-Z0-9\/.\-_\s%]+)/;

  constructor(private readonly props: IAwsS3Service.IProps) {
    //-----
    // CONFIGURATION
    //-----
    this.s3 = new S3Client({
      region: this.props.awsS3Region,
      maxAttempts: 3,
      credentials: {
        accessKeyId: this.props.awsAccessKeyId,
        secretAccessKey: this.props.awsSecretAccessKey,
      },
    });

    this.expirationInMinute = 3 as const;
  }

  /**
   * AWS S3 Service.
   *
   * Upload an object to S3
   */
  async uploadObject(input: IAwsS3Service.IUploadObjectInput): Promise<string> {
    const { data, contentType } = input;
    const putObjectConfig = new PutObjectCommand({
      Bucket: this.props.awsS3Bucket,
      Key: input.key,
      Body: data,
      ContentType: contentType,
    });
    await this.s3.send(putObjectConfig);
    return this.addBucketPrefix({ key: input.key });
  }

  /**
   * AWS S3 Service.
   *
   * Generate the URL required to upload a file
   */
  async getPutObjectUrl(
    input: IAwsS3Service.IGetPutObjectUrlInput,
  ): Promise<IAwsS3Service.IGetPutObjectUrlOutput> {
    try {
      const { extension } = input;
      const fileUUID = randomUUID();
      const fileSuffixUrl = `${fileUUID}.${extension}`;
      const putObjectConfig = new PutObjectCommand({
        Bucket: this.props.awsS3Bucket,
        Key: `${fileSuffixUrl}`,
      });
      const urlValidityThresholdInMinutes = 3 * 1000 * 60;
      const now = new Date();
      now.setMinutes(now.getMinutes() + urlValidityThresholdInMinutes);
      const urlExpDate = now;
      const uploadUrl = await getSignedUrl(this.s3, putObjectConfig, {
        expiresIn: 60 * 3,
        signingRegion: this.props.awsS3Region,
      });

      return {
        uuid: fileUUID,
        uploadUrl,
        urlExpTsMillis: urlExpDate.getTime(), // * date to milliseconds timestamp
      };
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * AWS S3 Service.
   *
   * Get an object from S3
   */
  async getObject(input: {
    fileUrl?: string;
    filename?: string;
  }): Promise<Buffer> {
    try {
      let getObjectCommand: GetObjectCommand;
      if (input.fileUrl) {
        const { bucket, key } = this.extractS3InfoFromUrl({
          url: input.fileUrl,
        });
        getObjectCommand = new GetObjectCommand({
          Bucket: bucket,
          Key: key,
        });
      } else {
        getObjectCommand = new GetObjectCommand({
          Bucket: this.props.awsS3Bucket,
          Key: input.filename, // file name
        });
      }

      const response = await this.s3.send(getObjectCommand);

      if (!response.Body) {
        throw new Error("S3 object has no content");
      }

      const stream = response.Body as Readable;
      const chunks: Buffer[] = [];

      for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
      }

      return Buffer.concat(chunks);
    } catch (error) {
      console.error(`Failed to get object from S3: ${error}`);
      throw error;
    }
  }

  /**
   * AWS S3 Service.
   *
   * Transforms S3 URLs in output to presigned URLs
   */
  async getGetObjectUrl(input: { fileUrl: string }): Promise<string> {
    const { fileUrl } = input;
    const match = fileUrl.match(this.S3BucketURL);

    if (!match) {
      throw new Error("Invalid format");
    }

    const bucket = match[1];
    const key = match[3];

    return await getSignedUrl(
      this.s3,
      new GetObjectCommand({ Bucket: bucket, Key: key }),
      {
        expiresIn: 60 * this.expirationInMinute,
        signingRegion: this.props.awsS3Region,
      },
    );
  }

  /**
   * AWS S3 Service.
   *
   * Extract S3 information from URL
   */
  extractS3InfoFromUrl(input: { url: string }): {
    bucket: string;
    key: string;
  } {
    try {
      const { url } = input;
      const match = url.match(this.S3BucketURL);
      if (!match) {
        throw new Error("Invalid S3 URL");
      }

      const bucket = match[1]!;
      const key = decodeURIComponent(match[3]!);

      return { bucket, key };
    } catch (error) {
      console.error("Invalid URL:", error);
      throw new Error("Invalid S3 URL");
    }
  }

  /**
   * AWS S3 Service.
   *
   * Get the size of an object in S3
   */
  async getFileSize(input: { fileUrl: string }): Promise<number> {
    const { fileUrl } = input;
    const [url] = fileUrl.split("?"); // 쿼리파라미터 부분 제거
    const matches = url?.match(this.S3BucketURL);

    if (!matches) {
      throw new Error("Invalid S3 URL");
    }

    const bucket = matches[1];
    const key = matches[3];

    try {
      const command = new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      const { ContentLength } = await this.s3.send(command);

      if (!ContentLength) {
        throw new Error();
      }
      return ContentLength;
    } catch (err) {
      console.error(JSON.stringify(`Failed to get file size: ${err}`));
      throw err;
    }
  }

  /**
   * @param key key name
   * @returns complete file path with bucket name prefix
   */
  addBucketPrefix(input: { key: string }): string {
    const url = `https://${this.props.awsS3Bucket}.s3.${this.props.awsS3Region}.amazonaws.com/${input.key}`;
    return url;
  }
}
