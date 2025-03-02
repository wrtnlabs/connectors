import { tags } from "typia";
import { IOpenDataService } from "./IOpenDataService";

/**
 * @title Ministry of Land, Infrastructure and Transport Type
 */
export namespace IMOLIT {
  export interface ICommonPaginationOutput {
    /**
     * @title nextPage
     *
     * Indicates whether the next page exists
     */
    nextPage: boolean;
  }

  export interface ICommonPaginationInput {
    /**
     * @title page
     */
    page: number & tags.Type<"uint64">;

    /**
     * @title limit
     */
    limit: number & tags.Type<"uint64"> & tags.Minimum<1> & tags.Maximum<20>;
  }

  export interface ICommonPaginationOutput {
    /**
     * @title nextPage
     */
    nextPage: boolean;
  }

  export interface IGetRTMSDataSvcAptRentInput extends ICommonPaginationInput {
    /**
     * @title City/county/district code
     */
    LAWD_CD: string;

    /**
     * @title Contract year and month of actual transaction data (6 digits)
     */
    DEAL_YMD: string;
  }

  export interface IGetRTMSDataSvcAptRentOutput {
    data: {
      /**
       * @title Block of Apartment
       * @description Indicates the block or building number of the apartment.
       */
      aptDong?: string;

      /**
       * @title Name of Apartment
       * @description Indicates the name of the apartment; for example, "Banseok Blessville."
       */
      aptNm?: string;

      /**
       * @title Apartment Sequence
       * @description Unique identifier for the apartment, e.g., "11710-132."
       */
      aptSeq?: string;

      /**
       * @title Main Lot Number
       * @description Indicates the main lot number, e.g., "0055."
       */
      bonbun?: string;

      /**
       * @title Sub Lot Number
       * @description Indicates the sub lot number, e.g., "0008."
       */
      bubun?: string;

      /**
       * @title Year Built
       * @description Indicates the year the building was constructed, e.g., "2002."
       */
      buildYear?: string;

      /**
       * @title Buyer Type
       * @description Indicates the type of buyer; for example, "Individual."
       */
      buyerGbn?: string;

      /**
       * @title Contract Date
       * @description Indicates the date of the contract.
       */
      cdealDay?: string;

      /**
       * @title Contract Type
       * @description Indicates the type of contract.
       */
      cdealType?: string;

      /**
       * @title Transaction Amount
       * @description Indicates the transaction amount in 10,000 KRW units (만원), e.g., "83,900."
       */
      dealAmount?: string;

      /**
       * @title Transaction Day
       * @description Indicates the day of the transaction, e.g., "30."
       */
      dealDay?: string;

      /**
       * @title Transaction Month
       * @description Indicates the month of the transaction, e.g., "6."
       */
      dealMonth?: string;

      /**
       * @title Transaction Year
       * @description Indicates the year of the transaction, e.g., "2024."
       */
      dealYear?: string;

      /**
       * @title Transaction Type
       * @description Indicates the type of transaction; for example, "Mediated Transaction."
       */
      dealingGbn?: string;

      /**
       * @title Agent Location
       * @description Indicates the district where the real estate agent is located, e.g., "Seoul Songpa-gu."
       */
      estateAgentSggNm?: string;

      /**
       * @title Exclusive Use Area
       * @description Indicates the exclusive use area in square meters, e.g., "83.15."
       */
      excluUseAr?: string;

      /**
       * @title Floor
       * @description Indicates the floor on which the transaction took place, e.g., "3."
       */
      floor?: string;

      /**
       * @title Lot Number (Jibun)
       * @description Indicates the lot number (Jibun), e.g., "55-8."
       */
      jibun?: string;

      /**
       * @title Land Code
       * @description Indicates the land code, e.g., "1."
       */
      landCd?: string;

      /**
       * @title Land Leasehold Indicator
       * @description Indicates whether the land is leased; "N" for no.
       */
      landLeaseholdGbn?: string;

      /**
       * @title Registration Date
       * @description Indicates the registration date, e.g., "24.10.02."
       */
      rgstDate?: string;

      /**
       * @title Road Name
       * @description Indicates the road name, e.g., "Dongnam-ro 23-gil."
       */
      roadNm?: string;

      /**
       * @title Road Main Number
       * @description Indicates the main number for the road, e.g., "00020."
       */
      roadNmBonbun?: string;

      /**
       * @title Road Sub Number
       * @description Indicates the sub number for the road, e.g., "00000."
       */
      roadNmBubun?: string;

      /**
       * @title Road Code
       * @description Indicates the road code, e.g., "4169545."
       */
      roadNmCd?: string;

      /**
       * @title Road Sequence
       * @description Indicates the sequence number for the road, e.g., "01."
       */
      roadNmSeq?: string;

      /**
       * @title Road District Code
       * @description Indicates the district code for the road, e.g., "11710."
       */
      roadNmSggCd?: string;

      /**
       * @title Road Number Code
       * @description Indicates the road number code, e.g., "0."
       */
      roadNmbCd?: string;

      /**
       * @title District Code
       * @description Indicates the district code, e.g., "11710."
       */
      sggCd?: string;

      /**
       * @title Seller Type
       * @description Indicates the type of seller; for example, "Individual."
       */
      slerGbn?: string;

      /**
       * @title Subdivision Code
       * @description Indicates the subdivision code, e.g., "11200."
       */
      umdCd?: string;

      /**
       * @title Subdivision Name
       * @description Indicates the name of the subdivision, e.g., "Ogeum-dong."
       */
      umdNm?: string;
    }[];

