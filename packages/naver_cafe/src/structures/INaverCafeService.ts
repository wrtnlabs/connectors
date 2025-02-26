import { tags } from "typia";

export namespace INaverCafeService {
  export interface IProps {
    /**
     * Naver Client ID.
     */
    clientId: string;

    /**
     * Naver Client Secret.
     */
    clientSecret: string;
  }
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

  /**
   * @title Naver Cafe Search Data
   */
  export interface ICafeNaverItemOutput {
    /**
     * Title of Naver Cafe post.
     *
     * @title Post title
     */
    title: string;

    /**
     * Link to Naver Cafe post.
     *
     * @title Post link
     */
    link: string;

    /**
     * Summary of Naver Cafe post.
     *
     * @title Summary of post
     */
    description: string;

    /**
     * The name of the cafe where the Naver Cafe post is located.
     *
     * @title The name of the cafe where the post is located
     */
    cafename: string;

    /**
     * Link to the cafe where the Naver Cafe post is located.
     *
     * @title Link to the cafe where the post is located
     */
    cafeurl: string;
  }

  /**
   * @title Naver Cafe Search Results
   */
  export interface ICafeNaverOutput {
    /**
     * Naver Cafe search result data.
     *
     * @title Naver Cafe search result data
     */
    data: {
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
      items: ICafeNaverItemOutput[];
    };
  }
}
