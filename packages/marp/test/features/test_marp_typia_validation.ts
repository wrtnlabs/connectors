import { MarpService } from "@wrtnlabs/connector-marp";
import typia from "typia";

export const test_marp_typia_validation = async () => {
  typia.llm.application<MarpService, "chatgpt">();
};
