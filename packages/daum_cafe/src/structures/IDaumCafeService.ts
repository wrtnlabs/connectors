import { tags } from "typia";
import { SnakeToCamel } from "@wrtnlabs/connector-shared";

export const ENV_LIST = ["DAUM_API_KEY"] as const;

/**
 * accuracy: accuracy (default)
 *
 * recency: latest
 *
 * @title Sort by
 */
type Sort = "accuracy" | "recency";

export namespace IDaumCafeService {
  export type IProps = {
    [key in SnakeToCamel<(typeof ENV_LIST)[number]>]: string;
  };

  /**
   * @title Information needed for the next search
   */
  export interface ISearchInput {
    /**
     * Set keywords that must be included in the following search results.
     *
     * @title Must-include keywords
     */
    andKeywords: string;

    /**
     * Set good keywords to enter the following search results.
     *
     * @title Good keywords to enter
     */
    orKeywords?: string;

    /**
     * Set keywords that should not be included in the following search results.
     *
     * @title Keywords that should not be included
     */
    notKeywords?: string;

    /**
     * - accuracy: accuracy order (default)
     * - recency: most recent order
     *
     * @title Sorting method for result documents
     */
    sort?: Sort & tags.Default<"accuracy">;

    /**
     * The number of the results page.
     *
     * @title Results page number
     */
    page?: number & tags.Minimum<1> & tags.Maximum<50> & tags.Default<1>;

    /**
     * The number of documents to be displayed on one page.
     *
     * @title The number of documents to be displayed on one page
     */
    size?: number & tags.Minimum<1> & tags.Maximum<50> & tags.Default<10>;
  }

  /**
   * @title Next Cafe Search Results
   */
  export interface ICafeOutput {
    /**
     * @title metadata
     */
    meta: {
      /**
       * Total number of searched cafes.
       *
       * @title Number of searched cafe contents
       */
      totalCount: number;

      /**
       * The number of contents that can be exposed among the searched cafe contents.
       *
       * @title The number of contents that can be exposed among the searched cafe contents
       */
      pageableCount: number;

      /**
       * If the value is false, you can request the next page by incrementing page.
       *
       * @title Whether the current page is the last page
       */
      isEnd: boolean;
    };

    /**
     * @title documents
     */
    documents: {
      /**
       * The title of the document searched.
       *
       * @title The title of the document
       */
      title: string;

      /**
       * This is part of the text of the document that was searched.
       *
       * @title Part of the text of the document
       */
      contents: string;

      /**
       * The URL of the document being searched.
       *
       * @title Document URL
       */
      url: string;

      /**
       * The following cafe name is searched.
       *
       * @title Cafe Name
       */
      cafeName: string;

      /**
       * Representative preview image URL extracted from the search system.
       *
       * @title Thumbnail image URL
       */
      thumbnail: string & tags.ContentMediaType<"image/*">;

      /**
       * The time the document was created.
       *
       * @title Document Creation Time
       */
      dateTime: string;
    }[];
  }
}
