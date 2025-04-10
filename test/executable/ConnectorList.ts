import typia from "typia";
import { ArxivSearchService } from "../../packages/arxiv_search";
import { AwsS3Service } from "../../packages/aws_s3";
import { ConnectorGlobal } from "../../src/ConnectorGlobal";
import { CalendlyService } from "../../packages/calendly";
import { CsvService } from "../../packages/csv";
import { DallE3Service } from "../../packages/dall_e_3";
import OpenAI from "openai";
import { DiscordService } from "../../packages/discord";
import { ExcelService } from "../../packages/excel";
import { FigmaService } from "../../packages/figma";
import { GithubService } from "../../packages/github";
import { GmailService } from "../../packages/gmail";
import { GoogleAdsService } from "../../packages/google_ads";
import { GoogleCalendarService } from "../../packages/google_calendar";
import { GoogleDocsService } from "../../packages/google_docs";
import { GoogleFlightService } from "../../packages/google_flight";
import { GoogleHotelService } from "../../packages/google_hotel";
import { GoogleImageService } from "../../packages/google_image";
import { GoogleMapService } from "../../packages/google_map";
import { GoogleScholarService } from "../../packages/google_scholar";
import { GoogleSearchService } from "../../packages/google_search";
import { GoogleSheetService } from "../../packages/google_sheet";
import { GoogleShoppingService } from "../../packages/google_shopping";
import { GoogleSlidesService } from "../../packages/google_slides";
import { GoogleTrendService } from "../../packages/google_trend";
import { JiraService } from "../../packages/jira";
import { MarpService } from "../../packages/marp";
import { NotionService } from "../../packages/notion";
import { RedditService } from "../../packages/reddit";
import { SlackService } from "../../packages/slack";
import { StableDiffusionBetaService } from "../../packages/stable_diffusion_beta";
import { TypeformService } from "../../packages/typeform";
import { WebCrawlerService } from "../../packages/web_crawler";
import { XService } from "../../packages/x";
import { YoutubeOfficialSearchService } from "../../packages/youtube_official_search";
import { YoutubeSearchService } from "../../packages/youtube_search";
import { YoutubeTranscriptService } from "../../packages/youtube_transcript";
import { ZoomService } from "../../packages/zoom";

// Define the type for a single controller configuration
type ControllerConfig = {
  name: string;
  protocol: "class";
  application: any; // Adjust type if possible, but `any` works for flexibility
  execute: object;
};

