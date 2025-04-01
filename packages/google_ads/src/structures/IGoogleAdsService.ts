import { tags } from "typia";
import {
  DeepStrictMerge,
  MyPartial,
  MyPick,
  StrictOmit,
} from "@wrtnlabs/connector-shared";

export namespace IGoogleAdsService {
  export interface IProps {
    googleAds: {
      /**
       * @title Google Ads Parent Secret
       */
      parentSecret: string;

      /**
       * @title Google Ads Account ID
       */
      accountId: string;

      /**
       * @title Google Ads Developer Token
       */
      developerToken: string;
    };

    google: {
      /**
       * @title Google Client ID
       */
      clientId: string;

      /**
       * @title Google Client Secret
       */
      clientSecret: string;

      /**
       * @title Google Refresh Token
       */
      secret: string;
    };
  }

  export interface IGetTargetCustomerIdInput {
    /**
     * @title Customer ID
     */
    customerId?: CustomerClient["id"];
  }

  export interface IGetMetricInput {
    /**
     * @title Statistics query date
     */
    date: string & tags.Format<"date">;

    /**
     * @title Customer ID
     */
    customerId: CustomerClient["id"];
  }

  export interface IGetMetricOutputResult {
    metrics: {
      /**
       * @title Number of exposures
       */
      impressions: `${number & tags.Type<"int64">}`;

      /**
       * @title Clicks
       */
      clicks: `${number & tags.Type<"int64">}`;

      /**
       * @title Advertising Spend (in micro units)
       * @description KRW value expressed in 1/1,000,000
       */
      costMicros: `${number & tags.Type<"int64">}`;

      /**
       * @title Video View
       */
      videoViews: `${number & tags.Type<"int64">}`;

      /**
       * @title Average Page Views
       */
      averagePageViews?: `${number & tags.Type<"int64">}`;

      /**
       * @title 25% of the videos were viewed
       */
      videoQuartileP25Rate?: `${number & tags.Type<"int64">}`;

      /**
       * @title 50% of the video was viewed
       */
      videoQuartileP50Rate?: `${number & tags.Type<"int64">}`;

      /**
       * @title 75% of the videos were viewed
       */
      videoQuartileP75Rate?: `${number & tags.Type<"int64">}`;

      /**
       * @title 100% of the video has been viewed
       */
      videoQuartileP100Rate?: `${number & tags.Type<"int64">}`;
    };

    adGroupAd: MyPick<AdGroupAd, "resourceName">;
  }

  export interface IGetAdGroupAdInput {
    /**
     * @title Resource name of the ad group ad
     */
    adGroupAdResourceName?: IGoogleAdsService.AdGroupAd["resourceName"];
  }

  export type IGetAdGroupAdOutput = MyPick<
    AdGroupAd,
    "resourceName" | "policySummary" | "status"
  >[];

  export interface IGetAdGroupAdDetailInput {
    /**
     * @title Resource name of the ad group ad
     */
    adGroupAdResourceName: IGoogleAdsService.AdGroupAd["resourceName"];
  }

  export interface Ad {
    resourceName: `customers/${number}/ads/${number}`;

    status: Status;
  }

  export interface IGetAdGroupAdDetailOutput {
    /**
     * @title Resource name of the ad group ad
     */
    resourceName: AdGroupAd["resourceName"];

    /**
     * @title Current status of advertising
     */
    status: Ad["status"];

    /**
     * @title Viewed Ad History
     */
    ad: {
      /**
       * @title Resource name of the advertisement
       */
      resourceName: Ad["resourceName"];

      /**
       * @title Advertising material information
       */
      detail: ResponsiveSearchAd | ResponsiveDisplayAd;
    };
  }

  export interface ResponsiveSearchAd {
    /**
     * @title Description List
     */
    descriptions: {
      /**
       * @title Registered description
       */
      text: string;
    }[];

    /**
     * @title List of titles
     */
    headlines: {
      /**
       * @title Registered title
       */
      text: string;
    }[];
  }

  export interface ResponsiveDisplayAd extends ResponsiveSearchAd {
    /**
     * @title long title
     */
    longHeadline: any;

    /**
     * @title Brand Name
     */
    businessName: any;

