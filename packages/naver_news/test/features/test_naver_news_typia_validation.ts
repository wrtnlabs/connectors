import { NaverNewsService } from "@wrtnlabs/connector-naver-news";
import typia from "typia";

export const test_naver_news_typia_validation = async () => {
  typia.llm.application<NaverNewsService, "chatgpt">();
};
