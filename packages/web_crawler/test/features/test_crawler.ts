import { TestValidator } from "@nestia/e2e";
import {
  IWebCrawlerService,
  WebCrawlerService,
} from "@wrtnlabs/connector-web-crawler";
import { TestGlobal } from "../TestGlobal";

export const test_web_crawler_get_content = async () => {
  const webCrawlerService = new WebCrawlerService({
    zenrowsApiKey: TestGlobal.env.ZENROWS_API_KEY,
  });

  const URL = "https://i.clarity.ms/";
  const res: IWebCrawlerService.IResponse =
    await webCrawlerService.getWebContent({
      url: URL,
    });

  TestValidator.equals("url")(URL)(res.url);
  TestValidator.equals("content")("OK")(res.content);
};
