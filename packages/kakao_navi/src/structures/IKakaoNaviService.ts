import { tags } from "typia";
import { MyPick, SnakeToCamel } from "@wrtnlabs/connector-shared";

export const ENV_LIST = ["KAKAO_NAVI_CLIENT_ID"] as const;

export namespace IKakaoNaviService {
  export type IProps = {
    [key in SnakeToCamel<(typeof ENV_LIST)[number]>]: string;
  };

  /**
   * @title Request Conditions
   */
  export interface IGetFutureDirectionsInput {
    /**
     * @title Departure time
     * @description Set time after current time in YYYYMMDDHHMM format
     */
    departure_time: string;

    /**
     * @title Origin
     * @description Longitude and latitude values in X, Y coordinate format
     */
    origin: string &
      tags.Pattern<"([+-]?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?,[+-]?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)">;

    /**
     * @title Destination
     * @description Longitude and latitude values in X, Y coordinate format
     */
    destination: string &
      tags.Pattern<"([+-]?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?,[+-]?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)">;
  }

  /**
   * @title Response Results
   */
  export type IGetFutureDirectionsOutput = ISuccessCase;

  /**
   * @title Success response
   */
  export interface ISuccessCase {
    /**
     * @title Path Request ID
     */
    trans_id: string;

    /**
     * @title Path information
     */
    routes: IRoute[];
  }

  export interface IRoute {
    /**
     * @title Path search result code
     */
    result_code: IRoute.Code;

    /**
     * @title Path search result message
     */
    result_msg: string;

    /**
     * @title Path Summary Information
     */
    summary?: ISummary;

    /**
     * @title Route information by section
     */
    sections?: ISection[];
  }

  export namespace IRoute {
    export type Code =
      | tags.Constant<0, { title: "길찾기 성공" }>
      | tags.Constant<1, { title: "길찾기 결과를 찾을 수 없음" }>
      | tags.Constant<
          101,
          { title: "경유지 지점 주변의 도로를 탐색할 수 없음" }
        >
      | tags.Constant<102, { title: "시작 지점 주변의 도로를 탐색할 수 없음" }>
      | tags.Constant<103, { title: "도착 지점 주변의 도로를 탐색할 수 없음" }>
      | tags.Constant<
          104,
          {
            title: "출발지와 도착지가 5 m 이내로 설정된 경우 경로를 탐색할 수 없음";
          }
        >
      | tags.Constant<
          105,
          { title: "시작 지점 주변의 도로에 유고 정보(교통 장애)가 있음" }
        >
      | tags.Constant<
          106,
          { title: "도착 지점 주변의 도로에 유고 정보(교통 장애)가 있음" }
        >
      | tags.Constant<
          107,
          { title: "경유지 주변의 도로에 유고 정보(교통 장애)가 있음." }
        >
      | tags.Constant<
          201,
          { title: "다중 출발지: 출발지가 탐색 영역에 포함되지 않음" }
        >
      | tags.Constant<
          202,
          { title: "다중 출발지: 출발지 최대 개수 초과 도로 선택 실패" }
        >
      | tags.Constant<203, { title: "다중 출발지: 목적지 도로 선택 실패" }>
      | tags.Constant<204, { title: "다중 출발지: 경로 탐색 처리 시간 제한" }>
      | tags.Constant<
          205,
          {
            title: "다중 출발지: 출발지 주변의 유고 정보(교통 장애)로 인한 통행 불가";
          }
        >
      | tags.Constant<
          206,
          {
            title: "다중 출발지: 목적지 주변의 유고 정보(교통 장애)로 인한 통행 불가";
          }
        >
      | tags.Constant<
          207,
          { title: "다중 출발지: 출발지가 설정한 길찾기 반경 범위를 벗어남" }
        >
      | tags.Constant<301, { title: "다중 목적지: 출발지 도로 선택 실패" }>
      | tags.Constant<302, { title: "다중 목적지: 목적지 도로 선택 실패" }>
      | tags.Constant<
          303,
          { title: "다중 목적지: 목적지 최대 개수 초과로 인해 경로 탐색 실패" }
        >
      | tags.Constant<
          304,
          { title: "다중 목적지: 목적지가 설정한 길찾기 반경 범위를 벗어남" }
        >;
  }

  export interface ISummary
    extends MyPick<ISection, "bound" | "distance" | "duration"> {
    /**
     * @title Departure information
     */
    origin: IPlace;

    /**
     * @title destination information
     */
    destination: IPlace;

    /**
     * @title Transit Information
     */
    waypoints: IPlace[];

    /**
     * @title Path Finding Priority Options
     */
    priority: string;

    /**
     * @title Rate Information
     */
    fare: IFare;
  }

