import { tags } from "typia";

export namespace IGoogleShoppingService {
  export interface IProps {
    /**
     * Serp Api Key.
     */
    apiKey: string;
  }

  /**
   * @title Product search conditions
   */
  export interface IRequestStandAlone {
    /**
     * Set the time period of the search results.
     *
     * @title Time period
     */
    tbs: string;

    /**
     * Enter the keyword you want to search for.
     *
     * @title Search term
     */
    keyword: string;

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
     * Set the number of search results.
     *
     * @title Number of search results
     */
    max_results: number & tags.Type<"int32">;
  }

  export interface IRequest extends IRequestStandAlone {
    /**
     * @title Category
     */
    category: string;
  }

  /**
   * @title Product search results
   */
  export interface IResponse {
    /**
     * @title Product name
     */
    title: string;

    /**
     * @title Product Link
     */
    link:
      | (string & tags.Format<"iri">)
      | (string & tags.Constant<"#", { title: "알 수 없는 링크" }>);

    /**
     * ₩57,600 Format
     *
     * @title Product Price
     */
    price: string;

    /**
     * @title Product Source
     */
    source?: string;

    /**
     * @title Shipping fee
     */
    deliveryCost?: string;

    /**
     * @title Product Image
     */
    thumbnail: string & tags.Format<"iri"> & tags.ContentMediaType<"image/*">;

    /**
     * @title Product Rating
     */
    rating?: number & tags.Type<"float">;
  }
}
