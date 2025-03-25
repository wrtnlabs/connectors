import { StableDiffusionBetaService } from "@wrtnlabs/connector-stable-diffusion-beta";
import typia from "typia";

export const test_stable_diffusion_beta_typia_validation = async () => {
  typia.llm.application<StableDiffusionBetaService, "chatgpt">();
};
