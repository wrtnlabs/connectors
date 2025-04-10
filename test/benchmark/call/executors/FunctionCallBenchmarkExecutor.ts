import { IConnection } from "@nestia/fetcher";
import {
  INestiaAgentEvent,
  INestiaAgentPrompt,
  INestiaAgentProvider,
  INestiaAgentTokenUsage,
  NestiaAgent,
} from "@nestia/agent";
import {
  ChatGptTypeChecker,
  HttpLlm,
  IChatGptSchema,
  IHttpLlmApplication,
  OpenApiTypeChecker,
} from "@samchon/openapi";
import { IFunctionCallBenchmarkResult } from "../structures/IFunctionCallBenchmarkResult";
import { IFunctionCallBenchmarkScenario } from "../structures/IFunctionCallBenchmarkScenario";
import { IFunctionCallBenchmarkOptions } from "../structures/IFunctionCallBenchmarkOptions";
import { Semaphore } from "tstl";
import { ConnectorGlobal } from "../../../../src/ConnectorGlobal";
import { FunctionCallBenchmarkPredicator } from "./FunctionCallBenchmarkPredicator";

export namespace FunctionCallBenchmarkExecutor {
  export interface IProps {
    application: IHttpLlmApplication<"chatgpt">;
    operations: Map<Function, Function>;
    provider: INestiaAgentProvider;
    connection: IConnection;
    options: IFunctionCallBenchmarkOptions;
    semaphore: Semaphore;
    scenario: IFunctionCallBenchmarkScenario;
    location: string;
  }

  export const execute = async (
    props: IProps,
  ): Promise<IFunctionCallBenchmarkResult> => {
    const trials: IFunctionCallBenchmarkResult.ITrial[] = await Promise.all(
      new Array(props.options.count).fill(0).map(async (_x, i) => {
        await props.semaphore.acquire();
        const tr: IFunctionCallBenchmarkResult.ITrial = await process(props);
        await props.semaphore.release();
        return tr;
      }),
    );
    return {
      location: props.location,
      scenario: props.scenario,
      trials,
    };
  };

  export const process = async (
    props: IProps,
  ): Promise<IFunctionCallBenchmarkResult.ITrial> => {
    const started_at: Date = new Date();
    const responses: INestiaAgentEvent.IResponse[] = [];

    const agent: NestiaAgent = new NestiaAgent({
      controllers: [
        {
          protocol: "http",
          name: "connectors",
          application: props.application,
          connection: props.connection,
        },
      ],
      provider: props.provider,
      config: {
        capacity: props.options.capacity,
        eliticism: true,
        locale: "ko-KR",
      },
    });
    try {
      agent.on("call", (event) => {
        if (event.operation.function.separated?.human) {
          event.arguments = HttpLlm.mergeParameters({
            function: event.operation.function,
            llm: event.arguments ?? {},
            human: fillArgument(
              event.operation.function.separated.human.$defs,
              event.operation.function.separated.human,
            ),
          });
        }
      });
      agent.on("response", async (r) => {
        responses.push(r);
      });

      await agent.conversate(props.scenario.prompt);
      while (
        (Date.now() - started_at.getTime()) / 1000 < props.options.timeout &&
        FunctionCallBenchmarkPredicator.success({
          application: props.application,
          operations: props.operations,
          expected: props.scenario.expected,
          functionList: agent
            .getPromptHistories()
            .filter((h) => h.type === "execute")
            .filter((h) => h.protocol === "http"),
          strict: false,
        }) === false &&
        (await FunctionCallBenchmarkPredicator.isNext({
          provider: props.provider,
          history: agent.getPromptHistories().at(-1) ?? null,
        })) === true
      )
        await agent.conversate(
          "진행해줘, 그리고 더 이상 나한테 물어보지 말고 너 스스로의 판단으로 나아가줘.",
        );

      const histories: INestiaAgentPrompt[] = agent.getPromptHistories();
      const usage: INestiaAgentTokenUsage = agent.getTokenUsage();

      return {
        histories,
        responses,
        usage,
        select: FunctionCallBenchmarkPredicator.success({
          application: props.application,
          operations: props.operations,
          expected: props.scenario.expected,
          functionList: histories
            .filter((h) => h.type === "select")
            .map((h) => h.operations)
            .flat()
            .filter((h) => h.protocol === "http"),
          strict: false,
        }),
        execute: FunctionCallBenchmarkPredicator.success({
          application: props.application,
          operations: props.operations,
          expected: props.scenario.expected,
          functionList: histories
            .filter((h) => h.type === "execute")
            .filter((h) => h.protocol === "http"),
          strict: false,
        }),
        error: null,
        started_at,
        completed_at: new Date(),
      };
    } catch (error) {
      return {
        histories: [],
        responses,
        usage: agent.getTokenUsage(),
        select: false,
        execute: false,
        error: error as Error,
        started_at,
        completed_at: new Date(),
      };
    }
  };
}

