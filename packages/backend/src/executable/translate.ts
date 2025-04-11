import { OpenApi, OpenApiTypeChecker } from "@samchon/openapi";
import fs from "fs";

import { MapUtil } from "../api/utils/MapUtil";

const main = async (): Promise<void> => {
  const dict: Map<string, Array<(str: string) => void>> = new Map();
  // cp.execSync("npm run build:swagger", { stdio: "inherit" });
  const swagger: OpenApi.IDocument = JSON.parse(
    await fs.promises.readFile(
      __dirname + "/../../packages/api/swagger.json",
      "utf8",
    ),
  );

  // PREPARE EMPLACERS
  const emplace = (key: string) => MapUtil.take(dict)(key, () => []);
  const gather = (schema: {
    title?: string;
    summary?: string;
    description?: string;
  }) => {
    if (schema.title) emplace(schema.title).push((str) => (schema.title = str));
    if (schema.description)
      emplace(schema.description).push((str) => (schema.description = str));
    if (schema.summary)
      emplace(schema.summary).push((str) => (schema.summary = str));
  };
  const iterate = (schema: OpenApi.IJsonSchema) => {
    gather(schema);
    if (OpenApiTypeChecker.isArray(schema)) iterate(schema.items);
    else if (OpenApiTypeChecker.isTuple(schema)) {
      for (const item of schema.prefixItems) iterate(item);
      if (
        typeof schema.additionalItems === "object" &&
        schema.additionalItems !== null
      )
        iterate(schema.additionalItems);
    } else if (OpenApiTypeChecker.isOneOf(schema))
      schema.oneOf.forEach(iterate);
    else if (OpenApiTypeChecker.isObject(schema))
      Object.values(schema.properties ?? {}).forEach(iterate);
  };

  // ITERATE SWAGGER MEMBERS
  for (const collection of Object.values(swagger.paths ?? {}))
    for (const method of ["get", "post", "put", "patch", "delete"] as const) {
      const operation: OpenApi.IOperation | undefined = collection[method];
      if (operation === undefined) continue;
      gather(operation);
      if (operation.requestBody) {
        iterate(operation.requestBody);
        for (const v of Object.values(operation.requestBody.content ?? {}))
          if (v?.schema !== undefined) iterate(v.schema);
      }
      for (const response of Object.values(operation.responses ?? {})) {
        gather(response);
        for (const v of Object.values(response.content ?? {}))
          if (v?.schema !== undefined) iterate(v.schema);
      }
      for (const param of operation.parameters ?? []) iterate(param.schema);
    }

  // TRANSLATE
  for (const [key, setters] of dict) {
    const translated: string = "@todo - ASHER - " + key;
    for (const s of setters) s(translated);
  }

  console.log("Length of paragraphs", dict.size);
  console.log([...dict.keys()]);

  // SAVE AS SWAGGER.JSON
  await fs.promises.writeFile(
    __dirname + "/../../packages/api/swagger.korean.json",
    JSON.stringify(swagger, null, 2),
  );
};
main().catch((exp) => {
  console.log(exp);
  process.exit(-1);
});
