# @wrtnlabs/connector-arxiv-search

`Arxiv-search` is a connector for retrieving research papers from the arXiv repository.

## How to Use

### Setup

install the packages related with `@agentica/core`
- `@agentica` : [README.md](https://github.com/wrtnlabs/agentica).

```bash
npm install @agentica/core @samchon/openapi typia
npx typia setup
```

install the `@wrtnlabs/connector-arxiv-search` package.
```bash
npm install @wrtnlabs/connector-arxiv-search
```

### Usage
```ts
import { ArxivSearchService } from "@wrtnlabs/connector-arxiv-search";

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
        name: "Arxiv Search Connector",
        protocol: "class",
        application: typia.llm.applicationOfValidate<ArxivSearchService, "chatgpt">(),
        execute: new ArxivSearchService(),
      }
    ],
  );

  await agent.conversate("What you can do?");
}

main().catch(console.error)
```

Define the LLM model to be used through `new OpenAI()` and create an agent to allow tool calls by injecting the `OpenAI` class into `new Agentica()`. And you can define the tool to use by entering Connector package(tool) in the controllers part of the creator. At this time, the protocol must be set to "class" and the methods of the class must be set to "class" so that the methods of the class can be executed through utterance with LLM. `typia.llm.applicationOfValidate<ConnectorService, "chatgpt">()` converts the methods implemented in class in Typescript compilation time into openai function scheme.
