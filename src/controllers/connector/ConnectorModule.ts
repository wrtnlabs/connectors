import { Module } from "@nestjs/common";

import { LoggerModule } from "nestjs-pino";
import { AISearchModule } from "./ai_search/AISearchModule";
import { AirportInformationModule } from "./airport_information/AirportInformationModule";
import { ArxivSearchModule } from "./arxiv_search/ArxivSearchModule";
import { CalendlyModule } from "./calendly/CalendlyModule";
import { CrunchbaseModule } from "./crunchbase/CrunchbaseModule";
import { CsvModule } from "./csv/CsvModule";
import { DaumBlogModule } from "./daum_blog/DaumBlogModule";
import { DiscordModule } from "./discord/DiscordModule";
import { ExcelModule } from "./excel/ExcelModule";
import { FigmaModule } from "./figma/FigmaModule";
import { GithubModule } from "./github/GithubModule";
import { GmailModule } from "./gmail/GmailModule";
import { GoogleDocsModule } from "./google-docs/GoogleDocsModule";
import { GoogleSheetModule } from "./google-sheet/GoogleSheetModule";
import { GoogleAdsModule } from "./google_ads/GoogleAdsModule";
import { GoogleCalendarModule } from "./google_calendar/GoogleCalendarModule";
import { GoogleDriveModule } from "./google_drive/GoogleDriveModule";
import { GoogleFlightModule } from "./google_flight/GoogleFlightModule";
import { GoogleHotelModule } from "./google_hotel/GoogleHotelModule";
import { GoogleImageModule } from "./google_image/GoogleImageModule";
import { GoogleMapModule } from "./google_map/GoogleMapModule";
import { GoogleScholarModule } from "./google_scholar/GoolgeScholarModule";
import { GoogleSearchModule } from "./google_search/GoogleSearchModule";
import { GoogleShoppingAladineModule } from "./google_shopping/google_shopping_aladine/GoogleShoppingAladinModule";
import { GoogleShoppingAliexpressModule } from "./google_shopping/google_shopping_aliexpress/GoogleShoppingAliexpressModule";
import { GoogleShoppingCoupangModule } from "./google_shopping/google_shopping_coupang/GoogleShoppingCoupangModule";
import { GoogleShoppingEqlModule } from "./google_shopping/google_shopping_eql/GoogleShoppingEqlModule";
import { GoogleShoppingIherbModule } from "./google_shopping/google_shopping_iherb/GoogleShoppingIherbModule";
import { GoogleShoppingKurlyModule } from "./google_shopping/google_shopping_kurly/GoogleShoppingKurlyModule";
import { GoogleShoppingMusinsaModule } from "./google_shopping/google_shopping_musinsa/GoogleShoppingMusinsaModule";
import { GoogleShoppingOcoModule } from "./google_shopping/google_shopping_oco/GoogleShoppingOcoModule";
import { GoogleShoppingOliveYoungModule } from "./google_shopping/google_shopping_olive_young/GoogleShoppingOliveYoungModule";
import { GoogleShoppingTwentyNineCentimeterModule } from "./google_shopping/google_shopping_twenty_nine_cenetimeter/GoogleShoppingTwentyNineCentimeterModule";
import { GoogleShoppingUniqloModule } from "./google_shopping/google_shopping_uniqlo/GoogleShoppingUniqloModule";
import { GoogleShoppingYesTwentyFourModule } from "./google_shopping/google_shopping_yes_twenty_four/GoogleShoppingYesTwentyFourModule";
import { GoogleSlidesModule } from "./google_slides/GoogleSlidesModule";
import { GoogleTrendModule } from "./google_trend/GoogleTrendModule";
import { HancellModule } from "./hancell/HancellModule";
import { HwpModule } from "./hwp/HwpModule";
import { ImwebModule } from "./imweb/ImwebModule";
import { InnoforestModule } from "./innoforest/InnoforestModule";
import { JiraModule } from "./jira/JiraModule";
import { KakaoMapModule } from "./kakao_map/KakaoMapModule";
import { KakaoNaviModule } from "./kakao_navi/KakaoNaviModule";
import { KakaoTalkModule } from "./kakao_talk/KakaoTalkModule";
import { KoreaEximbankModule } from "./korea_eximbank/KoreaEximbankModule";
import { MarpModule } from "./marp/MarpModule";
import { NaverBlogModule } from "./naver_blog/NaverBlogModule";
import { NotionModule } from "./notion/NotionModule";
import { OpenDataModule } from "./open_data/OpenDataModule";
import { RagModule } from "./rag/RagModule";
import { RedditModule } from "./reddit/RedditModule";
import { ShortLinkModule } from "./short_link/ShortLinkModule";
import { SimilarwebModule } from "./similarweb/SimilarwebModule";
import { SlackModule } from "./slack/SlackModule";
import { StableDiffusionBetaModule } from "./stable_diffustion_beta/StableDiffusionBetaModule";
import { SweetTrackerModule } from "./sweet_tracker/SweetTrackerModule";
import { TypeformModule } from "./typeform/TypeformModule";
import { WebCrawlerModule } from "./web_crawler/WebCrawlerModule";
import { XModule } from "./x/XModule";
import { YoutubeSearchModule } from "./youtube_search/YoutubeSearchModule";
import { ZoomModule } from "./zoom/ZoomModule";
import { NaverCafeModule } from "./naver_cafe/NaverCafeModule";
import { NaverNewsModule } from "./naver_news/NaverNewsModule";
import { DaumCafeModule } from "./daum_cafe/DaumCafeModule";
import { WantedModule } from "./wanted/WantedModule";
import { IncruitModule } from "./incruit/IncruitModule";
import { SaraminModule } from "./saramin/SaraminModule";
import { JumpitModule } from "./jumpit/JumpitModule";
import { CareerlyModule } from "./careerly/CareerlyModule";
import { DallEModule } from "./dall_e/DallEModule";
// import { GoogleShoppingAmazonModule } from "./google_shopping/google_shopping_amazon/GoogleShoppingAmazonModule";
// import { GoogleShoppingEbayModule } from "./google_shopping/google_shopping_ebay/GoogleShoppingEbayModule";
// import { GoogleShoppingWalmartModule } from "./google_shopping/google_shopping_walmart/GoogleShoppingWalmartModule";

