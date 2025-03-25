import typia from "typia";
import assert from "assert";
import { OpenDataService } from "@wrtnlabs/connector-open-data";
import { TestGlobal } from "../TestGlobal";

export const test_open_data_get_get_building_info = async () => {
  const openDataService = new OpenDataService({
    apiKey: TestGlobal.env.OPEN_DATA_API_KEY,
    weatherApiKey: TestGlobal.env.OPEN_WEATHER_API_KEY,
  });

  const res = await openDataService.getBuildingInfo({
    sigunguCd: "11680",
    bjdongCd: "10300",
    pageNo: 1,
    numOfRows: 100,
  });

  typia.assert(res);
};

export const test_open_data_get_get_building_info_2 = async () => {
  const openDataService = new OpenDataService({
    apiKey: TestGlobal.env.OPEN_DATA_API_KEY,
    weatherApiKey: TestGlobal.env.OPEN_WEATHER_API_KEY,
  });

  const res = await openDataService.getBuildingInfo({
    sigunguCd: "11680",
    bjdongCd: "1168010300",
    pageNo: 1,
    numOfRows: 100,
  });

  typia.assert(res);
};

export const test_open_data_get_get_parking_lot = async () => {
  const openDataService = new OpenDataService({
    apiKey: TestGlobal.env.OPEN_DATA_API_KEY,
    weatherApiKey: TestGlobal.env.OPEN_WEATHER_API_KEY,
  });

  const res = await openDataService.getParkingLot({
    props: {
      pageNo: 1,
      numOfRows: 100,
      lnmadr: "강원도 평창군 대관령면 횡계리 321-10",
    },
  });

  typia.assert(res);
};

export const test_open_data_get_get_lh_lease_info_has_next_page = async () => {
  const openDataService = new OpenDataService({
    apiKey: TestGlobal.env.OPEN_DATA_API_KEY,
    weatherApiKey: TestGlobal.env.OPEN_WEATHER_API_KEY,
  });

  const res = await openDataService.getLHLeaseInfo({
    pageNo: 1,
    numOfRows: 10,
    CNP_CD: 11,
  });

  typia.assert<true>(res.data.length === 10);
  typia.assert<true>(res.nextPage);
  typia.assert(res);
};

export const test_open_data_get_get_lh_lease_info = async () => {
  const openDataService = new OpenDataService({
    apiKey: TestGlobal.env.OPEN_DATA_API_KEY,
    weatherApiKey: TestGlobal.env.OPEN_WEATHER_API_KEY,
  });

  const res = await openDataService.getLHLeaseInfo({
    pageNo: 1,
    numOfRows: 1000,
    CNP_CD: 11,
  });

  typia.assert<false>(res.data.length === 1000);
  typia.assert<false>(res.nextPage);
  typia.assert(res);
};

export const test_open_data_get_get_lh_lease_info_second_page = async () => {
  const openDataService = new OpenDataService({
    apiKey: TestGlobal.env.OPEN_DATA_API_KEY,
    weatherApiKey: TestGlobal.env.OPEN_WEATHER_API_KEY,
  });

  const res = await openDataService.getLHLeaseInfo({
    pageNo: 2,
    numOfRows: 1000,
    CNP_CD: 11,
  });

  typia.assert<false>(res.data.length === 1000);
  typia.assert(res);
};

export const test_open_data_get_get_lh_lease_info_third_page = async () => {
  const openDataService = new OpenDataService({
    apiKey: TestGlobal.env.OPEN_DATA_API_KEY,
    weatherApiKey: TestGlobal.env.OPEN_WEATHER_API_KEY,
  });

  const res = await openDataService.getLHLeaseInfo({
    pageNo: 3,
    numOfRows: 1000,
    CNP_CD: 11,
  });

  typia.assert<false>(res.data.length === 1000);
  typia.assert<false>(res.nextPage);
  typia.assert(res);
};

