import {
  INaverBlogService,
  NaverBlogService,
} from "@wrtnlabs/connector-naver-blog";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

export const test_read_blog_naver =
  async (): Promise<INaverBlogService.IBlogNaverOutput> => {
    const input: INaverBlogService.INaverKeywordInput = {
      andKeywords: "뤼튼",
      orKeywords: "AI",
      notKeywords: "openAI",
      display: 10,
      sort: "sim",
    };

    const naverBlogService = new NaverBlogService({
      naverBlogClientId: TestGlobal.env.NAVER_CLIENT_ID,
      naverBlogClientSecret: TestGlobal.env.NAVER_CLIENT_SECRET,
    });

    const result = await naverBlogService.getBlog(input);
    typia.assert(result);

    return result;
  };
