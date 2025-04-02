import { AwsS3Service, IAwsS3Service } from "@wrtnlabs/connector-aws-s3";
import { TestGlobal } from "../TestGlobal";
import typia from "typia";
import { IFileManager } from "@wrtnlabs/connector-shared";
import { TestValidator } from "@nestia/e2e";

export const test_aws_s3_get_put_object_url = async () => {
  const awsS3Service = new AwsS3Service({
    awsAccessKeyId: TestGlobal.env.AWS_ACCESS_KEY_ID!,
    awsSecretAccessKey: TestGlobal.env.AWS_SECRET_ACCESS_KEY!,
    awsS3Bucket: TestGlobal.env.AWS_S3_BUCKET!,
    awsS3Region: "ap-northeast-2",
  });

  const res = await awsS3Service.getPutObjectUrl({
    extension: "xlsx",
    expirationInMinute: 3,
  });

  typia.assert<IAwsS3Service.IGetPutObjectUrlOutput>(res);
};

export const test_aws_s3_upload_and_read = async () => {
  const awsS3Service = new AwsS3Service({
    awsAccessKeyId: TestGlobal.env.AWS_ACCESS_KEY_ID!,
    awsSecretAccessKey: TestGlobal.env.AWS_SECRET_ACCESS_KEY!,
    awsS3Bucket: TestGlobal.env.AWS_S3_BUCKET!,
    awsS3Region: "ap-northeast-2",
  });

  const res = await awsS3Service.upload({
    props: {
      type: "object",
      data: Buffer.from("Hello, world!"),
      contentType: "text/plain",
      path: "test.txt",
    },
  });

  typia.assert<IFileManager.IUploadOutput>(res);

  const res2 = await awsS3Service.read({
    props: {
      type: "url",
      url: res.url,
    },
  });

  const str = res2.data.toString();

  TestValidator.equals("Hello, world!")(str);
};
