import { WebCrawlerService } from "@wrtnlabs/connector-web-crawler";
import typia from "typia";

export const test_crawler_typia_validation = async () => {
  typia.llm.application<WebCrawlerService, "chatgpt">();
};
