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
  });

  const requestBody: IStableDiffusionBetaService.IRequest = {
    prompt: `손들고 있는 고양이 그려줘`,
    image_ratio: "square",
    style_preset: "digital-art",
    file: {
      key: `connector/generate-image-node/sdxl-beta/${v4()}`,
    },
  };
  const output = await stableDiffusionBetaService.generateImage(requestBody);
  typia.assert<IStableDiffusionBetaService.IResponse>(output);
};
