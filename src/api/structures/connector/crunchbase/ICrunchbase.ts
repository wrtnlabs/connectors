import { Placeholder, Prerequisite } from "@wrtnio/decorators";
import { tags } from "typia";

export namespace ICrunchbase {
  /**
   * @title Represents the output of an autocomplete response.
   */
  export interface IAutocompleteOutput {
    /**
     * @title Description
     *
     * A description of the autocomplete result, which is always "OK".
     */
    description: string & Placeholder<"OK">;

    /**
     * @title Status
     *
     * The status code of the response, which is always 200 (success).
     */
    status: number & Placeholder<"200">;

    /**
     * @title Response Data
     */
    data: {
      /**
       * @title Entities
       *
       * An array of entities related to the organization.
       */
      entities: {
        /**
         * @title organization_identifier for crunchbase api
         *
         * The unique identifier of the organization
         */
        organization_identifier: string & Placeholder<"wrtn-technologies">;

        /**
         * @title short_description
         *
         * A brief description of the organization
         */
        short_description: string;

        /**
         * @title organization_name
         *
         * The name of the organization
         */
        organization_name: string & Placeholder<"Wrtn Technologies">;
      }[];

      /**
       * @title hasEntities
       *
       * A flag indicating if there are any entities in the response.
       */
      hasEntities: boolean;
    };
  }

  export interface IAutocompleteInput {
    /**
     * @title query
     *
     * As a search word, regardless of whether it is Korean or English, you can enter keywords related to the company you want to see.
     * You can use the company name to obtain an identifier that can be used by the company's name or Crunchbase.
     */
    query: string;
  }

  export interface IGetOrganizationDataInput {
    /**
     * @title organization_identifier
     *
     * Use the crashbase's autocomplete connector to find out the exact identifier of the company.
     * Typically, there is no way to find out this identifier without a query, so call the autocomplete connector first.
     */
    organization_identifier: string &
      Prerequisite<{
        method: "post";
        path: "connector/crunchbase/autocomplete";
        jmesPath: "data[].{value:organization_identifier, label: organization_name}";
      }>;
  }

  /**
   * @title Crunchbase Response
   */
  export interface CrunchbaseResponse {
    /**
     * @title 설명
     */
    description: string;
    /**
     * @title 상태 코드
     */
    status: number;
    /**
     * @title 데이터
     */
    data: OrganizationData;
  }

  /**
   * @title Orgnization Data
   */
  export interface OrganizationData {
    /**
     * @title organizationExists
     */
    organizationExists: boolean;
    /**
     * @title Orgnization Info
     */
    organization: Organization;
  }

  /**
   * @title Orgnization
   * @description Detailed Organization Info
   */
  export interface Organization {
    /**
     * @title Unique identifier of the organization.
     *
     * A unique string representing the organization in Crunchbase.
     */
    id: string;

    /**
     * @title Name of the organization.
     *
     * The official name of the organization.
     */
    name: string;

    /**
     * @title URL to the organization's Crunchbase page.
     *
     * A link to the organization's profile on Crunchbase.
     */
    url: string;

    /**
     * @title Ranking of the company.
     *
     * The position of the company relative to others in Crunchbase based on certain metrics.
     */
    rank_company: number;

    /**
     * @title List of locations where the organization operates.
     *
     * The physical addresses of the company's offices or facilities.
     */
    locations: Location[];

    /**
     * @title Address of the organization.
     *
     * The primary physical address of the company.
     */
    address: string;

    /**
     * @title Short description of the organization.
     *
     * A brief summary of what the company does.
     */
    about: string;

    /**
     * @title Full description of the organization.
     *
     * A detailed explanation of the company's operations, history, and business model.
     */
    full_description: string;

    /**
     * @title List of industries the organization is involved in.
     *
     * The sectors or markets where the company operates.
     */
    industries: string[];

    /**
     * @title Current operating status of the organization.
     *
     * Indicates whether the company is active, inactive, or has another status.
     */
    operating_status: string;

    /**
     * @title Date the organization was founded.
     *
     * The founding year or date of the company.
     */
    founded_date: string;

