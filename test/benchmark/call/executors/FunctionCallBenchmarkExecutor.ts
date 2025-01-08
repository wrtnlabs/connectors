import { IConnection } from "@nestia/fetcher";
import {
  IChatGptService,
  INestiaChatPrompt,
  INestiaChatTokenUsage,
  NestiaChatAgent,
} from "@nestia/agent";
import {
  ChatGptTypeChecker,
  HttpLlm,
  IChatGptSchema,
  IHttpLlmApplication,
  IHttpLlmFunction,
  OpenApiTypeChecker,
} from "@samchon/openapi";
import { IFunctionCallBenchmarkResult } from "../structures/IFunctionCallBenchmarkResult";
import { IFunctionCallBenchmarkScenario } from "../structures/IFunctionCallBenchmarkScenario";
import { IFunctionCallBenchmarkExpected } from "../structures/IFunctionCallBenchmarkExpected";
import { IFunctionCallBenchmarkOptions } from "../structures/IFunctionCallBenchmarkOptions";
import { Semaphore } from "tstl";
import { ConnectorGlobal } from "../../../../src/ConnectorGlobal";

export namespace FunctionCallBenchmarkExecutor {
  export interface IProps {
    application: IHttpLlmApplication<"chatgpt">;
    operations: Map<Function, Function>;
    service: IChatGptService;
    connection: IConnection;
    options: IFunctionCallBenchmarkOptions;
    semaphore: Semaphore;
    scenario: IFunctionCallBenchmarkScenario;
    location: string;
  }

  export const execute = async (
    props: IProps,
  ): Promise<IFunctionCallBenchmarkResult> => ({
    location: props.location,
    scenario: props.scenario,
    trials: await Promise.all(
      new Array(props.options.count).fill(0).map(async () => {
        await props.semaphore.acquire();
        const tr: IFunctionCallBenchmarkResult.ITrial = await process(props);
        await props.semaphore.release();
        return tr;
      }),
    ),
  });

  export const process = async (
    props: IProps,
  ): Promise<IFunctionCallBenchmarkResult.ITrial> => {
    const agent: NestiaChatAgent = new NestiaChatAgent({
      application: props.application,
      service: props.service,
      connection: props.connection,
      config: {
        capacity: props.options.capacity,
        eliticism: true,
      },
    });
    agent.on("call", (event) => {
      if (event.function.separated?.human)
        event.arguments = HttpLlm.mergeParameters({
          function: event.function,
          llm: event.arguments ?? null,
          human: fillArgument(
            event.function.separated.human.$defs,
            event.function.separated.human,
          ),
        });
    });

    const started_at: Date = new Date();
    try {
      const histories: INestiaChatPrompt[] = await agent.conversate(
        props.scenario.prompt,
      );
      const usage: INestiaChatTokenUsage = agent.getTokenUsage();
      return {
        histories,
        usage,
        select: predicateIncludeFunction({
          application: props.application,
          operations: props.operations,
          expected: props.scenario.expected,
          functionList: histories
            .filter((h) => h.kind === "select")
            .map((h) => h.functions)
            .flat(),
          strict: false,
        }),
        execute: predicateIncludeFunction({
          application: props.application,
          operations: props.operations,
          expected: props.scenario.expected,
          functionList: histories.filter((h) => h.kind === "execute"),
          strict: false,
        }),
        error: null,
        started_at,
        completed_at: new Date(),
      };
    } catch (error) {
      return {
        histories: [],
        usage: agent.getTokenUsage(),
        select: false,
        execute: false,
        error: error as Error,
        started_at,
        completed_at: new Date(),
      };
    }
  };

  const predicateIncludeFunction = (props: {
    application: IHttpLlmApplication<"chatgpt">;
    operations: Map<Function, Function>;
    expected: IFunctionCallBenchmarkExpected;
    functionList: { function: IHttpLlmFunction<"chatgpt"> }[];
    strict: boolean;
  }): boolean => {
    const call = (
      expected: IFunctionCallBenchmarkExpected,
      overrideHistories?: { function: IHttpLlmFunction<"chatgpt"> }[],
    ) =>
      predicateIncludeFunction({
        application: props.application,
        operations: props.operations,
        functionList: overrideHistories ?? props.functionList,
        expected,
        strict: props.strict,
      });

    switch (props.expected.type) {
      case "standalone":
        const target: IHttpLlmFunction<"chatgpt"> | undefined = getFunction({
          application: props.application,
          operations: props.operations,
          function: props.expected.function,
        });
        return props.functionList.some(({ function: func }) => func === target);
      case "allOf":
        return props.expected.allOf.every((expected) => call(expected));
      case "anyOf":
        return props.expected.anyOf.some((expected) => call(expected));
      case "array":
        const targetIterator = props.expected.items[Symbol.iterator]();
        let targeted = targetIterator.next();

        for (const history of props.functionList) {
          if (targeted.done) {
            return true;
          }

          if (call(targeted.value, [history])) {
            targeted = targetIterator.next();
            continue;
          }

          if (props.strict) {
            return false;
          }
        }
        return true;
    }
  };

  const getFunction = (props: {
    application: IHttpLlmApplication<"chatgpt">;
    operations: Map<Function, Function>;
    function: Function;
  }): IHttpLlmFunction<"chatgpt"> | undefined => {
    return props.application.functions.find(
      (func) =>
        func.operation()["x-samchon-accessor"]?.at(-1) ===
          props.function.name &&
        func.operation()["x-samchon-controller"] ===
          props.operations.get(props.function)?.name,
    );
  };
}

const fillArgument = (
  $defs: Record<string, IChatGptSchema>,
  schema: IChatGptSchema,
): any => {
  if (OpenApiTypeChecker.isString(schema))
    if (schema.description?.includes("@contentMediaType") !== undefined)
      return "https://namu.wiki/w/%EB%A6%B4%ED%8C%8C";
    else if (schema["x-wrtn-secret-key"] === "google")
      return ConnectorGlobal.env.GOOGLE_TEST_SECRET;
    else if (schema["x-wrtn-secret-key"] === "notion")
      return ConnectorGlobal.env.NOTION_TEST_SECRET;
    else if (schema["x-wrtn-secret-key"] === "slack")
      return ConnectorGlobal.env.SLACK_TEST_SECRET;
    else if (schema["x-wrtn-secret-key"] === "github")
      return ConnectorGlobal.env.G_GITHUB_TEST_SECRET;
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
