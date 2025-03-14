import chalk from "chalk";
import cp from "child_process";
import fs from "fs";
import { ArgumentParser } from "../../helpers/ArgumentParser";
import { ConnectorConfiguration } from "../../../src/ConnectorConfiguration";
import typia from "typia";
import { ISwagger } from "@wrtnio/schema";
import {
  HttpLlm,
  IHttpLlmApplication,
  IHttpLlmFunction,
} from "@samchon/openapi";
import { FunctionSelectBenchmarkExecutor } from "./FunctionSelectBenchmarkExecutor";
import { IFunctionSelectBenchmarkResult } from "./IFunctionSelectBenchmarkResult";
import { FunctionSelectBenchmarkReporter } from "./FunctionSelectBenchmarkReporter";
import { IFunctionSelectBenchmarkOptions } from "./IFunctionSelectBenchmarkOptions";
import { MathUtil } from "../../../src/utils/MathUtil";
import { Semaphore } from "tstl";
import OpenAI from "openai";
import { ConnectorGlobal } from "../../../src/ConnectorGlobal";

interface IOptions extends IFunctionSelectBenchmarkOptions {
  swagger: boolean;
  semaphore: number;
}

const SWAGGER_LOCATION = `${ConnectorConfiguration.ROOT}/packages/api/swagger.json`;

const getOptions = () =>
  ArgumentParser.parse<IOptions>(async (command, prompt, action) => {
    command.option("--swagger <true|false>", "Build swagger document");
    command.option("--repeat <number>", "repeat benchmark");
    command.option("--capacity <number>", "dividing count");
    command.option("--semaphore <number>", "semaphore size");
    command.option("--include <string...>", "include benchmrk endpoints");
    command.option("--exclude <string...>", "exclude benchmark endpoints");
    return action(async (options) => {
      if (fs.existsSync(SWAGGER_LOCATION) === false) options.swagger = true;
      else {
        if (typeof options.swagger === "string")
          options.swagger = options.swagger === "true";
        options.swagger ??= await prompt.boolean("swagger")(
          "Build swagger document",
        );
      }
      if (typeof options.repeat === "string")
        options.repeat = Number(options.repeat);
      options.repeat ??= await prompt.number("repeat")(
        "Repeating count (default 10)",
        10,
      );
      if (typeof options.capacity === "string")
        options.capacity = Number(options.capacity);
      options.capacity ??= await prompt.number("capacity")(
        "Capacity count per agent (divide and conquer, default 100)",
        100,
      );
      if (typeof options.semaphore === "string")
        options.semaphore = Number(options.semaphore);
      options.semaphore ??= await prompt.number("semaphore")(
        "Semaphore size (default 100)",
        100,
      );
      return options as IOptions;
    });
  });

const main = async (): Promise<void> => {
  // PREPARE OPTIONS
  const options: IOptions = await getOptions();
  if (options.swagger === true)
    cp.execSync("npm run build:swagger", {
      cwd: ConnectorConfiguration.ROOT,
      stdio: "inherit",
    });

  // COMPOSE APPLICATION
  const application: IHttpLlmApplication<"chatgpt"> = HttpLlm.application({
    model: "chatgpt",
    document: typia.json.assertParse<ISwagger>(
      await fs.promises.readFile(SWAGGER_LOCATION, "utf8"),
    ),
  });
  application.functions = application.functions.filter(
    (f) => f.operation()["x-wrtn-experimental"] !== true,
  );
  const candidates: IHttpLlmFunction<"chatgpt">[] =
    application.functions.filter(
      (f) =>
        f.operation()["x-wrtn-function-select-benchmarks"] !== undefined &&
        (!options.include?.length ||
          options.include.some((str) => f.path.includes(str))) &&
        (!options.exclude?.length ||
          options.exclude.every((str) => f.path.includes(str) === false)),
    );

  // DO BENCHMARK
  const semaphore: Semaphore = new Semaphore(options.semaphore);
  const executor: FunctionSelectBenchmarkExecutor =
    new FunctionSelectBenchmarkExecutor(
      {
        type: "chatgpt",
        api: new OpenAI({
          apiKey: ConnectorGlobal.env.OPENAI_API_KEY,
        }),
        model: "gpt-4o",
      },
      application,
      options,
      semaphore,
    );
  const results: IFunctionSelectBenchmarkResult[] = await Promise.all(
    candidates
      .map((func) =>
        (func.operation()["x-wrtn-function-select-benchmarks"] ?? []).map(
          (keyword) => [func, keyword] as const,
        ),
      )
      .flat()
      .map(async ([func, keyword]) => {
        const result: IFunctionSelectBenchmarkResult = await executor.execute(
          func,
          keyword,
        );
        console.log(
          chalk.blueBright(func.method),
          chalk.greenBright(func.path) + ":",
          `${result.success === 0 ? chalk.redBright(result.success) : chalk.yellowBright(result.success)} of ${chalk.yellowBright(result.count)}`,
          "->",
          chalk.cyanBright(
            MathUtil.round(
              result.events
                .map(
                  (event) =>
                    event.completed_at.getTime() - event.started_at.getTime(),
                )
                .reduce((prev, curr) => prev + curr, 0),
            ).toLocaleString(),
          ) + " ms",
          `(${keyword})`,
        );
        return result;
      }),
  );

  // REPORT IT
  await FunctionSelectBenchmarkReporter.report({
    application,
    options,
    results,
    usage: executor.getUsage(),
  });
};
main().catch((error) => {
  console.log(error);
  process.exit(-1);
});
