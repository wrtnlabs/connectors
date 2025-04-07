import { load } from "cheerio";
import { ZenRows } from "zenrows";
import { IWebCrawlerService } from "../structures/IWebCrawlerService";

export class WebCrawlerService {
  private readonly zenRowsClient: ZenRows;
  private readonly naverBlogBaseUrl = "https://blog.naver.com";
  private readonly arxivBaseUrl = "https://arxiv.org";

  constructor(private readonly props: IWebCrawlerService.IProps) {
    this.zenRowsClient = new ZenRows(this.props.zenrowsApiKey);
  }

  /**
   * Web Crawler Service.
   *
   * Get HTML content from the URL
   *
   * This API accepts a URL as input and returns the HTML content of the body of the corresponding web page.
   * It fetches only the <body> element, excluding the head and other parts of the HTML structure, providing developers
   * with a streamlined way to access the main content of a web page for further processing or analysis.
   *
   * The API includes a "Wait For Selector" option, allowing it to wait for a specific CSS selector
   * to be present in the DOM before returning the content.
   * This is useful for ensuring that dynamic elements or data are fully loaded.
   *
   */
  async getWebContent(
    input: IWebCrawlerService.IRequest,
  ): Promise<IWebCrawlerService.IResponse> {
    try {
      const html = await this.scrapWeb(input);

      if (!html) {
        throw new Error(`failed to scrape web: ${input.url}`);
      }

      const $ = load(html);

      $("script").remove();
      $("style").remove();
      $("header").remove();
      $("footer").remove();
      $("nav").remove();

      const text = $("body").text().trim();
      const textWithoutNewLines = text.replace(/\s+/g, " ");
      return {
        content: textWithoutNewLines,
        url: input.url,
      };
    } catch {
      throw new Error(`unsupported website: ${input.url}`);
    }
  }

  private async scrapWeb(
    input: IWebCrawlerService.IRequest,
  ): Promise<string | null> {
    try {
      const request = await this.zenRowsClient.get(
        this.transformUrl(input.url),
        {
          js_render: true,
          wait: 4500,
          wait_for: input.wait_for,
          ...this.getProxyOptions(input.url),
        },
      );
      const data = await request.text();

      try {
        const json = JSON.parse(data);

        if (json.status % 100 !== 2) {
          console.warn({
            message: "웹 스크래핑 비정상 응답",
            log_data: {
              status: json.status,
              code: json.code,
            },
          });

          if (json.code === "AUTH004") {
            throw new Error(`too many requests: ${input.url}`);
          } else {
            throw new Error(`failed to scrape web: ${input.url}`);
          }
        }
      } catch {}

      return data;
    } catch (error) {
      console.error({
        message: "웹 스크래핑 요청 실패",
        log_data: { error_message: error },
      });
      return null;
    }
  }

  private transformNaverBlogURL(url: string): string {
    const regex = /https:\/\/blog\.naver\.com\/([^/]+)\/(\d+)/;
    const match = url.match(regex);

    if (match) {
      const blogId = match[1];
      const logNo = match[2];
      return `https://blog.naver.com/PostView.naver?blogId=${blogId}&logNo=${logNo}`;
    } else {
      return url;
    }
  }

  private transformUrl(url: string): string {
    if (url.includes(this.naverBlogBaseUrl)) {
      return this.transformNaverBlogURL(url);
    } else {
      return url;
    }
  }

  private getProxyOptions(url: string) {
    if (url.includes(this.arxivBaseUrl)) {
      return {
        proxy_country: "kr",
      };
    } else {
      return {};
    }
  }
}
