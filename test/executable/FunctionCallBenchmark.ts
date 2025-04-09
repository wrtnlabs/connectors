import { Agentica, AgenticaOperation } from "@agentica/core";
import fs from "fs";
import OpenAI from "openai";
import path from "path";
import { AgenticaSelectBenchmark } from "@agentica/benchmark";
import { IAgenticaSelectBenchmarkScenario } from "@agentica/benchmark/src/structures/IAgenticaSelectBenchmarkScenario";
import typia from "typia";

// --- Import all your services (make sure paths are correct) ---
import { GmailService } from "../../packages/gmail";
import { ZoomService } from "../../packages/zoom";
import { ArxivSearchService } from "../../packages/arxiv_search";
import { AwsS3Service } from "../../packages/aws_s3";
import { CalendlyService } from "../../packages/calendly";
import { CsvService } from "../../packages/csv";
import { DallE3Service } from "../../packages/dall_e_3";
import { DiscordService } from "../../packages/discord";
import { ExcelService } from "../../packages/excel";
import { FigmaService } from "../../packages/figma";
import { GithubService } from "../../packages/github";
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
import { ConnectorGlobal } from "../../src/ConnectorGlobal"; // Adjust path if needed

// --- Helper Functions (mkdir, rmdir - unchanged) ---
const mkdir = async (str: string) => {
  try {
    await fs.promises.mkdir(str, { recursive: true });
  } catch {}
};
const rmdir = async (str: string) => {
  try {
    await fs.promises.rm(str, { recursive: true });
  } catch {}
};

// Define the type for a single controller configuration
type ControllerConfig = {
  name: string;
  protocol: "class";
  application: any; // Adjust type if possible, but `any` works for flexibility
  execute: object;
};

