import { Agentica, AgenticaOperation } from "@agentica/core";
import fs from "fs";
import OpenAI from "openai";
import path from "path";
import { AgenticaSelectBenchmark } from "@agentica/benchmark";
import { IAgenticaSelectBenchmarkScenario } from "@agentica/benchmark/src/structures/IAgenticaSelectBenchmarkScenario";

import { ConnectorGlobal } from "../../src/ConnectorGlobal";
import { allControllerConfigs } from "./ConnectorList";

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

/**
 * Generates a multi-step scenario text using the provided Agentica instance
 * based on the controller's functions.
 * Also extracts the expected first function call.
 */
const generateScenarioText = async (
  controllerName: string,
  operations: AgenticaOperation<"chatgpt">[],
  agentica: Agentica<"chatgpt">, // Accept the Agentica instance
): Promise<{ scenarioText: string; firstFunctionName: string } | null> => {
  // Format the list of functions for the prompt (unchanged)
  const functionListString = operations
    .map(
      (op) =>
        `    *   Function Name: ${op.function.name}\n        Description: ${op.function.description || "No description available."}`,
    )
    .join("\n");

  const generationPrompt = [
    "# Role:",
    "You are an expert in creating **multi-step workflow scenarios** to test the capabilities of an AI agent. Your role is to creatively combine the various functions provided by a given service (controller) and craft a **single cohesive story** that guides the user toward achieving a **meaningful final goal**.",
    "",
    "# Goal:",
    `For the **${controllerName}** service below, create **one integrated user scenario** in **multi-line text** that utilizes **at least three different functions**. This scenario should realistically depict the process of a user interacting with the AI agent to progressively complete a task. The result must be presented as a **single text block**, with each line representing a user request, thought, or instruction.`,
    "",
    "# Input Information:",
    `*   **Service Name:** ${controllerName}`,
    "*   **List of Available Functions (Name, Description):**",
    functionListString,
    "",
    "# Output Format Requirements:",
    "*   **One Complete Story:** Must be written as a **single text block** spanning multiple lines.",
    "*   **Natural Flow:** Each line should logically connect to the previous one, following the user’s journey toward their goal.",
    "*   **Command/Request Style:** Written in a natural, conversational tone or as instructions, as if the user is speaking to the AI.",
    "*   **Diverse Function Usage:** The scenario must imply the use of **at least three different functions** from the list provided.",
    '*   **Shopping Example Style:** Follow a structure and flow similar to the shopping scenario provided below, without individual prefixes like "User Request:", making it feel like one continuous user narrative.',
    "",
    "# Output Restrictions:",
    '*   Do not add prefixes like "User Request:" to each step.',
    "*   Do not invent content unrelated to the provided list of functions.",
    "*   Ensure the scenario clearly implies the use of at least three *different* functions.",
    "",
    "# Additional Output Requirement:",
    "After generating the scenario text block, add **exactly one blank line**, followed by a single line formatted precisely as:",
    "FIRST_FUNCTION_EXPECTED: [Function Name]",
    "(Replace [Function Name] with the **exact name** of the function from the provided list that the scenario would most logically trigger *first*.)",
  ].join("\n");

  console.log(
    `  Requesting scenario generation for ${controllerName} using agent's model (gpt-4o-mini)...`,
  );

  try {
    const responseHistory = await agentica.conversate(generationPrompt);

    if (!Array.isArray(responseHistory) || responseHistory.length === 0) {
      console.warn(
        `  Scenario generation for ${controllerName} returned an unexpected response structure (empty or not an array).`,
      );
      return null;
    }

    const assistantResponse = responseHistory
      .filter(
        (history) =>
          history.type === "text" &&
          history.text &&
          history.role === "assistant",
      )
      .map((history) => history.type === "text" && history.text)
      .join("\n");

    const content = assistantResponse.trim();

    const lines = content.split("\n");
    if (lines.length < 3) {
      console.warn(
        `  Scenario generation for ${controllerName} produced insufficient lines. Content:\n${content}`,
      );
      return null;
    }

    const lastLine = lines[lines.length - 1];
    const secondLastLine = lines[lines.length - 2];

    if (
      lastLine.startsWith("FIRST_FUNCTION_EXPECTED:") &&
      secondLastLine === ""
    ) {
      const firstFunctionName = lastLine
        .replace("FIRST_FUNCTION_EXPECTED:", "")
        .trim();

      // Check if the function name actually exists in the *current agent's* operations
      if (!operations.some((op) => op.function.name === firstFunctionName)) {
        console.warn(
          `  LLM suggested first function "${firstFunctionName}" for ${controllerName}, but it was not found in the available operations for this agent. Content:\n${content}`,
        );
        return null; // Function name mismatch
      }

      const scenarioText = lines.slice(0, -2).join("\n").trim(); // Remove the last two lines
      if (!scenarioText) {
        console.warn(
          `  Scenario generation for ${controllerName} resulted in an empty scenario text after parsing. Content:\n${content}`,
        );
        return null;
      }

      console.log(
        `  Scenario generated successfully via agent conversation for ${controllerName}. First expected function: ${firstFunctionName}`,
      );
      return { scenarioText, firstFunctionName };
    } else {
      console.warn(
        `  Scenario generation output for ${controllerName} did not follow the expected format (missing blank line or FIRST_FUNCTION_EXPECTED line). Content:\n${content}`,
      );
      return null;
    }
  } catch (error) {
    console.error(
      `  Error during scenario generation conversation for ${controllerName}:`,
      error instanceof Error ? error.message : String(error),
    );
    // Log the agent's history if available and an error occurred
    if (agentica.getHistories().length > 0) {
      console.error(
        "  Agent history at time of error:",
        JSON.stringify(agentica.getHistories(), null, 2),
      );
    }
    return null;
  }
};

