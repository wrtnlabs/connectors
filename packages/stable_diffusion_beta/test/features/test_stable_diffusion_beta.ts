import {
  IStableDiffusionBetaService,
  StableDiffusionBetaService,
} from "@wrtnlabs/connector-stable-diffusion-beta";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";
import { v4 } from "uuid";
import { AwsS3Service } from "@wrtnlabs/connector-aws-s3";

export const test_stable_diffusion_beta = async () => {
  const stableDiffusionBetaService = new StableDiffusionBetaService(
    {
      stableDiffusionApiKey: TestGlobal.env.STABILITY_AI_API_KEY,
      stableDiffusionCfgScale: TestGlobal.env.STABILITY_AI_CFG_SCALE,
      stableDiffusionDefaultStep: TestGlobal.env.STABILITY_AI_DEFAULT_STEP,
      stableDiffusionEngineId: TestGlobal.env.STABILITY_AI_ENGINE_ID,
      stableDiffusionHost: TestGlobal.env.STABILITY_AI_HOST,
    },
    new AwsS3Service({
      awsAccessKeyId: TestGlobal.env.AWS_ACCESS_KEY_ID!,
      awsSecretAccessKey: TestGlobal.env.AWS_SECRET_ACCESS_KEY!,
      awsS3Bucket: TestGlobal.env.AWS_S3_BUCKET!,
      awsS3Region: "ap-northeast-2",
    }),
  );

  const requestBody: IStableDiffusionBetaService.IRequest = {
    prompt: `손들고 있는 고양이 그려줘`,
    image_ratio: "square",
    style_preset: "digital-art",
    file: {
      path: `connector/generate-image-node/sdxl-beta/${v4()}`,
    },
  };
  const output = await stableDiffusionBetaService.generateImage(requestBody);
  typia.assert<IStableDiffusionBetaService.IResponse>(output);
};