    /**
     * @title Num Of Rows
     */
    numOfRows?: number;

    /**
     * @title Page Number
     */
    pageNo?: number;

    /**
     * @title Total Count
     */
    totalCount?: number;
  }

  export type IgetRTMSDataSvcSHRentInput = IGetRTMSDataSvcAptRentInput;
  export interface IgetRTMSDataSvcSHRentOutput {
    /**
     * 계약 정보 아이템
     */
    data: {
      /**
       * @title 건축 연도
       **/
      buildYear?: string;

      /**
       * @title 계약 기간
       **/
      contractTerm?: string;

      /**
       * @title 계약 유형
       **/
      contractType?: string;

      /**
       * @title 계약 날짜 (일)
       **/
      dealDay: string;

      /**
       * @title 계약 날짜 (월)
       **/
      dealMonth: string;

      /**
       * @title 계약 날짜 (년)
       **/
      dealYear: string;

      /**
       * @title 보증금
       **/
      deposit: string;

      /**
       * @title 주택 유형
       **/
      houseType: string;

      /**
       * @title 월세
       **/
      monthlyRent: string;

      /**
       * @title 이전 보증금
       **/
      preDeposit?: string;

      /**
       * @title 이전 월세
       **/
      preMonthlyRent?: string;

      /**
       * @title 시군구 코드
       **/
      sggCd: string;

      /**
       * @title 총 층 면적
       **/
      totalFloorAr: string;

      /**
       * @title 읍면동 이름
       **/
      umdNm: string;

      /**
       * @title 지상권 사용 여부
       **/
      useRRRight?: string;
    }[];

    /**
     * @title Num Of Rows
     */
    numOfRows?: number;

    /**
     * @title Page Number
     */
    pageNo?: number;

    /**
     * @title Total Count
     */
    totalCount?: number;
  }

  export type IGetRTMSDataSvcOffiRentInput = IGetRTMSDataSvcAptRentInput;

