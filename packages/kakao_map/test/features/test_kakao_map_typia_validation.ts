import { KakaoMapService } from "@wrtnlabs/connector-kakao-map";
import typia from "typia";

export const test_kakao_map_typia_validation = async () => {
  typia.llm.application<KakaoMapService, "chatgpt">();
};
