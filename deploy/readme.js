const fs = require("fs");
const path = require("path");
const { loadPackages } = require("./internal/loadPackages");

const TEMPLATE_PATH = path.join(__dirname, "internal/README-template.md");

function toPascalCase(str) {
  return str
    .split("_") // snake_case -> PascalCase (split by underscore)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

function toKebabCase(str) {
  return str.toLowerCase().replace(/_/g, "-"); // snake_case -> kebab-case
}

function generateReadme(packageName) {
  const baseName = packageName.replace("@wrtnlabs/connector-", "");

  if (baseName === "api" || baseName === "backend" || baseName === "shared") {
    return;
  }

  const serviceClass = toPascalCase(baseName) + "Service"; // Convert to PascalCase
  const connectorName = toPascalCase(baseName.replace(/_/g, " "));
  const kebabCaseBaseName = toKebabCase(baseName); // Convert to kebab-case

  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error("README-template.md not found!");
    process.exit(1);
  }

  let content = fs.readFileSync(TEMPLATE_PATH, "utf8");

  const replacements = [
    { pattern: /@wrtnlabs\/connector-[a-z0-9-]+/g, replacement: packageName },
    { pattern: /[A-Za-z0-9]+Service/g, replacement: serviceClass },
    {
      pattern: /"[A-Za-z0-9 ]+ Connector"/g,
      replacement: `"${connectorName} Connector"`,
    },
    { pattern: /AWS S3/g, replacement: connectorName },
    {
      pattern: /@wrtnlabs\/connector-[a-z0-9-_]+/g,
      replacement: `@wrtnlabs/connector-${kebabCaseBaseName}`,
    },
    {
      pattern: /typia\.llm\.application<[A-Za-z0-9]+Service, "chatgpt">\(\)/g,
      replacement: `typia.llm.application<${serviceClass}, "chatgpt">()`,
    },
  ];

  replacements.forEach(({ pattern, replacement }) => {
    content = content.replace(pattern, replacement);
  });

  const readmePath = path.join(__dirname, `../packages/${baseName}/README.md`);
  fs.writeFileSync(readmePath, content, "utf8");
  console.log(`Generated README: ${readmePath}`);
}

function main() {
  loadPackages().forEach((pkg) => generateReadme(`@wrtnlabs/connector-${pkg}`));
}

main();
