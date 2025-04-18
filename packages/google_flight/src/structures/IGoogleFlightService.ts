import { tags } from "typia";
import {
  LinkShortener,
  SnakeToCamel,
  StrictOmit,
} from "@wrtnlabs/connector-shared";

export const ENV_LIST = ["SERP_API_KEY"] as const;

export namespace IGoogleFlightService {
  export type IProps = {
    [key in SnakeToCamel<(typeof ENV_LIST)[number]>]: string;
  } & {
    linkShortener?: LinkShortener;
  };

  /**
   * @title Information needed to search for airline tickets
   */
  export interface IRequest {
    /**
     * Please enter the code of the departure airport.
     *
     * The departure code must be the same even if it is a round trip (type "1").
     *
     * When calling connector/google-flight/arrival for a round trip (type "1"), the departure_id must be the same as when calling connector/google-flight/departure.
     *
     * @title Departure
     */
    departure_id: string;

    /**
     * Please enter the destination airport code.
     *
     * Even if it is a round trip (type "1"), the destination code must be the same.
     *
     * When calling connector/google-flight/arrival for a round trip (type "1"), the arrival_id must be the same as when calling connector/google-flight/departure.
     *
     * @title Destination
     */
    arrival_id: string;

    /**
     * Please select whether it is round trip or one way.
     *
     * Possible values are 1 and 2.
     *
     * Please select "1" for round trip and "2" for one way.
     *
     * @title Round trip or one way
     */
    type:
      | tags.Constant<"1", { title: "왕복" }>
      | tags.Constant<"2", { title: "편도" }>;

    /**
     * Please enter your departure date.
     *
     * Please enter a date after today's date.
     *
     * @title Departure date
     */
    outbound_date: string & tags.Format<"date">;

    /**
     * Please enter the date of arrival.
     *
     * If type is "1", it must be entered.
     *
     * If type is "2", it must not be entered.
     *
     * Please enter a date after today's date.
     *
     * @title Date of arrival
     */
    return_date?: string & tags.Format<"date">;

    /**
     * Please select a seat class.
     *
     * Possible values are 1, 2, 3, 4.
     *
     * @title Seat Class
     * @internal
     */
    travel_class:
      | tags.Constant<"1", { title: "이코노미" }>
      | tags.Constant<"2", { title: "프리미엄 이코노미" }>
      | tags.Constant<"3", { title: "비즈니스" }>
      | tags.Constant<"4", { title: "퍼스트" }>;

    /**
     * Please enter the number of adults.
     *
     * @title Number of adults
     */
    adults: number & tags.Type<"int32">;

    /**
     * Please enter the number of children.
     *
     * @title Number of children
     */
    children?: number & tags.Type<"int32">;

    /**
     * Please select whether it is a direct flight.
     *
     * Possible values are 0, 1, 2, 3.
     *
     * @title Whether it is a direct flight
     */
    stop:
      | tags.Constant<"0", { title: "상관 없음" }>
      | tags.Constant<"1", { title: "직항" }>
      | tags.Constant<"2", { title: "1번 경유" }>
      | tags.Constant<"3", { title: "2번 이상 경유" }>;

    /**
     * Please enter the maximum price for your flight.
     *
     * You must search for flights that do not exceed the maximum price you entered.
     *
     * @title Maximum Price
     */
    max_price?: number & tags.Type<"int32">;
  }

  export interface IRequestArrival extends IRequest {
    /**
     * Token for searching for return flights.
     *
     * @title Return Flight Search Token
     */
    departure_token: string;
  }

  export interface IRequestFinal extends IRequest {
    /**
     * Token for final confirmation of flight.
     *
     * @title Flight final confirmation token
     */
    booking_token: string;
  }

  /**
   * Here are the flight search results.
   *
   * @title Flight search results
   */
  export interface IResponse {
    /**
     * Here are the best flight search results for the given conditions.
     *
     * @title Best flight search results
     */
    best_flights: ISearchOutput[];

    /**
     * Here are the remaining flight search results.
     *
     * @title The remaining flight search results
     */
    other_flights: ISearchOutput[];
  }

  /**
   * Here are the final flight selection results.
   *
   * @title Final flight selection results
   */
  export interface IFinalResponse {
    /**
     * Here is the final selected flight information.
     *
     * @title Final selected flight information
     */
    flight: ISearchOutput[];

    /**
     * Here is the information you need to book your chosen flight.
     *
     * @title Reservation Information
     */
    booking_options: IBookingOption[];
  }

  /**
   * Here are the flight search results.
   *
   * @title Flight search results
   */
  export interface ISearchOutput {
    /**
     * Here is the flight information.
     *
     * @title Flight Information
     */
    flight: IFlight[];

    /**
     * Total flight time.
     *
     * @title Total flight time
     */
    total_duration: string;

    /**
     * Flight prices.
     *
     * @title Flight prices
     */
    price: `${number}원` | string;

    /**
     * Here is the flight transfer information.
     *
     * @title Transfer Information
     */
    layover?: ILayover;

    /**
     * Token for return flight search
     *
     * @title Return flight search token
     */
    departure_token?: string;

    /**
     * Token for final confirmation of flight
     *
     * @title Final confirmation token for flight
     */
    booking_token?: string;
  }

  interface IFlight {
    /**
     * Here is the flight departure information.
     *
     * @title Departure Information
     */
    departure_airport: IAirport;

    /**
     * Here is the flight arrival information.
     *
     * @title Arrival Information
     */
    arrival_airport: IAirport;

    /**
     * This is the time it takes to fly.
     *
     * @title Flight time
     */
    duration: string;

    /**
     * Here is the aircraft type information.
     *
     * @title Airplane type
     */
    airplane: string;

    /**
     * Here is the airline information.
     *
     * @title Airline
     */
    airline: string;

    /**
     * This is an image of an airline logo.
     *
     * @title Airline Logo
     */
    airline_logo: string &
      tags.Format<"uri"> &
      tags.ContentMediaType<"image/*">;

    /**
     * Here is the seat class information.
     *
     * @title Seat Class
     */
    travel_class: string;

    /**
     * Flight number is.
     *
     * @title Flight number
     */
    flight_number: string;
  }

  /**
   * @title Flight Information
   */
  interface IAirport {
    /**
     * Airport name.
     *
     * @title Airport name
     */
    name: string;

    /**
     * This is a three-digit airport code.
     *
     * @title Airport Code
     */
    code: string;

    /**
     * The date and time of the flight departure.
     *
     * @title Flight Departure Date / Time
     */
    time: string;
  }

  /**
   * @title Transfer information
   */
  interface ILayover extends StrictOmit<IAirport, "time"> {
    /**
     * It's transfer time.
     *
     * @title Transfer time
     */
    duration: string;
  }

  /**
   * Reservation options.
   *
   * @title Reservation options
   */
  export interface IBookingOption {
    /**
     * This is a site where you can book flights of your choice.
     *
     * @title Reservation site
     */
    book_with: string;

    /**
     * The price of the selected flight.
     *
     * @title Price
     */
    price: string | `${number}원`;

    /**
     * Here is a link to book your selected flight.
     *
     * @title Reservation Link
     */
    book_link: {
      /**
       * Departing flight link
       */
      depart?: string & tags.Format<"iri">;

      /**
       * Returning flight link
       */
      return?: string & tags.Format<"iri">;
    };
  }
}
