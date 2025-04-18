const cp = require("child_process");
const fs = require("fs");
const path = require("path");

const { loadPackages } = require("./internal/loadPackages");

const getPackageJson = (pkgName) =>
  JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, `../packages/${pkgName}/package.json`),
      "utf8",
    ),
  );

// Topological Sort Function (Kahn's Algorithm)
const topologicalSort = (packages) => {
  const graph = new Map();
  const inDegree = new Map();

  // Initialize
  for (const name of packages) {
    graph.set(name, []);
    inDegree.set(name, 0);
  }

  // Build dependency graph
  for (const name of packages) {
    const pkgJson = getPackageJson(name);
    const deps = {
      ...pkgJson.dependencies,
      ...pkgJson.devDependencies,
    };

    for (const depName of Object.keys(deps || {})) {
      if (depName.startsWith("@wrtnlabs/connector-")) {
        const target = depName.replace("@wrtnlabs/connector-", "");
        if (packages.includes(target)) {
          graph.get(target).push(name); // target → name
          inDegree.set(name, inDegree.get(name) + 1);
        }
      }
    }
  }

  // Start from nodes with in-degree of 0
  const queue = [...packages.filter((name) => inDegree.get(name) === 0)];
  const result = [];

  while (queue.length > 0) {
    const current = queue.shift();
    result.push(current);

    for (const neighbor of graph.get(current)) {
      inDegree.set(neighbor, inDegree.get(neighbor) - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }

  if (result.length !== packages.length) {
    throw new Error("Circular dependency detected between packages.");
  }

  return result;
};

const build = ({ version, tag, name }) => {
  console.log("=========================================");
  console.log(` Publish @wrtnlabs/connector-${name}`);
  console.log("=========================================");

  const location = `${__dirname}/../packages/${name}`;

  // SDK and backend are not Published with other packages.
  if (name === "api" || name === "backend") return;

  const execute = (command) =>
    cp.execSync(command, {
      cwd: location,
      stdio: "inherit",
    });
  execute("pnpm run build:main");

  const load = () => fs.readFileSync(`${location}/package.json`, "utf8");
  const original = JSON.parse(load());
  const pack = JSON.parse(load());

  delete pack.private;
  pack.version = version;
  pack.main = "lib/index.js";
  pack.module = "lib/index.mjs";
  pack.typings = "lib/index.d.ts";

  for (const obj of [pack.dependencies ?? {}, pack.devDependencies ?? {}])
    for (const key of Object.keys(obj))
      if (key.startsWith("@wrtnlabs/connector-")) obj[key] = `^${version}`;

  try {
    fs.writeFileSync(
      `${location}/package.json`,
      JSON.stringify(pack, null, 2),
      "utf8",
    );
    execute(
      `npm publish --tag ${tag} --access public ${tag === "latest" ? "--provance" : ""}`,
    );
  } catch (exp) {
    throw exp;
  } finally {
    fs.writeFileSync(
      `${location}/package.json`,
      JSON.stringify(original, null, 2),
      "utf8",
    );
  }
};

const main = () => {
  const { version } = JSON.parse(
    fs.readFileSync(`${__dirname}/../package.json`, "utf8"),
  );
  const dev = version.includes("-dev.");

  const tag = (() => {
    const index = process.argv.indexOf("--tag");
    const value = index === -1 ? undefined : process.argv[index + 1];
    return value ?? "latest";
  })();
  if (dev === undefined)
    throw new Error("Invalid package version. Please check the package.json.");
  else if (tag === "next" && dev === false)
    throw new Error(`${tag} tag can only be used for dev versions.`);
  else if (tag === "latest" && dev === true)
    throw new Error(`latest tag can only be used for non-dev versions.`);

  cp.execSync("pnpm install", {
    cwd: `${__dirname}/../`,
    stdio: "inherit",
  });

  const packages = loadPackages();
  const sorted = topologicalSort(packages);

  console.log("📦 Publish Order:", sorted.join(" → "));

  for (const name of sorted) {
    build({
      name,
      version,
      tag,
    });
  }
};

main();