    marketingImages: any;
    squareMarketingImages: any;
    squareLogoImages: any;
  }
  export interface IUpdateSearchAdInput {
    /**
     * @title Resource name of the ad group ad
     */
    adGroupAdResourceName: IGoogleAdsService.AdGroupAd["resourceName"];
  }

  export interface ISetOnOffInput {
    /**
     * @title Resource name of the ad group ad
     */
    adGroupAdResourceName: AdGroupAd["resourceName"];

    /**
     * @title Ad Status
     */
    status:
      | tags.Constant<"ENABLED", { title: "ENABLED" }>
      | tags.Constant<"PAUSED", { title: "PAUSED" }>;

    /**
     * @title Customer ID
     */
    customerId: CustomerClient["id"];
  }

  /**
   * @title Keyword deletion condition
   */
  export interface IDeleteAdGroupCriteriaInput {
    /**
     * @title ID of the keyword to be deleted
     */
    resourceNames: AdGroupCriterion["resourceName"][];

    /**
     * @title Customer ID
     */
    customerId: CustomerClient["id"];
  }

  /**
   * @title Keyword generation result
   */
  export type ICreateAdGroupCriteriaOutput = Array<
    IGoogleAdsService.AdGroupCriterion["resourceName"]
  >;

  export interface ICreateAdGroupCriteriaInput
    extends StrictOmit<ICreateKeywordInput, "customerId"> {
    /**
     * @title Resource name of the ad group to which you want to add the keyword
     */
    adGroupResourceName: AdGroup["resourceName"];
  }

  export interface Keyword {
    /**
     * @title Keyword Text
     */
    text: string;

    /**
     * Keyword Match Type
     *
     * @title Keyword Match Type
     */
    matchType:
      | tags.Constant<"UNSPECIFIED", { title: "명시되지 않음" }>
      | tags.Constant<"UNKNOWN", { title: "알 수 없음" }>
      | tags.Constant<"EXACT", { title: "완전일치" }>
      | tags.Constant<"PHRASE", { title: "구문일치" }>
      | tags.Constant<"BROAD", { title: "확장검색" }>;
  }

  export type AdGroupCriterion = {
    /**
     * Format: `customers/${number}/adGroupCriteria/number~${number}`
     *
     * @title Ad Group Standard Resource Name
     */
    resourceName: string &
      tags.Pattern<"(customers\\/(.*)\\/adGroupCriteria\\/[+-]?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?~[+-]?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)">;

    /**
     * @title type
     */
    type: "KEYWORD";

    /**
     * Ad Group Standard ID
     *
     * @title Ad Group Standard ID
     */
    criterionId: `${number}`;

    /**
     * @title keyword
     */
    keyword: Keyword;

    /**
     * @title Ad Group Standard Status
     */
    status: IGoogleAdsService.Status;
  };

  export interface IGetKeywordsOutputResult {
    adGroupCriterion: MyPick<
      AdGroupCriterion,
      | "criterionId"
      | "resourceName"
      | "type"
      | "criterionId"
      | "keyword"
      | "status"
    > &
      Keyword;
  }

  /**
   * @title Keyword search results
   */
  export type IGetKeywordsOutput = IGetKeywordsOutputResult[];

  /**
   * @title Keyword search conditions
   */
  export interface IGetKeywordsInput {
    /**
     * Ad Group Resource Name
     *
     * @title Ad Group Resource Name
     */
    adGroupResourceName: AdGroup["resourceName"];
  }

  /**
   * @title Keyword creation conditions
   */
  export interface ICreateKeywordInput {
    /**
     * @title Customer ID
     */
    customerId: CustomerClient["id"];

    /**
     * @title Keyword to generate
     */
    keywords: string[];
  }

  export interface AdGroup {
    /**
     * @title ID of the advertising group
     */
    id: `${number}`;

    /**
     * `customers/${number}/adGroups/${number}` format
     *
     * @title Ad Group Resource Name
     */
    resourceName: string &
      tags.Pattern<"(customers\\/[+-]?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?\\/adGroups\\/[+-]?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)">;

    /**
     * @title Ad group name
     */
    name: string;

    /**
     * @title Type of ad group
     */
    type:
      | tags.Constant<"SEARCH_STANDARD", { title: "검색 광고" }>
      | tags.Constant<"DISPLAY_STANDARD", { title: "디스플레이 광고" }>; // campaign으로부터 가져오게 한다.
  }

