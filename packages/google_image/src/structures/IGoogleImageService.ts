import { tags } from "typia";
import { SnakeToCamel } from "@wrtnlabs/connector-shared";

export const ENV_LIST = ["SERP_API_KEY"] as const;

export namespace IGoogleImageService {
  export type IProps = {
    [key in SnakeToCamel<(typeof ENV_LIST)[number]>]: string;
  };

  /**
   * @title Google Image Search Condition
   */
  export interface IRequest {
    /**
     * Set a search query to get images.
     *
     * @title Search Query
     */
    query: string;

    /**
     * Choose which language you want to use as your search term.
     *
     * You can only pass a single BCP 47 language identifier.
     *
     * ex) You want to setting korean language, you can pass "ko".
     *
     * @title Language Setting
     */
    lang: string;

    /**
     * Set the ratio of the images to be retrieved as search results
     *
     * @title Image Ratio
     */
    ratio:
      | tags.Constant<"s", { title: "square" }>
      | tags.Constant<"t", { title: "tall" }>
      | tags.Constant<"w", { title: "wide" }>
      | tags.Constant<"xw", { title: "panoramic" }>;
  }

  /**
   * @title Google Image Search Result
   */
  export interface IResponse {
    /**
     * Image title
     *
     * @title title
     */
    title: string;

    /**
     * Image url
     *
     * @title url
     */
    imageUrl: string & tags.Format<"iri">;

    /**
     * Image Thumbnail
     *
     * @title thumbnail
     */
    thumbnail: string & tags.Format<"iri">;
  }
}