    /**
     * @title Type of company (e.g., Private, Public).
     *
     * The legal or business classification of the company.
     */
    company_type: string;

    /**
     * @title List of the organization's social media profiles.
     *
     * Links to the company's social media accounts.
     */
    social_media: SocialMedia[];

    /**
     * @title Number of employees working for the organization.
     *
     * A count or estimate of the company's workforce.
     */
    num_employees: string;

    /**
     * @title The official website of the organization.
     *
     * The company's main website URL.
     */
    website: string;

    /**
     * @title IPO status of the organization.
     *
     * Indicates whether the company is publicly traded or privately held.
     */
    ipo_status: string;

    /**
     * @title Primary contact email for the organization.
     *
     * The main email address for contacting the company.
     */
    contact_email: string;

    /**
     * @title Primary contact phone number for the organization.
     *
     * The main phone number for contacting the company.
     */
    contact_phone: string;

    /**
     * @title Information about the organization's funding history.
     *
     * Details on the company's fundraising rounds, including investors and amounts raised.
     */
    funding_info: FundingInfo[];

    /**
     * @title List of similar companies.
     *
     * Companies that share similarities in industry, business model, or other factors with the organization.
     */
    similar_companies: SimilarCompany[];

    /**
     * @title Logo of the organization.
     *
     * URL to the organization's logo image.
     */
    logo: string;

    /**
     * @title Monthly visits according to SEMrush.
     *
     * The number of visits the company's website receives, as reported by SEMrush.
     */
    semrush_monthly_visits: number;

    /**
     * @title Monthly visit growth according to SEMrush.
     *
     * The percentage growth of monthly website visits compared to the previous month.
     */
    semrush_monthly_visits_growth: number;

    /**
     * @title Date of the last SEMrush update.
     *
     * The date SEMrush last updated the visit data.
     */
    semrush_last_updated: string;

    /**
     * @title Number of contacts the organization has.
     *
     * The total number of contacts within the organization.
     */
    num_contacts: number;

    /**
     * @title Number of employee profiles.
     *
     * The total number of employee profiles available for the organization.
     */
    num_employee_profiles: number;

    /**
     * @title Number of active products.
     *
     * The total count of products currently offered by the organization.
     */
    total_active_products: number;

    /**
     * @title Number of news articles about the organization.
     *
     * The total number of news mentions or articles about the company.
     */
    num_news: number;

    /**
     * @title Funding round details for the organization.
     *
     * Information about the various rounds of funding the company has gone through.
     */
    funding_rounds: FundingRounds;

    /**
     * @title Date of the last Bombora update.
     *
     * The date Bombora last updated the company's data.
     */
    bombora_last_updated: string;

    /**
     * @title Number of investors in the organization.
     *
     * The total number of investors who have invested in the company.
     */
    num_investors: number;

    /**
     * @title Legal name of the organization.
     *
     * The registered legal name of the company.
     */
    legal_name: string;

    /**
     * @title Contact details of the organization.
     *
     * The primary contacts for the company, such as executives or HR.
     */
    contacts: Contact[];

    /**
     * @title IPO details of the organization.
     *
     * Information about the company's IPO, if it has one.
     */
    ipo: IPO;

    /**
     * @title Total Funds
     *
     * Total amount of funds raised by the organization.
     */
    funds_total?: number | null;

    /**
     * @title Acquisition Information
     *
     * Details about the company that acquired this organization.
     */
    acquired_by: AcquiredBy;

    /**
     * @title Investor Type
     *
     * The type or category of investors (e.g., Angel, Venture Capital).
     */
    investor_type?: string | null;

    /**
     * @title Investment Stage
     *
     * The stage at which the company receives investments (e.g., Seed, Series A).
     */
    investment_stage?: string | null;

    /**
     * @title Current Employees
     *
     * List of employees currently working at the organization.
     */
    current_employees: CurrentEmployee[];

    /**
     * @title SEMrush Location List
     *
     * List of locations according to SEMrush data.
     */
    semrush_location_list: SemrushLocation[];

    /**
     * @title Siftery Products
     *
     * List of products offered by the organization as recorded by Siftery.
     */
    siftery_products: any[];

