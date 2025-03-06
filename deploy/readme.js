// const fs = require("fs");
// const path = require("path");
// const { loadPackages } = require("./internal/loadPackages");

// const TEMPLATE_PATH = path.join(__dirname, "internal/README-template.md");

// // PascalCase로 변환하는 함수
// function toPascalCase(str) {
//   return str
//     .split("_") // snake_case -> PascalCase (underscore를 기준으로 split)
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // 첫 문자 대문자, 나머지 소문자
//     .join("");
// }

// // kebab-case로 변환하는 함수
// function toKebabCase(str) {
//   return str.toLowerCase().replace(/_/g, "-"); // snake_case -> kebab-case (underscore를 하이픈으로 변환)
// }

// function generateReadme(packageName) {
//   const baseName = packageName.replace("@wrtnlabs/connector-", "");

//   // PascalCase와 kebab-case 변환
//   const serviceClass = toPascalCase(baseName) + "Service"; // PascalCase로 변환
//   const connectorName = baseName.replace(/-/g, " "); // 공백으로 연결된 케밥 케이스
//   const kebabCaseBaseName = toKebabCase(baseName); // kebab-case로 변환

//   if (!fs.existsSync(TEMPLATE_PATH)) {
//     console.error("README-template.md not found!");
//     process.exit(1);
//   }

//   let content = fs.readFileSync(TEMPLATE_PATH, "utf8");

//   const replacements = [
//     { pattern: /@wrtnlabs\/connector-[a-z0-9-]+/g, replacement: packageName },
//     { pattern: /[A-Za-z0-9]+Service/g, replacement: serviceClass },
//     {
//       pattern: /"[A-Za-z0-9 ]+ Connector"/g,
//       replacement: `"${connectorName} Connector"`,
//     },
//     { pattern: /AWS S3/g, replacement: connectorName }, // 예시로 AWS S3 부분을 동적으로 바꿈
//     {
//       pattern:
//         /import { [A-Za-z0-9]+Service } from "@wrtnlabs\/connector-[a-z0-9-]+";/g,
//       replacement: `import { ${serviceClass} } from "@wrtnlabs/connector-${kebabCaseBaseName}";`,
//     },
//     {
//       pattern: /typia\.llm\.application<[A-Za-z0-9]+Service, "chatgpt">\(\)/g,
//       replacement: `typia.llm.application<${serviceClass}, "chatgpt">()`,
//     },
//   ];

//   // 교체 작업 실행
//   replacements.forEach(({ pattern, replacement }) => {
//     content = content.replace(pattern, replacement);
//   });

//   const readmePath = path.join(__dirname, `../packages/${baseName}/README.md`);
//   fs.writeFileSync(readmePath, content, "utf8");
//   console.log(`Generated README: ${readmePath}`);
// }

// function main() {
//   loadPackages().forEach((pkg) => generateReadme(`@wrtnlabs/connector-${pkg}`));
// }

// main();

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
