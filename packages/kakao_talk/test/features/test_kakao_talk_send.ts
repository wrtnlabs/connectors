import typia from "typia";
import { KakaoTalkService } from "@wrtnlabs/connector-kakao-talk";
import { TestGlobal } from "../TestGlobal";

export const test_api_kakao_talk_send_message = async () => {
  const kakaoTalkService = new KakaoTalkService({
    kakaoTalkClientId: TestGlobal.env.KAKAO_TALK_CLIENT_ID,
    kakaoTalkClientSecret: TestGlobal.env.KAKAO_TALK_CLIENT_SECRET,
    kakaoTalkRefreshToken: TestGlobal.env.KAKAO_TALK_TEST_REFRESH_TOKEN,
  });

  /**
   * 텍스트 메시지 발송.
   */
  const sendTextForm = await kakaoTalkService.send({
    receiver_uuids: ["z_jB88bwyfzQ5tbj1OPR4ND8yvnK_Mz-jg"],
    message: "텍스트 영역입니다. 최대 200자 표시 가능합니다.",
  });

  typia.assert(sendTextForm);
};
