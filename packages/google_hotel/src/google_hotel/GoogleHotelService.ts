import { getJson } from "serpapi";
import { IGoogleHotelService } from "../structures/IGoogleHotelService";

export class GoogleHotelService {
  private readonly defaultParams: {
    engine: string;
    api_key: string;
    hl: string;
    gl: string;
    currency: string;
  };

  constructor(private readonly props: IGoogleHotelService.IProps) {
    this.defaultParams = {
      engine: "google_hotels",
      api_key: this.props.serpApiKey,
      hl: "ko",
      gl: "kr",
      currency: "KRW",
    };
  }

  /**
   * Google Hotel Service.
   *
   * Search for accommodations using Google Hotels service
   * Only one keyword should be requested per request.
   * For example, if you need to enter Seoul and Tokyo as keywords, you should make two requests with one word, "Seoul" and "Tokyo", not "Seoul, Tokyo".
   */
  async search(
    input: IGoogleHotelService.IRequest,
  ): Promise<IGoogleHotelService.IResponse[]> {
    try {
      const output: IGoogleHotelService.IResponse[] = [];

      let hotel_class = "";
      let type = "";
      if (input.hotel_class && input.hotel_class.length > 0) {
        hotel_class = input.hotel_class.join(",");
      }

      if (input.type && input.type.length > 0) {
        type = input.type.join(",");
      }

      if (input.check_in_date || input.check_out_date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (input.check_in_date) {
          const checkInDate = new Date(input.check_in_date);
          checkInDate.setHours(0, 0, 0, 0);
          if (checkInDate < today) {
            throw new Error("Check In Date cannot be in the past");
          }
        }

        if (input.check_out_date) {
          const checkOutDate = new Date(input.check_out_date);
          checkOutDate.setHours(0, 0, 0, 0);
          if (checkOutDate < today) {
            throw new Error("Check Out Date cannot be in the past");
          }
        }
      }

      let params: any = {
        ...this.defaultParams,
        q: input.keyword,
        check_in_date: input.check_in_date,
        check_out_date: input.check_out_date,
        ...(input.adults && { adults: input.adults }),
        ...(input.children && { children: input.children }),
        ...(input.rating && { rating: input.rating }),
        ...(input.sort_by && { sort_by: input.sort_by }),
        ...(input.min_price && { min_price: input.min_price }),
        ...(input.type && { property_types: type }),
        ...(input.hotel_class && { hotel_class: hotel_class }),
        ...(input.free_cancellation && {
          free_cancellation: input.free_cancellation,
        }),
      };
      while (output.length < input.max_results) {
        const res = await getJson(params);
        const results = res["properties"];

        if (!res.serpapi_pagination) {
          return output;
        }

        if (!results || results.length === 0) {
          return [];
        }

        for (const result of results) {
          if (output.length === input.max_results) {
            break;
          }

          const data: IGoogleHotelService.IResponse = {
            name: result.name,
            description: result.description ?? "숙소 설명 정보가 없습니다.",
            link: result.link ?? "숙소 링크 정보가 없습니다.",
            check_in_time:
              result.check_in_time ?? "체크인 시간 정보가 없습니다.",
            check_out_time:
              result.check_out_time ?? "체크아웃 정보가 없습니다.",
            price: result.rate_per_night?.lowest ?? "가격 정보가 없습니다.",
            nearby_place: result.nearby_places?.map(
              (place: IGoogleHotelService.INearbyPlace) => {
                return {
                  name: place.name,
                  transportations: place.transportations,
                };
              },
            ),
            hotel_class: result?.hotel_class,
            thumbnails: result.images.map(
              (image: { thumbnail: string; original_image: string }) =>
                image.thumbnail,
            ),
            rating:
              result.overll_rating !== undefined
                ? `${result.overall_rating}점`
                : "평점 정보가 없습니다.",
            review_count:
              result.reviews !== undefined
                ? `${result.reviews}개`
                : "리뷰 갯수 정보가 없습니다.",
            amenities: result.amenities ?? "편의시설 정보가 없습니다.",
            excluded_amenities: result?.excluded_amenities ?? [],
          };
          output.push(data);
        }

        if (!res.serpapi_pagination.next) {
          break;
        }

        params = {
          ...params,
          next_page_token: res.serpapi_pagination.next_page_token,
        };
      }

      return output;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }
}