  export interface IGetAdGroupInput {
    /**
     * @title Customer ID
     */
    customerId: CustomerClient["id"];

    /**
     * @title ID of the parent campaign
     * @description If you only want to search for the ID of the campaign
     */
    campaignId?: Campaign["id"];

    /**
     * @title Resource name of the ad group
     * @description If you want to search only by the ad group resource name
     */
    adGroupResourceName?: AdGroup["resourceName"];
  }

  export interface IGetGoogleAdGroupOutput {
    results: IGetAdGroupOutputResult[];
  }

  export interface IGetAdGroupOutputResult {
    campaign: MyPick<Campaign, "id" | "resourceName" | "status">;

    adGroup: MyPick<AdGroup, "id" | "type" | "name" | "resourceName">;
  }

  export interface AdGroupAd {
    /**
     * `customers/${number}/adGroupAds/${number}~${number}` format
     *
     * @title Resource name of the ad group ad
     */
    resourceName: string &
      tags.Pattern<"(customers\\/[+-]?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?\\/adGroupAds\\/[+-]?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?~[+-]?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)">;

    /**
     * @title Evaluation of advertising review and policies
     */
    policySummary: {
      /**
       * @title Ad approval status
       * @description This is Google's decision on whether or not the ad can be sent.
       */
      approvalStatus:
        | tags.Constant<"APPROVED", { title: "승인됨" }>
        | tags.Constant<"APPROVED_LIMITED", { title: "제한된 승인" }>
        | tags.Constant<
            "AREA_OF_INTEREST_ONLY",
            { title: "특정 영역에 대한 허용" }
          >
        | tags.Constant<"DISAPPROVED", { title: "비승인" }>
        | tags.Constant<"UNKNOWN", { title: "알 수 없음" }>
        | tags.Constant<"UNSPECIFIED", { title: "명시되지 않음" }>;

      /**
       * @title Ad Review Status
       * @description Only ads that have been reviewed can see whether they have been approved or disapproved.
       */
      reviewStatus:
        | tags.Constant<"ELIGIBLE_MAY_SERVE", { title: "자격을 갖춤" }>
        | tags.Constant<"REVIEWED", { title: "검토되었음" }>
        | tags.Constant<"REVIEW_IN_PROGRESS", { title: "검토 중임" }>
        | tags.Constant<"UNDER_APPEAL", { title: "심사 중임" }>
        | tags.Constant<"UNKNOWN", { title: "알 수 없음" }>
        | tags.Constant<"UNSPECIFIED", { title: "명시되지 않음" }>;
    };

    /**
     * @title Status of the ad
     */
    status: IGoogleAdsService.Status;
  }

  /**
   * @title Conditions for creating an ad group
   */
  export type ICreateAdGroupInput =
    | ICreateSearchAdGroupInput
    | ICreateDisplayAdGroupInput;

  /**
   * @title Create ad group common
   */
  export interface ICreateAdGroupCommon {
    /**
     * @title Customer ID
     */
    customerId: CustomerClient["id"];

    /**
     * @title Campaign Resource Name
     */
    campaignResourceName: Campaign["resourceName"];
  }

  /**
   * @title Search Ad Group Creation Conditions
   */
  export interface ICreateSearchAdGroupInput extends ICreateAdGroupCommon {
    /**
     * @title Ad Group Type
     */
    type: Extract<AdGroup["type"], "SEARCH_STANDARD">;
  }

  /**
   * @title Conditions for creating a display ad group
   */
  export interface ICreateDisplayAdGroupInput extends ICreateAdGroupCommon {
    /**
     * @title Ad Group Type
     */
    type: Extract<AdGroup["type"], "DISPLAY_STANDARD">;
  }

  export type ICreateAdGroupAdAtOnceInput =
    | ICreateAdGroupSearchAdAtOnceInput
    | ICreateAdGroupDisplayAdAtOnceInput;

  export interface ICreateAdGroupSearchAdAtOnceInputCommon {
    /**
     * @title Campaign Creation Conditions
     */
    campaign: StrictOmit<ICreateCampaignInput, "customerId">;
  }