// --- Main Benchmark Function ---
const startBenchMark = async (): Promise<void> => {
  // --- Static list of all controller configurations ---
  // (Ensure ConnectorGlobal.env properties are loaded correctly before this point)
  const allControllerConfigs: ControllerConfig[] = [
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
        // Assuming G_GITHUB_TEST_SECRET is the correct refresh token
        githubRefreshToken: ConnectorGlobal.env.G_GITHUB_TEST_SECRET,
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
    // Corrected Google Docs entry (removed `void`)
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
        // Assuming SERP_API_KEY is used for trends as well
        googleTrendApiKey: ConnectorGlobal.env.SERP_API_KEY,
      }),
    },
    {
      name: "Jira Connector",
      protocol: "class",
      application: typia.llm.application<JiraService, "chatgpt">(),
      execute: new JiraService({
        jiraRedirectUri: ConnectorGlobal.env.JIRA_REFRESH_URI,
        jiraClientId: ConnectorGlobal.env.JIRA_CLIENT_ID,
        jiraClientSecret: ConnectorGlobal.env.JIRA_CLIENT_SECRET,
        jiraRefreshToken: ConnectorGlobal.env.JIRA_TEST_SECRET,
      }),
    },
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
      application: typia.llm.application<
        StableDiffusionBetaService,
        "chatgpt"
      >(),
      execute: new StableDiffusionBetaService({
        stableDiffusionApiKey: ConnectorGlobal.env.STABILITY_AI_API_KEY,
        stableDiffusionCfgScale: ConnectorGlobal.env.STABILITY_AI_CFG_SCALE,
        stableDiffusionDefaultStep:
          ConnectorGlobal.env.STABILITY_AI_DEFAULT_STEP,
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
        // Assuming SEARCH_API_KEY is correct for transcripts
        searchApiKey: ConnectorGlobal.env.SEARCH_API_KEY,
      }),
    },
    {
      name: "Zoom Connector",
      protocol: "class",
      application: typia.llm.application<ZoomService, "chatgpt">(),
      execute: new ZoomService({
        // Ensure this is the correct way to authenticate Zoom service
        zoomSecretKey: ConnectorGlobal.env.ZOOM_TEST_AUTHORIZATION_CODE,
      }),
    },
  ];

  console.log(
    `Found ${allControllerConfigs.length} controller configurations to benchmark individually.`,
  );

  const allBenchmarkResults: Record<string, Record<string, string>> = {};
  const baseReportDir: string = path.resolve(
    __dirname,
    "..",
    "docs",
    "benchmarks",
    "call_individual", // Changed directory name
  );

  // --- Clear overall report directory ---
  console.log(`Cleaning base report directory: ${baseReportDir}`);
  await rmdir(baseReportDir);
  await mkdir(baseReportDir); // Recreate base directory

  // --- Loop through each controller configuration ---
  for (const controllerConfig of allControllerConfigs) {
    console.log(`\n--- Benchmarking Controller: ${controllerConfig.name} ---`);

    // --- CREATE AI AGENT with only ONE controller ---
    const agent = new Agentica({
      model: "chatgpt",
      vendor: {
        api: new OpenAI({ apiKey: "********" }),
        model: "gpt-4o-mini", // or your preferred model
      },
      controllers: [controllerConfig], // Pass only the current controller config
    });
    console.log(`Agent created for ${controllerConfig.name}.`);

    const availableOperations = agent
      .getOperations()
      .filter((op) => op.protocol === "class");

    if (availableOperations.length === 0) {
      console.warn(
        `No class operations found for ${controllerConfig.name}. Skipping benchmark.`,
      );
      continue; // Skip to the next controller
    }

    console.log(
      `Registered class operations for ${controllerConfig.name}:`,
      availableOperations.map((op) => op.function.name).join(", "),
    );

    // --- Define find function specific to this agent instance ---
    const find = (functionName: string): AgenticaOperation<"chatgpt"> => {
      const found = availableOperations.find(
        (op) => op.function.name === functionName,
      );
      if (!found) {
        console.error(
          `Available class operations for ${
            controllerConfig.name
          }: ${availableOperations.map((op) => op.function.name).join(", ") || "None"}`,
        );
        throw new Error(
          `Operation not found via find() for ${controllerConfig.name}: "${functionName}". Check controller's service method names.`,
        );
      }
      return found;
    };

    await agent.conversate("");

    // --- Define Scenarios SPECIFICALLY for THIS controller ---
    // !! IMPORTANT !!
    // You MUST define scenarios that ONLY use functions from the CURRENT controller (`controllerConfig.name`).
    // The example below creates a *generic* scenario using the *first* available function.
    // Replace this with your actual, meaningful scenarios for each controller.

    let scenarios: IAgenticaSelectBenchmarkScenario<"chatgpt">[] = [];
    try {
      // Example: Create a basic scenario using the first function found
      const firstOp = availableOperations[0];
      if (firstOp) {
        scenarios.push({
          name: `${controllerConfig.name} - Basic Execution`,
          text: `Please execute the ${firstOp.function.name} function from the ${controllerConfig.name}.`,
          expected: {
            type: "standalone",
            operation: find(firstOp.function.name), // Use the find function defined above
          },
        });
      }

      if (scenarios.length === 0) {
        console.warn(
          `No specific scenarios defined or generated for ${controllerConfig.name}. Skipping benchmark.`,
        );
        continue;
      }

      console.log(
        `Using ${scenarios.length} scenarios for ${controllerConfig.name}.`,
      );
    } catch (error) {
      console.error(
        `Error preparing scenarios or finding operations for ${controllerConfig.name}:`,
        error,
      );
      continue; // Skip to next controller
    }

    // --- Benchmark Execution ---
    try {
      const benchmark: AgenticaSelectBenchmark<"chatgpt"> =
        new AgenticaSelectBenchmark({
          agent: agent,
          config: {
            repeat: 2, // Reduced repeat for faster individual tests initially
            simultaneous: 1, // Reduced concurrency for potentially clearer results/debugging
          },
          scenarios: scenarios, // Use the scenarios specific to this controller
        });

      console.log(`Executing benchmark for ${controllerConfig.name}...`);
      await benchmark.execute();
      console.log(`Benchmark execution finished for ${controllerConfig.name}.`);

      // --- Store Report ---
      allBenchmarkResults[controllerConfig.name] = benchmark.report();
    } catch (error) {
      console.error(
        `Benchmark execution failed for ${controllerConfig.name}:`,
        error,
      );
      // Optionally store an error marker instead of results
      allBenchmarkResults[controllerConfig.name] = {
        error: `Benchmark failed: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  } // End of loop through controllers

  // --- Generate All Reports ---
  console.log("\n--- Generating Reports ---");
  for (const [controllerName, reportDocs] of Object.entries(
    allBenchmarkResults,
  )) {
    const controllerReportDir = path.join(
      baseReportDir,
      controllerName.replace(/[^a-zA-Z0-9_-]/g, "_"), // Sanitize name for directory
    );
    console.log(`Generating report files in: ${controllerReportDir}`);
    await mkdir(controllerReportDir); // Create specific directory for this controller

    if (reportDocs.error) {
      // Handle cases where the benchmark failed
      const errorFilePath = path.join(controllerReportDir, "ERROR.md");
      await fs.promises.writeFile(
        errorFilePath,
        `# Benchmark Error for ${controllerName}\n\n${reportDocs.error}`,
        "utf8",
      );
      console.warn(
        `Wrote error file for ${controllerName} due to benchmark failure.`,
      );
    } else {
      // Write normal report files
      for (const [key, value] of Object.entries(reportDocs)) {
        const filePath = path.join(controllerReportDir, key);
        // Ensure subdirectory for the file itself exists (though unlikely needed if key is just filename)
        await mkdir(path.dirname(filePath));
        await fs.promises.writeFile(filePath, value, "utf8");
      }
    }
  }
  console.log("All reports generated successfully.");
};

// --- Run the Benchmark ---
startBenchMark().catch((error) => {
  console.error("Benchmark process failed with an error:", error);
  process.exit(1);
});
