import fs from "fs";
import path from "path";

import { ConnectorGlobal } from "./ConnectorGlobal";

export namespace ConnectorConfiguration {
  export const API_PORT = () => Number(ConnectorGlobal.env.CONNECTOR_API_PORT);

  export const ROOT = (() => {
    const splitted: string[] = __dirname.split(path.sep);
    return splitted.at(-1) === "src" && splitted.at(-2) === "bin"
      ? path.resolve(__dirname + "/../..")
      : fs.existsSync(__dirname + "/.env")
        ? __dirname
        : path.resolve(__dirname + "/..");
  })();
}
