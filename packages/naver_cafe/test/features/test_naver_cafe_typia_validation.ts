import { NaverCafeService } from "@wrtnlabs/connector-naver-cafe";
import typia from "typia";

export const test_naver_cafe_typia_validation = async () => {
  typia.llm.application<NaverCafeService, "chatgpt">();
};
