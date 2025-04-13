import { glob } from "tinyglobby";
import { join } from "node:path";
import Module from "node:module";
import fs from "fs-extra";
import type { PackageJson, RequiredDeep } from "type-fest";
import { version } from "../package.json";

const ROOT_DIR = join(__dirname, "..");

const IGNORE_PACKAGE_LIST = ["api", "backend", "shared"];

// @ts-ignore
const originalLoad = Module._load;

// mock the module loading to prevent errors when a module is not found
// @ts-ignore
Module._load = function (path: string) {
  // mock typia
  if (path.includes("typia")) {
    // prevent mocking the typia/lib/transform module
    if (path.includes("typia/lib/transform")) {
      return originalLoad.apply(this, arguments);
    }
    console.warn(`Warning: Mock typia module`);
    return {
      createIs: () => {},
    };
  }
  try {
    return originalLoad.apply(this, arguments);
  } catch (error) {
    // ignore integral package import errors
    // @ts-ignore
    if (path.includes("@wrtnlabs")) {
      console.warn(`Warning: Module "${path}" not found. Using mock instead.`);
      return {};
    }
    // mock typia
    return originalLoad.apply(this, arguments);
  }
};

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
    const { ENV_LIST = [] }: { ENV_LIST: string[] } = await import(
      join(packagePath, "src", "index.ts")
    );

    const { name } = (await fs.readJSON(
      join(packagePath, "package.json"),
    )) as RequiredDeep<Pick<PackageJson, "name">>;
    return { name, envList: ENV_LIST };
  };

  console.log("Packages");
  console.log(packages);
  const connectors = await Promise.all(packages.map(extractPackageInfo));

  connectors.sort((a, b) => a.name.localeCompare(b.name));

  const connectorsListData = {
    connectors,
    version,
  };

  /** write package list to file */
  await fs.outputJson(
    join(ROOT_DIR, "connectors-list.json"),
    connectorsListData,
    { spaces: 2 },
  );
}

main();
