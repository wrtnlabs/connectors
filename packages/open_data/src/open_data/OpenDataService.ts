import axios from "axios";
import {
  IKoreaMeteorologicalAdministration,
  IOpenDataService,
} from "../structures/IOpenDataService";
import { IMSIT } from "../structures/MSIT";
import {
  convertAllPropertyToString,
  convertXmlToJson,
  createQueryParameter,
} from "@wrtnlabs/connector-shared";
import { IMOLIT } from "../structures/IMOLIT";
import { ILH } from "../structures/ILH";
import { INIA } from "../structures/INIA";
import typia, { tags } from "typia";
import { KoreaCopyrightCommission } from "../structures/KoreaCopyrightCommission";

export class OpenDataService {
  constructor(private readonly props: IOpenDataService.IProps) {}

  // getPagination<T>(
  //   data: T[],
  //   option: { page: number; limit: number },
  // ): { response: T[]; nextPage: boolean } {
  //   const { skip, take } = getOffset(option);
  //   const response = data.splice(skip, take + 1);

  //   // 다음 페이지가 존재한다는 take + 1 번째 값이 존재할 경우 다음 페이지가 있다고 값 저장 후 take + 1 번째 값 제거
  //   const nextPage = response.length === take + 1 ? true : false;
  //   if (nextPage === true) {
  //     response.pop();
  //   }

  //   return { response, nextPage };
  // }

  /**
   * Open Data Service.
   *
   * Search for the address system of the Republic of Korea
   *
   * - If you enter a postal address, you can convert it to a street address and a road name address.
   *
   */
  async getAddress(
    input: IMSIT.IGetAddressInput,
  ): Promise<IMSIT.IGetAddressOutput> {
    const baseUrl = `http://openapi.epost.go.kr/postal/retrieveNewAdressAreaCdService/retrieveNewAdressAreaCdService/getNewAddressListAreaCd`;
    const serviceKey = `${this.props.apiKey}`;
    const queryString = createQueryParameter({
      ...input,
      searchSe: "post",
      serviceKey,
    });
    const res = await axios.get(`${baseUrl}?${queryString}`);
    return res.data;
  }

