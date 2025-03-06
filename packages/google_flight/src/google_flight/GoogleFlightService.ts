import { getJson } from "serpapi";
import { IGoogleFlightService } from "../structures/IGoogleFlightService";

export class GoogleFlightService {
  private readonly defaultParams: {
    engine: string;
    api_key: string;
    hl: string;
    gl: string;
    currency: string;
  };

  constructor(private readonly props: IGoogleFlightService.IProps) {
    this.defaultParams = {
      engine: "google_flights",
      api_key: this.props.apiKey,
      hl: "ko",
      gl: "kr",
      currency: "KRW",
    };
  }

  /**
   * Google Flight Service.
   *
   * Search for one-way flights
   */
  async searchOneWay(
    input: IGoogleFlightService.IRequest,
  ): Promise<IGoogleFlightService.IFinalResponse> {
    try {
      if (input.outbound_date) {
        const outboundDate = new Date(input.outbound_date);
        const today = new Date();

        if (outboundDate.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)) {
          throw new Error("Outbound date cannot be in the past");
        }
      }
      const params: any = {
        ...this.defaultParams,
        type: "2",
        departure_id: input.departure_id,
        arrival_id: input.arrival_id,
        outbound_date: input.outbound_date,
        travel_class: Number(input.travel_class),
        adults: input.adults,
        ...(input.children && { children: input.children }),
        stops: Number(input.stop),
        ...(input.max_price && { max_price: input.max_price }),
      };
      const res = await getJson(params);

      if (!res["best_flights"] || res["best_flights"].length === 0) {
        return { flight: [], booking_options: [] };
      }

      const bookingToken = res["best_flights"][0].booking_token;

      // 최종 결과 조회
      const finalParams = {
        ...params,
        booking_token: bookingToken,
      };

      return await this.searchForFinal(
        finalParams as IGoogleFlightService.IRequestFinal,
      );
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Google Flight Service.
   *
   * Search for round-trip flights
   */
  async searchRoundTrip(
    input: IGoogleFlightService.IRequest,
  ): Promise<IGoogleFlightService.IFinalResponse> {
    try {
      if (input.outbound_date || input.return_date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (input.outbound_date) {
          const outboundDate = new Date(input.outbound_date);
          outboundDate.setHours(0, 0, 0, 0);
          if (outboundDate < today) {
            throw new Error("Outbound date cannot be in the past");
          }
        }

        if (input.return_date) {
          const returnDate = new Date(input.return_date);
          returnDate.setHours(0, 0, 0, 0);
          if (returnDate < today) {
            throw new Error("Return date cannot be in the past");
          }
        }
      }
      const initialParams: any = {
        ...this.defaultParams,
        type: "1",
        departure_id: input.departure_id,
        arrival_id: input.arrival_id,
        outbound_date: input.outbound_date,
        return_date: input.return_date,
        travel_class: Number(input.travel_class),
        adults: input.adults,
        ...(input.children && { children: input.children }),
        stops: Number(input.stop),
        ...(input.max_price && { max_price: input.max_price }),
      };

      // 출발편 조회
      const departureRes = await getJson(initialParams);
      if (
        !departureRes["best_flights"] ||
        departureRes["best_flights"].length === 0
      ) {
        return { flight: [], booking_options: [] };
      }

      const departureToken = departureRes["best_flights"][0].departure_token;

      // 도착편 조회
      const arrivalParams = {
        ...initialParams,
        departure_token: departureToken,
      };
      const arrivalRes = await getJson(arrivalParams);

      if (
        !arrivalRes["best_flights"] ||
        arrivalRes["best_flights"].length === 0
      ) {
        return { flight: [], booking_options: [] };
      }

      const bookingToken = arrivalRes["best_flights"][0].booking_token;

      // 최종 결과 조회
      const finalParams = {
        ...initialParams,
        booking_token: bookingToken,
      };

      return await this.searchForFinal(
        finalParams as IGoogleFlightService.IRequestFinal,
      );
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  private async searchForFinal(
    input: IGoogleFlightService.IRequestFinal,
  ): Promise<IGoogleFlightService.IFinalResponse> {
    try {
      const params: any = {
        ...this.defaultParams,
        departure_id: input.departure_id,
        arrival_id: input.arrival_id,
        type: input.type,
        outbound_date: input.outbound_date,
        ...(input.return_date && { return_date: input.return_date }),
        travel_class: Number(input.travel_class),
        adults: input.adults,
        ...(input.children && { children: input.children }),
        stops: Number(input.stop),
        ...(input.max_price && { max_price: input.max_price }),
        ...(input.booking_token && { booking_token: input.booking_token }),
      };

      const res = await getJson(params);
      /**
       * 검색 결과가 없을 경우 빈배열 return
       */
      if (!res["selected_flights"] || res["selected_flights"].length === 0) {
        return { flight: [], booking_options: [] };
      }

      const output: IGoogleFlightService.IFinalResponse = {
        flight: this.transformResults(
          res["selected_flights"],
          res["price_insights"],
        ),
        booking_options: await this.transformBookingOption(
          res["booking_options"],
        ),
      };

      return output;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  private transformResults(
    results: any[],
    price_insights: any,
  ): IGoogleFlightService.ISearchOutput[] {
    return results.map((result) => ({
      flight: result.flights.map((flight: any) => ({
        departure_airport: {
          name: flight.departure_airport.name,
          code: flight.departure_airport.id,
          time: flight.departure_airport.time,
        },
        arrival_airport: {
          name: flight.arrival_airport.name,
          code: flight.arrival_airport.id,
          time: flight.arrival_airport.time,
        },
        duration: this.transformDuration(flight.duration),
        airplane:
          flight.airplane === undefined
            ? "비행기 기종 정보가 없습니다."
            : flight.airplane,
        airline: flight.airline,
        airline_logo: flight.airline_logo,
        travel_class: flight.travel_class,
        flight_number: flight.flight_number,
      })),
      total_duration: this.transformDuration(result.total_duration),
      price:
        result.price !== undefined
          ? `${result.price}원`
          : price_insights?.lowest_price !== undefined
            ? `${price_insights?.lowest_price}원`
            : "가격 정보가 없습니다.",
      layover: result.layover?.map((layover: any) => ({
        name: layover.name,
        code: layover.id,
        duration: layover.duration,
      })),
      departure_token: result.departure_token,
      booking_token: result.booking_token,
    }));
  }

  private transformDuration(duration: number): string {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}시간 ${minutes}분`;
  }

  private async transformBookingOption(
    bookingOptions: any[],
  ): Promise<IGoogleFlightService.IBookingOption[]> {
    const transformedOptions = await Promise.all(
      bookingOptions.map(async (bookingOption) => {
        const togetherBookingRequest = bookingOption.together?.booking_request;
        const departingBookingRequest =
          bookingOption.departing?.booking_request;
        const returningBookingRequest =
          bookingOption.returning?.booking_request;

        let bookLink: string;
        if (togetherBookingRequest) {
          bookLink = `${togetherBookingRequest.url}?${togetherBookingRequest.post_data}`;
        } else if (departingBookingRequest && returningBookingRequest) {
          const departingLink = `${departingBookingRequest.url}?${departingBookingRequest.post_data}`;
          const returningLink = `${returningBookingRequest.url}?${returningBookingRequest.post_data}`;
          bookLink = `출발 항공편 예약 링크: ${departingLink} / 도착 항공편 예약 링크: ${returningLink}`;
        } else {
          bookLink = "예약 링크가 없습니다.";
        }

        return {
          book_with: bookingOption.together?.book_with || "정보 없음",
          price:
            bookingOption.together?.price !== undefined
              ? `${bookingOption.together.price}원`
              : "가격 정보가 없습니다.",
          book_link: bookLink,
        };
      }),
    );
    return transformedOptions;
  }
}
