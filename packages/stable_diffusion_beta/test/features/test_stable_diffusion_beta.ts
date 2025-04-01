import {
  IStableDiffusionBetaService,
  StableDiffusionBetaService,
} from "@wrtnlabs/connector-stable-diffusion-beta";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";
import { v4 } from "uuid";

export const test_stable_diffusion_beta = async () => {
  const stableDiffusionBetaService = new StableDiffusionBetaService({
    apiKey: TestGlobal.env.STABILITY_AI_API_KEY,
    cfgScale: Number(TestGlobal.env.STABILITY_AI_CFG_SCALE),
    defaultStep: Number(TestGlobal.env.STABILITY_AI_DEFAULT_STEP),
    engineId: TestGlobal.env.STABILITY_AI_ENGINE_ID,
    host: TestGlobal.env.STABILITY_AI_HOST,
    aws: {
      s3: {
        accessKeyId: TestGlobal.env.AWS_ACCESS_KEY_ID,
        bucket: TestGlobal.env.AWS_S3_BUCKET,
        region: "ap-northeast-2",
        secretAccessKey: TestGlobal.env.AWS_SECRET_ACCESS_KEY,
      },
    },
  });

  const requestBody: IStableDiffusionBetaService.IRequest = {
    prompt: `손들고 있는 고양이 그려줘`,
    image_ratio: "square",
    style_preset: "digital-art",
    s3: {
      key: `connector/generate-image-node/sdxl-beta/${v4()}`,
    },
  };
  const output = await stableDiffusionBetaService.generateImage(requestBody);
  typia.assert<IStableDiffusionBetaService.IResponse>(output);
};
