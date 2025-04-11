import { glob } from "tinyglobby";
import fs from "node:fs/promises";
import { join } from "node:path";
import Module from 'node:module';

const ROOT_DIR = join(__dirname, "..");

const IGNORE_PACKAGE_LIST = ["api", "backend", "shared"];

// @ts-ignore
const originalLoad = Module._load;

// mocuk the module loading to prevent errors when a module is not found
// @ts-ignore
Module._load = function(path: string) {
  // mock typia
  if (path.includes("typia")) {
    // prevent mocking the typia/lib/transform module
    if(path.includes("typia/lib/transform")) {
      return originalLoad.apply(this, arguments);
    }
    console.warn(`Warning: Mock typia module`);
    return {
      createIs: () => {}
    };
  }
  try {
    return originalLoad.apply(this, arguments);
  } catch (error) {
    // ignore integral package import errors
    // @ts-ignore
    if(path.includes("@wrtnlabs")) {
      console.warn(`Warning: Module "${path}" not found. Using mock instead.`);
      return {}
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

    const packageJson = await fs.readFile(
        join(packagePath, "package.json"),
      "utf8",
    );
    const { name }: { name: string } = JSON.parse(packageJson);
    return { name, envList: ENV_LIST };
  };

  console.log("Packages");
  console.log(packages);
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

main();
