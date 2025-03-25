import { ImwebService } from "@wrtnlabs/connector-imweb";
import typia from "typia";

export const test_imweb_typia_validation = async () => {
  typia.llm.application<ImwebService, "chatgpt">();
};
