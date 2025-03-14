import { DallE3Service } from "@wrtnlabs/connector-dall-e-3";
import typia from "typia";

export const test_dall_e_3_typia_validation = async () => {
  typia.llm.application<DallE3Service, "chatgpt">();
};