  export interface IPlace {
    /**
     * @title place name
     */
    name: string;

    /**
     * @title X coordinate (longitude)
     */
    x: number;

    /**
     * @title Y coordinate (latitude)
     */
    y: number;
  }

  /**
   * @title Bounding box of a rectangle containing all paths
   */
  export interface IBound {
    /**
     * @title X coordinate of the bottom left of the bounding box
     */
    min_x: number;

    /**
     * @title Y coordinate of the bottom left of the bounding box
     */
    min_y: number;

    /**
     * @title X coordinate of the upper right corner of the bounding box
     */
    max_x: number;

    /**
     * @title Y coordinate of the upper right corner of the bounding box
     */
    max_y: number;
  }

  /**
   * @title Rate Information
   */
  export interface IFare {
    /**
     * @title Taxi fare (won)
     */
    taxi: number;

    /**
     * @title Toll fee (won)
     */
    toll: number;
  }

  /**
   * @title Route information by section
   * @description If there is a waypoint, a section is created equal to the number of waypoints plus 1.
   */
  export interface ISection {
    /**
     * @title Section Distance (meters)
     */
    distance: number & tags.Type<"int32">;

    /**
     * @title Full search results move time (seconds)
     */
    duration: number & tags.Type<"int32">;

    /**
     * @title A rectangular bounding box that contains all paths
     */
    bound: IBound;

    /**
     * @title Road Information
     */
    roads?: IRoad[];

    /**
     * @title Guide Information
     */
    guides?: IGuide[];
  }

  /**
   * @title Road Information
   */
  export interface IRoad {
    /**
     * @title road name
     */
    name: string;

    /**
     * @title Road length (meters)
     */
    distance: number & tags.Type<"int32">;

    /**
     * @title Estimated travel time (sec)
     * @description Current estimated travel time and actual travel time are set to the same value
     */
    duration: number & tags.Type<"int32">;

    /**
     * @title Current traffic information speed (km/h)
     */
    traffic_speed: number;

    /**
     * @title Current traffic information status
     */
    traffic_state: TrafficState;

    /**
     * @title A one-dimensional array consisting of X, Y coordinates
     */
    vertexes: number[];
  }

  /**
   * @title Current traffic information status
   */
  export type TrafficState =
    | tags.Constant<0, { title: "교통 상태 정보 없음" }>
    | tags.Constant<1, { title: "교통 정체" }>
    | tags.Constant<2, { title: "교통 지체" }>
    | tags.Constant<3, { title: "교통 서행" }>
    | tags.Constant<4, { title: "교통 원활" }>
    | tags.Constant<6, { title: "교통사고(통행 불가)" }>;

  /**
   * @title Guide information
   */
  export interface IGuide
    extends IPlace,
      MyPick<ISection, "distance" | "duration"> {
    /**
     * @title Guide type
     */
    type: GuideType;

    /**
     * @title Guide text
     */
    guidance: string;

    /**
     * @title Link index for the current guide
     */
    road_index: number & tags.Type<"int32">;
  }

