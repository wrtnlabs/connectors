import { tags } from "typia";
import { SnakeToCamel } from "@wrtnlabs/connector-shared";

export const ENV_LIST = ["SERP_API_KEY"] as const;

export namespace IGoogleScholarService {
  export type IProps = {
    [key in SnakeToCamel<(typeof ENV_LIST)[number]>]: string;
  };

  /**
   * @title Search Conditions
   */
  export interface ISearchInput {
    /**
     * Keywords that must be included in search results.
     *
     * @title Keywords that must be included
     */
    andKeyword: Array<string>;

    /**
     * Keywords that you would like to see included in your search results.
     *
     * @title Keywords that you would like to see included
     */
    orKeyword?: Array<string>;

    /**
     * Keywords that should not be included in search results.
     *
     * @title Keywords to exclude
     */
    notKeyword?: Array<string>;

    /**
     * Sets how many search results to retrieve.
     *
     * @title Number of search results
     */
    max_results: number & tags.Type<"int32">;
  }

  /**
   * @title Search Results
   */

  export interface ISearchOutput {
    /**
     * Unique id of search result data.
     *
     * @title Unique id of search result data
     */
    id: string;

    /**
     * This is the title of the paper searched.
     *
     * @title Title of the paper searched
     */
    title: string;

    /**
     * Here is the link to the searched paper.
     *
     * @title Link to the searched paper
     */
    link: (string & tags.Format<"iri">) | null;

    /**
     * Here is a snippet of the search results.
     *
     * @title Snippet of the search results
     */
    snippet: string;

    /**
     * Here is the publication summary information for the searched paper.
     *
     * @title Publication Summary Information
     */
    publication_info: string;

    /**
     * Here is the reference information for the searched paper.
     *
     * @title Reference information
     */
    resource: IResource[] | null;

    /**
     * The number of times the searched paper was cited.
     *
     * @title Number of times cited
     */
    citation_count: number & tags.Type<"int32">;

    /**
     * Here are links to academic materials related to the searched paper.
     *
     * @title Links to related academic materials
     */
    related_pages_link: string & tags.Format<"iri">;

    /**
     * Here is the version information for the searched paper.
     *
     * @title Version information
     */
    version_info: IVersion;
  }

  /**
   * @title References
   */
  export interface IResource {
    /**
     * Title of the reference material.
     *
     * @title Title of the reference material
     */
    title: string;

    /**
     * This is the format of the reference file.
     *
     * @title Reference file format
     */
    file_format?: string;

    /**
     * Here is a link to the reference material.
     *
     * @title Link to the reference material
     */
    link: string & tags.Format<"iri">;
  }

  /**
   * @title version
   */
  interface IVersion {
    /**
     * Here is the version information.
     *
     * @title Version information
     */
    version: (number & tags.Type<"int32">) | null;

    /**
     * Here are the version-related links.
     *
     * @title Version-related links
     */
    link: (string & tags.Format<"iri">) | null;
  }
}
