# Connector Service Packages


[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/wrtnlabs/connectors/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/@wrtnlabs/connector-shared.svg)](https://www.npmjs.com/package/@wrtnlabs/connector-shared)
[![Build Status](https://github.com/wrtnlabs/agentica/workflows/build/badge.svg)](https://github.com/wrtnlabs/connectors/actions?query=workflow%3Abuild)


## Contents
- [1. Outline](#1-outline)
- [2. Packages](#2-packages)
  - [2.1. How to use](#21-how-to-use) 
- [3. Development](#3-development)
  - [3.1. Structure](#31-structure)
  - [3.2. Service](#32-service)
  - [3.3. Interface and DTO](#33-interface-and-dto)
  - [3.4. Test](#34-test)
- [4. Connector Package List](#4-connector-package-list)


## 1. Outline


- `@todo` In the future, when the service is released, it should be rewritten in English.
- `@todo` Detailed technical documentation is needed for the contents covered in the outline.


Connector Packages.
- Provides classes as a tool for LLM.
- It can be converted to OpenAI Function Schema through the function `typia.llm.application()` and used for explanation of the annotation.


"Wrtn Technologies" provides a service called "Wrtn Labs," an AI agent service combined with the Large Language Model (LLM). This "Wrtn Labs" provides a connection to access other external applications when communicating with LLM.
The connector was originally created for proxy servers that brokered external APIs. However, it is now provided as a tool for LLM in the form of a package.


## 2. Packages
The Connector packages are the individual export of the Connector server's service functions to npm as a package.
When you use Connector packages, you can use Connector packages using `@agentica/core` packages. Alternatively, you can use 'typia.llm.application' to convert it to OpenAI function scheme.
Consequently, the connector package can be used as an agent development tool.

If you want to know the details of `@agentica` pacakge, please refer to this [document](https://github.com/wrtnlabs/agentica/blob/main/packages/core/README.md).

### 2.1. How to use
---
Tool(Connector) calling can be performed using Connector packages with the '@agentica/core' package.

### Setup

install the packages related with `@agentica/core`
```bash
npm install @agentica/core @samchon/openapi typia
npx typia setup
```
install the Connector packages.
```bash
npm install @wrtnlabs/connector-${packageName}

# If you want to use github connector, use this command.
npm install @wrtnlabs/connector-github
```


### Use Connector package with `@agentica` package.
This is the example of using `@wrtnlabs/connector-google-map` and `@wrtnlabs/connector-gmail` connector packages.

install the connector packages about google map and gmail.

```bash
npm install @wrtnlabs/connector-google-map @wrtnlabs/connector-gmail
```

```ts
import { GmailService } from "@wrtnlabs/connector-gmail";
import { GoogleMapService } from "@wrtnlabs/connector-google-map";

async function main() {
  const agent = new Agentica({
    provider: {
      api: new OpenAI({
          apiKey: "YOUR_OPENAI_API_KEY",
        }),
        model: "gpt-4o-mini",
      },
      model: "gpt-4o-mini",
      type: "chatgpt",
    },
    controllers: [
      {
        name: "Gmail Connector",
        protocol: "class",
        application: typia.llm.applicationOfValidate<GmailService, "chatgpt">(),
        execute: new GmailService({
          clientId: "YOUR_GOOGLE_CLIENT_ID",
          clientSecret: "YOUR_GOOGLE_CLIENT_SECRET",
          secret: "YOUR_GOOGLE_SECRET",
        }),
      },
      {
        name: "Google Map Connector",
        protocol: "class",
        application: typia.llm.applicationOfValidate<
          GoogleMapService,
          "chatgpt"
        >(),
        execute: new GoogleMapService({
          googleApiKey: "YOUR_GOOGLE_API_KEY",
          serpApiKey: "YOUR_SERP_API_KEY",
        }),
      },
    ],
  );

  await agent.conversate("What you can do?");
  await agent.conversate("Find a good restaurant near Gangnam Station. And fill out the information in a markdown format and send it to me by email 'wrtnlabs@wrtn.io'.")
}

main().catch(console.error)

```

Define the LLM model to be used through `new OpenAI()` and create an agent to allow tool calls by injecting the `OpenAI` class into `new Agentica()`. And you can define the tool to use by entering Connector package(tool) in the controllers part of the creator. At this time, the protocol must be set to "class" and the methods of the class must be set to "class" so that the methods of the class can be executed through utterance with LLM. `typia.llm.applicationOfValidate<ConnectorService, "chatgpt">()` converts the methods implemented in class in Typescript compilation time into openai function scheme.

## 3. Development

If you want to contribute our repository, Please follow this development guide.

First, You make a directory about the service that you want to add features.
The directory name follows the lower snake case.
The file name follows the Pascal case.

```bash
cd packages

mkdir <package-name>
```   


### 3.1 Structure

The mono repo structure is as follow.
```bash
<package-name>
│
├── src
│    │
│    ├── <package-name> # Main service logic is located here.
│    │    │
│    │    └── ${PackageName}Service.ts
│    │
│    ├── structures # Every Dtos or Interfaces or Types are located here.
│    │    │
│    │    └── I${PackageName}Service.ts # Add prefix "I" to the file name.
│    │
│    └── index.ts # Export classes and interfaces in src directory.
│
├── test # Write the Test code about the service that you implement.
│    │
│    ├── features # Implement test about each features.
│    │    │
│    │    └── test_${package_name}_${feature} # Test code file.
│    │
│    ├── index.ts # Test execute file.
│    │
│    ├── TestGlobal.ts # Define the environment variables for Test.
│    │
│    └── tsconfig.json # tsconfig.json for Test.
│
├── package.json
│
├── README.md
│
├── rollup.config.js
│
└── tsconfig.json
```




### 3.2 Service
The Main Service Logic is implemented by class. There are no exceptions, because the methods of class are converted to OpenAI Function schemes through 'typia.llm.application()' to perform tool calls.
The class name of the service must end with "Service".

**annotation**

Also, you should add comments to each public method. (private is not necessary) The comments are needed to write down a description of what services each function is, what functions it performs, and what needs to be done. This will help LLM select that function more accurately later.
First, write the service name related with the method.
Second, write the description under the service name.

**Keep in mind. the input parameters for all methods must be in object format.**

```ts
export class SlackService {
  constructor(private readonly props: ISlackService.IProps) {}
  /**
   * Slack Service.
   * 
   * Get Specific Message Information.
   *
   * Get channel information and ts and get information of a specific message.
   */
  async getMessage(input: ISlackService.IGetMessageInput): Promise<ISlackService.IGetMessageOutput> {
    // Implement the get message logic.
  }
}
```

### 3.3 Interface and DTO
Interface is implemented with namespace. (not necessary)
You should the prefix `I` to interface name like `ISlackService`.
Write the input parameter or return type object about Method.

The input parameters for all methods must be in object format.

```ts
import { tags } from "typia";

export namespace ISlackService {
  export interface IGetMessageInput {
    /**
     * this is message id from the channel.
     * 
     * @title Slack Message ID.
     */
    messageId: string & tags.Format<"uuid">;
  }

  export interface IGetMessageOutput {
    /**
     * Message body.
     * 
     * @title Message Content. 
     */
    message: string;
  }
}
```

### 3.4 Test
In order to contribute to the connector package, all tests must finally pass.
You should make `.env` file on the root directory. and write the necessary environment variables related the tests to `TestGlobal.ts` file.
The name of test function must have the `test` in the prefix and should be exported.

```ts
// test/features
export const test_slack_get_message = async () => {
  const slackService = new SlackService({
    // props
  })

  const res = await slackService.getMessage();

  typia.assert(res)
}

// test/TestGlobal.ts
interface IEnvironments {
  SLACK_CLIENT_ID: string;
  SLACK_CLIENT_SECRET: string;
  SLACK_TEST_SECRET: string;
}
```

Please refer to the links below for the validation function.

- [typia](https://typia.io/docs/validators/assert/)
- [Nestia](https://nestia.io/docs/e2e/development/)


## 4. Connector Package List

- [Arxiv](https://github.com/wrtnlabs/connectors/blob/main/packages/arxiv_search/README.md)
- [AWS S3](https://github.com/wrtnlabs/connectors/blob/main/packages/aws_s3/README.md)

- [Calendly](https://github.com/wrtnlabs/connectors/blob/main/packages/calendly/README.md)
- [Career](https://github.com/wrtnlabs/connectors/blob/main/packages/career/README.md)
- [Csv](https://github.com/wrtnlabs/connectors/blob/main/packages/csv/README.md)

- [Dall E3](https://github.com/wrtnlabs/connectors/blob/main/packages/dall_e_3/README.md)
- [Daum Blog](https://github.com/wrtnlabs/connectors/blob/main/packages/daum_blog/README.md)
- [Daum Cafe](https://github.com/wrtnlabs/connectors/blob/main/packages/daum_cafe/README.md)
- [Discord](https://github.com/wrtnlabs/connectors/blob/main/packages/discord/README.md)

- [Excel](https://github.com/wrtnlabs/connectors/blob/main/packages/excel/README.md)

- [Figma](https://github.com/wrtnlabs/connectors/blob/main/packages/figma/README.md)

- [Github](https://github.com/wrtnlabs/connectors/blob/main/packages/github/README.md)
- [Gmail](https://github.com/wrtnlabs/connectors/blob/main/packages/gmail/README.md)
- [Google](https://github.com/wrtnlabs/connectors/blob/main/packages/google/README.md)
- [Google Ads](https://github.com/wrtnlabs/connectors/blob/main/packages/google_ads/README.md)
- [Google Calendar](https://github.com/wrtnlabs/connectors/blob/main/packages/google_calendar/README.md)
- [Google Docs](https://github.com/wrtnlabs/connectors/blob/main/packages/google_docs/README.md)
- [Google Drive](https://github.com/wrtnlabs/connectors/blob/main/packages/google_drive/README.md)
- [Google Flight](https://github.com/wrtnlabs/connectors/blob/main/packages/google_flight/README.md)
- [Google Hotel](https://github.com/wrtnlabs/connectors/blob/main/packages/google_hotel/README.md)
- [Google Image](https://github.com/wrtnlabs/connectors/blob/main/packages/google_image/README.md)
- [Google Map](https://github.com/wrtnlabs/connectors/blob/main/packages/google_map/README.md)
- [Google Scholar](https://github.com/wrtnlabs/connectors/blob/main/packages/google_scholar/README.md)
- [Google Search](https://github.com/wrtnlabs/connectors/blob/main/packages/google_search/README.md)
- [Google Shopping](https://github.com/wrtnlabs/connectors/blob/main/packages/google_shopping/README.md)
- [Google Slides](https://github.com/wrtnlabs/connectors/blob/main/packages/google_slides/README.md)
- [Google Trend](https://github.com/wrtnlabs/connectors/blob/main/packages/google_trend/README.md)

- [Hancell](https://github.com/wrtnlabs/connectors/blob/main/packages/hancell/README.md)
- [Hwp](https://github.com/wrtnlabs/connectors/blob/main/packages/hwp/README.md)

- [Image](https://github.com/wrtnlabs/connectors/blob/main/packages/image/README.md)
- [Imweb](https://github.com/wrtnlabs/connectors/blob/main/packages/imweb/README.md)

- [Jira](https://github.com/wrtnlabs/connectors/blob/main/packages/jira/README.md)

- [Kakao Map](https://github.com/wrtnlabs/connectors/blob/main/packages/kakao_map/README.md)
- [Kakao Navi](https://github.com/wrtnlabs/connectors/blob/main/packages/kakao_navi/README.md)
- [Kakao Talk](https://github.com/wrtnlabs/connectors/blob/main/packages/kakao_talk/README.md)
- [Korea Eximbank](https://github.com/wrtnlabs/connectors/blob/main/packages/korea_eximbank/README.md)

- [Marp](https://github.com/wrtnlabs/connectors/blob/main/packages/marp/README.md)

- [Naver Blog](https://github.com/wrtnlabs/connectors/blob/main/packages/naver_blog/README.md)
- [Naver Cafe](https://github.com/wrtnlabs/connectors/blob/main/packages/naver_cafe/README.md)
- [Naver News](https://github.com/wrtnlabs/connectors/blob/main/packages/naver_news/README.md)
- [Notion](https://github.com/wrtnlabs/connectors/blob/main/packages/notion/README.md)

- [Open Data](https://github.com/wrtnlabs/connectors/blob/main/packages/open_data/README.md)

- [Reddit](https://github.com/wrtnlabs/connectors/blob/main/packages/reddit/README.md)

- [Shared](https://github.com/wrtnlabs/connectors/blob/main/packages/shared/README.md)
- [Slack](https://github.com/wrtnlabs/connectors/blob/main/packages/slack/README.md)
- [Sort](https://github.com/wrtnlabs/connectors/blob/main/packages/sort/README.md)
- [Stable Diffusion Beta](https://github.com/wrtnlabs/connectors/blob/main/packages/stable_diffusion_beta/README.md)
- [Sweet Tracker](https://github.com/wrtnlabs/connectors/blob/main/packages/sweet_tracker/README.md)

- [Typeform](https://github.com/wrtnlabs/connectors/blob/main/packages/typeform/README.md)

- [Web Crawler](https://github.com/wrtnlabs/connectors/blob/main/packages/web_crawler/README.md)

- [X](https://github.com/wrtnlabs/connectors/blob/main/packages/x/README.md)

- [Youtube Search](https://github.com/wrtnlabs/connectors/blob/main/packages/youtube_search/README.md)

- [Zoom](https://github.com/wrtnlabs/connectors/blob/main/packages/zoom/README.md)