  /**
   * @title Guide text
   */
  export type GuideType =
    | tags.Constant<0, { title: "직진" }>
    | tags.Constant<1, { title: "좌회전" }>
    | tags.Constant<2, { title: "우회전" }>
    | tags.Constant<3, { title: "유턴" }>
    | tags.Constant<5, { title: "왼쪽 방향" }>
    | tags.Constant<6, { title: "오른쪽 방향" }>
    | tags.Constant<7, { title: "고속 도로 출구" }>
    | tags.Constant<8, { title: "왼쪽에 고속 도로 출구" }>
    | tags.Constant<9, { title: "오른쪽에 고속 도로 출구" }>
    | tags.Constant<10, { title: "고속 도로 입구" }>
    | tags.Constant<11, { title: "왼쪽에 고속 도로 입구" }>
    | tags.Constant<12, { title: "오른쪽에 고속 도로 입구" }>
    | tags.Constant<14, { title: "고가 도로 진입" }>
    | tags.Constant<15, { title: "지하 차도 진입" }>
    | tags.Constant<16, { title: "고가 도로 옆길" }>
    | tags.Constant<17, { title: "지하 차도 옆길" }>
    | tags.Constant<18, { title: "오른쪽 1시 방향" }>
    | tags.Constant<19, { title: "오른쪽 2시 방향" }>
    | tags.Constant<20, { title: "오른쪽 3시 방향" }>
    | tags.Constant<21, { title: "오른쪽 4시 방향" }>
    | tags.Constant<22, { title: "오른쪽 5시 방향" }>
    | tags.Constant<23, { title: "6시 방향" }>
    | tags.Constant<24, { title: "왼쪽 7시 방향" }>
    | tags.Constant<25, { title: "왼쪽 8시 방향" }>
    | tags.Constant<26, { title: "왼쪽 9시 방향" }>
    | tags.Constant<27, { title: "왼쪽 10시 방향" }>
    | tags.Constant<28, { title: "왼쪽 11시 방향" }>
    | tags.Constant<29, { title: "12시 방향" }>
    | tags.Constant<30, { title: "로터리에서 오른쪽 1시 방향" }>
    | tags.Constant<31, { title: "로터리에서 오른쪽 2시 방향" }>
    | tags.Constant<32, { title: "로터리에서 오른쪽 3시 방향" }>
    | tags.Constant<33, { title: "로터리에서 오른쪽 4시 방향" }>
    | tags.Constant<34, { title: "로터리에서 오른쪽 5시 방향" }>
    | tags.Constant<35, { title: "로터리에서 6시 방향" }>
    | tags.Constant<36, { title: "로터리에서 왼쪽 7시 방향" }>
    | tags.Constant<37, { title: "로터리에서 왼쪽 8시 방향" }>
    | tags.Constant<38, { title: "로터리에서 왼쪽 9시 방향" }>
    | tags.Constant<39, { title: "로터리에서 왼쪽 10시 방향" }>
    | tags.Constant<40, { title: "로터리에서 왼쪽 11시 방향" }>
    | tags.Constant<41, { title: "로터리에서 12시 방향" }>
    | tags.Constant<42, { title: "도시 고속 도로 출구" }>
    | tags.Constant<43, { title: "왼쪽에 도시 고속 도로 출구" }>
    | tags.Constant<44, { title: "오른쪽에 도시 고속 도로 출구" }>
    | tags.Constant<45, { title: "도시 고속 도로 입구" }>
    | tags.Constant<46, { title: "왼쪽에 도시 고속 도로 입구" }>
    | tags.Constant<47, { title: "오른쪽에 도시 고속 도로 입구" }>
    | tags.Constant<48, { title: "왼쪽 고속 도로 진입" }>
    | tags.Constant<49, { title: "오른쪽 고속 도로 진입" }>
    | tags.Constant<61, { title: "페리 항로 진입" }>
    | tags.Constant<62, { title: "페리 항로 진출" }>
    | tags.Constant<70, { title: "회전 교차로에서 오른쪽 1시 방향" }>
    | tags.Constant<71, { title: "회전 교차로에서 오른쪽 2시 방향" }>
    | tags.Constant<72, { title: "회전 교차로에서 오른쪽 3시 방향" }>
    | tags.Constant<73, { title: "회전 교차로에서 오른쪽 4시 방향" }>
    | tags.Constant<74, { title: "회전 교차로에서 오른쪽 5시 방향" }>
    | tags.Constant<75, { title: "회전 교차로에서 6시 방향" }>
    | tags.Constant<76, { title: "회전 교차로에서 왼쪽 7시 방향" }>
    | tags.Constant<77, { title: "회전 교차로에서 왼쪽 8시 방향" }>
    | tags.Constant<78, { title: "회전 교차로에서 왼쪽 9시 방향" }>
    | tags.Constant<79, { title: "회전 교차로에서 왼쪽 10시 방향" }>
    | tags.Constant<80, { title: "회전 교차로에서 왼쪽 11시 방향" }>
    | tags.Constant<81, { title: "회전 교차로에서 12시 방향" }>
    | tags.Constant<82, { title: "왼쪽 직진" }>
    | tags.Constant<83, { title: "오른쪽 직진" }>
    | tags.Constant<84, { title: "톨게이트 진입" }>
    | tags.Constant<85, { title: "원톨링 진입" }>
    | tags.Constant<86, { title: "분기 후 합류 구간 진입" }>
    | tags.Constant<100, { title: "출발지" }>
    | tags.Constant<101, { title: "목적지" }>
    | tags.Constant<1000, { title: "경유지" }>
    | tags.Constant<300, { title: "톨게이트" }>
    | tags.Constant<301, { title: "휴게소" }>;
}
