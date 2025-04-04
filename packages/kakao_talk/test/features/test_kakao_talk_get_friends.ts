import typia from "typia";
import { TestGlobal } from "../TestGlobal";
import { KakaoTalkService } from "@wrtnlabs/connector-kakao-talk";

export const test_api_kakao_talk_get_friends = async () => {
  const kakaoTalkService = new KakaoTalkService({
    kakaoTalkClientId: TestGlobal.env.KAKAO_TALK_CLIENT_ID,
    kakaoTalkClientSecret: TestGlobal.env.KAKAO_TALK_CLIENT_SECRET,
    kakaoTalkRefreshToken: TestGlobal.env.KAKAO_TALK_TEST_REFRESH_TOKEN,
  });

  const res = await kakaoTalkService.getFriends({
    limit: 1,
    offset: 1,
  });

  typia.assert(res);
};