export const test_open_data_get_RTMS_Data_svc_offi_rent = async () => {
  const openDataService = new OpenDataService({
    apiKey: TestGlobal.env.OPEN_DATA_API_KEY,
    weatherApiKey: TestGlobal.env.OPEN_WEATHER_API_KEY,
  });

  const standardRegionCodeList =
    await openDataService.getStandardRegionCodeList({
      locatadd_nm: "서울특별시",
    });

  const sigunguCd = standardRegionCodeList.rows.at(0)?.sigunguCd;
  if (!sigunguCd) {
    throw new Error("시군도 코드 조회 단계에서 에러 발생");
  }

  const res = await openDataService.getRTMSDataSvcOffiRent({
    page: 1,
    limit: 20,
    LAWD_CD: sigunguCd,
    DEAL_YMD: "202406",
  });

  typia.assert(res);
};
export const test_open_data_get_RTMS_Data_svc_offi_rent_with_pagination =
  async () => {
    const openDataService = new OpenDataService({
      apiKey: TestGlobal.env.OPEN_DATA_API_KEY,
      weatherApiKey: TestGlobal.env.OPEN_WEATHER_API_KEY,
    });

    const standardRegionCodeList =
      await openDataService.getStandardRegionCodeList({
        locatadd_nm: "서울특별시",
      });

    const sigunguCd = standardRegionCodeList.rows.at(0)?.sigunguCd;
    if (!sigunguCd) {
      throw new Error("시군도 코드 조회 단계에서 에러 발생");
    }

    const firstPage = await openDataService.getRTMSDataSvcOffiRent({
      page: 1,
      limit: 2,
      LAWD_CD: sigunguCd,
      DEAL_YMD: "202406",
    });

    typia.assert(firstPage);

    const secondPage = await openDataService.getRTMSDataSvcOffiRent({
      page: 2,
      limit: 2,
      LAWD_CD: sigunguCd,
      DEAL_YMD: "202406",
    });

    typia.assert(secondPage);
    assert(JSON.stringify(firstPage) !== JSON.stringify(secondPage));
  };

export const test_open_data_get_RTMS_Data_svc_apt_rent = async () => {
  const openDataService = new OpenDataService({
    apiKey: TestGlobal.env.OPEN_DATA_API_KEY,
    weatherApiKey: TestGlobal.env.OPEN_WEATHER_API_KEY,
  });

  const standardRegionCodeList =
    await openDataService.getStandardRegionCodeList({
      locatadd_nm: "서울특별시",
    });

  const sigunguCd = standardRegionCodeList.rows.at(0)?.sigunguCd;
  if (!sigunguCd) {
    throw new Error("시군도 코드 조회 단계에서 에러 발생");
  }

  const res = await openDataService.getRTMSDataSvcAptRent({
    page: 1,
    limit: 20,
    LAWD_CD: sigunguCd,
    DEAL_YMD: "202406",
  });

  typia.assert(res);
};

export const test_open_data_get_copy_right = async () => {
  const openDataService = new OpenDataService({
    apiKey: TestGlobal.env.OPEN_DATA_API_KEY,
    weatherApiKey: TestGlobal.env.OPEN_WEATHER_API_KEY,
  });

  const res = await openDataService.getCopyRight({});

  typia.assert(res);
};

export const test_open_data_get_copy_right_with_author_name_1 = async () => {
  const openDataService = new OpenDataService({
    apiKey: TestGlobal.env.OPEN_DATA_API_KEY,
    weatherApiKey: TestGlobal.env.OPEN_WEATHER_API_KEY,
  });

  const res = await openDataService.getCopyRight({
    AUTHOR_NAME: "이지은",
    page: 1,
    perPage: 100,
  });

  typia.assert(res);
};

export const test_open_data_get_copy_right_with_author_name_2 = async () => {
  const openDataService = new OpenDataService({
    apiKey: TestGlobal.env.OPEN_DATA_API_KEY,
    weatherApiKey: TestGlobal.env.OPEN_WEATHER_API_KEY,
  });

  const res = await openDataService.getCopyRight({
    AUTHOR_NAME: "이지은",
    page: 2,
    perPage: 100,
  });

  typia.assert(res);
};

export const test_open_data_get_RTMS_Data_svc_sh_rent = async () => {
  const openDataService = new OpenDataService({
    apiKey: TestGlobal.env.OPEN_DATA_API_KEY,
    weatherApiKey: TestGlobal.env.OPEN_WEATHER_API_KEY,
  });

  const standardRegionCodeList =
    await openDataService.getStandardRegionCodeList({
      locatadd_nm: "서울특별시",
    });

  const sigunguCd = standardRegionCodeList.rows.at(0)?.sigunguCd;
  if (!sigunguCd) {
    throw new Error("시군도 코드 조회 단계에서 에러 발생");
  }

  const res = await openDataService.getRTMSDataSvcSHRent({
    page: 1,
    limit: 20,
    LAWD_CD: sigunguCd,
    DEAL_YMD: "202406",
  });

  typia.assert(res);
};
