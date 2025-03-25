import { DaumCafeService } from "@wrtnlabs/connector-daum-cafe";
import typia from "typia";

export const test_daum_cafe_typia_validation = async () => {
  typia.llm.application<DaumCafeService, "chatgpt">();
};