  export interface IGetRTMSDataSvcOffiRentOutput {
    data: {
      /**
       * @title Block of Apartment
       * @description Indicates the block or building number of the apartment.
       */
      aptDong?: string;

      /**
       * @title Name of Apartment
       * @description Indicates the name of the apartment; for example, "Banseok Blessville."
       */
      aptNm?: string;

      /**
       * @title Apartment Sequence
       * @description Unique identifier for the apartment, e.g., "11710-132."
       */
      aptSeq?: string;

      /**
       * @title Main Lot Number
       * @description Indicates the main lot number, e.g., "0055."
       */
      bonbun?: string;

      /**
       * @title Sub Lot Number
       * @description Indicates the sub lot number, e.g., "0008."
       */
      bubun?: string;

      /**
       * @title Year Built
       * @description Indicates the year the building was constructed, e.g., "2002."
       */
      buildYear?: string;

      /**
       * @title Buyer Type
       * @description Indicates the type of buyer; for example, "Individual."
       */
      buyerGbn?: string;

      /**
       * @title Contract Date
       * @description Indicates the date of the contract.
       */
      cdealDay?: string;

      /**
       * @title Contract Type
       * @description Indicates the type of contract.
       */
      cdealType?: string;

      /**
       * @title Transaction Amount
       * @description Indicates the transaction amount in 10,000 KRW units (만원), e.g., "83,900."
       */
      dealAmount?: string;

      /**
       * @title Transaction Day
       * @description Indicates the day of the transaction, e.g., "30."
       */
      dealDay?: string;

      /**
       * @title Transaction Month
       * @description Indicates the month of the transaction, e.g., "6."
       */
      dealMonth?: string;

      /**
       * @title Transaction Year
       * @description Indicates the year of the transaction, e.g., "2024."
       */
      dealYear?: string;

      /**
       * @title Transaction Type
       * @description Indicates the type of transaction; for example, "Mediated Transaction."
       */
      dealingGbn?: string;

      /**
       * @title Agent Location
       * @description Indicates the district where the real estate agent is located, e.g., "Seoul Songpa-gu."
       */
      estateAgentSggNm?: string;

      /**
       * @title Exclusive Use Area
       * @description Indicates the exclusive use area in square meters, e.g., "83.15."
       */
      excluUseAr?: string;

      /**
       * @title Floor
       * @description Indicates the floor on which the transaction took place, e.g., "3."
       */
      floor?: string;

      /**
       * @title Lot Number (Jibun)
       * @description Indicates the lot number (Jibun), e.g., "55-8."
       */
      jibun?: string;

      /**
       * @title Land Code
       * @description Indicates the land code, e.g., "1."
       */
      landCd?: string;

      /**
       * @title Land Leasehold Indicator
       * @description Indicates whether the land is leased; "N" for no.
       */
      landLeaseholdGbn?: string;

      /**
       * @title Registration Date
       * @description Indicates the registration date, e.g., "24.10.02."
       */
      rgstDate?: string;

      /**
       * @title Road Name
       * @description Indicates the road name, e.g., "Dongnam-ro 23-gil."
       */
      roadNm?: string;

      /**
       * @title Road Main Number
       * @description Indicates the main number for the road, e.g., "00020."
       */
      roadNmBonbun?: string;

      /**
       * @title Road Sub Number
       * @description Indicates the sub number for the road, e.g., "00000."
       */
      roadNmBubun?: string;

      /**
       * @title Road Code
       * @description Indicates the road code, e.g., "4169545."
       */
      roadNmCd?: string;

      /**
       * @title Road Sequence
       * @description Indicates the sequence number for the road, e.g., "01."
       */
      roadNmSeq?: string;

      /**
       * @title Road District Code
       * @description Indicates the district code for the road, e.g., "11710."
       */
      roadNmSggCd?: string;

      /**
       * @title Road Number Code
       * @description Indicates the road number code, e.g., "0."
       */
      roadNmbCd?: string;

      /**
       * @title District Code
       * @description Indicates the district code, e.g., "11710."
       */
      sggCd?: string;

      /**
       * @title Seller Type
       * @description Indicates the type of seller; for example, "Individual."
       */
      slerGbn?: string;

      /**
       * @title Subdivision Code
       * @description Indicates the subdivision code, e.g., "11200."
       */
      umdCd?: string;

      /**
       * @title Subdivision Name
       * @description Indicates the name of the subdivision, e.g., "Ogeum-dong."
       */
      umdNm?: string;
    }[];

    /**
     * @title Num Of Rows
     */
    numOfRows?: number;

    /**
     * @title Page Number
     */
    pageNo?: number;

    /**
     * @title Total Count
     */
    totalCount?: number;
  }

  /**
   * @title Building search conditions
   */
  export interface GetBuildingInfoInput
    extends IOpenDataService.ICommon.IPaginationInput {
    /**
     * @title City/county/district code
     */
    sigunguCd: string;

    /**
     * @title Beopjeong-dong Code
     */
    bjdongCd: string;
  }

  /**
   * @title Building Inquiry Response
   */
  export interface GetBuildingInfoOutput
    extends IOpenDataService.ICommon.IPaginationOutput {
    /**
     * @title Building Information List
     */
    bulidings: Building[];
  }

  export interface Building {
    /**
     * @title Primary purpose code name
     */
    mainPurpsCdNm?: string;

    /**
     * @title Other uses
     */
    etcPurps?: string;

    /**
     * @title roof code
     */
    roofCd?: number | `${number}` | string;

    /**
     * @title Roof code name
     */
    roofCdNm?: string;

    /**
     * @title Guitar Roof
     */
    etcRoof?: string;

    /**
     * @title Number of generations (generation)
     */
    hhldCnt?: number;

    /**
     * @title Number of households (households)
     */
    fmlyCnt?: number;

    /**
     * @title Height (m)
     */
    heit?: number;

    /**
     * @title Number of floors above ground
     */
    grndFlrCnt?: number;

    /**
     * @title Basement floor
     */
    ugrndFlrCnt?: number;

    /**
     * @title Elevator driver
     */
    rideUseElvtCnt?: number;

    /**
     * @title Emergency Elevator
     */
    emgenUseElvtCnt?: number;