// --- Main Benchmark Function (Modified Call to generateScenarioText) ---
const main = async (): Promise<void> => {
  console.log(
    `Found ${allControllerConfigs.length} controller configurations to benchmark individually.`,
  );

  const allBenchmarkResults: Record<string, Record<string, string>> = {};
  const baseReportDir: string = path.resolve(
    __dirname,
    "..",
    "..",
    "docs",
    "benchmarks",
    "select",
  );

  console.log(`Cleaning base report directory: ${baseReportDir}`);
  await rmdir(baseReportDir);
  await mkdir(baseReportDir); // Recreate base directory

  for (const controllerConfig of allControllerConfigs) {
    console.log(`\n--- Benchmarking Controller: ${controllerConfig.name} ---`);

    const agent = new Agentica({
      model: "chatgpt",
      vendor: {
        api: new OpenAI({ apiKey: ConnectorGlobal.env.OPENAI_API_KEY }),
        model: "gpt-4o-mini",
      },
      controllers: [controllerConfig],
    });
    console.log(`Agent created for ${controllerConfig.name}.`);

    const availableOperations = agent
      .getOperations()
      .filter((op) => op.protocol === "class");

    if (availableOperations.length === 0) {
      console.warn(
        `No class operations found for ${controllerConfig.name}. Skipping benchmark.`,
      );
      allBenchmarkResults[controllerConfig.name] = {
        error: "No class operations found.",
      };
      continue;
    }

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
          `Operation "${functionName}" not found via find() for ${controllerConfig.name}. Check LLM output or controller's service method names.`,
        );
      }
      return found;
    };

    // --- Generate Scenario using Agentica ---
    let scenarios: IAgenticaSelectBenchmarkScenario<"chatgpt">[] = [];
    try {
      const generationResult = await generateScenarioText(
        controllerConfig.name,
        availableOperations,
        agent,
      );

      if (generationResult) {
        const { scenarioText, firstFunctionName } = generationResult;
        const expectedOperation = find(firstFunctionName);

        scenarios.push({
          name: `${controllerConfig.name} - Generated Multi-Step Scenario`,
          text: scenarioText,
          expected: {
            type: "standalone",
            operation: expectedOperation,
          },
        });
        console.log(`  Using generated scenario for ${controllerConfig.name}.`);
      } else {
        console.warn(
          `  Failed to generate a valid scenario via agent conversation for ${controllerConfig.name}. Skipping benchmark.`,
        );
        allBenchmarkResults[controllerConfig.name] = {
          error:
            "Scenario generation via agent conversation failed or produced invalid output.",
        };
        continue; // Skip if scenario couldn't be generated
      }
    } catch (error) {
      console.error(
        `  Error during scenario preparation/finding operation for ${controllerConfig.name}:`,
        error,
      );
      allBenchmarkResults[controllerConfig.name] = {
        error: `Scenario preparation failed: ${error instanceof Error ? error.message : String(error)}`,
      };
      continue; // Skip to next controller
    }

    if (scenarios.length > 0) {
      try {
        const benchmark: AgenticaSelectBenchmark<"chatgpt"> =
          new AgenticaSelectBenchmark({
            agent: agent,
            config: {
              repeat: 2,
              simultaneous: 1,
            },
            scenarios: scenarios,
          });

        console.log(`  Executing benchmark for ${controllerConfig.name}...`);
        await benchmark.execute();
        console.log(
          `  Benchmark execution finished for ${controllerConfig.name}.`,
        );

        // --- Store Report ---
        allBenchmarkResults[controllerConfig.name] = benchmark.report();
      } catch (error) {
        console.error(
          `  Benchmark execution failed for ${controllerConfig.name}:`,
          error,
        );
        allBenchmarkResults[controllerConfig.name] = {
          error: `Benchmark failed: ${error instanceof Error ? error.message : String(error)}`,
        };
      }
    } else {
      console.warn(
        `  No scenarios were available to run the benchmark for ${controllerConfig.name}.`,
      );
      if (!allBenchmarkResults[controllerConfig.name]) {
        allBenchmarkResults[controllerConfig.name] = {
          error: "No scenarios available for benchmark.",
        };
      }
    }
  } // End of loop through controllers

  // --- Generate All Reports ---
  console.log("\n--- Generating Reports ---");
  for (const [controllerName, reportDocs] of Object.entries(
    allBenchmarkResults,
  )) {
    const controllerReportDir = path.join(
      baseReportDir,
      controllerName.replace(/[^a-zA-Z0-9_-]/g, "_"), // Sanitize name
    );
    console.log(`Generating report files in: ${controllerReportDir}`);
    await mkdir(controllerReportDir);

    if (reportDocs.error) {
      const errorFilePath = path.join(
        controllerReportDir,
        "BENCHMARK_ERROR.md",
      );
      await fs.promises.writeFile(
        errorFilePath,
        `# Benchmark Error/Skip for ${controllerName}\n\n${reportDocs.error}`,
        "utf8",
      );
      console.warn(`Wrote error/skip file for ${controllerName}.`);
    } else {
      for (const [key, value] of Object.entries(reportDocs)) {
        const filePath = path.join(controllerReportDir, key);
        await mkdir(path.dirname(filePath));
        await fs.promises.writeFile(filePath, value, "utf8");
      }
    }
  }
  console.log("All reports generated successfully.");
};

main().catch((error) => {
  console.error("Benchmark process failed with an error:", error);
  process.exit(1);
});
