import { tags } from "typia";

export namespace IGoogleSearchService {
  export interface IProps {
    /**
     * Serp API Key.
     */
    apiKey: string;
  }
  /**
   * @title Conditions for searching
   */
  export interface IRequest {
    /**
     * Set the target site to search for.
     *
     * @title Target site
     */
    targetSite?: string;

    /**
     * Set keywords that must be included in search results.
     *
     * @title Must-include keywords
     */
    andKeywords: Array<string>;

    /**
     * Set good keywords to enter the search results.
     *
     * @title Good keywords to enter
     */
    orKeywords?: Array<string>;

    /**
     * Set keywords that should not be included in search results.
     *
     * @title Keywords that should not be included
     */
    notKeywords?: Array<string>;

    /**
     * Set the number of search results.
     *
     * @title Number of search results
     */
    max_results: number & tags.Type<"int32">;
  }

  /**
   * @title Search Results
   */
  export interface IResponse {
    /**
     * @title Search Results Title
     */
    title: string;

    /**
     * @title Search Results Link
     */
    link: string & tags.Format<"iri">;

    /**
     * @title Search Results Summary
     */
    snippet?: string;

    /**
     * @title Search Results thumbnail
     */
    thumbnail?: string & tags.Format<"iri"> & tags.ContentMediaType<"image/*">;
  }
}