  /**
   * @title Request conditions for creating Google search campaigns and ads all at once
   */
  export interface ICreateAdGroupSearchAdAtOnceInput
    extends ICreateAdGroupSearchAdAtOnceInputCommon {
    /**
     * @title Ad Creation Conditions
     */
    ad: StrictOmit<
      ICreateAdGroupSearchAdInput,
      "campaignResourceName" | "type" | "customerId"
    >;
  }

  /**
   * @title Request conditions for creating ads from Google display campaigns at once
   */
  export interface ICreateAdGroupDisplayAdAtOnceInput
    extends ICreateAdGroupSearchAdAtOnceInputCommon {
    /**
     * @title Ad Creation Conditions
     */
    ad: StrictOmit<
      ICreateAdGroupDisplayAdInput,
      "campaignResourceName" | "type" | "customerId"
    >;
  }

  /**
   * @title Advertisement Information
   */
  export interface AdWrapper {
    /**
     * This refers to an advertisement within the generated ad group.
     *
     * @title Advertisement Information
     */
    ad: IGoogleAdsService.IGetAdGroupsOutputResult;
  }
  /**
   * @title Results for requests to create everything from campaigns to ads at once
   */
  export type ICreateAdGroupAdAtOnceOutput = DeepStrictMerge<
    IGoogleAdsService.ICreateCampaignsOutput,
    AdWrapper
  >;

  /**
   * @title Ad Creation Conditions
   */
  export type ICreateAdGroupAdInput = ICreateAdGroupAdInputCommon;

  export type IUpdateAdGroupAdInput = MyPick<
    AdGroupAd,
    "resourceName" | "status"
  > &
    ICreateAdGroupAdInputCommon;

  /**
   * @title Ad Creation Conditions
   */
  export type ICreateAdGroupAdInputCommon =
    | ICreateAdGroupSearchAdInput
    | ICreateAdGroupDisplayAdInput;

  /**
   * @title Search Ad Creation Conditions
   */
  export interface ICreateAdGroupSearchAdInput
    extends ICreateSearchAdGroupInput,
      ICreateKeywordInput {
    /**
     * @title Customer ID
     */
    customerId: CustomerClient["id"];

    /**
     * @title Homepage that is the target of the advertisement
     */
    finalUrl: string & tags.Format<"iri">;

    /**
     * @title title list
     */
    headlines: (string & tags.MinLength<1> & tags.MaxLength<30>)[] &
      tags.MinItems<1> &
      tags.MaxItems<15>;

    /**
     * @title Description List
     */
    descriptions: (string & tags.MinLength<1> & tags.MaxLength<90>)[] &
      tags.MinItems<1> &
      tags.MaxItems<4>;
  }

  /**
   * @title Conditions for creating display ads
   */
  export interface ICreateAdGroupDisplayAdInput
    extends ICreateDisplayAdGroupInput,
      ICreateKeywordInput {
    /**
     * @title Customer ID
     */
    customerId: CustomerClient["id"];

    /**
     * @title Homepage that is the target of the advertisement
     */
    finalUrl: string & tags.Format<"iri">;

    /**
     * @title List of short titles
     */
    headlines: (string & tags.MinLength<1> & tags.MaxLength<30>)[] &
      tags.MinItems<1> &
      tags.MaxItems<5>;

    /**
     * @title long title
     */
    longHeadline: string & tags.MinLength<1> & tags.MaxLength<90>;

    /**
     * @title Description List
     */
    descriptions: (string & tags.MinLength<1> & tags.MaxLength<90>)[] &
      tags.MinItems<1> &
      tags.MaxItems<5>;

    /**
     * @title Business and Brand Name
     */
    businessName: string & tags.MinLength<1> & tags.MaxLength<25>;

    /**
     * @title Landscape image
     * @description Landscape image with 1.91:1 resolution, recommended 5 frames
     */
    landscapeImages: (string &
      tags.Format<"uri"> &
      tags.ContentMediaType<"image/*">)[] &
      tags.MinItems<1> &
      tags.MaxItems<15>;

    /**
     * @title Logo image
     * @description Square image, minimum size 128x128px, recommended 1200x1200px
     */
    logoImages: (string &
      tags.Format<"uri"> &
      tags.ContentMediaType<"image/*">)[] &
      tags.MinItems<1> &
      tags.MaxItems<5>;

    /**
     * @title Square image
     * @description A landscape image with a 1.91:1 aspect ratio, with a minimum size of 300x300px, and a recommended size of 600x600px.
     */
    squareImages: (string &
      tags.Format<"uri"> &
      tags.ContentMediaType<"image/*">)[] &
      tags.MinItems<1> &
      tags.MaxItems<15>;
  }

