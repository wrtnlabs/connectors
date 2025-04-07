import { tags } from "typia";
import { SnakeToCamel } from "@wrtnlabs/connector-shared";

/**
 * Write the environment variables that are required for the AWS S3 service.
 */
export const ENV_LIST = ["ZENROWS_API_KEY"] as const;

export namespace IWebCrawlerService {
  export type IProps = {
    [key in SnakeToCamel<(typeof ENV_LIST)[number]>]: string;
  };

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
