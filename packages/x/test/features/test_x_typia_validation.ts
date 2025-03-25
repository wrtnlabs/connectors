import { XService } from "@wrtnlabs/connector-x";
import typia from "typia";

export const test_x_typia_validation = async () => {
  typia.llm.application<XService, "chatgpt">();
};
