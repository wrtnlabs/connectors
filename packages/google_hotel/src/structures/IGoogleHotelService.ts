import { tags } from "typia";

export namespace IGoogleHotelService {
  export interface IProps {
    /**
     * Serp API Key.
     */
    apiKey: string;
  }
  /**
   * @title Accommodation search criteria
   */
  export interface IRequest {
    /**
     * Enter the keyword you want to search for.
     *
     * @title Search term
     */
    keyword: string;

    /**
     * Set your check-in date.
     *
     * Please enter a date after today's date.
     *
     * @title Check-in date
     */
    check_in_date: string & tags.Format<"date">;

    /**
     * Set a checkout date.
     *
     * Please enter a date after today's date.
     *
     * @title Checkout Date
     */
    check_out_date: string & tags.Format<"date">;

    /**
     * Set the number of adults staying. The default is 2.
     *
     * @title Number of adults
     */
    adults?: number & tags.Type<"int32"> & tags.Default<2>;

    /**
     * Set the number of children staying. The default is 0.
     *
     * @title Number of children
     */
    children?: number & tags.Type<"int32"> & tags.Default<0>;

    /**
     * Please select the desired sort criteria.
     *
     * Only 3, 8, and 13 are possible values.
     *
     * @title Sort criteria
     */
    sort_by?:
      | tags.Constant<"3", { title: "낮은 가격 순" }>
      | tags.Constant<"8", { title: "평점 높은 순" }>
      | tags.Constant<"13", { title: "리뷰 많은 순" }>;

    /**
     * Please set the minimum price for the price range.
     *
     * @title Minimum price
     */
    min_price?: number & tags.Type<"int32">;

    /**
     * Please set the maximum price for the price range.
     *
     * @title Maximum price
     */
    max_price?: number & tags.Type<"int32">;

    /**
     * Search only properties with a selected rating or higher.
     *
     * Only possible values are 7, 8, and 9.
     *
     * @title Rating
     */
    rating?:
      | tags.Constant<"7", { title: "평점 3.5 이상" }>
      | tags.Constant<"8", { title: "평점 4.0 이상" }>
      | tags.Constant<"9", { title: "평점 4.5 이상" }>;

    /**
     * Please select the accommodation type.
     *
     * Only 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24 are possible values.
     *
     * @title Accommodation type
     */
    type?: Array<
      string &
        (
          | tags.Constant<"12", { title: "비치 호텔" }>
          | tags.Constant<"13", { title: "부티크 호텔" }>
          | tags.Constant<"14", { title: "호스텔" }>
          | tags.Constant<"15", { title: "여관" }>
          | tags.Constant<"16", { title: "모텔" }>
          | tags.Constant<"17", { title: "리조트" }>
          | tags.Constant<"18", { title: "스파 호텔" }>
          | tags.Constant<"19", { title: "아침 식사를 제공하는 숙소(B&B)" }>
          | tags.Constant<"20", { title: "기타" }>
          | tags.Constant<"21", { title: "아파트 호텔" }>
          | tags.Constant<"22", { title: "민박" }>
          | tags.Constant<"23", { title: "일본식 비즈니스 호텔" }>
          | tags.Constant<"24", { title: "료칸" }>
        )
    >;

    /**
     * Please select your accommodation class.'
     *
     * Only 1, 2, 3, 4, 5 are possible values.
     *
     * @title Accommodation class
     */
    hotel_class?: Array<
      string &
        (
          | tags.Constant<"1", { title: "1성급" }>
          | tags.Constant<"2", { title: "2성급" }>
          | tags.Constant<"3", { title: "3성급" }>
          | tags.Constant<"4", { title: "4성급" }>
          | tags.Constant<"5", { title: "5성급" }>
        )
    >;

    /**
     * Search only properties with free cancellation.
     *
     * @title Is free cancellation possible?
     */
    free_cancellation?: boolean & tags.Default<false>;

    /**
     * Set the number of search results.
     *
     * @title Number of search results
     */
    max_results: number & tags.Type<"int32">;
  }

  /**
   * @title Accommodation search results
   */
  export interface IResponse {
    /**
     * Accommodation Name
     *
     * @title Accommodation Name
     */
    name: string;

    /**
     * Property Description
     *
     * @title Property Description
     */
    description?: string;

    /**
     * Accommodation Link
     *
     * @title Accommodation Link
     */
    link?: string;

    /**
     * Accommodation check-in time
     *
     * @title Check-in time
     */
    check_in_time?: string;

    /**
     * Accommodation Check-out Time
     *
     * @title Check-out Time
     */
    check_out_time?: string;

    /**
     * Accommodation prices
     *
     * @title Accommodation prices
     */
    price: string;

    /**
     * Facilities around the property
     *
     * @title Facilities around the property
     */
    nearby_place?: INearbyPlace[];

    /**
     * Accommodation rating
     *
     * @title Accommodation rating
     */
    hotel_class?: string;

    /**
     * Accommodation thumbnail image
     *
     * @title thumbnail
     */
    thumbnails: Array<
      string & tags.Format<"iri"> & tags.ContentMediaType<"image/*">
    >;

    /**
     * Accommodation rating
     *
     * @title rating
     */
    rating?: string;

    /**
     * Number of reviews
     *
     * @title Number of reviews
     */
    review_count?: string;

    /**
     * Amenities provided by the property
     *
     * @title Amenities
     */
    amenities: string[] | string;

    /**
     * Amenities not provided by the property
     *
     * @title Amenities not provided
     */
    excluded_amenities?: string[];
  }

  /**
   * @title Surrounding facilities
   */
  export interface INearbyPlace {
    /**
     * Surrounding facility name
     *
     * @title Surrounding facility name
     */
    name: string;

    /**
     * Transportation to nearby facilities
     *
     * @title Transportation
     */
    transportations?: {
      /**
       * Types of Transportation
       *
       * @title Types of Transportation
       */
      type: string;

      /**
       * Time required to reach surrounding facilities
       *
       * @title Time required
       */
      duration: string;
    }[];
  }
}
