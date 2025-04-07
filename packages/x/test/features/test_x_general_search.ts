import typia from "typia";
import { XService } from "../../src/x/XService";
import { TestGlobal } from "../TestGlobal";

export const test_x_general_search = async () => {
  const xService = new XService({
    xClientId: TestGlobal.env.X_CLIENT_ID,
    xClientSecret: TestGlobal.env.X_CLIENT_SECRET,
    xBearerToken: TestGlobal.env.X_TEST_SECRET,
  });

  const res = await xService.generalSearch({
    query: "유행하는 책",
    lang: "ko",
    maxResults: 10,
    sort_order: "relevancy",
    // isExcludeQuote: true,
    // isExcludeReply: true,
    // isExcludeRetweet: true,
  });
  typia.assert(res);
  return res;
};
