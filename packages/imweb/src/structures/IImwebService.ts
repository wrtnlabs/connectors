import { tags } from "typia";
import { ContentMediaType } from "typia/lib/tags";
import { SnakeToCamel } from "@wrtnlabs/connector-shared";

export const ENV_LIST = ["IMWEB_API_KEY", "IMWEB_SECRET_KEY"] as const;

export namespace IImwebService {
  export type IProps = {
    [key in SnakeToCamel<(typeof ENV_LIST)[number]>]: string;
  };

  export interface IResponseForm {
    /**
     * @title Summary message for the response
     */
    msg: tags.Constant<"SUCCESS", { title: "성공" }>;

    /**
     * @title Status code
     */
    code: 200;

    /**
     * @title Number of requests used by this key
     */
    request_count: number;

    /**
     * @title Version of the API currently in use
     */
    version: `${number}`;
  }

  /**
   * @title Product Inquiry Request
   */
  export interface IGetProductInput {
    /**
     * You can deliver the value when you want to inquire based on the sales status of the product.
     * You can select 'sale', 'soldout', 'nosale'.
     *
     * @title the sales status of a product
     */
    prod_status?: IImwebService.ProductStatus;

    /**
     * You can also search with the product's category code,
     * but this code is randomly determined by `Imweb`, so it's currently unavailable.
     * If you don't know the exact category code, it's better not to use it.
     *
     * @title product category code
     */
    category?: string;
  }

  /**
   * @title Product inquiry results
   */
  export interface IGetProductOutput extends IResponseForm {
    /**
     * @title Product info
     */
    data: {
      /**
       * @title Product list
       */
      list: IImwebService.IProduct[];
    };
  }

  export interface IProduct {
    /**
     * @title Product number
     */
    no: number;

    /**
     * @title Status of product
     */
    prod_status: IImwebService.ProductStatus;

    /**
     * @title Category codes
     */
    categories: string[];

    /**
     * @title Custom product code
     */
    custom_prod_code: string | null;

    /**
     * @title Name of product
     */
    name: string;

    /**
     * @title File code of product images
     */
    images: string[];

    /**
     * @title File urls
     *
     * Can't call it right away because it's not a completed URL.
     */
    image_url: (string & tags.Format<"iri"> & ContentMediaType<"image/*">)[];

    /**
     * @title Detailed description
     */
    content: string;

    /**
     * Text that contains html tags and is generally difficult to use
     *
     * @title Simple description of product's content
     */
    simple_content: string;

    /**
     * Pure string except html tag
     *
     * @title Simple description of product's content
     */
    simple_content_plain: string;

    /**
     * @title Whether or not mobile details are used
     */
    use_mobile_prod_content: boolean;

    /**
     * @title Description of mobile details
     */
    mobile_content?: string;

    /**
     * @title Setting the sales method
     *
     * It will be 'normal', 'digital' and 'subscribe' product.
     */
    prod_type:
      | tags.Constant<"normal", { title: "일반 상품" }>
      | tags.Constant<"digital", { title: "디지털 상품" }>
      | tags.Constant<"subscribe", { title: "회원그룹 이용권" }>;

    /**
     * @title Sales method data
     */
    prod_type_data?: (
      | IImwebService.ProdTypeData.DigitalData
      | IImwebService.ProdTypeData.SubscribeData
    )[];

    /**
     * @title Whether the sales period is set or not
     */
    use_pre_sale: boolean;

    /**
     * @title Timestamp for sale
     */
    pre_sale_start_date?: number;

    /**
     * @title Timestamp is the end of the sale period
     */
    pre_sale_end_date?: number;

    /**
     * @title Price
     */
    price: number;

    /**
     * To provide an experience as if the product was discounted,
     * the seller can also set the original price of the product differently from the actual price it sells.
     * This is a common sales promotion strategy in commerce.
     *
     * @title The price before the discount
     */
    price_org?: number;

    /**
     * @title Whether taxes are included or not
     */
    price_tax: boolean;

    /**
     * @title Whether or not there is no price
     */
    price_none: boolean;

