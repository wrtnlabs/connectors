import { NestFactory } from "@nestjs/core";
import * as sdk from "@nestia/sdk";
import "reflect-metadata";
import { OpenApi } from "@samchon/openapi";
import { LoggerModule } from "nestjs-pino";
import { Type } from "@nestjs/common";
import { ConnectorModule } from "./src/ConnectorModule";

const toKebabCase = (str: string) => {
  return str
    .replace(/Module$/, "")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();
};

const swagger = (props: {
  module: Type<any>;
  info: Partial<OpenApi.IDocument.IInfo>;
  output: string;
}): sdk.INestiaConfig => ({
  input: () => NestFactory.create(props.module),
  swagger: {
    output: props.output,
    info: props.info,
    beautify: true,
    decompose: true,
    servers: [
      {
        url: "https://studio-connector-api.wrtn.ai",
        description: "Production Server",
      },
      {
        url: "https://studio-connector-poc.dev.wrtn.club",
        description: "Develop Server",
      },
      {
        url: "http://localhost:3003",
        description: "Local Server",
      },
    ],
  },
});

const moduleNames = (
  Reflect.getMetadata("imports", ConnectorModule) || []
).filter((module: any) => module !== LoggerModule);

const NESTIA_CONFIG: sdk.INestiaConfig[] = [
  {
    input: async () => NestFactory.create(ConnectorModule),
    output: "src/api",
    swagger: {
      decompose: true,
      output: "packages/api/swagger.json",
      servers: [
        {
          url: "https://studio-connector-api.wrtn.ai",
          description: "Production Server",
        },
        {
          url: "https://studio-connector-poc.dev.wrtn.club",
          description: "Develop Server",
        },
        {
          url: "http://localhost:3003",
          description: "Local Server",
        },
      ],
      beautify: true,
    },
    distribute: "packages/api",
    simulate: true,
  },
  ...moduleNames.map((module: any) => {
    const title = toKebabCase(module.name);
    return swagger({
      module,
      info: {
        title: title,
      },
      output: `packages/api/connectors/${title}.swagger.json`,
    });
  }),
];

export default NESTIA_CONFIG;
