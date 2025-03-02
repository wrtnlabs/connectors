import { tags } from "typia";

/**
 * MSIT: Ministry of Science and ICT
 */
export namespace IMSIT {
  export interface IGetAddressOutput {
    /**
     * @title NewAddressListResponse
     *
     * Section containing header information for the response result
     */
    NewAddressListResponse: {
      cmmMsgHeader: {
        /**
         * @title totalCount
         */
        totalCount?: number & tags.Type<"uint64">;

        /**
         * @title countPerPage
         */
        countPerPage?: number & tags.Type<"uint64">;

        /**
         * @title totalPage
         */
        totalPage?: number & tags.Type<"uint64">;

        /**
         * @title error message
         */
        errMsg?: string;
      };

      /**
       * @title Address Data
       *
       * If there is no data, the key itself does not exist, so in this case, there are no search results.
       */
      newAddressListAreaCd?: {
        /**
         * @title Postal address
         */
        zipNo: string;

        /**
         * @title street address
         */
        lnmAdres: string;

        /**
         * @title Road name address
         */
        rnAdres: string;
      }[];
    };
  }

  export interface IGetAddressInput {
    /**
     * @title search term
     */
    srchwrd: string & tags.MinLength<1> & tags.MaxLength<200>;

    /**
     * @title Number of outputs per page
     */
    countPerPage?: number & tags.Type<"uint32">;

    /**
     * @title Page number to be printed
     */
    currentPage?: number & tags.Type<"uint32">;
  }
}