    /**
     * @title Set up a reserve
     */
    point: IImwebService.IPointConfigData;

    /**
     * @title Set Discount Usage
     */
    product_discount_options: (
      | tags.Constant<"coupon", { title: "Coupon" }>
      | tags.Constant<"point", { title: "Points" }>
      | tags.Constant<"shopping_group_dc", { title: "Shopping Group Discount" }>
    )[];

    /**
     * @title Product Weight
     */
    weight: string;

    /**
     * @title Product Stock Information
     */
    stock: IImwebService.IProdStockConfigData;

    /**
     * @title Origin
     */
    origin: string;

    /**
     * @title Manufacturer
     */
    maker: string;

    /**
     * @title Brand
     */
    brand: string;

    /**
     * @title Badge Information
     */
    badge: IImwebService.IProdBadgeData;

    /**
     * @title External Integration Information
     */
    sync: IImwebService.IProdSyncData;

    /**
     * @title Miscellaneous Settings
     */
    etc: IImwebService.IProdEtcData;

    /**
     * @title Product Information Disclosure
     *
     * Type is not specified, so it is denoted as an array of `any`.
     */
    prodinfo: any[];

    /**
     * @title Existence of Product Options
     */
    is_exist_options:
      | tags.Constant<"Y", { title: "Options Exist" }>
      | tags.Constant<"N", { title: "Single Product" }>;

    /**
     * @title Combination Option for Product
     */
    is_mix:
      | tags.Constant<"Y", { title: "Combination Option" }>
      | tags.Constant<"N", { title: "Single Option" }>;

    /**
     * @title Product Add Time Timestamp
     */
    add_time: number;

    /**
     * @title Product Last Edit Time Timestamp
     */
    edit_time: number;
  }

  export type ProductStatus =
    | tags.Constant<"sale", { title: "판매중" }>
    | tags.Constant<"soldout", { title: "품절" }>
    | tags.Constant<"nosale", { title: "숨김" }>;

  export namespace ProdTypeData {
    export interface DigitalData {
      /**
       * @title Download Limit Setting
       */
      use_limit: boolean;

      /**
       * @title Period Limit
       */
      period: number & tags.Type<"int64">;

      /**
       * @title Usage Limit
       */
      maximum: number & tags.Type<"int64">;
    }

    export interface SubscribeData {
      /**
       * @title Target Group Code
       */
      group_code: string;

      /**
       * @title Group Retention Period (Days)
       */
      period: number & tags.Type<"int64">;
    }
  }
  /**
   * @title Point Configuration Data Structure
   */
  export interface IPointConfigData {
    /**
     * @title Point Configuration Type
     */
    type:
      | tags.Constant<"common", { title: "Default Settings" }>
      | tags.Constant<"individual", { title: "Individual Point Settings" }>;

    /**
     * @title Point Accumulation Unit
     */
    value_type?:
      | tags.Constant<"percent", { title: "Percentage" }>
      | tags.Constant<"price", { title: "Currency Unit" }>;

    /**
     * @title Point Value
     *
     * Calculated as a percentage if `value_type` is percent
     */
    value?: `${number}`;
  }

  /**
   * @title Product Stock Information Data Structure
   */
  export interface IProdStockConfigData {
    /**
     * @title Use Stock
     */
    stock_use: boolean;

    /**
     * @title Allow Orders After Stock Depletion
     */
    stock_unlimit: boolean;

    /**
     * @title Product Stock Quantity
     */
    stock_no_option: (number & tags.Type<"int64">) | "";

    /**
     * @title Product Stock Number (SKU)
     */
    sku_no_option: (number & tags.Type<"int64">) | "";
  }

  /**
   * @title Badge Information Data Structure
   */
  export interface IProdBadgeData {
    /**
     * @title New Product
     */
    new: boolean;

    /**
     * @title Best Product
     */
    best: boolean;

    /**
     * @title MD Recommended
     */
    md: boolean;

    /**
     * @title High Demand
     */
    hot: boolean;
  }

  /**
   * @title External Integration Information Data Structure
   */
  export interface IProdSyncData {
    /**
     * @title Product Name for Naver and Kakao Shopping Exposure
     */
    pay_product_name: string;

