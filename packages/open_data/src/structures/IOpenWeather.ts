import { tags } from "typia";

export namespace IOpenWeather {
  /**
   * @title Get Weather Request Condition
   */
  export interface IRequest {
    /**
     * city name
     *
     * City names must be in English.
     * For example, in Seoul and Busan in Korea, Please go to Seoul or Busan.
     *
     * @title City Name
     */
    cityName: string & tags.MinLength<1>;
  }

  /**
   * @title Get Weather Response
   */
  export interface IResponse {
    /**
     * city name
     *
     * @title City Name
     */
    city_name: string;

    /**
     * weather main information
     *
     * @title weather information
     */
    weather_main: string;

    /**
     * weather description about weather main
     *
     * @title weather description
     */
    weather_description: string;

    /**
     * temperature
     *
     * @title temperature
     */
    temperature: number;

    /**
     * feel like temperature
     *
     * @title feel like temperature
     */
    feel_like_temperature: number;

    /**
     * minimum temperature
     *
     * @title minimum temperature
     */
    temperature_min: number;

    /**
     * maximum temperature
     *
     * @title maximum temperature
     */
    temperature_max: number;

    /**
     * wind_speed
     *
     * @title wind_speed
     */
    wind_speed: number;

    /**
     * humidity
     *
     * @title humidity
     */
    humidity: number;
  }
}