    /**
     * @title Number of auxiliary buildings
     */
    atchBldCnt?: number;

    /**
     * @title Area of attached building (㎡)
     */
    atchBldArea?: number;

    /**
     * @title Total floor area (㎡)
     */
    totDongTotArea?: number;

    /**
     * @title Indoor machine counter (large)
     */
    indrMechUtcnt?: number;

    /**
     * @title Indoor mechanical area (㎡)
     */
    indrMechArea?: number;

    /**
     * @title Outdoor mechanical counter (large)
     */
    oudrMechUtcnt?: number;

    /**
     * @title Outdoor mechanical area (㎡)
     */
    oudrMechArea?: number;

    /**
     * @title Indoor self-sufficient stock (large)
     */
    indrAutoUtcnt?: number;

    /**
     * @title Indoor self-sufficient area (㎡)
     */
    indrAutoArea?: number;

    /**
     * @title Outdoor self-propelled vehicle (large)
     */
    oudrAutoUtcnt?: number;

    /**
     * @title Outdoor self-contained area (㎡)
     */
    oudrAutoArea?: number;

    /**
     * @title Permission Date
     */
    pmsDay?: string | `${number}` | number;

    /**
     * @title Start date
     */
    stcnsDay?: string | `${number}` | number;

    /**
     * @title Date of approval for use
     */
    useAprDay?: string | `${number}` | number;

    /**
     * @title License number year
     */
    pmsnoYear?: string | `${number}` | number;

    /**
     * @title License Number Agency Code
     */
    pmsnoKikCd?: number | `${number}` | string;

    /**
     * @title License Number Agency Code Name
     */
    pmsnoKikCdNm?: string;

    /**
     * @title Permit number classification code
     */
    pmsnoGbCd?: number | `${number}` | string;

    /**
     * @title Permit number classification code name
     */
    pmsnoGbCdNm?: string;

    /**
     * @title lake
     */
    hoCnt?: number;

    /**
     * @title Energy Efficiency Rating
     */
    engrGrade?: string;

    /**
     * @title Energy saving rate
     */
    engrRat?: number;

    /**
     * @title EPI score
     */
    engrEpi?: number;

    /**
     * @title Eco-friendly building rating
     */
    gnBldGrade?: string | number;

    /**
     * @title Eco-friendly building certification score
     */
    gnBldCert?: number;

    /**
     * @title Intelligent Building Rating
     */
    itgBldGrade?: string;

    /**
     * @title Intelligent Building Certification Score
     */
    itgBldCert?: number;

    /**
     * @title Creation date
     */
    crtnDay: string | `${number}` | number;

    /**
     * @title order
     */
    rnum?: number;

    /**
     * @title Earth location
     */
    platPlc: string;

    /**
     * @title City/county/district code
     */
    sigunguCd: number | `${number}` | string;

    /**
     * @title Beopjeong-dong code
     */
    bjdongCd: number | `${number}` | string;

    /**
     * @title Earth Classification Code
     */
    platGbCd?: number | `${number}` | string;

    /**
     * @title number
     * @description One of the Korean address names
     */
    bun?: string;

    /**
     * @title Ji
     * @description One of the Korean address names
     */
    ji?: string;

    /**
     * @title Management Building Register PK
     */
    mgmBldrgstPk: string;

    /**
     * @title Colon Distinction Code
     */
    regstrGbCd?: number | `${number}` | string;

    /**
     * @title Colon division code name
     */
    regstrGbCdNm?: string;

    /**
     * @title Colon type code
     */
    regstrKindCd?: number | `${number}` | string;

    /**
     * @title Colon type code name
     */
    regstrKindCdNm?: string;

    /**
     * @title Road name site location
     */
    newPlatPlc?: string;

    /**
     * @title Building name
     */
    bldNm?: string;

    /**
     * @title Special place name
     */
    splotNm?: string;

    /**
     * @title block
     */
    block?: string;

    /**
     * @title lot
     */
    lot?: string;

    /**
     * @title External index
     */
    bylotCnt?: number;

    /**
     * @title New address road code
     */
    naRoadCd?: number | `${number}` | string;

    /**
     * @title New address law code
     */
    naBjdongCd?: number | `${number}` | string;

    /**
     * @title New address ground and underground code
     */
    naUgrndCd?: number | `${number}` | string;

    /**
     * @title New address number
     */
    naMainBun?: number;

    /**
     * @title New address number
     */
    naSubBun?: number;

    /**
     * @title Same name
     */
    dongNm?: string | number;

    /**
     * @title Main/Subordinate Classification Code
     */
    mainAtchGbCd?: number | `${number}` | string;

