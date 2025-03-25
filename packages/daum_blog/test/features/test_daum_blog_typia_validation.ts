import { DaumBlogService } from "@wrtnlabs/connector-daum-blog";
import typia from "typia";

export const test_daum_blog_typia_validation = async () => {
  typia.llm.application<DaumBlogService, "chatgpt">();
};
