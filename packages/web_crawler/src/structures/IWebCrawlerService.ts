import { tags } from "typia";

export namespace IWebCrawlerService {
  export interface IProps {
    /**
     * @title ZenRows API Key
     */
    zenRowsApiKey: string;
  }

  /**
   * @title Request to crawl a web page
   */
  export interface IRequest {
    /**
     * @title Target URL to crawl
     */
    url: string;

    /**
     * @title Wait for a CSS selector to appear before returning content. (not required)
     */
    wait_for?: string;
  }

  /**
   * @title Response from crawled web page
   */
  export interface IResponse {
    /**
     * @title Crawled url
     */
    url: string & tags.Format<"iri">;

    /**
     * @title Crawled content
     */
    content: string;
  }
}
