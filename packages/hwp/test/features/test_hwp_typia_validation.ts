import { HwpService } from "@wrtnlabs/connector-hwp";
import typia from "typia";

export const test_hwp_typia_validation = async () => {
  typia.llm.application<HwpService, "chatgpt">();
};
