import { tags } from "typia";

export namespace IKoreaEximbankService {
  export interface IProps {
    /**
     * @title Eximbank API Key
     */
    apiKey: string;
  }

  /**
   * @title Exchange Rate Information
   * @description Korea Export-Import Bank provides exchange rate information for today's date.
   */
  export type IGetExchangeOutput = {
    /**
     * @title Summary of query results
     */
    result:
      | tags.Constant<1, { title: "성공" }>
      | tags.Constant<2, { title: "데이터 코드 오류" }>
      | tags.Constant<3, { title: "인증코드 오류" }>
      | tags.Constant<4, { title: "일일 제한 횟수 마감" }>;

    /**
     * @title currency code
     */
    cur_unit: string | null;

    /**
     * @title When receiving a wire transfer (remittance)
     */
    ttb: string | null;

    /**
     * @title When sending a wire transfer (remittance)
     */
    tts: string | null;

    /**
     * @title Trading standard rate
     */
    deal_bas_r: string | null;

    /**
     * @title Book Price
     */
    bkpr: string | null;

    /**
     * @title Annual Conversion Rate
     */
    yy_efee_r: string | null;

    /**
     * @title 10-day redemption rate
     */
    ten_dd_efee_r: string | null;

    /**
     * @title Seoul Foreign Exchange Brokerage Book Price
     */
    kftc_bkpr: string | null;

    /**
     * @title Seoul Foreign Exchange Brokerage Trading Standard Rate
     */
    kftc_deal_bas_r: string | null;

    /**
     * @title Country/Currency Name
     */
    cur_nm: string | null;
  }[];
}
