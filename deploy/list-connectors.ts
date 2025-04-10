import { glob } from "tinyglobby";
import fs from "node:fs/promises";
import { join } from "node:path";

const ROOT_DIR = join(__dirname, "..");

const IGNORE_PACKAGE_LIST = ["api", "backend", "shared"];

async function main() {
  const packages = await glob(
    ["packages/*", ...IGNORE_PACKAGE_LIST.map((name) => `!packages/${name}`)],
    {
      onlyDirectories: true,
      absolute: true,
    },
  );

  /** extract package name from package.json */
  const extractPackageInfo = async (packagePath: string) => {
    const directory = packagePath.split("/").at(-2);
    if (!directory) {
      throw new Error("Invalid package path");
    }

    const { ENV_LIST = [] }: { ENV_LIST: string[] } = await import(
      `../packages/${directory}/src/index`
    );

    const packageJson = await fs.readFile(
      `${packagePath}/package.json`,
      "utf8",
    );
    const { name }: { name: string } = JSON.parse(packageJson);
    return { name, envList: ENV_LIST };
  };

  console.log("Packages");
  console.log(packages);

  const getEnvList = async (packagePath: string): Promise<string[]> => {
    const directory = packagePath.split("/").at(-2);
    if (!directory) {
      throw new Error("Invalid package path");
    }

    const { ENV_LIST = [] }: { ENV_LIST: string[] } = await import(
      `../packages/${directory}/src/index`
    );

    return ENV_LIST;
  };

  await Promise.all(packages.map(getEnvList));

  const connectors = await Promise.all(packages.map(extractPackageInfo));

  connectors.sort((a, b) => a.name.localeCompare(b.name));

  /** get version from root package.json */
  const rootPackageJson = await fs.readFile(`${ROOT_DIR}/package.json`, "utf8");
  const { version } = JSON.parse(rootPackageJson);

  const connectorsListData = {
    connectors,
    version,
  };

  /** write package list to file */
  await fs.writeFile(
    `${ROOT_DIR}/connectors-list.json`,
    JSON.stringify(connectorsListData, null, 2),
  );
}

main().catch(console.error);
