import {
  GoogleScholarService,
  IGoogleScholarService,
} from "@wrtnlabs/connector-google-scholar";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

export const test_google_scholar = async () => {
  const googleScholarService = new GoogleScholarService({
    serpApiKey: TestGlobal.env.SERP_API_KEY,
  });

  const searchResult: IGoogleScholarService.ISearchOutput[] =
    await googleScholarService.search({
      andKeyword: ["biology", "ecosystem"],
      orKeyword: ["AI", "machine learning"],
      notKeyword: ["pollution", "politics"],
      max_results: 25,
    });
  typia.assert<IGoogleScholarService.ISearchOutput[]>(searchResult);
};