    /**
     * @title Naver Shopping Event Phrase
     */
    event_words: string;

    /**
     * @title Naver Shopping Category ID
     */
    naver_category: string;

    /**
     * @title Naver Shopping Sales Method
     */
    product_flag:
      | tags.Constant<"소매", { title: "Retail" }>
      | tags.Constant<"도매", { title: "Wholesale" }>
      | tags.Constant<"렌탈", { title: "Rental" }>
      | tags.Constant<"대여", { title: "Lease" }>
      | tags.Constant<"할부", { title: "Installment" }>
      | tags.Constant<"예약판매", { title: "Pre-order" }>
      | tags.Constant<"구매대행", { title: "Buying Agent" }>;

    /**
     * @title Naver Shopping Product Condition
     */
    product_condition:
      | tags.Constant<"신상품", { title: "New" }>
      | tags.Constant<"중고", { title: "Used" }>
      | tags.Constant<"리퍼", { title: "Refurbished" }>
      | tags.Constant<"전시", { title: "Exhibition" }>
      | tags.Constant<"반품", { title: "Returned" }>
      | tags.Constant<"스크래치", { title: "Scratch" }>;

    /**
     * @title Overseas Buying Agent
     */
    import_flag: boolean;

    /**
     * @title Parallel Import
     */
    parallel_import: boolean;

    /**
     * @title Cultural Performance Income Deduction
     */
    is_culture_benefit: boolean;

    /**
     * @title Made to Order
     */
    order_made: boolean;
  }

  /**
   * @title Miscellaneous Settings Data Structure
   */
  export interface IProdEtcData {
    /**
     * @title Minimum Purchase Quantity
     */
    minimum_purchase_quantity: number & tags.Type<"int64">;

    /**
     * @title Maximum Quantity per Purchase
     */
    maximum_purchase_quantity: number & tags.Type<"int64">;

    /**
     * @title Maximum Quantity per Member Purchase
     */
    member_maximum_purchase_quantity: number & tags.Type<"int64">;

    /**
     * @title Maximum Purchase Quantity Limit Type for Free Options
     */
    optional_limit_type:
      | tags.Constant<
          "relative",
          { title: "Can Purchase as Much as the Main Product" }
        >
      | tags.Constant<"limit", { title: "Maximum Purchase Quantity Limit" }>
      | tags.Constant<"unique", { title: "Can Purchase Only One" }>;

    /**
     * @title Maximum Purchase Quantity for Free Options
     *
     * Maximum Purchase Quantity Limit
     */
    optional_limit?: number & tags.Type<"int64">;

    /**
     * @title use_unipass_number
     */
    use_unipass_number:
      | tags.Constant<
          "default",
          {
            title: "Follow Default Method";
            description: "May vary depending on shopping environment settings";
          }
        >
      | tags.Constant<"Y", { title: "Use" }>
      | tags.Constant<"N", { title: "Do Not Use" }>;

    /**
     * @title Minor Purchase Restriction
     */
    adult: boolean;
  }

  /**
   * An API Key and Secret Key must be issued first to use the Rest API.
   * These keys are generated on a site-by-site basis.
   *
   * @title Imweb Access Token Request DTO
   */
  export interface ICredential {
    /**
     * @title API Key
     *
     * This can be found in the configuration settings on the `Imweb`.
     */
    key: string;

    /**
     * @title API Secret Key
     *
     * This can be found in the configuration settings on the `Imweb`.
     */
    secret: string;
  }

  /**
   * @title Imweb Token Issuance Request Response DTO
   */
  export interface IGetAccessTokenOutput {
    /**
     * @title Response Message
     */
    msg: "SUCCESS";

    /**
     * @title IMWEB Custom Code
     */
    code: tags.Constant<200, { title: "Value Indicating Success" }>;

    /**
     * @title HTTP Status Code
     */
    http_code: tags.Constant<200, { title: "HTTP STATUS CODE 200" }>;

    /**
     * @title Access Token
     */
    access_token: string;
  }
}
