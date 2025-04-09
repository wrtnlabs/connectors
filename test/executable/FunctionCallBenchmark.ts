import { Agentica, AgenticaOperation } from "@agentica/core";

export class FunctionCallBenchmark {}

import fs from "fs";
import OpenAI from "openai";
import path from "path";
import { AgenticaSelectBenchmark } from "@agentica/benchmark";
import { IAgenticaSelectBenchmarkScenario } from "@agentica/benchmark/src/structures/IAgenticaSelectBenchmarkScenario";
import { AwsS3Service } from "../../packages/aws_s3";

const mkdir = async (str: string) => {
  try {
    await fs.promises.mkdir(str, {
      recursive: true,
    });
  } catch {}
};

const rmdir = async (str: string) => {
  try {
    await fs.promises.rm(str, {
      recursive: true,
    });
  } catch {}
};

const startBenchMark = async (): Promise<void> => {
  // CREATE AI AGENT
  const agent: Agentica<"chatgpt"> = new Agentica({
    model: "chatgpt",
    vendor: {
      api: new OpenAI({ apiKey: "********" }),
      model: "gpt-4o-mini",
    },
    controllers: [],
  });

  // DO BENCHMARK
  const find = (functionName: string): AgenticaOperation<"chatgpt"> => {
    const found = agent
      .getOperations()
      .find(
        (op) => op.protocol === "class" && op.function.name === functionName,
      );
    if (!found) throw new Error(`Operation not found: ${functionName}`);
    return found;
  };

  const benchmark: AgenticaSelectBenchmark<"chatgpt"> =
    new AgenticaSelectBenchmark({
      agent: agent,
      config: {
        repeat: 4,
        simultaneous: 100,
      },
      scenarios: [
        {
          name: "order",
          text: [
            "I wanna see every sales in the shopping mall",
            "",
            "And then show me the detailed information about the Macbook.",
            "",
            "After that, select the most expensive stock",
            "from the Macbook, and put it into my shopping cart.",
            "And take the shopping cart to the order.",
            "",
            "At last, I'll publish it by cash payment, and my address is",
            "",
            "  - country: South Korea",
            "  - city/province: Seoul",
            "  - department: Wrtn Apartment",
            "  - Possession: 101-1411",
          ].join("\n"),
          expected: {
            type: "array",
            items: [
              {
                type: "standalone",
                operation: find("/shoppings/customers/sales"),
              },
              {
                type: "standalone",
                operation: find("/shoppings/customers/sales/{id}"),
              },
              {
                type: "anyOf",
                anyOf: [
                  {
                    type: "standalone",
                    operation: find("/shoppings/customers/orders"),
                  },
                  {
                    type: "standalone",
                    operation: find("/shoppings/customers/orders/direct"),
                  },
                ],
              },
              {
                type: "standalone",
                operation: find(
                  "/shoppings/customers/orders/{orderId}/publish",
                ),
              },
            ],
          },
        },
      ] satisfies IAgenticaSelectBenchmarkScenario<"chatgpt">[],
    });
  await benchmark.execute();

  // REPORT
  const docs: Record<string, string> = benchmark.report();
  const root: string = `docs/benchmarks/call`;

  await rmdir(root);
  for (const [key, value] of Object.entries(docs)) {
    await mkdir(path.join(root, key.split("/").slice(0, -1).join("/")));
    await fs.promises.writeFile(path.join(root, key), value, "utf8");
  }
};