@Module({
  // connectors that require DI of some sort shall be declared as modules
  // the rest can be simply imported as controllers
  imports: [
    // ArticleModule,
    // SpreadsheetModule,
    // KeywordExtractModule,
    // RankModule,
    // MarketingCopyModule,
    // StudentReportGeneratorModule,
    // AwsModule,
    RagModule,
    HwpModule,
    ExcelModule,
    GoogleDocsModule,
    GoogleSheetModule,
    GoogleCalendarModule,
    GoogleDriveModule,
    // LlmModule,
    // GoogleModule,
    GmailModule,
    LoggerModule,
    FigmaModule,
    ZoomModule,
    SweetTrackerModule,
    HancellModule,
    KakaoTalkModule,
    KakaoMapModule,
    KakaoNaviModule,
    GoogleSlidesModule,
    ImwebModule,
    OpenDataModule,
    KoreaEximbankModule,
    StableDiffusionBetaModule,
    DallEModule,
    GoogleSearchModule,
    WantedModule,
    IncruitModule,
    SaraminModule,
    JumpitModule,
    CareerlyModule,
    GoogleShoppingAladineModule,
    GoogleShoppingAliexpressModule,
    GoogleShoppingCoupangModule,
    GoogleShoppingEqlModule,
    GoogleShoppingIherbModule,
    GoogleShoppingKurlyModule,
    GoogleShoppingOcoModule,
    GoogleShoppingOliveYoungModule,
    GoogleShoppingTwentyNineCentimeterModule,
    GoogleShoppingUniqloModule,
    GoogleShoppingYesTwentyFourModule,
    GoogleShoppingMusinsaModule,
    // GoogleShoppingAmazonModule,
    // GoogleShoppingEbayModule,
    // GoogleShoppingWalmartModule,
    GoogleAdsModule,
    ArxivSearchModule,
    DaumBlogModule,
    DaumCafeModule,
    NaverBlogModule,
    NaverCafeModule,
    NaverNewsModule,
    YoutubeSearchModule,
    GoogleScholarModule,
    CsvModule,
    NotionModule,
    GoogleHotelModule,
    AirportInformationModule,
    GoogleFlightModule,
    SlackModule,
    JiraModule,
    GoogleTrendModule,
    GoogleMapModule,
    GithubModule,
    ShortLinkModule,
    DiscordModule,
    CalendlyModule,
    AISearchModule,
    TypeformModule,
    MarpModule,
    CrunchbaseModule,
    SimilarwebModule,
    XModule,
    RedditModule,
    InnoforestModule,
    WebCrawlerModule,
    GoogleImageModule,
  ],
})
export class ConnectorModule {}
