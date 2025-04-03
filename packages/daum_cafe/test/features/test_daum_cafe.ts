import {
  DaumCafeService,
  IDaumCafeService,
} from "@wrtnlabs/connector-daum-cafe";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

export const test_cafe_daum =
  async (): Promise<IDaumCafeService.ICafeOutput> => {
    const daumCafeService = new DaumCafeService({
      daumApiKey: TestGlobal.env.DAUM_API_KEY,
    });

    const input: IDaumCafeService.ISearchInput = {
      andKeywords: "뤼튼",
      orKeywords: "AI",
      notKeywords: "openAI",
      page: 1,
      size: 10,
      sort: "accuracy",
    };
    const result = await daumCafeService.search(input);
    typia.assert(result);

    return result;
  };
