import { tags } from "typia";
import { SnakeToCamel } from "@wrtnlabs/connector-shared";

export const ENV_LIST = ["GOOGLE_TREND_API_KEY"] as const;

export namespace IGoogleTrendService {
  export type IProps = {
    [key in SnakeToCamel<(typeof ENV_LIST)[number]>]: string;
  };

  /**
   * 입력한 날짜의 트렌드를 조회합니다.
   *
   * 입력하지 않으면 오늘 날짜를 기준으로 조회합니다.
   *
   * 날짜 형식은 "20241231" 형식입니다.
   *
   * @title 구글 데일리 트렌드 조회를 위한 정보
   */
  export interface IRequest {
    /**
     * 데일리 트렌드를 조회할 날짜 입니다.
     *
     * 입력되지 않으면 오늘 날짜를 기준으로 조회합니다.
     * year-month-day 형식의 date 타입 문자열을 제공해주어야 한다.
     *
     * @title 날짜
     */
    date?: string & tags.Format<"date">;
  }

  /**
   * 데일리 트렌드 조회 결과입니다.
   *
   * @title 구글 데일리 트렌드 조회 결과
   */
  export interface IResponse {
    /**
     * 트렌드 조회 날짜입니다.
     *
     * @title 날짜
     */
    date: string;

    /**
     * 데일리 트렌드로 조회된 검색어입니다.
     *
     * @title 검색어
     */
    query: string;

    /**
     * 데일리 트렌드로 조회된 검색어와 연관된 검색어 목록입니다.
     *
     * @title 연관 검색어
     */
    related_queries: string[];

    /**
     * 해당 키워드가 검색된 트래픽 수입니다.
     *
     * @title 트래픽 수
     */
    traffic: string;
  }
}