    /**
     * @title Funding Rounds List
     *
     * Information on various funding rounds the organization has been part of.
     */
    funding_rounds_list: FundingRound[];

    /**
     * @title Overview Timeline
     *
     * Timeline overview of the organization's key events and milestones.
     */
    overview_timeline: OverviewTimeline[];

    /**
     * @title Bombora
     *
     * Bombora data related to the organization's market intelligence.
     */
    bombora: Bombora[];

    /**
     * @title Investors
     *
     * List of investors who have invested in the company.
     */
    investors: Investor[];

    /**
     * @title Acquisitions
     *
     * Information about companies the organization has acquired.
     */
    acquisitions: any[];

    /**
     * @title Funds Raised
     *
     * Details of the funds raised by the organization over time.
     */
    funds_raised: any[];

    /**
     * @title Investments
     *
     * Information on the organization's investments in other companies.
     */
    investments: any[];

    /**
     * @title Apptopia
     *
     * Apptopia data for the organization's app performance or analytics.
     */
    apptopia: any[];

    /**
     * @title Current Advisors
     *
     * List of current advisors working with the organization.
     */
    current_advisors: any[];

    /**
     * @title Exits
     *
     * Details on company exits (e.g., IPOs, acquisitions).
     */
    exits: any[];

    /**
     * @title News
     *
     * News articles or mentions related to the organization.
     */
    news: News[];

    /**
     * @title Aberdeen IT Spend
     *
     * IT spending data sourced from Aberdeen.
     */
    aberdeen_it_spend: any;

    /**
     * @title Headquarters Regions
     *
     * Geographic regions where the organization's headquarters are located.
     */
    headquarters_regions: HeadquartersRegion[];

    /**
     * @title Financial Highlights
     *
     * Key financial data points about the organization.
     */
    financials_highlights: FinancialsHighlights;

    /**
     * @title IPQwery
     *
     * Data from IPQwery related to the organization's intellectual property.
     */
    ipqwery: IPQwery;

    /**
     * @title Overview Highlights
     *
     * Summary of key highlights in the organization's history and performance.
     */
    overview_highlights: OverviewHighlights;

    /**
     * @title People Highlights
     *
     * Key personnel highlights, such as notable employees or founders.
     */
    people_highlights: PeopleHighlights;

    /**
     * @title Technology Highlights
     *
     * Information on the organization's technology stack or notable tech achievements.
     */
    technology_highlights: TechnologyHighlights;

    /**
     * @title Founders
     *
     * List of founders of the organization.
     */
    founders: Founder[];
  }

  /**
   * @title Location
   */
  export type Location = {
    /**
     * @title The value or name of the location.
     *
     * The specific name or address of the company's location.
     */
    value: string;

    /**
     * @title Type of the location.
     *
     * The category or function of this location (e.g., headquarters, branch).
     */
    location_type: string;
  };
  /**
   * @title SocialMedia
   */
  export type SocialMedia = {
    /**
     * @title Name of the social media platform.
     *
     * The name of the social platform where the company is active (e.g., Twitter, LinkedIn).
     */
    name: string;

    /**
     * @title Link to the company's social media profile.
     *
     * The URL to the company's social media account on the respective platform.
     */
    link: string;
  };

  /**
   * @title Funding Info
   */
  export type FundingInfo = {
    /**
     * @title Title of the funding information.
     *
     * The name or title of the funding-related data.
     */
    title: string;

    /**
     * @title Number of organizations involved in the funding.
     *
     * The number of companies or investors involved.
     */
    org_num: number;

    /**
     * @title Number of investors involved.
     *
     * The total count of investors participating in the funding.
     */
    org_num_investors: number;

    /**
     * @title Total funding amount.
     *
     * The total amount of funding raised in USD or another currency.
     */
    org_funding_total: FundingTotal;
  };

  /**
   * @title Funding Total
   */
  export type FundingTotal = {
    /**
     * @title Total value in USD.
     *
     * The total amount of funding, expressed in US dollars.
     */
    value_usd: number | string | null;

    /**
     * @title Currency of the funding.
     *
     * The currency in which the funding is denominated.
     */
    currency: string | null;

    /**
     * @title The raw value of the funding.
     *
     * The total value of the funding before conversion to USD.
     */
    value: number | string | null;
  };