  /**
   * @title Campaign Modification Conditions
   */
  export interface IUpdateCampaignInput
    extends MyPartial<
      MyPick<
        ICreateCampaignInput,
        "campaignName" | "campaignBudget" | "endDate"
      >
    > {
    /**
     * @title Resource ID of the campaign to be modified
     */
    campaignResourceName: Campaign["resourceName"];
  }

  export interface ICreateCampaignInput
    extends StrictOmit<ICreateCampaignBudgetInput, "customerId"> {
    /**
     * @title Customer ID
     */
    customerId?: CustomerClient["id"];

    /**
     * @title Campaign Type
     */
    advertisingChannelType:
      | tags.Constant<
          "SEARCH",
          {
            title: "검색 광고";
            description: "Google 검색에서 구매 의도가 높은 고객에게 적시에 노출";
          }
        >
      | (tags.Constant<
          "DISPLAY",
          {
            title: "디스플레이 광고";
            description: "눈에 잘 띄는 광고 소재로 3백만 사이트와 앱에서 고객에게 도달";
          }
        > &
          tags.Default<"SEARCH">);

    /**
     * @title Campaign Name
     *
     * If the name is left blank, a random name will be generated. The name must not be the same as a previously created campaign.
     */
    campaignName?: string;

    /**
     * @title Campaign start time
     */
    startDate?: string & tags.Format<"date">;

    /**
     * @title Campaign End Time
     */
    endDate?: string & tags.Format<"date">;
  }

  export interface ICreateCampaignBudgetInput {
    /**
     * @title Customer ID
     */
    customerId: CustomerClient["id"];

    /**
     * @title Advertising Budget
     * @description Korean currency unit, Won
     *
     * Originally, there is no limit on the amount, but in preparation for an emergency, the function is currently limited to 100,000 won per campaign.
     */
    campaignBudget: number & tags.Maximum<100000>;
  }

  /**
   * @title Google Resource Status
   */
  export type Status =
    | tags.Constant<"ENABLED", { title: "ENABLED" }>
    | tags.Constant<"PAUSED", { title: "PAUSED" }>
    | tags.Constant<"REMOVED", { title: "REMOVED" }>
    | tags.Constant<"UNKNOWN", { title: "UNKNOWN" }>
    | tags.Constant<"UNSPECIFIED", { title: "UNSPECIFIED" }>;

  /**
   * @title Google Ads Campaign
   */
  export interface Campaign {
    /**
     * @title Campaign Resource Name
     */
    resourceName: string &
      tags.Pattern<"(customers\\/[+-]?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?\\/campaigns\\/[+-]?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)">;

    /**
     * @title Campaign Status
     */
    status: Status;

    /**
     * @title Campaign Advertising Channel
     */
    advertisingChannelType:
      | tags.Constant<"DEMAND_GEN", { title: "DEMAND_GEN" }>
      | tags.Constant<"DISPLAY", { title: "DISPLAY" }>
      | tags.Constant<"HOTEL", { title: "HOTEL" }>
      | tags.Constant<"LOCAL", { title: "LOCAL" }>
      | tags.Constant<"LOCAL_SERVICES", { title: "LOCAL_SERVICES" }>
      | tags.Constant<"MULTI_CHANNEL", { title: "MULTI_CHANNEL" }>
      | tags.Constant<"PERFORMANCE_MAX", { title: "PERFORMANCE_MAX" }>
      | tags.Constant<"SEARCH", { title: "SEARCH" }>
      | tags.Constant<"SHOPPING", { title: "SHOPPING" }>
      | tags.Constant<"SMART", { title: "SMART" }>
      | tags.Constant<"TRAVEL", { title: "TRAVEL" }>
      | tags.Constant<"UNKNOWN", { title: "UNKNOWN" }>
      | tags.Constant<"UNSPECIFIED", { title: "UNSPECIFIED" }>
      | tags.Constant<"VIDEO", { title: "VIDEO" }>;

    /**
     * @title Campaign Name
     */
    name: string;

    /**
     * @title Campaign ID
     */
    id: string & tags.Pattern<"([+-]?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)">;

