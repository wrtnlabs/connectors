import {
  DaumBlogService,
  IDaumBlogService,
} from "@wrtnlabs/connector-daum-blog";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

export const test_blog_daum = async () => {
  const input: IDaumBlogService.ISearchInput = {
    andKeywords: "뤼튼",
    orKeywords: "AI",
    notKeywords: "openAI",
    page: 1,
    size: 10,
    sort: "accuracy",
  };

  const daumBlogService = new DaumBlogService({
    apiKey: TestGlobal.env.DAUM_API_KEY,
  });

  const result = await daumBlogService.search(input);
  typia.assert(result);

  return result;
};