  /**
   * @title Similar Companies
   */
  export type SimilarCompany = {
    /**
     * @title Name of the similar company.
     *
     * The name of a company that is similar to this organization.
     */
    name: string;

    /**
     * @title URL to the similar company's profile.
     *
     * A link to the similar company's page on Crunchbase or other platform.
     */
    url: string;
  };

  /**
   * @title Funding Rounds
   * @description Includes information about funding rounds.
   */
  export interface FundingRounds {
    /**
     * @title Last Funding Date
     *
     * The date of the last funding round.
     */
    last_funding_at: string;

    /**
     * @title Last Funding Type
     *
     * The type of the last funding round.
     */
    last_funding_type: string;

    /**
     * @title Number of Funding Rounds
     *
     * The total number of funding rounds.
     */
    num_funding_rounds: number;

    /**
     * @title Value
     *
     * Total amount of funds raised.
     */
    value: FundingTotal;
  }

  /**
   * @title Contact
   * @description Includes information about the contact person.
   */
  export interface Contact {
    /**
     * @title Name
     *
     * Name of the contact person.
     */
    name: string;

    /**
     * @title LinkedIn ID
     *
     * LinkedIn ID of the contact.
     */
    linkedin_id: string;

    /**
     * @title Levels
     *
     * Job levels of the contact person.
     */
    levels: string[];

    /**
     * @title Departments
     *
     * The department(s) the contact person is associated with.
     */
    departments: any;
  }

  /**
   * @title IPO
   * @description Includes information about the company's IPO (Initial Public Offering).
   */
  export interface IPO {
    /**
     * @title Date
     *
     * The date of the IPO.
     */
    date?: string | null;

    /**
     * @title Stock Link
     *
     * URL link to the stock.
     */
    stock_link?: string | null;

    /**
     * @title Stock Symbol
     *
     * The stock symbol (ticker).
     */
    stock_symbol?: string | null;
  }

  /**
   * @title Acquisition Information
   * @description Includes details about the acquisition.
   */
  export interface AcquiredBy {
    /**
     * @title Acquirer
     *
     * The name of the company that acquired this organization.
     */
    acquirer?: string | null;

    /**
     * @title Acquirer Permalink
     *
     * URL permalink of the acquirer.
     */
    acquirer_permalink?: string | null;

    /**
     * @title Acquisition Price
     *
     * The price at which the company was acquired.
     */
    acquisition_price?: string | null;

    /**
     * @title Date
     *
     * The date of the acquisition.
     */
    date?: string | null;

    /**
     * @title Transaction Name
     *
     * The name of the acquisition transaction.
     */
    transaction_name?: string | null;
  }

  /**
   * @title Current Employee
   * @description Includes details about current employees.
   */
  export interface CurrentEmployee {
    /**
     * @title Image
     *
     * URL of the employee's image.
     */
    image: string;

    /**
     * @title Name
     *
     * The employee's name.
     */
    name: string;

    /**
     * @title Permalink
     *
     * URL permalink to the employee's profile.
     */
    permalink: string;

    /**
     * @title Title
     *
     * The employee's job title.
     */
    title: string;
  }

  /**
   * @title SEMrush Location
   * @description Includes information about SEMrush locations.
   */
  export interface SemrushLocation {
    /**
     * @title Location List
     *
     * List of detailed location information.
     */
    locations: LocationDetail[];

    /**
     * @title Rank
     *
     * The rank of the location.
     */
    rank: number;

    /**
     * @title Rank MoM Percentage
     *
     * Month-over-month percentage change in rank.
     */
    rank_mom_pct: number | null;

    /**
     * @title Visits MoM Percentage
     *
     * Month-over-month percentage change in visits.
     */
    visits_mom_pct: number | null;

    /**
     * @title Visits Percentage
     *
     * Percentage of total visits.
     */
    visits_pct: number;
  }

  /**
   * @title Location Detail
   * @description Includes detailed information about a specific location.
   */
  export interface LocationDetail {
    /**
     * @title Name
     *
     * The name of the location.
     */
    name: string;

