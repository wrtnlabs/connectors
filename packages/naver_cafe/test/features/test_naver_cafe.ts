import {
  INaverCafeService,
  NaverCafeService,
} from "@wrtnlabs/connector-naver-cafe";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

export const test_read_cafe_naver =
  async (): Promise<INaverCafeService.ICafeNaverOutput> => {
    const input: INaverCafeService.INaverKeywordInput = {
      andKeywords: "뤼튼",
      orKeywords: "AI",
      notKeywords: "openAI",
      display: 10,
      sort: "sim",
    };

    const naverCafeService = new NaverCafeService({
      naverCafeClientId: TestGlobal.env.NAVER_CLIENT_ID,
      naverCafeClientSecret: TestGlobal.env.NAVER_CLIENT_SECRET,
    });

    const result = await naverCafeService.getCafe(input);
    typia.assert(result);

    return result;
  };
