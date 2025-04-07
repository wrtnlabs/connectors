import { tags } from "typia";
import { SnakeToCamel } from "@wrtnlabs/connector-shared";

export const ENV_LIST = [
  "NAVER_NEWS_CLIENT_ID",
  "NAVER_NEWS_CLIENT_SECRET",
] as const;

export namespace INaverNewsService {
  export type IProps = {
    [key in SnakeToCamel<(typeof ENV_LIST)[number]>]: string;
  };

  /**
   * @title Search Conditions
   */
  export interface INaverKeywordInput {
    /**
     * Keywords that must be included in search results.
     *
     * @title Must-include keywords
     */
    andKeywords: string;

    /**
     * Keywords that you would like to see included in the search results.
     *
     * @title Keywords that would be good to include
     */
    orKeywords?: string;

    /**
     * Keywords that should not be included in search results.
     *
     * @title Keywords that should not be included
     */
    notKeywords?: string;

    /**
     * Set how many search results to retrieve.
     * Minimum 1, maximum 100, default 10.
     *
     * @title Number to search
     */
    display?: number & tags.Minimum<1> & tags.Maximum<100> & tags.Default<10>;

    /**
     * Indicates how to sort.
     *
     * - sim: Sort by accuracy descending (default).
     * - date: Sort by date descending.
     *
     * @title Sort by
     */
    sort?:
      | tags.Constant<
          "sim",
          { title: "sim"; description: "정확도 순 내림착순 정렬" }
        >
      | tags.Constant<
          "date",
          { title: "date"; description: "날짜순 내림차수 정렬" }
        >;
  }

  export interface INewsNaverOutput {
    /**
     * The time the search results were generated.
     *
     * @title The time the search results were generated
     */
    lastBuildDate: string;

    /**
     * Total number of search results.
     *
     * @title Total number of search results
     */
    total: number;

    /**
     * The starting position of the search results.
     *
     * @title The starting position of the search
     */
    start: number;

    /**
     * The number of search results to display at one time.
     *
     * @title The number of search results to display at one time
     */
    display: number;

    /**
     * Individual search results.
     *
     * @title Individual search results
     */
    items: INewsNaverItemOutput[];
  }

  /**
   * @title Naver News Search Data
   */
  export interface INewsNaverItemOutput {
    /**
     * News Title.
     *
     * @title Title
     */
    title: string;

    /**
     * Naver News URL.
     *
     * @title Naver News URL
     */
    link: string & tags.Format<"iri">;

    /**
     * Original URL of news article.
     *
     * @title Original URL
     */
    originallink: string & tags.Format<"iri">;

    /**
     * The part that matches the search term <b>is wrapped in tags. @title Summary of the news article</b>
     */
    description: string;

    /**
     * The time the news article was provided to Naver.
     *
     * @title News article publication time
     */
    pubDate: string;
  }
}
