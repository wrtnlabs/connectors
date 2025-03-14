import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { IAws } from "@wrtn/connector-api/lib/structures/connector/aws/IAws";
import { randomUUID } from "crypto";
import { Readable } from "stream";
import { ConnectorGlobal } from "../../../ConnectorGlobal";

export namespace AwsProvider {
  //-----
  // CONFIGURATION
  //-----
  const s3: S3Client = new S3Client({
    region: "ap-northeast-2",
    maxAttempts: 3,
    credentials: {
      accessKeyId: ConnectorGlobal.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: ConnectorGlobal.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  const region = "ap-northeast-2" as const;
  const fileBucket = ConnectorGlobal.env.AWS_S3_BUCKET;
  const EXPIRATION_IN_MINUTES = 3 as const;

  //-----
  // METHODS
  //-----

  /**
   * @param key 키 이름
   * @returns 버킷 이름을 붙여 만든 전체 파일 경로
   */
  export function addBucketPrefix(key: string): string {
    const url = `https://${fileBucket}.s3.ap-northeast-2.amazonaws.com/${key}`;
    return url;
  }

  export async function uploadObject(
    input: IAws.IUploadObjectInput,
  ): Promise<string> {
    const { data, contentType } = input;
    const putObjectConfig = new PutObjectCommand({
      Bucket: ConnectorGlobal.env.AWS_S3_BUCKET,
      Key: input.key,
      Body: data,
      ContentType: contentType,
    });
    await s3.send(putObjectConfig);
    return addBucketPrefix(input.key);
  }

  export async function getPutObjectUrl(
    input: IAws.IGetPutObjectUrlInput,
  ): Promise<IAws.IGetPutObjectUrlOutput> {
    try {
      const { extension } = input;
      const fileUUID = randomUUID();
      const fileSuffixUrl = `${fileUUID}.${extension}`;
      const putObjectConfig = new PutObjectCommand({
        Bucket: fileBucket,
        Key: `${fileSuffixUrl}`,
      });
      const urlValidityThresholdInMinutes = 3 * 1000 * 60;
      const now = new Date();
      now.setMinutes(now.getMinutes() + urlValidityThresholdInMinutes);
      const urlExpDate = now;
      const uploadUrl = await getSignedUrl(s3, putObjectConfig, {
        expiresIn: 60 * 3,
        signingRegion: region,
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

  export async function getObject(
    input: { fileUrl: string } | { filename: string },
  ): Promise<Buffer> {
    try {
      let getObjectCommand: GetObjectCommand;
      if ("fileUrl" in input) {
        const { bucket, key } = AwsProvider.extractS3InfoFromUrl(input.fileUrl);
        getObjectCommand = new GetObjectCommand({
          Bucket: bucket,
          Key: key,
        });
      } else {
        getObjectCommand = new GetObjectCommand({
          Bucket: fileBucket,
          Key: input.filename, // file name
        });
      }

      const response = await s3.send(getObjectCommand);

      if (!response.Body) {
        throw new InternalServerErrorException("S3 object has no content");
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
   * Transforms S3 URLs in output to presigned URLs
   */
  export async function getGetObjectUrl(fileUrl: string): Promise<string> {
    const match = fileUrl.match(AwsProvider.S3BucketURL);

    if (!match) {
      throw new Error("Invalid format");
    }

    const bucket = match[1];
    const key = match[3];

    return await getSignedUrl(
      s3,
      new GetObjectCommand({ Bucket: bucket, Key: key }),
      {
        expiresIn: 60 * EXPIRATION_IN_MINUTES,
        signingRegion: region,
      },
    );
  }

  export function extractS3InfoFromUrl(url: string): {
    bucket: string;
    key: string;
  } {
    try {
      const match = url.match(AwsProvider.S3BucketURL);
      if (!match) {
        throw new BadRequestException("Invalid S3 URL");
      }

      const bucket = match[1];
      const key = decodeURIComponent(match[3]);

      return { bucket, key };
    } catch (error) {
      console.error("Invalid URL:", error);
      throw new BadRequestException("Invalid S3 URL");
    }
  }

  export async function getFileSize(fileUrl: string): Promise<number> {
    const [url] = fileUrl.split("?"); // 쿼리파라미터 부분 제거
    const matches = url.match(AwsProvider.S3BucketURL);

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

      const { ContentLength } = await s3.send(command);

      if (!ContentLength) {
        throw new InternalServerErrorException();
      }
      return ContentLength;
    } catch (err) {
      console.error(JSON.stringify(`Failed to get file size: ${err}`));
      throw err;
    }
  }

  export const S3BucketURL =
    /https?:\/\/([^.]+)\.s3(?:\.([^.]+))?\.amazonaws\.com\/([a-zA-Z0-9\/.\-_\s%]+)/;
}
