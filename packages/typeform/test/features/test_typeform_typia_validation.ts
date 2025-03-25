import { TypeformService } from "@wrtnlabs/connector-typeform";
import typia from "typia";

export const test_typeform_typia_validation = async () => {
  typia.llm.application<TypeformService, "chatgpt">();
};
