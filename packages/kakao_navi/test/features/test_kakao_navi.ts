import { KakaoNaviService } from "@wrtnlabs/connector-kakao-navi/lib/kakao_navi/KakaoNaviService";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

export const test_kakao_navi_get_future_directions = async () => {
  const kakaoNaviService = new KakaoNaviService({
    clientId: TestGlobal.env.KAKAO_TALK_CLIENT_ID,
  });

  const first = await kakaoNaviService.getFutureDirections({
    departure_time: `202406202000`,
    origin: "127.11015314141542,37.39472714688412",
    destination: "127.10824367964793,37.401937080111644",
  });

  typia.assert(first);

  const second = await kakaoNaviService.getFutureDirections({
    departure_time: `202406202000`,
    origin: "127.11015314141542,37.39472714688412",
    destination: "127.11015314141542,37.39472714688412",
  });

  typia.assert(second);
};
