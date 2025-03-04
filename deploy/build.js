const cp = require("child_process");

const { loadPackages } = require("./internal/loadPackages");

const build = (name) => {
  console.log("=========================================");
  console.log(` Build @wrtnlabs/connector-${name}`);
  console.log("=========================================");

  // SDK and backend are not Published with other packages.
  if (name === "api" || name === "backend") {
    return;
  }

  const cwd = `${__dirname}/../packages/${name}`;
  const execute = (command) =>
    cp.execSync(command, {
      cwd,
      stdio: "inherit",
    });
  execute(`pnpm install --filter .`);
  execute("pnpm run build:main");
};

const main = () => {
  // cp.execSync("pnpm install", {
  //   cwd: `${__dirname}/../`,
  //   stdio: "inherit",
  // });
  loadPackages().forEach(build);
};
main();
