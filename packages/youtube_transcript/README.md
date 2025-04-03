# @wrtnlabs/connector-youtube-transcript

By installing the package, you can use functions for `Youtube transcript`.

## How to Use

### Setup

install the packages related with `@agentica/core`

- `@agentica` : [README.md](https://github.com/wrtnlabs/agentica).
- `@samchon/openapi` : [README](https://github.com/samchon/openapi)
- `typia` : [Homepage](https://typia.io/)

```bash
npm install @agentica/core @samchon/openapi typia
npx typia setup
```

install the `@wrtnlabs/connector-youtube-transcript` package.

```bash
npm install @wrtnlabs/connector-youtube-transcript
```

### Usage

```ts
import { YoutubeTranscriptService } from "@wrtnlabs/connector-youtube-transcript";

async function main() {
  const agent = new Agentica({
    model: "chatgpt",
    vendor: {
      api: openai,
      model: "gpt-4o-mini",
    },
    controllers: [
      {
        name: "Youtube transcript Connector",
        protocol: "class",
        application: typia.llm.application<YoutubeTranscriptService, "chatgpt">(),
        execute: new YoutubeTranscriptService(),
      },
    ],
  });

  await agent.conversate("What you can do?");
}

main().catch(console.error);
```

Define the LLM model to be used through `new OpenAI()` and create an agent to allow tool calls by injecting the `OpenAI` class into `new Agentica()`. And you can define the tool to use by entering Connector package(tool) in the controllers part of the creator. At this time, the protocol must be set to "class" and the methods of the class must be set to "class" so that the methods of the class can be executed through utterance with LLM. `typia.llm.applicationOfValidate<YoutubeTranscriptService, "chatgpt">()` converts the methods implemented in class in Typescript compilation time into openai function scheme.
