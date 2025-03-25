import { KakaoNaviService } from "@wrtnlabs/connector-kakao-navi";
import typia from "typia";

export const test_kakao_navi_typia_validation = async () => {
  typia.llm.application<KakaoNaviService, "chatgpt">();
};
