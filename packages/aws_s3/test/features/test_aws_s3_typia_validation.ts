import { AwsS3Service } from "@wrtnlabs/connector-aws-s3";
import typia from "typia";

export const test_aws_s3_typia_validation = async () => {
  typia.llm.application<AwsS3Service, "chatgpt">();
};