    /**
     * @title Campaign start date
     */
    startDate: string & tags.Format<"date">;

    /**
     * @title Campaign End Date
     */
    endDate: string & tags.Format<"date">;
  }

  export interface CampaignBudget {
    /**
     * @title Campaign Budget Resource Name
     */
    resourceName: `customers/${number}/campaignBudgets/${number}`;

    /**
     * @title Budget (micro units)
     */
    amountMicros: `${number}`;
  }

  /**
   * @title Campaign Creation Results
   */
  export type ICreateCampaignsOutput = IGetCampaignsOutputResult;

  /**
   * @title Campaign Search Input
   */
  export interface IGetCampaignsInput {
    /**
     * @title Customer ID
     */
    customerId: CustomerClient["id"];

    /**
     * @title Resource Name of the Campaign
     */
    resourceName?: Campaign["resourceName"];
  }

  /**
   * @title Campaign search results
   */
  export type IGetCampaignsOutput = IGetCampaignsOutputResult[];

  /**
   * @title Campaign Information
   */
  export interface IGetCampaignsOutputResult {
    /**
     * This refers to a google campaign information.
     *
     * @title Campaign Information
     */
    campaign: Campaign;

    /**
     * This refers to a campaign budget infomation.
     *
     * @title Campaign Budget Information
     */
    campaignBudget: CampaignBudget;
  }

  /**
   * @title Ad group ad view results
   */
  export type IGetAdGroupOutput = IGetAdGroupsOutputResult[];

  export interface IGetAdGroupsOutputResult {
    /**
     * @title campaign
     */
    campaign: MyPick<
      IGoogleAdsService.Campaign,
      "resourceName" | "id" | "status"
    >;

    /**
     * @title Ad Group
     */
    adGroup: MyPick<AdGroup, "id" | "resourceName" | "type">;

    /**
     * @title List of ads in ad group
     */
    adGroupAds: MyPick<AdGroupAd, "resourceName" | "policySummary">[];

    /**
     * @title Keyword List
     */
    keywords: DeepStrictMerge<
      Keyword,
      MyPick<AdGroupCriterion, "criterionId" | "resourceName">
    >[];
  }

  /**
   * @title Invite Client
   */
  export interface ICreateClientLinkOutput {
    result: {
      resourceName: `cusotmers/${number}/customerClientLinks/${number}~${number}`;
    };
  }

  /**
   * @title Google Ads Error Object
   * @description The minimum object structure for determining errors.
   */
  export interface GoogleAdsError {
    error: {
      code: number;
      message: string;
      status: string;
      details: {
        "@type": string;
        requestId: string;
        errors: {
          /**
           * An object containing the error name and error message, as follows:
           *
           * @example
           * { managerLinkError: "ALREADY_INVITED_BY_THIS_MANAGER" }
           */
          errorCode: Record<string, string>;
          message: string;
          details: object;
        }[];
      }[];
    };
  }

  export interface RESOURCE_EXHAUSTED_ERROR {
    errorCode: Record<string, string>;
    message: string;
    details: {
      quotaErrorDetails: {
        rateScope: string;
        rateName: string;
        retryDelay: `${number}s`;
      };
    };
  }

  export interface Customer {
    id: string;

    resourceName: `customers/${number}`;
  }

  export interface CustomerClient {
    /**
     * @title Customer ID
     * @description Each customer has a unique value.
     */
    id: string & tags.Pattern<"([+-]?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)">;

    /**
     * @title Customer Resource Name
     */
    resourceName: `customers/${number}/customerClients/${number}`;

    /**
     * @title Specified name
     */
    descriptiveName?: string;

    /**
     * @title Currency unit, currency code
     * @description Means 'USD', 'EUR', 'KRW', etc.
     */
    currencyCode: string;
  }

  /**
   * @title Customer Inquiry Results
   */
  export type IGetCustomerOutput = CustomerClient[];

  export interface IGetlistAccessibleCustomersOutput {
    /**
     * @title Resource name of the account to which access is granted
     */
    resourceNames: `customers/${number}`[];
  }

  export interface ICommonInput {
    /**
     * @title Number of results per page
     */
    pageSize?: number &
      tags.Type<"int32"> &
      tags.Minimum<1> &
      tags.Maximum<10000>;

