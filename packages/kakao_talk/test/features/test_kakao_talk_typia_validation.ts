import { KakaoTalkService } from "@wrtnlabs/connector-kakao-talk";
import typia from "typia";

export const test_kakao_talk_typia_validation = async () => {
  typia.llm.application<KakaoTalkService, "chatgpt">();
};
