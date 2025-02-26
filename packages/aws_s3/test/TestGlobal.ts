import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import path from "path";
import { Singleton } from "tstl";
import typia from "typia";

export class TestGlobal {
  public static readonly ROOT: string =
    __filename.substring(__filename.length - 2) === "js"
      ? `${__dirname}/../..`
      : `${__dirname}/..`;

  public static get env(): IEnvironments {
    return environments.get();
  }

  public static getArguments(type: string): string[] {
    const from: number = process.argv.indexOf(`--${type}`) + 1;
    if (from === 0) return [];
    const to: number = process.argv
      .slice(from)
      .findIndex((str) => str.startsWith("--"), from);
    return process.argv.slice(
      from,
      to === -1 ? process.argv.length : to + from,
    );
  }
}

interface IEnvironments {
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_S3_BUCKET: string;
  FAKE_S3_PORT: string;
}

const environments = new Singleton(() => {
  const env = dotenv.config({
    path: path.resolve(__dirname, "../../../../.env"),
  });
  dotenvExpand.expand(env);

  return typia.assert<IEnvironments>(process.env);
});