    /**
     * @title Next Page Token
     * @description Use the page token that can be received from the previous request.
     */
    pageToken?: string;
  }

  export type IGenerateKeywordIdeaByKeywordsAndUrlInput =
    IGenerateKeywordIdeaByKeywordsInput & IGenerateKeywordIdeaByURLInput;

  export interface IGenerateKeywordIdeaByKeywordsInput extends ICommonInput {
    /**
     * @title Search keywords for keyword generation
     */
    keywords: string[] & tags.MinItems<1>;

    /**
     * @title Customer ID
     */
    customerId?: CustomerClient["id"];
  }

  export interface IGenerateKeywordIdeaByURLInput extends ICommonInput {
    /**
     * @title URL to reference when generating advertising keyword ideas
     */
    url: string;

    /**
     * @title Customer ID
     */
    customerId?: CustomerClient["id"];
  }

  export interface IGenerateKeywordIdeaOutput {
    /**
     * @title Results List
     */
    results: GeneratedKeyword[];

    /**
     * @title Total number of results
     */
    totalSize: `${number}`;

    /**
     * @title Token that can be used when viewing the next page
     * @description If there is no next page, viewing is not possible
     */
    nextPageToken?: string | null;
  }

  export interface GeneratedKeyword {
    /**
     * @title Keyword metrics
     */
    keywordIdeaMetrics: KeywordIdeaMetrics;

    /**
     * @title keyword
     */
    text: string;
  }

  export interface KeywordIdeaMetrics {
    /**
     * @title Competition level for search terms
     */
    competition?:
      | tags.Constant<
          "LOW",
          {
            title: "낮음";
            description: "낮은 경쟁률 경쟁 지수 범위는 [0, 33]입니다.";
          }
        >
      | tags.Constant<
          "MEDIUM",
          {
            title: "중간";
            description: "경쟁이 보통입니다. 이에 대한 경쟁 지수의 범위는 [34, 66]입니다.";
          }
        >
      | tags.Constant<
          "HIGH",
          {
            title: "높음";
            description: "경쟁이 치열합니다. 경쟁 지수 범위는 [67, 100]입니다.";
          }
        >;

    /**
     * @title Approximate number of searches this search term has been run on in the last 12 months
     */
    monthlySearchVolumes: MonthlySearchVolumes[];

    /**
     * @title Approximate monthly searches for this search term over the past 12 months
     */
    avgMonthlySearches: `${number & tags.Type<"int64"> & tags.Minimum<0>}`;

    /**
     * @title Competition Index
     */
    competitionIndex?: `${number &
      tags.Type<"int64"> &
      tags.Minimum<0> &
      tags.Maximum<100>}`;

    /**
     * @title Keyword Micro Top Page Bid Subrange (20th Percentile)
     */
    lowTopOfPageBidMicros?: `${number & tags.Type<"int64"> & tags.Minimum<0>}`;

    /**
     * @title keyword detail page top bid (80th percentile)
     */
    highTopOfPageBidMicros?: `${number & tags.Type<"int64"> & tags.Minimum<0>}`;
  }

  export interface MonthlySearchVolumes {
    /**
     * @title The month in which the search volume occurred
     */
    month: Month;

    /**
     * @title Year in which search volume occurred
     */
    year: string;

    /**
     * @title Approximate number of searches for the month
     * @description A null value indicates that search volume for the month is not available.
     */
    monthlySearches: `${number & tags.Type<"int64"> & tags.Minimum<0>}` | null;
  }

  export type Month =
    | tags.Constant<"JANUARY", { title: "January" }>
    | tags.Constant<"FEBRUARY", { title: "February" }>
    | tags.Constant<"MARCH", { title: "March" }>
    | tags.Constant<"APRIL", { title: "April" }>
    | tags.Constant<"MAY", { title: "May" }>
    | tags.Constant<"JUNE", { title: "June" }>
    | tags.Constant<"JULY", { title: "July" }>
    | tags.Constant<"AUGUST", { title: "August" }>
    | tags.Constant<"SEPTEMBER", { title: "September" }>
    | tags.Constant<"OCTOBER", { title: "October" }>
    | tags.Constant<"NOVEMBER", { title: "November" }>
    | tags.Constant<"DECEMBER", { title: "December" }>;
}
