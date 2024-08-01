import { Injectable } from "@nestjs/common";
import { IGoogleFlight } from "@wrtn/connector-api/lib/structures/connector/google_flight/IGoogleFlight";
import { getJson } from "serpapi";

const defaultParams = {
  engine: "google_flights",
  api_key: process.env.SERP_API_KEY,
  hl: "ko",
  gl: "kr",
  currency: "KRW",
};

@Injectable()
export class GoogleFlightProvider {
  async searchOneWay(
    input: IGoogleFlight.IRequest,
  ): Promise<IGoogleFlight.IFinalResponse> {
    try {
      const params: any = {
        ...defaultParams,
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
      const bookingToken = res["best_flights"][0].booking_token;

      // 최종 결과 조회
      const finalParams = {
        ...params,
        booking_token: bookingToken,
      };

      return await this.searchForFinal(
        finalParams as IGoogleFlight.IRequestFinal,
      );
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  async searchRoundTrip(
    input: IGoogleFlight.IRequest,
  ): Promise<IGoogleFlight.IFinalResponse> {
    try {
      const initialParams: any = {
        ...defaultParams,
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
      const departureToken = departureRes["best_flights"][0].departure_token;

      // 도착편 조회
      const arrivalParams = {
        ...initialParams,
        departure_token: departureToken,
      };
      const arrivalRes = await getJson(arrivalParams);
      const bookingToken = arrivalRes["best_flights"][0].booking_token;

      // 최종 결과 조회
      const finalParams = {
        ...initialParams,
        booking_token: bookingToken,
      };

      return await this.searchForFinal(
        finalParams as IGoogleFlight.IRequestFinal,
      );
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  private async searchForFinal(
    input: IGoogleFlight.IRequestFinal,
  ): Promise<IGoogleFlight.IFinalResponse> {
    try {
      const params: any = {
        ...defaultParams,
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
      const output: IGoogleFlight.IFinalResponse = {
        flight: this.transformResults(
          res["selected_flights"],
          res["price_insights"],
        ),
        booking_options: this.transformBookingOption(res["booking_options"]),
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
  ): IGoogleFlight.ISearchOutput[] {
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
          : price_insights.lowest_price !== undefined
            ? `${price_insights.lowest_price}원`
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

  private transformBookingOption(
    bookingOptions: any[],
  ): IGoogleFlight.IBookingOption[] {
    return bookingOptions.map((bookingOption) => ({
      book_with: bookingOption.together.book_with,
      price:
        bookingOption.together.price === undefined
          ? "가격 정보가 없습니다."
          : `${bookingOption.together.price}원`,
      book_link: `${bookingOption.together.booking_request.url}?${bookingOption.together.booking_request.post_data}`,
    }));
  }
}
