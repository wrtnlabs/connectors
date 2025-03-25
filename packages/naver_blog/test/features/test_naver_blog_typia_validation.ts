import { NaverBlogService } from "@wrtnlabs/connector-naver-blog";
import typia from "typia";

export const test_naver_blog_typia_validation = async () => {
  typia.llm.application<NaverBlogService, "chatgpt">();
};