export const allControllerConfigs: ControllerConfig[] = [
  // ... (Your existing controller configurations remain unchanged here) ...
  {
    name: "Arxiv Connector",
    protocol: "class",
    application: typia.llm.application<ArxivSearchService, "chatgpt">(),
    execute: new ArxivSearchService(),
  },
  {
    name: "Aws s3 Connector",
    protocol: "class",
    application: typia.llm.application<AwsS3Service, "chatgpt">(),
    execute: new AwsS3Service({
      awsAccessKeyId: ConnectorGlobal.env.AWS_ACCESS_KEY_ID,
      awsSecretAccessKey: ConnectorGlobal.env.AWS_SECRET_ACCESS_KEY,
      awsS3Bucket: ConnectorGlobal.env.AWS_S3_BUCKET,
      awsS3Region: "ap-northeast-2",
    }),
  },
  {
    name: "Calendly Connector",
    protocol: "class",
    application: typia.llm.application<CalendlyService, "chatgpt">(),
    execute: new CalendlyService({
      calendlyClientId: ConnectorGlobal.env.CALENDLY_CLIENT_ID,
      calendlyClientSecret: ConnectorGlobal.env.CALENDLY_CLIENT_SECRET,
      calendlyRefreshToken: ConnectorGlobal.env.CALENDLY_TEST_SECRET,
    }),
  },
  {
    name: "CSV Connector",
    protocol: "class",
    application: typia.llm.application<CsvService, "chatgpt">(),
    execute: new CsvService({
      fileManager: new AwsS3Service({
        awsAccessKeyId: ConnectorGlobal.env.AWS_ACCESS_KEY_ID,
        awsSecretAccessKey: ConnectorGlobal.env.AWS_SECRET_ACCESS_KEY,
        awsS3Bucket: ConnectorGlobal.env.AWS_S3_BUCKET,
        awsS3Region: "ap-northeast-2",
      }),
    }),
  },
  {
    name: "Dalle3 Connector",
    protocol: "class",
    application: typia.llm.application<DallE3Service, "chatgpt">(),
    execute: new DallE3Service({
      openai: new OpenAI({
        // Reuse the main OpenAI client later
        apiKey: ConnectorGlobal.env.OPENAI_API_KEY,
      }),
      fileManager: new AwsS3Service({
        awsAccessKeyId: ConnectorGlobal.env.AWS_ACCESS_KEY_ID,
        awsSecretAccessKey: ConnectorGlobal.env.AWS_SECRET_ACCESS_KEY,
        awsS3Bucket: ConnectorGlobal.env.AWS_S3_BUCKET,
        awsS3Region: "ap-northeast-2",
      }),
    }),
  },
  {
    name: "Discord Connector",
    protocol: "class",
    application: typia.llm.application<DiscordService, "chatgpt">(),
    execute: new DiscordService({
      discordToken: ConnectorGlobal.env.DISCORD_BOT_TOKEN,
    }),
  },
  {
    name: "Excel Connector",
    protocol: "class",
    application: typia.llm.application<ExcelService, "chatgpt">(),
    execute: new ExcelService({
      fileManager: new AwsS3Service({
        awsAccessKeyId: ConnectorGlobal.env.AWS_ACCESS_KEY_ID,
        awsSecretAccessKey: ConnectorGlobal.env.AWS_SECRET_ACCESS_KEY,
        awsS3Bucket: ConnectorGlobal.env.AWS_S3_BUCKET,
        awsS3Region: "ap-northeast-2",
      }),
    }),
  },
  {
    name: "Figma Connector",
    protocol: "class",
    application: typia.llm.application<FigmaService, "chatgpt">(),
    execute: new FigmaService({
      figmaClientId: ConnectorGlobal.env.FIGMA_CLIENT_ID,
      figmaClientSecret: ConnectorGlobal.env.FIGMA_CLIENT_SECRET,
      figmaRefreshToken: ConnectorGlobal.env.FIGMA_TEST_SECRET,
    }),
  },
  {
    name: "Github Connector",
    protocol: "class",
    application: typia.llm.application<GithubService, "chatgpt">(),
    execute: new GithubService({
      githubAccessToken: ConnectorGlobal.env.G_GITHUB_TEST_SECRET,
    }),
  },
  {
    name: "Gmail Connector",
    protocol: "class",
    application: typia.llm.application<GmailService, "chatgpt">(),
    execute: new GmailService({
      googleClientId: ConnectorGlobal.env.GOOGLE_CLIENT_ID,
      googleClientSecret: ConnectorGlobal.env.GOOGLE_CLIENT_SECRET,
      googleRefreshToken: ConnectorGlobal.env.GOOGLE_TEST_SECRET,
    }),
  },
  {
    name: "Google ads Connector",
    protocol: "class",
    application: typia.llm.application<GoogleAdsService, "chatgpt">(),
    execute: new GoogleAdsService({
      googleAdsAccountId: ConnectorGlobal.env.GOOGLE_ADS_ACCOUNT_ID,
      googleAdsParentSecret: ConnectorGlobal.env.GOOGLE_ADS_PARENT_SECRET,
      googleAdsDeveloperToken: ConnectorGlobal.env.GOOGLE_ADS_DEVELOPER_TOKEN,
      googleClientId: ConnectorGlobal.env.GOOGLE_CLIENT_ID,
      googleClientSecret: ConnectorGlobal.env.GOOGLE_CLIENT_SECRET,
      googleRefreshToken: ConnectorGlobal.env.GOOGLE_TEST_SECRET,
    }),
  },
  {
    name: "Google Calendar Connector",
    protocol: "class",
    application: typia.llm.application<GoogleCalendarService, "chatgpt">(),
    execute: new GoogleCalendarService({
      googleClientId: ConnectorGlobal.env.GOOGLE_CLIENT_ID,
      googleClientSecret: ConnectorGlobal.env.GOOGLE_CLIENT_SECRET,
      googleRefreshToken: ConnectorGlobal.env.GOOGLE_TEST_SECRET,
    }),
  },
  {
    name: "Google Docs Connector",
    protocol: "class",
    application: typia.llm.application<GoogleDocsService, "chatgpt">(),
    execute: new GoogleDocsService({
      googleClientId: ConnectorGlobal.env.GOOGLE_CLIENT_ID,
      googleClientSecret: ConnectorGlobal.env.GOOGLE_CLIENT_SECRET,
      googleRefreshToken: ConnectorGlobal.env.GOOGLE_TEST_SECRET,
    }),
  },
  {
    name: "Google Flight Connector",
    protocol: "class",
    application: typia.llm.application<GoogleFlightService, "chatgpt">(),
    execute: new GoogleFlightService({
      serpApiKey: ConnectorGlobal.env.SERP_API_KEY,
    }),
  },
  {
    name: "Google Hotel Connector",
    protocol: "class",
    application: typia.llm.application<GoogleHotelService, "chatgpt">(),
    execute: new GoogleHotelService({
      serpApiKey: ConnectorGlobal.env.SERP_API_KEY,
    }),
  },
  {
    name: "Google Image Connector",
    protocol: "class",
    application: typia.llm.application<GoogleImageService, "chatgpt">(),
    execute: new GoogleImageService({
      serpApiKey: ConnectorGlobal.env.SERP_API_KEY,
    }),
  },
  {
    name: "Google Map Connector",
    protocol: "class",
    application: typia.llm.application<GoogleMapService, "chatgpt">(),
    execute: new GoogleMapService({
      googleApiKey: ConnectorGlobal.env.GOOGLE_API_KEY,
      serpApiKey: ConnectorGlobal.env.SERP_API_KEY,
    }),
  },
  {
    name: "Google Scholar Connector",
    protocol: "class",
    application: typia.llm.application<GoogleScholarService, "chatgpt">(),
    execute: new GoogleScholarService({
      serpApiKey: ConnectorGlobal.env.SERP_API_KEY,
    }),
  },
  {
    name: "Google Search Connector",
    protocol: "class",
    application: typia.llm.application<GoogleSearchService, "chatgpt">(),
    execute: new GoogleSearchService({
      serpApiKey: ConnectorGlobal.env.SERP_API_KEY,
    }),
  },
  {
    name: "Google Sheet Connector",
    protocol: "class",
    application: typia.llm.application<GoogleSheetService, "chatgpt">(),
    execute: new GoogleSheetService({
      googleClientId: ConnectorGlobal.env.GOOGLE_CLIENT_ID,
      googleClientSecret: ConnectorGlobal.env.GOOGLE_CLIENT_SECRET,
      googleRefreshToken: ConnectorGlobal.env.GOOGLE_TEST_SECRET,
    }),
  },
  {
    name: "Google Shopping Connector",
    protocol: "class",
    application: typia.llm.application<GoogleShoppingService, "chatgpt">(),
    execute: new GoogleShoppingService({
      serpApiKey: ConnectorGlobal.env.SERP_API_KEY,
    }),
  },
  {
    name: "Google Slide Connector",
    protocol: "class",
    application: typia.llm.application<GoogleSlidesService, "chatgpt">(),
    execute: new GoogleSlidesService({
      googleClientId: ConnectorGlobal.env.GOOGLE_CLIENT_ID,
      googleClientSecret: ConnectorGlobal.env.GOOGLE_CLIENT_SECRET,
      googleRefreshToken: ConnectorGlobal.env.GOOGLE_TEST_SECRET,
      fileManager: new AwsS3Service({
        awsAccessKeyId: ConnectorGlobal.env.AWS_ACCESS_KEY_ID,
        awsSecretAccessKey: ConnectorGlobal.env.AWS_SECRET_ACCESS_KEY,
        awsS3Bucket: ConnectorGlobal.env.AWS_S3_BUCKET,
        awsS3Region: "ap-northeast-2",
      }),
    }),
  },
  {
    name: "Google Trend Connector",
    protocol: "class",
    application: typia.llm.application<GoogleTrendService, "chatgpt">(),
    execute: new GoogleTrendService({
      googleTrendApiKey: ConnectorGlobal.env.SERP_API_KEY, // Assuming SERP API key
    }),
  },
  // {
  //   name: "Jira Connector",
  //   protocol: "class",
  //   application: typia.llm.application<JiraService, "chatgpt">(),
  //   execute: new JiraService({
  //     jiraRedirectUri: ConnectorGlobal.env.JIRA_REFRESH_URI,
  //     jiraClientId: ConnectorGlobal.env.JIRA_CLIENT_ID,
  //     jiraClientSecret: ConnectorGlobal.env.JIRA_CLIENT_SECRET,
  //     jiraRefreshToken: ConnectorGlobal.env.JIRA_TEST_SECRET,
  //   }),
  // },
  {
    name: "Marp Connector",
    protocol: "class",
    application: typia.llm.application<MarpService, "chatgpt">(),
    execute: new MarpService({
      fileManager: new AwsS3Service({
        awsAccessKeyId: ConnectorGlobal.env.AWS_ACCESS_KEY_ID,
        awsSecretAccessKey: ConnectorGlobal.env.AWS_SECRET_ACCESS_KEY,
        awsS3Bucket: ConnectorGlobal.env.AWS_S3_BUCKET,
        awsS3Region: "ap-northeast-2",
      }),
    }),
  },
  {
    name: "Notion Connector",
    protocol: "class",
    application: typia.llm.application<NotionService, "chatgpt">(),
    execute: new NotionService({
      notionApiKey: ConnectorGlobal.env.NOTION_TEST_SECRET,
    }),
  },
  {
    name: "Reddit Connector",
    protocol: "class",
    application: typia.llm.application<RedditService, "chatgpt">(),
    execute: new RedditService({
      redditClientId: ConnectorGlobal.env.REDDIT_CLIENT_ID,
      redditClientSecret: ConnectorGlobal.env.REDDIT_CLIENT_SECRET,
      redditRefreshToken: ConnectorGlobal.env.REDDIT_TEST_SECRET,
    }),
  },
  {
    name: "Slack Connector",
    protocol: "class",
    application: typia.llm.application<SlackService, "chatgpt">(),
    execute: new SlackService({
      slackToken: ConnectorGlobal.env.SLACK_TEST_SECRET,
    }),
  },
  {
    name: "Stable diffusion Connector",
    protocol: "class",
    application: typia.llm.application<StableDiffusionBetaService, "chatgpt">(),
    execute: new StableDiffusionBetaService({
      stableDiffusionApiKey: ConnectorGlobal.env.STABILITY_AI_API_KEY,
      stableDiffusionCfgScale: ConnectorGlobal.env.STABILITY_AI_CFG_SCALE,
      stableDiffusionDefaultStep: ConnectorGlobal.env.STABILITY_AI_DEFAULT_STEP,
      stableDiffusionEngineId: ConnectorGlobal.env.STABILITY_AI_ENGINE_ID,
      stableDiffusionHost: ConnectorGlobal.env.STABILITY_AI_HOST,
      fileManager: new AwsS3Service({
        awsAccessKeyId: ConnectorGlobal.env.AWS_ACCESS_KEY_ID,
        awsSecretAccessKey: ConnectorGlobal.env.AWS_SECRET_ACCESS_KEY,
        awsS3Bucket: ConnectorGlobal.env.AWS_S3_BUCKET,
        awsS3Region: "ap-northeast-2",
      }),
    }),
  },
  {
    name: "TypeForm Connector",
    protocol: "class",
    application: typia.llm.application<TypeformService, "chatgpt">(),
    execute: new TypeformService({
      typeformClientId: ConnectorGlobal.env.TYPEFORM_CLIENT_ID,
      typeformClientSecret: ConnectorGlobal.env.TYPEFORM_CLIENT_SECRET,
      typeformRefreshToken: ConnectorGlobal.env.TYPEFORM_TEST_SECRET,
    }),
  },
  {
    name: "Web Crawler Connector",
    protocol: "class",
    application: typia.llm.application<WebCrawlerService, "chatgpt">(),
    execute: new WebCrawlerService({
      zenrowsApiKey: ConnectorGlobal.env.ZENROWS_API_KEY,
    }),
  },
  {
    name: "X Connector",
    protocol: "class",
    application: typia.llm.application<XService, "chatgpt">(),
    execute: new XService({
      xClientId: ConnectorGlobal.env.X_CLIENT_ID,
      xClientSecret: ConnectorGlobal.env.X_CLIENT_SECRET,
      xBearerToken: ConnectorGlobal.env.X_TEST_SECRET,
    }),
  },
  {
    name: "Youtube Official Search Connector",
    protocol: "class",
    application: typia.llm.application<
      YoutubeOfficialSearchService,
      "chatgpt"
    >(),
    execute: new YoutubeOfficialSearchService({
      youtubeOfficialSearchGoogleApiKey: ConnectorGlobal.env.GOOGLE_API_KEY,
    }),
  },
  {
    name: "Youtube Search Connector",
    protocol: "class",
    application: typia.llm.application<YoutubeSearchService, "chatgpt">(),
    execute: new YoutubeSearchService({
      serpApiKey: ConnectorGlobal.env.SERP_API_KEY,
    }),
  },
  {
    name: "Youtube Transcript Connector",
    protocol: "class",
    application: typia.llm.application<YoutubeTranscriptService, "chatgpt">(),
    execute: new YoutubeTranscriptService({
      searchApiKey: ConnectorGlobal.env.SEARCH_API_KEY, // Verify this key
    }),
  },
  {
    name: "Zoom Connector",
    protocol: "class",
    application: typia.llm.application<ZoomService, "chatgpt">(),
    execute: new ZoomService({
      zoomSecretKey: ConnectorGlobal.env.ZOOM_TEST_AUTHORIZATION_CODE, // Verify this credential type
    }),
  },
];
