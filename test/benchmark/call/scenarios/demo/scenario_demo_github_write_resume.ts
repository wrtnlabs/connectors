import { GithubController } from "../../../../../src/controllers/connector/github/GithubController";
import { GoogleDocsController } from "../../../../../src/controllers/connector/google-docs/GoogleDocsController";
import { NotionController } from "../../../../../src/controllers/connector/notion/NotionController";
import { IFunctionCallBenchmarkScenario } from "../../structures/IFunctionCallBenchmarkScenario";

export const scenario_demo_github_write_resume =
  (): IFunctionCallBenchmarkScenario => ({
    title: "Github Repository 기반 개발자 이력서 작성 에이전트",
    prompt: `
    github에서 pin된 repository를 읽고 분석해서 개발자 이력서를 작성해줘.`,
    expected: {
      type: "array",
      items: [
        {
          type: "standalone",
          function: GithubController.prototype.getUserPinnedRepositories,
        },
        {
          type: "anyOf",
          anyOf: [
            NotionController.prototype.createPageByMarkdown,
            GoogleDocsController.prototype.write,
          ].map((func) => ({
            type: "standalone",
            function: func,
          })),
        },
      ],
    },
  });