    /**
     * @title Main/Subordinate Code Name
     */
    mainAtchGbCdNm?: string;

    /**
     * @title Land area (㎡)
     */
    platArea?: number;

    /**
     * @title Building area (㎡)
     */
    archArea?: number;

    /**
     * @title Building coverage ratio (%)
     */
    bcRat?: number;

    /**
     * @title Total floor area (㎡)
     */
    totArea?: number;

    /**
     * @title Floor area ratio calculation area (㎡)
     */
    vlRatEstmTotArea?: number;

    /**
     * @title Volume ratio (%)
     */
    vlRat?: number;

    /**
     * @title Structure Code
     */
    strctCd?: number | `${number}` | string;

    /**
     * @title Structure code name
     */
    strctCdNm?: string;

    /**
     * @title Other Structures
     */
    etcStrct?: string;

    /**
     * @title Primary Purpose Code
     */
    mainPurpsCd?: number | `${number}` | string;

    /**
     * @title Whether earthquake-resistant design is applied
     */
    rserthqkDsgnApplyYn?:
      | tags.Constant<1, { title: "적용" }>
      | tags.Constant<0, { title: "미적용" }>
      | tags.Constant<" ", { title: "알 수 없음" }>;

    /**
     * @title seismic capacity
     */
    rserthqkAblty?: string;
  }

  export interface OriginalBuildingLentInfo {
    /**
     * @title Use of renewal request right
     */
    갱신요구권사용: string;

    /**
     * @title Year of construction
     */
    건축년도?: string | `${number}` | number;

    /**
     * @title Contract type
     */
    계약구분: string;

    /**
     * @title Contract period
     */
    계약기간: string;

    /**
     * @title year
     */
    년: string | `${number}` | number;

    /**
     * @title Beopjeong-dong
     */
    법정동: string;

    /**
     * @title Deposit amount
     */
    보증금액: string | number;

    /**
     * @title Apartment
     */
    아파트: string;

    /**
     * @title month
     */
    월:
      | string
      | (number & tags.Type<"int32"> & tags.Minimum<1> & tags.Maximum<12>);

    /**
     * @title Monthly rent amount
     */
    월세금액: string | (number & tags.Type<"int32">);

    /**
     * @title day
     */
    일:
      | string
      | (number & tags.Type<"int32"> & tags.Minimum<1> & tags.Maximum<31>);

    /**
     * @title Exclusive area
     */
    전용면적: string | number;

    /**
     * @title Previous contract deposit
     */
    종전계약보증금: string | number;

    /**
     * @title Previous contract monthly rent
     */
    종전계약월세: string | number;

    /**
     * @title Address
     */
    지번: string | (number & tags.Type<"int32">);

    /**
     * @title area code
     */
    지역코드: string | number;

    /**
     * @title floor
     */
    층: string | (number & tags.Type<"int32">);
  }

  export interface BuildingLentInfo {
    /**
     * @title Use of renewal request right
     */
    useOfRenewalRight: string;

    /**
     * @title Year of construction
     */
    yearOfConstruction?: string | `${number}` | number;

    /**
     * @title Contract type
     */
    typeOfContract: string;

    /**
     * @title Contract period
     */
    contractPeriod: string;

    /**
     * @title year
     */
    year: string | `${number}` | number;

    /**
     * @title Beopjeong-dong
     */
    legalDistrict: string;

    /**
     * @title Deposit amount
     *
     * Since it is based on Korean currency, it will be in ten thousand won in most cases.
     */
    depositAmount: string | number;

    /**
     * @title Apartment
     */
    apartment: string;

    /**
     * @title month
     */
    month:
      | string
      | (number & tags.Type<"int32"> & tags.Minimum<1> & tags.Maximum<12>);

    /**
     * @title Monthly rent
     *
     * Since it is based on Korean currency, it will be in ten thousand won in most cases.
     */
    monthlyRentAmount: string | (number & tags.Type<"int32">);

    /**
     * @title day
     */
    day:
      | string
      | (number & tags.Type<"int32"> & tags.Minimum<1> & tags.Maximum<31>);

    /**
     * @title Exclusive area
     */
    exclusiveArea: string | number;

    /**
     * @title Previous contract deposit
     */
    previousContractDeposit: string | number;

    /**
     * @title Previous contract monthly rent
     */
    previousContractMonthlyRent: string | number;

    /**
     * @title Address
     */
    lotNumber: string | (number & tags.Type<"int32">);

    /**
     * @title area code
     */
    areaCode: string | number;

    /**
     * @title floor
     */
    floor: string | (number & tags.Type<"int32">);
  }
}