  /**
   * Open Data Service.
   *
   * [Ministry of Land, Infrastructure and Transport] Retrieves information on single-family homes and multi-family homes for lease or rent
   *
   * This Connect is based on data obtained from public data portals in Korea.
   * If you talk about a specific organization here, it is an organization in Korea, and information or deducible facts that data or statistics point to can also be limited to Korea.
   *
   * You need to look up the city, county, and district code first. (POST /connector/open-data/getStandardRegionCodeList connector)
   * A connector that looks up the distirct code already exists, so call the preceding connector.
   *
   * Since this is Korean public data, most searches may have to be done in Korean.
   * Please be aware of this.
   *
   */
  async getRTMSDataSvcSHRent(
    input: IMOLIT.IgetRTMSDataSvcSHRentInput,
  ): Promise<IMOLIT.IgetRTMSDataSvcSHRentOutput> {
    try {
      const baseUrl = `https://apis.data.go.kr/1613000/RTMSDataSvcSHRent/getRTMSDataSvcSHRent`;
      const serviceKey = `${this.props.apiKey}`;
      const queryString = createQueryParameter({
        numOfRows: input.limit,
        pageNo: input.page,
        DEAL_YMD: input.DEAL_YMD,
        LAWD_CD: input.LAWD_CD,
        serviceKey,
        _type: "json",
      });

      const url = `${baseUrl}?${queryString}` as const;
      const res = await axios.get(url);
      const jsonData = await convertXmlToJson(res.data);
      const data =
        jsonData.response.body.items.item instanceof Array
          ? jsonData.response.body.items.item.map(convertAllPropertyToString)
          : convertAllPropertyToString(jsonData.response.body.items.item);

      const numOfRows = jsonData.response.body.numOfRows;
      const pageNo = jsonData.response.body.pageNo;
      const totalCount = jsonData.response.body.totalCount;
      return { data, numOfRows, pageNo, totalCount };
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Open Data Service.
   *
   * [Ministry of Land, Infrastructure and Transport] Retrieves officetel lease and rent information
   *
   * This Connect is based on data obtained from public data portals in Korea.
   * If you talk about a specific organization here, it is an organization in Korea, and information or deducible facts that data or statistics point to can also be limited to Korea.
   *
   * You need to look up the city, county, and district code first. (POST /connector/open-data/getStandardRegionCodeList connector)
   * A connector that looks up the distirct code already exists, so call the preceding connector.
   *
   * Since this is Korean public data, most searches may have to be done in Korean.
   * Please be aware of this.
   *
   */
  async getRTMSDataSvcOffiRent(
    input: IMOLIT.IGetRTMSDataSvcOffiRentInput,
  ): Promise<IMOLIT.IGetRTMSDataSvcOffiRentOutput> {
    try {
      const baseUrl = `https://apis.data.go.kr/1613000/RTMSDataSvcOffiRent/getRTMSDataSvcOffiRent`;
      const serviceKey = `${this.props.apiKey}`;
      const queryString = Object.entries({
        numOfRows: input.limit,
        pageNo: input.page,
        DEAL_YMD: input.DEAL_YMD,
        LAWD_CD: input.LAWD_CD,
        serviceKey,
        _type: "json",
      })
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      const url = `${baseUrl}?${queryString}` as const;
      const res = await axios.get(url);
      const jsonData = await convertXmlToJson(res.data);
      const data =
        jsonData.response.body.items.item instanceof Array
          ? jsonData.response.body.items.item.map(convertAllPropertyToString)
          : convertAllPropertyToString(jsonData.response.body.items.item);

      const numOfRows = jsonData.response.body.numOfRows;
      const pageNo = jsonData.response.body.pageNo;
      const totalCount = jsonData.response.body.totalCount;
      return { data, numOfRows, pageNo, totalCount };
    } catch (err) {
      console.error((err as any).response.data);
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Open Data Service.
   *
   * [Ministry of Land, Infrastructure and Transport] Retrieves apartment lease and rent information
   *
   * This Connect is based on data obtained from public data portals in Korea.
   * If you talk about a specific organization here, it is an organization in Korea, and information or deducible facts that data or statistics point to can also be limited to Korea.
   *
   * You need to look up the city, county, and district code first. (POST /connector/open-data/getStandardRegionCodeList connector)
   * A connector that looks up the distirct code already exists, so call the preceding connector.
   *
   * Since this is Korean public data, most searches may have to be done in Korean.
   * Please be aware of this.
   *
   */
  async getRTMSDataSvcAptRent(
    input: IMOLIT.IGetRTMSDataSvcAptRentInput,
  ): Promise<IMOLIT.IGetRTMSDataSvcAptRentOutput> {
    try {
      const baseUrl = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev`;
      const serviceKey = `${this.props.apiKey}`;
      const queryString = createQueryParameter({
        ...input,
        pageNo: input.page,
        numOfRows: input.limit,
        DEAL_YMD: input.DEAL_YMD,
        LAWD_CD: input.LAWD_CD,
        serviceKey,
        type: "JSON",
      });

      const url = `${baseUrl}?${queryString}`;
      const res = await axios.get(url);
      const jsonData = await convertXmlToJson(res.data);
      const data =
        jsonData.response.body.items.item instanceof Array
          ? jsonData.response.body.items.item.map(convertAllPropertyToString)
          : convertAllPropertyToString(jsonData.response.body.items.item);

      const numOfRows = jsonData.response.body.numOfRows;
      const pageNo = jsonData.response.body.pageNo;
      const totalCount = jsonData.response.body.totalCount;
      return { data, numOfRows, pageNo, totalCount };
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Open Data Service.
   *
   * [Korea Land and Housing Corporation] Retrieves information on LH rental housing complexes
   *
   * This Connect is based on data obtained from public data portals in Korea.
   * If you talk about a specific organization here, it is an organization in Korea, and information or deducible facts that data or statistics point to can also be limited to Korea.
   *
   * Since this is Korean public data, most searches may have to be done in Korean.
   * The types of houses you can choose from here are one of the following: '국민임대','공공임대','영구임대','행복주택','장기전세','매입임대','전세임대'.
   * In addition, you can inquire by city, county, and region(=시도군)
   *
   * In the Korean urban system, inquiries can only be made at the level of '특별시', '광역시', '자치시', '자치도', '도', so if you want to see it in more detail, you should ask the user for pagenation.
   *
   */
  async getLHLeaseInfo(
    input: ILH.IGetLHLeaseInfoInput,
  ): Promise<ILH.IGetLHLeaseInfoOutput> {
    try {
      const baseUrl = `http://apis.data.go.kr/B552555/lhLeaseInfo1/lhLeaseInfo1`;
      const serviceKey = `${this.props.apiKey}`;

      const queryString = Object.entries({
        PG_SZ: (input.numOfRows ? Number(input.numOfRows) : 10) + 1,
        PAGE: input.pageNo ?? 1,
        CNP_CD: input.CNP_CD,
        ...(input.SPL_TP_CD && { SPL_TP_CD: input.SPL_TP_CD }),
        serviceKey,
        type: "json",
      })
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      const res = await axios.get(`${baseUrl}?${queryString}`);
      const [_, { dsList }] = res.data;

      let nextPage: boolean = false;
      const take = (input.numOfRows ? Number(input.numOfRows) : 10) + 1;
      if (dsList.length === take) {
        nextPage = true;
        dsList.pop();
      }

      return { nextPage, data: dsList };
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Open Data Service.
   *
   * [National Information Society Agency] Retrieves parking lot information
   *
   * This Connect is based on data obtained from public data portals in Korea.
   * If you talk about a specific organization here, it is an organization in Korea, and information or deducible facts that data or statistics point to can also be limited to Korea.
   * If you don't know the exact road name(도로명주소) or lot number address(지번주소), you can't search it.
   * Look up other public data connectors first or use map connectors to look up the correct address. (ex. kakao-map connector)
   *
   * Since this is Korean public data, most searches may have to be done in Korean.
   * Please be aware of this.
   *
   */
  async getParkingLot(
    input: INIA.IGetParkingLotInput,
  ): Promise<INIA.IGetParkingLotOutput> {
    try {
      const baseUrl = `http://api.data.go.kr/openapi/tn_pubr_prkplce_info_api`;
      const serviceKey = `${this.props.apiKey}`;

      const queryString = Object.entries({
        ...input,
        serviceKey,
        type: "json",
      })
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      const res = await axios.get(`${baseUrl}?${queryString}`);
      const data = res.data.response.body;
      const parkingLots = data.items;
      return {
        numOfRows: Number(data.numOfRows),
        pageNo: Number(data.pageNo),
        totalCount: Number(data.totalCount),
        parkingLots,
      };
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Open Data Service.
   *
   * [Ministry of Land, Infrastructure and Transport] Retrieves building registration information
   *
   * This Connect is based on data obtained from public data portals in Korea.
   * If you talk about a specific organization here, it is an organization in Korea, and information or deducible facts that data or statistics point to can also be limited to Korea.
   *
   * You need to look up the city, county, and district code first. (POST /connector/open-data/getStandardRegionCodeList connector)
   * A connector that looks up the distirct code already exists, so call the preceding connector.
   *
   * Since this is Korean public data, most searches may have to be done in Korean.
   * Please be aware of this.
   *
   */
  async getBuildingInfo(
    input: IMOLIT.GetBuildingInfoInput,
  ): Promise<IMOLIT.GetBuildingInfoOutput> {
    const baseUrl = `http://apis.data.go.kr/1613000/BldRgstService_v2/getBrTitleInfo`;
    const serviceKey = `${this.props.apiKey}`;
    const queryString = Object.entries({
      ...input,
      serviceKey,
      _type: "json",
    })
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    try {
      const res = await axios.get(`${baseUrl}?${queryString}`, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
      const data = res.data.response.body;
      const bulidings = data.items.item;

      return {
        numOfRows: Number(data.numOfRows),
        pageNo: Number(data.pageNo),
        totalCount: Number(data.totalCount),
        bulidings: bulidings,
      };
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Open Data Service.
   *
   * [Ministry of the Interior and Safety] Retrieves administrative standard codes for domestic regions
   *
   * This Connect is based on data obtained from public data portals in Korea.
   * If you talk about a specific organization here, it is an organization in Korea, and information or deducible facts that data or statistics point to can also be limited to Korea.
   * Public data operating in a specific area-based class, such as building ledger information or building lease on a deposit basis information,
   * may all need to know the legal building code and the city, county, and district code (법정동 코드, 시군구 코드를 의미한다.).
   * In this case, this connector call must be preceded.
   *
   * Since this is Korean public data, most searches may have to be done in Korean.
   * Please be aware of this.
   *
   * For the search, you should use the exact name that means the administrative district, just like the "서울특별시", not "서울".
   *
   */
  async getStandardRegionCodeList(
    input: IOpenDataService.MinistryOfTheInteriorAndSafety.IGetStandardRegionCodeListInput,
  ): Promise<IOpenDataService.MinistryOfTheInteriorAndSafety.IGetStandardRegionCodeListOutput> {
    try {
      const baseUrl = `http://apis.data.go.kr/1741000/StanReginCd/getStanReginCdList`;
      const serviceKey = `${this.props.apiKey}`;

      const queryString = Object.entries({
        ...input,
        serviceKey,
        type: "json",
      })
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      const res = await axios.get(`${baseUrl}?${queryString}`);
      const [{ head }, body] = res.data.StanReginCd;

      return {
        totalCount: head[0].totalCount,
        pageNo: Number(head[1].pageNo),
        numOfRows: Number(head[1].numOfRows),
        rows: body.row.map(
          (
            el: IOpenDataService.MinistryOfTheInteriorAndSafety.IGetStandardRegionCodeListOutput["rows"][0],
          ) => {
            el.sigunguCd = `${el.sido_cd}${el.sgg_cd}`;
            el.sigunguNm =
              el.locatadd_nm?.split(" ").slice(0, 2).join(" ") ?? "";
            el.bjdongCd = `${el.umd_cd}${el.ri_cd}`;

            return el;
          },
        ),
      };
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Open Data Service.
   *
   * [Financial Services Commission] Retrieves market capitalization and stock information
   *
   * This Connect is based on data obtained from public data portals in Korea.
   * If you talk about a specific organization here, it is an organization in Korea, and information or deducible facts that data or statistics point to can also be limited to Korea.
   *
   * Since this is Korean public data, most searches may have to be done in Korean. for example "삼성전자".
   * Also, since this is based on the closing of the stock market, you can only look up from about two months ago (9 days ago) to yesterday from today's date.
   *
   */
  async getStockPriceInfo(
    input: IOpenDataService.FinancialServicesCommission.IGetStockPriceInfoInput,
  ): Promise<IOpenDataService.FinancialServicesCommission.IGetStockPriceInfoOutput> {
    try {
      const baseUrl = `https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo`;
      const serviceKey = `${this.props.apiKey}`;

      // 형식에 안맞는 date format일 경우 공공 데이터 포맷에 맞게 변형
      const is = typia.createIs<string & tags.Format<"date">>();

      const transformedInput = Object.entries(input)
        .map((el) => (is(el) ? el.replaceAll("-", "") : el))
        .reduce((acc, [key, value]) => {
          acc = Object.assign({ [key]: value });
          return acc;
        }, {});

      const queryString = createQueryParameter({
        ...transformedInput,
        serviceKey,
        resultType: "json",
      });

      const res = await axios.get(`${baseUrl}?${queryString}`);
      return res.data;
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Open Data Service.
   *
   * [Korea Meteorological Administration] Retrieves today's weather information
   *
   * Latitude and longitude coordinates are required for querying.
   * When provided, the latitude and longitude will be used to get current weather data based on the 00 minute mark of each hour for that region.
   * The output will be converted from grid coordinates to latitude and longitude, and provide weather-related information such as current weather, wind direction, and wind speed for the region.
   * The currently provided information includes:
   *
   * - POP: Probability of Precipitation
   * - PTY: Precipitation Type
   * - PCP: Precipitation Amount in the Last Hour
   * - REH: Humidity
   * - SNO: Snowfall in the Last Hour
   * - SKY: Sky Condition
   * - TMP: Temperature in the Last Hour
   * - TMN: Daily Minimum Temperature
   * - TMX: Daily Maximum Temperature
   * - UUU: Wind Speed (East-West Component)
   * - VVV: Wind Speed (North-South Component)
   * - WAV: Wave Height
   * - VEC: Wind Direction
   * - WSD: Wind Speed
   * - T1H: Temperature
   * - RN1: Precipitation Amount in the Last Hour
   * - VEC: Wind Direction
   * - T1H: Temperature
   *
   * This Connect is based on data obtained from public data portals in Korea.
   * If you talk about a specific organization here, it is an organization in Korea, and information or deducible facts that data or statistics point to can also be limited to Korea.
   *
   * There are two types in request body.
   * One is 'latitude_and_longitude' and the other is 'grid_coordinates'.
   * This function uses grid coordinate values to express Korean geographical conditions inside,
   * so grid coordinates must be entered.
   * However, grid coordinates also allow for latitude values because it is difficult for users to know their local coordinates. In this case,
   * you must deliver the values of nx and ny together with the values of 'latitude_and_longitude'.
   * If the latitude hardness value is delivered,
   * it is converted to grid coordinate value from the inside and used.
   *
   * Since this is Korean public data, most searches may have to be done in Korean.
   * Please be aware of this.
   *
   */
  async getShortTermForecast(
    input: IKoreaMeteorologicalAdministration.IGetVillageForecastInformationInput,
  ): Promise<IKoreaMeteorologicalAdministration.IWeatherResponse> {
    let nx: number | null = input.nx;
    let ny: number | null = input.ny;

    try {
      const baseUrl = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst`;
      const serviceKey = `${this.props.apiKey}`;

      const koreanTimeString = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Seoul",
      });
      const now = new Date(koreanTimeString);

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = `00`;

      if (input.type === "latitude_and_longitude") {
        const { x, y } = this.dfs_xy_conv("toXY", input.ny, input.nx);
        nx = x;
        ny = y;
      }

      const queryObject = {
        serviceKey,
        nx,
        ny,
        pageNo: 1,
        numOfRows: 14, // 코드 값의 수가 14개이므로 14를 고정 값으로 사용.
        base_date: `${year}${month}${day}`,
        base_time: `${hours}${minutes}`,
        dataType: "JSON",
      };

      const queryString = createQueryParameter(queryObject);

      const res = await axios.get(`${baseUrl}?${queryString}`);
      const data =
        res.data as IKoreaMeteorologicalAdministration.IGetVillageForecastInformationOutput;
      return data.response.body.items?.item.map((el) => {
        const { lat, lng } = this.dfs_xy_conv("toLL", el.ny, el.nx);
        return { ...el, nx: lat, ny: lng };
      });
    } catch (error) {
      if (input.type === "latitude_and_longitude") {
        return await this.getShortTermForecastByOpenWeatherMap({
          type: input.type,
          nx: input.nx,
          ny: input.ny,
        });
      } else {
        const { x, y } = this.dfs_xy_conv("toLL", input.ny, input.nx);
        return await this.getShortTermForecastByOpenWeatherMap({
          type: input.type,
          nx: x,
          ny: y,
        });
      }
    }
  }

  /**
   * Open Data Service.
   *
   * [Korea Copyright Commission] Searches for copyright information
   *
   * This Connect is based on data obtained from public data portals in Korea.
   * If you talk about a specific organization here, it is an organization in Korea, and information or deducible facts that data or statistics point to can also be limited to Korea.
   *
   * Since this is Korean public data, most searches may have to be done in Korean.
   * Please be aware of this.
   *
   * - 제호(명칭) : 저작물의 명칭을 의미하는 말로, 사용자가 어려워할 수 있기 때문에 쉽게 풀어 말하는 것이 좋습니다.
   *
   */
  async getCopyRight(
    input: KoreaCopyrightCommission.IGetCopyRightInput,
  ): Promise<KoreaCopyrightCommission.IGetCopyRightOutput> {
    try {
      const baseUrl = `https://api.odcloud.kr/api/CpyrRegInforService/v1/getCpyrRegInforUniList`;
      const serviceKey = `${this.props.apiKey}`;

      const decoded = decodeURIComponent(serviceKey);
      const queryString = createQueryParameter({
        serviceKey: decoded,
        "cond[AUTHOR_NAME::LIKE]": input.AUTHOR_NAME,
        "cond[CONT_TITLE::LIKE]": input.CONT_TITLE,
        "cond[REG_ID::EQ]": input.REG_ID,
        page: input.page,
        perPage: input.perPage,
      });

      const res = await axios.get(`${baseUrl}?${queryString}`, {
        headers: {
          Authorization: decoded,
        },
      });
      return res.data;
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  private async getShortTermForecastByOpenWeatherMap(
    input: IKoreaMeteorologicalAdministration.IGetVillageForecastInformationInput,
  ) {
    if (!this.props.weatherApiKey) {
      throw new Error("weatherApiKey is not set");
    }

    try {
      const res = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
          params: {
            appid: this.props.weatherApiKey,
            lat: input.ny,
            lon: input.nx,
          },
        },
      );

      const kelvinToCelsius = (kelvin: number) =>
        Number((kelvin - 273.15).toFixed(1));
      const { name, main, weather, wind } = res.data;
      return {
        city_name: name,
        weather_main: weather[0].main,
        weather_description: weather[0].description,
        temperature: kelvinToCelsius(main.temp),
        feel_like_temperature: kelvinToCelsius(main.feels_like),
        temperature_min: kelvinToCelsius(main.temp_min),
        temperature_max: kelvinToCelsius(main.temp_max),
        wind_speed: wind.speed,
        humidity: main.humidity,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
   *
   * @param code
   * @param v1 y좌표 혹은 위도
   * @param v2 x좌표 혹은 경도
   * @returns
   */
  private dfs_xy_conv(code: "toXY" | "toLL", v1: number, v2: number) {
    const RE = 6371.00877; // 지구 반경(km)
    const GRID = 5.0; // 격자 간격(km)
    const SLAT1 = 30.0; // 투영 위도1(degree)
    const SLAT2 = 60.0; // 투영 위도2(degree)
    const OLON = 126.0; // 기준점 경도(degree)
    const OLAT = 38.0; // 기준점 위도(degree)
    const XO = 43; // 기준점 X좌표(GRID)
    const YO = 136; // 기준점 Y좌표(GRID)

    const DEGRAD = Math.PI / 180.0;
    const RADDEG = 180.0 / Math.PI;

    const re = RE / GRID;
    const slat1 = SLAT1 * DEGRAD;
    const slat2 = SLAT2 * DEGRAD;
    const olon = OLON * DEGRAD;
    const olat = OLAT * DEGRAD;

    const sn =
      Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
      Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
    let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = (re * sf) / Math.pow(ro, sn);
    let ra: number | null = null;
    let theta: number | null = null;

    const rs: Record<"lat" | "lng" | "x" | "y", number> = {
      lat: 0,
      lng: 0,
      x: 0,
      y: 0,
    };

    if (code == "toXY") {
      rs["lat"] = v1;
      rs["lng"] = v2;
      ra = Math.tan(Math.PI * 0.25 + v1 * DEGRAD * 0.5);
      if (!ra) {
        console.error("Invalid ra value", ra);
      }
      ra = (re * sf) / Math.pow(ra, sn);
      if (!ra || isNaN(ra)) {
        console.error("Invalid ra value after pow", ra);
      }
      theta = v2 * DEGRAD - olon;
      if (theta > Math.PI) theta -= 2.0 * Math.PI;
      if (theta < -Math.PI) theta += 2.0 * Math.PI;
      theta *= sn;
      rs["x"] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
      rs["y"] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
    } else {
      rs["x"] = v1;
      rs["y"] = v2;
      const xn = v1 - XO;
      const yn = ro - v2 + YO;
      ra = Math.sqrt(xn * xn + yn * yn);
      if (sn < 0.0) -ra;
      let alat = Math.pow((re * sf) / ra, 1.0 / sn);
      alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

      if (Math.abs(xn) <= 0.0) {
        theta = 0.0;
      } else {
        if (Math.abs(yn) <= 0.0) {
          theta = Math.PI * 0.5;
          if (xn < 0.0) -theta;
        } else theta = Math.atan2(xn, yn);
      }
      const alon = theta / sn + olon;
      rs["lat"] = alat * RADDEG;
      rs["lng"] = alon * RADDEG;
    }
    return rs;
  }
}