    /**
     * @title Permalink
     *
     * URL permalink to the location details.
     */
    permalink: string;
  }

  /**
   * @title Funding Round
   * @description Includes information about specific funding rounds.
   */
  export interface FundingRound {
    /**
     * @title Announced Date
     *
     * The date the funding round was announced.
     */
    announced_on: string;

    /**
     * @title ID
     *
     * Unique identifier for the funding round.
     */
    id: string;

    /**
     * @title Image ID
     *
     * Image ID associated with the funding round.
     */
    image_id: string;

    /**
     * @title Number of Investors
     *
     * The total number of investors in the funding round.
     */
    num_investors: number;

    /**
     * @title Lead Investors
     *
     * List of lead investors in the funding round.
     */
    lead_investors: LeadInvestor[] | null;

    /**
     * @title Money Raised
     *
     * The total amount of money raised in this funding round.
     */
    money_raised: FundingTotal;
  }

  /**
   * @title Lead Investor
   * @description Includes details about lead investors.
   */
  export interface LeadInvestor {
    /**
     * @title UUID
     */
    uuid?: string & tags.Format<"uuid">;

    /**
     * @title Image
     *
     * URL of the investor's image.
     */
    image: string;

    /**
     * @title Name
     *
     * Name of the lead investor.
     */
    name: string;

    /**
     * @title Permalink
     *
     * URL permalink to the lead investor's profile.
     */
    permalink: string;
  }

  /**
   * @title Overview Timeline
   * @description Includes information about the timeline of key events in the organization's history.
   */
  export interface OverviewTimeline {
    /**
     * @title Announced Date
     *
     * The date the event was announced.
     */
    announced_on: string;

    /**
     * @title ID
     *
     * Unique identifier for the event.
     */
    id?: string | null;

    /**
     * @title Image ID
     *
     * Image ID associated with the event.
     */
    image_id?: string | null;

    /**
     * @title Lead Investors
     *
     * List of lead investors associated with this event.
     */
    lead_investors: LeadInvestor[];

    /**
     * @title Money Raised
     *
     * The total amount of money raised in this event.
     */
    money_raised: FundingTotal;

    /**
     * @title Title
     *
     * The title of the event.
     */
    title: string;

    /**
     * @title UUID
     *
     * Unique identifier (UUID) for the event.
     */
    uuid: string & tags.Format<"uuid">;
  }

  /**
   * @title Bombora
   * @description Includes information from Bombora market intelligence data.
   */
  export interface Bombora {
    /**
     * @title Category
     *
     * The category of interest.
     */
    category: string;

    /**
     * @title Score
     *
     * Bombora score for the topic.
     */
    score: number;

    /**
     * @title Topic
     *
     * The topic associated with the score.
     */
    topic: string;

    /**
     * @title Weeks Surging
     *
     * Number of weeks the topic has been surging in popularity.
     */
    weeks_surging: number;

    /**
     * @title WoW Growth
     *
     * Week-over-week growth percentage.
     */
    wow_growth?: number | null;
  }

  /**
   * @title Investor
   * @description Includes details about the investors.
   */
  export interface Investor {
    /**
     * @title Funding Round
     *
     * Details of the funding round this investor participated in.
     */
    funding_round: FundingRoundDetail;

    /**
     * @title ID
     *
     * Unique identifier for the investor.
     */
    id: string;

    /**
     * @title Investor
     *
     * Details about the investor.
     */
    investor: InvestorDetail;

    /**
     * @title Lead Investor
     *
     * Indicates whether the investor is a lead investor.
     */
    lead_investor?: boolean | null;

    /**
     * @title Type
     *
     * Type of investment (e.g., equity, venture capital).
     */
    type: string;

    /**
     * @title Value
     *
     * The value of the investment.
     */
    value: string;
  }

  /**
   * @title Funding Round Detail
   * @description Contains details of a funding round.
   */
  export interface FundingRoundDetail {
    /**
     * @title ID
     */
    id: string;

    /**
     * @title value
     */
    type: string;

    /**
     * @title Value
     */
    value: string;

