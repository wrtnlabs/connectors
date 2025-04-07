import { tags } from "typia";
import { SnakeToCamel } from "@wrtnlabs/connector-shared";

export const ENV_LIST = ["KAKAO_MAP_CLIENT_ID"] as const;

export namespace IKakaoMapService {
  export type IProps = {
    [key in SnakeToCamel<(typeof ENV_LIST)[number]>]: string;
  };

  /**
   * @title Search Conditions
   */
  export interface ISearchByKeywordInput {
    /**
     * Search Keyword
     *
     * The simpler the search term, the better.
     * It is a good idea to search for a specific area name
     * and the type you are looking for.
     * For example, it can be 'Seoul Cafe'.
     * If you search by composing only these clear words,
     * you will provide the search results
     * that are best suited to the keyword inside the Kakao server.
     * If adjectives or words decorating places, such as 'popular cafes',
     * are included, the search quality may be lowered or nothing may be searched,
     * so put the search word as plain as possible.
     *
     * @title Search Keyword
     */
    query: string;

    /**
     * @title Results page number
     */
    page?: number &
      tags.Type<"int32"> &
      tags.Minimum<1> &
      tags.Maximum<45> &
      tags.Default<1>;

    /**
     * @title Number of documents per page
     */
    size?: number &
      tags.Type<"int32"> &
      tags.Minimum<1> &
      tags.Maximum<15> &
      tags.Default<15>;
  }

  /**
   * @title Search Results
   */
  export interface ISearchByKeywordOutput {
    /**
     * @title Search Results List
     */
    documents: IDocument[];

    /**
     * @title meta information
     */
    meta: IMeta;
  }

  /**
   * @title Search Results
   */
  export interface IDocument {
    /**
     * @title Location ID
     */
    id: string;

    /**
     * @title Place name, company name
     */
    place_name: string;

    /**
     * @title Category Name
     */
    category_name: string;

    /**
     * @title Category group code that groups only important categories
     */
    category_group_code: CategoryGroupCode;

    /**
     * @title Category group name that groups only important categories
     */
    category_group_name: CategoryGroupName;

    /**
     * @title phone number
     */
    phone: string;

    /**
     * @title Full street address
     */
    address_name: string;

    /**
     * @title Full road name address
     */
    road_address_name: string;

    /**
     * @title X coordinate value
     * @description longitude (longitude) in case of latitude and longitude
     */
    x: string;

    /**
     * @title Y coordinate value
     * @description latitude in case of longitude and latitude
     */
    y: string;

    /**
     * @title Location details page URL
     */
    place_url: string & tags.Format<"iri">;

    /**
     * @title Distance to the center coordinate
     * @description (only exists when x,y parameters are given) Unit meter
     */
    distance: string;
  }

  /**
   * @title meta information
   */
  export interface IMeta {
    /**
     * @title Number of documents found for search term
     */
    total_count: number & tags.Type<"int32">;

    /**
     * @title Number of documents displayed at once
     */
    pageable_count: number & tags.Type<"int32"> & tags.Maximum<45>;

    /**
     * @title Whether the current page is the last page
     * @description If the value is false, the page value can be increased for the next request to request the next page.
     */
    is_end: boolean;

    same_name?: {
      /**
       * @title Keyword excluding local information from query language
       * @description If you search for 'Jungang-ro Restaurant', the value extracted from the part corresponding to 'Restaurant'
       */
      keyword: string;

      /**
       * @title List of regions recognized in the query
       * @description If you search for 'Jungang-ro restaurant', the value extracted from the part corresponding to 'Jungang-ro'
       */
      region: string[];

      /**
       * @title Local information used in search
       */
      selected_region: string;
    };
  }

  /**
   * @title Category Group Code
   */
  export type CategoryGroupCode =
    | tags.Constant<"MT1", { title: "대형마트" }>
    | tags.Constant<"CS2", { title: "편의점" }>
    | tags.Constant<"PS3", { title: "어린이집,유치원" }>
    | tags.Constant<"SC4", { title: "학교" }>
    | tags.Constant<"AC5", { title: "학원" }>
    | tags.Constant<"PK6", { title: "주차장" }>
    | tags.Constant<"OL7", { title: "주유소, 충전소" }>
    | tags.Constant<"SW8", { title: "지하철역" }>
    | tags.Constant<"BK9", { title: "은행" }>
    | tags.Constant<"CT1", { title: "문화시설" }>
    | tags.Constant<"AG2", { title: "중개업소" }>
    | tags.Constant<"PO3", { title: "공공기관" }>
    | tags.Constant<"AT4", { title: "관광명소" }>
    | tags.Constant<"AD5", { title: "숙박" }>
    | tags.Constant<"FD6", { title: "음식점" }>
    | tags.Constant<"CE7", { title: "카페" }>
    | tags.Constant<"HP8", { title: "병원" }>
    | tags.Constant<"PM9", { title: "약국" }>
    | tags.Constant<"", { title: "알 수 없음" }>;

  /**
   * @title Category Group Name
   */
  export type CategoryGroupName =
    | tags.Constant<"대형마트", { title: "대형마트" }>
    | tags.Constant<"편의점", { title: "편의점" }>
    | tags.Constant<"어린이집,유치원", { title: "어린이집,유치원" }>
    | tags.Constant<"학교", { title: "학교" }>
    | tags.Constant<"학원", { title: "학원" }>
    | tags.Constant<"주차장", { title: "주차장" }>
    | tags.Constant<"주유소, 충전소", { title: "주유소, 충전소" }>
    | tags.Constant<"지하철역", { title: "지하철역" }>
    | tags.Constant<"은행", { title: "은행" }>
    | tags.Constant<"문화시설", { title: "문화시설" }>
    | tags.Constant<"중개업소", { title: "중개업소" }>
    | tags.Constant<"공공기관", { title: "공공기관" }>
    | tags.Constant<"관광명소", { title: "관광명소" }>
    | tags.Constant<"숙박", { title: "숙박" }>
    | tags.Constant<"음식점", { title: "음식점" }>
    | tags.Constant<"카페", { title: "카페" }>
    | tags.Constant<"병원", { title: "병원" }>
    | tags.Constant<"약국", { title: "약국" }>
    | tags.Constant<"", { title: "알 수 없음" }>;
}
