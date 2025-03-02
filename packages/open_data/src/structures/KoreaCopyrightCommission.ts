import { MyPick } from "@wrtnlabs/connector-shared";
import { tags } from "typia";

/**
 * @title Korea Copyright Association Type
 */
export namespace KoreaCopyrightCommission {
  /**
   * @title Copyright inquiry conditions
   */
  export interface IGetCopyRightInput {
    /**
     * @title Number of results per page
     */
    perPage?: number & tags.Type<"int32"> & tags.Default<10>;

    /**
     * @title Page number
     */
    page?: number & tags.Type<"int32"> & tags.Default<1>;

    /**
     * @title Copyright registration number
     * @description Only copyrights that match exactly are searched.
     */
    REG_ID?: string;

    /**
     * @title Title (Name)
     *
     * Title refers to the name of the work.
     */
    CONT_TITLE?: string;

    /**
     * @title Copyright holder name
     *
     * This refers to the name of the copyright holder. It can be a person's name, or the name of a company or specific organization.
     */
    AUTHOR_NAME?: string;
  }

  /**
   * @title Copyright search results
   */
  export interface IGetCopyRightOutput
    extends MyPick<IGetCopyRightInput, "page" | "perPage"> {
    /**
     * @title Current page count
     */
    currentCount: number & tags.Type<"int32">;

    /**
     * @title Number of copyrights matching the search criteria
     */
    matchCount: number & tags.Type<"int32">;

    /**
     * @title Search Results
     */
    data: (MyPick<
      IGetCopyRightInput,
      "REG_ID" | "CONT_TITLE" | "AUTHOR_NAME"
    > & {
      /**
       * @title Copyright registration date
       */
      REG_DATE: string & tags.Format<"date">;
    })[];
  }
}