    // /**
    //  * @title Date
    //  */
    // date?: string | null;

    // /**
    //  * @title Amount Raised
    //  */
    // amount_raised: number;

    // /**
    //  * @title Round Type
    //  */
    // round_type: string; // e.g., Seed, Series A, Series B, etc.

    // /**
    //  * @title Investors
    //  */
    // investors: InvestorDetail[];
  }

  /**
   * @title Investor Detail
   * @description Contains details of an investor.
   */
  export interface InvestorDetail {
    /**
     * @title ID
     */
    id: string;

    /**
     * @title Value
     */
    value: string;

    /**
     * @title Type
     */
    type: string; // e.g., Angel, Venture Capital, etc.

    /**
     * @title Contact Information
     */
    contact_info?: string | null;
  }

  /**
   * @title 뉴스
   * @description 뉴스 정보를 포함합니다.
   */
  export interface News {
    /**
     * @title 날짜
     */
    date: string;
    /**
     * @title 조직
     */
    organization: string;
    /**
     * @title 발행자
     */
    publisher: string | null;
    /**
     * @title 썸네일 URL
     */
    thumbnail_url?: string | null;
    /**
     * @title 제목
     */
    title: string | null;
    /**
     * @title URL
     */
    url: string | null;
  }

  /**
   * @title 본사 지역
   * @description 본사 지역 정보를 포함합니다.
   */
  export interface HeadquartersRegion {
    /**
     * @title ID
     */
    id: string;
    /**
     * @title 값
     */
    value: string;
  }

  /**
   * @title 재무 하이라이트
   * @description 재무 하이라이트 정보를 포함합니다.
   */
  export interface FinancialsHighlights {
    /**
     * @title 총 자금
     */
    funding_total: FundingTotal;
    /**
     * @title 자금 조달 라운드 수
     */
    num_funding_rounds: number;
    /**
     * @title 투자자 수
     */
    num_investors: number;
    /**
     * @title 리드 투자자 수
     */
    num_lead_investors: number;
  }

  /**
   * @title IPQwery
   * @description IPQwery 정보를 포함합니다.
   */
  export interface IPQwery {
    /**
     * @title 인기 특허 카테고리
     */
    ipqwery_popular_patent_category: string;
    /**
     * @title 인기 상표 클래스
     */
    ipqwery_popular_trademark_class: string;
    /**
     * @title 등록된 상표 수
     */
    ipqwery_num_trademark_registered: number;
    /**
     * @title 승인된 특허 수
     */
    ipqwery_num_patent_granted: number;
  }

  /**
   * @title 개요 하이라이트
   * @description 개요 하이라이트 정보를 포함합니다.
   */
  export interface OverviewHighlights {
    /**
     * @title 유사 조직 수
     */
    num_org_similarities: number;
    /**
     * @title 현재 직위 수
     */
    num_current_positions: number;
    /**
     * @title 투자자 수
     */
    num_investors: number;
    /**
     * @title 연락처 수
     */
    num_contacts: number;
    /**
     * @title 총 자금
     */
    funding_total: FundingTotal;
  }

  /**
   * @title 인물 하이라이트
   * @description 인물 하이라이트 정보를 포함합니다.
   */
  export interface PeopleHighlights {
    /**
     * @title 연락처 수
     */
    num_contacts: number;
    /**
     * @title 현재 직위 수
     */
    num_current_positions: number;
  }

  /**
   * @title 기술 하이라이트
   * @description 기술 하이라이트 정보를 포함합니다.
   */
  export interface TechnologyHighlights {
    /**
     * @title 사용된 기술 수
     */
    builtwith_num_technologies_used: number;
    /**
     * @title SEMrush 최신 월 방문자 수
     */
    semrush_visits_latest_month: number;
    /**
     * @title SEMrush MoM 방문자 비율
     */
    semrush_visits_mom_pct: number;
  }

  /**
   * @title 창립자
   * @description 창립자 정보를 포함합니다.
   */
  export interface Founder {
    /**
     * @title ID
     */
    id: string;
    /**
     * @title 유형
     */
    type: string;
    /**
     * @title 값
     */
    value: string;
  }
}
