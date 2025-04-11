import {
  HttpLlm,
  HttpMigration,
  OpenApi,
  OpenApiTypeChecker,
} from "@samchon/openapi";
import {
  IHttpOpenAiApplication,
  ISwaggerMigrateApplication,
  HttpOpenAi,
  OpenAiTypeChecker,
} from "@wrtnio/schema";
import cp from "child_process";
import fs from "fs";
import typia from "typia";
import { Escaper } from "typia/lib/utils/Escaper";

import { ConnectorConfiguration } from "../ConnectorConfiguration";

const assertDocumentDescription = (document: OpenApi.IDocument): void => {
  const components: OpenApi.IComponents = document.components;
  const visited: WeakSet<OpenApi.IJsonSchema> = new WeakSet();
  const violates: Set<string> = new Set();
  for (const [path, collection] of Object.entries(document.paths ?? {}))
    for (const [method, operation] of Object.entries(collection))
      if (
        method === "get" ||
        method === "post" ||
        method === "put" ||
        method === "patch" ||
        method === "delete"
      )
        visitOperationDescription({
          components,
          visited,
          violates,
          path,
          method,
          operation,
        });
  if (violates.size)
    console.error(
      "Some operation or schema do not have { summary, title, or description }",
      Array.from(violates).sort(),
    );
};

const visitOperationDescription = (props: {
  components: OpenApi.IComponents;
  visited: WeakSet<OpenApi.IJsonSchema>;
  violates: Set<string>;
  path: string;
  method: string;
  operation: OpenApi.IOperation;
}): void => {
  const accessor: string = `${props.method.toUpperCase()} ${props.path}`;
  if (
    props.operation.summary === undefined &&
    props.operation.description === undefined
  )
    props.violates.add(accessor);

  for (const param of props.operation.parameters ?? [])
    if (param.schema)
      visitSchemaDescription({
        top: false,
        components: props.components,
        visited: props.visited,
        violates: props.violates,
        accessor: `${accessor} ${param.name}`,
        schema: param.schema,
      });
  if (props.operation.requestBody)
    Object.values(props.operation.requestBody.content ?? {}).forEach(
      (media) => {
        if (media?.schema)
          visitSchemaDescription({
            top: false,
            components: props.components,
            visited: props.visited,
            violates: props.violates,
            accessor: `${accessor} Request Body`,
            schema: media.schema,
          });
      },
    );
  Object.values(props.operation.responses ?? {}).map((response) => {
    Object.values(response.content ?? {}).forEach((media) => {
      if (media?.schema)
        visitSchemaDescription({
          top: false,
          components: props.components,
          visited: props.visited,
          violates: props.violates,
          accessor: `${accessor} Response Body`,
          schema: media.schema,
        });
    });
  });
};

const visitSchemaDescription = (props: {
  top: boolean;
  components: OpenApi.IComponents;
  visited: WeakSet<OpenApi.IJsonSchema>;
  violates: Set<string>;
  accessor: string;
  schema: OpenApi.IJsonSchema;
}): void => {
  // GATHER ACCESSORS
  if (props.visited.has(props.schema)) return;
  props.visited.add(props.schema);
  if (
    props.top === true &&
    props.schema.title === undefined &&
    props.schema.description === undefined
  )
    props.violates.add(props.accessor);

  if (OpenApiTypeChecker.isReference(props.schema))
    visitSchemaDescription({
      top: false,
      components: props.components,
      visited: props.visited,
      violates: props.violates,
      accessor: props.schema.$ref.split("/").at(-1) ?? "",
      schema:
        props.components?.schemas?.[
          props.schema.$ref.split("/").at(-1) ?? ""
        ] ?? {},
    });
  else if (OpenApiTypeChecker.isArray(props.schema))
    visitSchemaDescription({
      top: false,
      components: props.components,
      visited: props.visited,
      violates: props.violates,
      accessor: `${props.accessor}[]`,
      schema: props.schema.items,
    });
  else if (OpenApiTypeChecker.isTuple(props.schema)) {
    props.schema.prefixItems.forEach((item, i) =>
      visitSchemaDescription({
        top: false,
        components: props.components,
        visited: props.visited,
        violates: props.violates,
        accessor: `${props.accessor}[${i}]`,
        schema: item,
      }),
    );
    if (
      typeof props.schema.additionalItems === "object" &&
      props.schema.additionalItems !== null
    )
      visitSchemaDescription({
        top: false,
        components: props.components,
        visited: props.visited,
        violates: props.violates,
        accessor: props.accessor,
        schema: props.schema.additionalItems,
      });
  } else if (OpenApiTypeChecker.isOneOf(props.schema))
    props.schema.oneOf.forEach((schema) =>
      visitSchemaDescription({
        top: false,
        components: props.components,
        visited: props.visited,
        violates: props.violates,
        accessor: props.accessor,
        schema,
      }),
    );
  else if (OpenApiTypeChecker.isObject(props.schema)) {
    for (const [key, schema] of Object.entries(props.schema.properties ?? {}))
      visitSchemaDescription({
        top: true,
        components: props.components,
        visited: props.visited,
        violates: props.violates,
        accessor: Escaper.variable(key)
          ? `${props.accessor}.${key}`
          : `${props.accessor}[${JSON.stringify(key)}]`,
        schema,
      });
    if (
      typeof props.schema.additionalProperties === "object" &&
      props.schema.additionalProperties !== null
    )
      visitSchemaDescription({
        top: true,
        components: props.components,
        visited: props.visited,
        violates: props.violates,
        accessor: `${props.accessor}[string]`,
        schema: props.schema.additionalProperties,
      });
  }
};

const generateOpenAiFunctionCallingSchemas = async (
  location: string,
  document: OpenApi.IDocument,
): Promise<void> => {
  const migrate: ISwaggerMigrateApplication =
    HttpMigration.application(document);

  for (const keyword of [false, true]) {
    const openai: IHttpOpenAiApplication = HttpOpenAi.application({
      document,
      options: {
        keyword,
        separate: (s) =>
          OpenAiTypeChecker.isString(s) &&
          (s["x-wrtn-secret-key"] !== undefined ||
            s.contentMediaType !== undefined),
      },
    });
    if (openai.errors.length > 0) {
      console.log(JSON.stringify(openai.errors, null, 2));
      throw new Error("new openai function schema has errors");
    }
    await fs.promises.writeFile(
      `${location}/openai-${keyword ? "keyword" : "positional"}.json`,
      JSON.stringify(openai),
      "utf8",
    );
  }
  await fs.promises.writeFile(
    `${location}/migrate.json`,
    JSON.stringify(migrate),
    "utf8",
  );
  await fs.promises.writeFile(
    `${location}/version.json`,
    JSON.stringify({ version: document.info?.version }),
    "utf8",
  );
};

const main = async (): Promise<void> => {
  const location: string = `${ConnectorConfiguration.ROOT}/packages/api`;
  if (false === fs.existsSync(`${location}/swagger.json`))
    cp.execSync("npx nestia swagger", { stdio: "inherit" });

  const document: OpenApi.IDocument = typia.assert<OpenApi.IDocument>(
    JSON.parse(await fs.promises.readFile(`${location}/swagger.json`, "utf-8")),
  );
  await assertDocumentDescription(document);
  await generateOpenAiFunctionCallingSchemas(location, document);
};
main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