const fillArgument = (
  $defs: Record<string, IChatGptSchema>,
  schema: IChatGptSchema,
): any => {
  if (OpenApiTypeChecker.isString(schema))
    if (schema.description?.includes("@contentMediaType") === true)
      return "https://namu.wiki/w/%EB%A6%B4%ED%8C%8C";
    else if (schema["x-wrtn-secret-key"] !== undefined)
      return secrets()[schema["x-wrtn-secret-key"]] ?? "invalid";
    else return "Hello word";
  else if (ChatGptTypeChecker.isNumber(schema)) return 123;
  else if (ChatGptTypeChecker.isBoolean(schema)) return true;
  else if (ChatGptTypeChecker.isArray(schema))
    return new Array(1).fill(0).map(() => fillArgument($defs, schema.items));
  else if (ChatGptTypeChecker.isObject(schema)) {
    const obj: any = {};
    for (const [key, value] of Object.entries(schema.properties ?? {}))
      obj[key] = fillArgument($defs, value);
    return obj;
  } else if (ChatGptTypeChecker.isReference(schema)) {
    const ref: IChatGptSchema | undefined =
      $defs[schema.$ref.split("/").pop()!];
    if (ref !== undefined) return fillArgument($defs, ref);
  }
  throw new Error("Invalid schema");
};

const secrets = (): Record<string, string> => ({
  // calendly: parsed.CALENDLY_TEST_SECRET, // disposable
  daum: ConnectorGlobal.env.DAUM_API_KEY,
  github: ConnectorGlobal.env.G_GITHUB_TEST_SECRET,
  google: ConnectorGlobal.env.GOOGLE_TEST_SECRET,
  naver: ConnectorGlobal.env.NAVER_CLIENT_SECRET,
  notion: ConnectorGlobal.env.NOTION_TEST_SECRET,
  openData: ConnectorGlobal.env.OPEN_DATA_API_KEY,
  serp: ConnectorGlobal.env.SERP_API_KEY,
  slack: ConnectorGlobal.env.SLACK_TEST_SECRET,
  // typeform: ConnectorGlobal.env.TYPEFORM_PERSONAL_ACCESS_KEY, // disposable
  figma: ConnectorGlobal.env.FIGMA_CLIENT_SECRET,
  zoom: ConnectorGlobal.env.ZOOM_TEST_REFRESH_TOKEN,
  sweetTracker: ConnectorGlobal.env.TEST_SWEET_TRACKER_KEY,
  googleAds: ConnectorGlobal.env.GOOGLE_ADS_PARENT_SECRET,
  jira: ConnectorGlobal.env.JIRA_TEST_SECRET,
  kakao: ConnectorGlobal.env.KAKAO_TALK_TEST_REFRESH_TOKEN,
  exim: ConnectorGlobal.env.KOREA_EXIM_BANK_API_KEY,
});
