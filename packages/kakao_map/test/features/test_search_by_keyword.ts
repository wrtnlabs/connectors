import { KakaoMapService } from "@wrtnlabs/connector-kakao-map";
import { TestGlobal } from "../TestGlobal";
import typia from "typia";

export const test_search_by_keyword = async () => {
  const kakaoMapService = new KakaoMapService({
    kakaoMapClientId: TestGlobal.env.KAKAO_TALK_CLIENT_ID,
  });

  const res = await kakaoMapService.searchByKeyword({
    query: "종로구 맛집",
  });

  typia.assert(res);

  if (res.documents.length === 0) {
    throw new Error(`Kakao Map Search Result does not exist.`);
  }
};
