import fs from "fs";
import { Singleton, randint } from "tstl";

import { ConnectorConfiguration } from "../ConnectorConfiguration";

import serializeError = require("serialize-error");

export namespace ErrorUtil {
  export const toJSON = (err: any): object =>
    err instanceof Object && err.toJSON instanceof Function
      ? err.toJSON()
      : serializeError(err);

  export const log =
    (prefix: string) =>
    async (error: string | object | Error): Promise<void> => {
      try {
        if (error instanceof Error) error = toJSON(error);

        const date: Date = new Date();
        const fileName: string = `${date.getFullYear()}${cipher(
          date.getMonth() + 1,
        )}${cipher(date.getDate())}${cipher(date.getHours())}${cipher(
          date.getMinutes(),
        )}${cipher(date.getSeconds())}.${randint(0, Number.MAX_SAFE_INTEGER)}`;
        const content: string = JSON.stringify(error, null, 4);

        await directory.get();
        await fs.promises.writeFile(
          `${ConnectorConfiguration.ROOT}/assets/logs/errors/${prefix}_${fileName}.log`,
          content,
          "utf8",
        );
      } catch {}
    };
}

const cipher = (val: number): string => String(val).padStart(2, "0");
const directory = new Singleton(async () => {
  await mkdir(`${ConnectorConfiguration.ROOT}/assets/logs`);
  await mkdir(`${ConnectorConfiguration.ROOT}/assets/logs/errors`);
});
async function mkdir(path: string): Promise<void> {
  try {
    await fs.promises.mkdir(path);
  } catch {}
}
