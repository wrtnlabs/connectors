import * as fs from "fs";
import * as path from "path";
import { ArrayUtil } from "@nestia/e2e";
import { spawn } from "node:child_process";

interface AutomationConfig {
  ignoreList: string[];
}

interface ConnectorEnvMapping {
  [connectorName: string]: {
    envList: string[];
    hasFileManager: boolean;
  };
}

function getAvailableConnectors(
  packagesPath: string,
  ignoreList: string[] = [],
): string[] {
  try {
    if (!fs.existsSync(packagesPath)) {
      console.warn(`⚠️ 경로를 찾을 수 없습니다: ${packagesPath}`);
      return [];
    }

    const items = fs.readdirSync(packagesPath, { withFileTypes: true });
    const connectors = items
      .filter((item) => item.isDirectory())
      .map((item) => item.name)
      .filter((name) => !ignoreList.includes(name));

    return connectors;
  } catch (error) {
    console.error(`커넥터 목록을 가져오는 중 오류 발생:`, error);
    return [];
  }
}

async function automateAgenticaStart(
  connectorName: string,
  apiKey: string,
  connectorIndex: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const projectPath = `./test-${connectorName}`;
    const agentica = spawn("npx", ["agentica", "start"], {
      stdio: ["pipe", "pipe", "pipe"],
      shell: true,
    });

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    const sendKey = async (key: string, label?: string, ms = 800) => {
      await delay(ms);
      agentica.stdin.write(key);
      console.log(`🔹 Sent: ${label || JSON.stringify(key)}`);
    };

    const normalize = (name: string): string =>
      name.toUpperCase().replace(/[\s_\-]/g, "");

    const findConnectorIndex = (cliList: string[], pkgName: string): number => {
      console.log(cliList);
      const target = normalize(pkgName);
      return cliList.findIndex((label) => normalize(label) === target);
    };

    const runSequence = async () => {
      console.log(`🚀 자동화 시작: ${connectorName}`);

      await sendKey(`${projectPath}`, "프로젝트 경로 입력", 2000);
      await sendKey(`\r`, "Enter 입력", 1000);
      await sendKey("\r", "npm 선택", 2000);
      await sendKey("\r", "Standalone Agent Server 선택", 1000);

      await delay(1000); // 출력 기다리기

      // connectorIndex만큼 아래로 이동
      if (connectorIndex >= 0) {
        for (let i = 0; i < connectorIndex; i++) {
          await sendKey("\x1B[B", `↓ ${i + 1}`, 30);
        }
        await sendKey(" ", "스페이스 선택", 500);
        await sendKey("\r", "엔터", 500);
      } else {
        console.warn(`⚠️ 유효하지 않은 connectorIndex: ${connectorIndex}`);
      }

      await sendKey("\x1B[D", "Yes ←");
      await sendKey("\r", "Yes 선택");
      await sendKey(`${apiKey}`, "API Key 입력", 1000);
      await sendKey("\r", "Enter 입력");
      console.log("⌛ 완료 대기 중...");
    };

    agentica.stdout.on("data", (data) => {
      const text = data.toString();
      process.stdout.write(text);
    });

    agentica.stderr.on("data", (data) => {
      process.stderr.write(data.toString());
    });

    agentica.on("close", (code) => {
      if (code === 0) {
        console.log("✅ Agentica 프로젝트 생성 완료!");
        resolve();
      } else {
        console.error(`❌ 종료 코드 ${code}`);
        reject(new Error("Agentica 자동화 실패"));
      }
    });

    agentica.on("spawn", () => {
      runSequence();
    });

    agentica.on("error", (err) => {
      console.error(`[ERROR] ${err.message}`);
      reject(err);
    });
  });
}

function runNpmCommand(command: string, cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn("npm", command.split(" "), {
      cwd,
      shell: true,
      stdio: "pipe",
    });

    let output = "";
    proc.stdout.on("data", (data) => (output += data.toString()));
    proc.stderr.on("data", (data) => (output += data.toString()));

    proc.on("close", (code) => {
      if (code === 0) resolve(output);
      else
        reject(new Error(`npm ${command} failed with code ${code}\n${output}`));
    });
  });
}

function extractServiceInfo(
  connectorName: string,
  sourceDir: string,
): { envList: string[]; hasFileManager: boolean } {
  try {
    const srcDir = path.join(sourceDir, connectorName, "src"); // 예: ../../packages/my-connector/src
    if (!fs.existsSync(srcDir)) {
      console.warn(`⚠️ 소스 디렉토리를 찾을 수 없습니다: ${srcDir}`);
      return { envList: [], hasFileManager: false };
    }

    let envList: string[] = [];
    let hasFileManager = false;

    // 1. ENV_LIST 찾기 (기존 로직 유지 - src/structures 에서 찾음)
    const structuresDir = path.join(srcDir, "structures");
    if (fs.existsSync(structuresDir)) {
      const structureFiles = fs
        .readdirSync(structuresDir)
        .filter((file) => file.endsWith(".ts"));

      for (const file of structureFiles) {
        const filePath = path.join(structuresDir, file);
        const content = fs.readFileSync(filePath, "utf8");
        const envListMatch = content.match(
          /export\s+const\s+ENV_LIST\s*=\s*\[([\s\S]*?)\]/,
        );
        if (envListMatch) {
          const envListStr = envListMatch[1];
          const envVarMatches = envListStr.match(/'([^']+)'|"([^"]+)"/g);
          if (envVarMatches) {
            envList = envVarMatches.map((match) => match.replace(/['"]/g, ""));
            console.log(
              `[${connectorName}] Found ENV_LIST in ${filePath}:`,
              envList,
            );
            break;
          }
        }
      }
    } else {
      console.log(
        `[${connectorName}] structures 디렉토리가 없습니다: ${structuresDir}`,
      );
    }

    // 2. 서비스 클래스에서 fileManager 확인 (경로 수정됨)
    // 예: ../../packages/my-connector/src/my-connector
    const connectorSpecificSourceDir = path.join(srcDir, connectorName);

    if (!fs.existsSync(connectorSpecificSourceDir)) {
      console.warn(
        `⚠️ 커넥터별 소스 디렉토리를 찾을 수 없습니다: ${connectorSpecificSourceDir}`,
      );
      // ENV_LIST는 찾았을 수 있으므로, 현재까지 찾은 정보 반환
      return { envList, hasFileManager };
    }

    // connectorSpecificSourceDir 안에서 *Service.ts 파일을 찾음
    const serviceFiles = fs
      .readdirSync(connectorSpecificSourceDir)
      .filter((file) => file.endsWith(".ts") && file.includes("Service"));

    for (const file of serviceFiles) {
      const filePath = path.join(connectorSpecificSourceDir, file); // 경로 수정
      const content = fs.readFileSync(filePath, "utf8");

      const constructorMatch = content.match(/constructor\s*\([^{]*\)/s);
      if (constructorMatch) {
        if (connectorName.includes("s3")) return { envList, hasFileManager }; // S3 커넥터는 FileManager 필요 없음

        const constructorParams = constructorMatch[0];
        console.log(
          `[${connectorName}] Found constructor in ${filePath}: ${constructorParams}`,
        );

        if (
          /fileManager\s*:/i.test(constructorParams) ||
          /FileManager\b/.test(constructorParams) ||
          /AwsS3Service\b/.test(constructorParams)
        ) {
          hasFileManager = true;
          console.log(
            `[${connectorName}] Found fileManager in constructor: ${filePath}`,
          );
          break; // FileManager를 찾으면 더 이상 다른 서비스 파일은 볼 필요 없음
        }
      }
    }

    return { envList, hasFileManager };
  } catch (error) {
    console.error(`[${connectorName}] 서비스 정보 추출 중 오류 발생:`, error);
    return { envList: [], hasFileManager: false };
  }
}

// Helper function to convert SNAKE_CASE to camelCase
function toCamelCase(str: string): string {
  return str.toLowerCase().replace(/_([a-z])/g, (_, p1) => p1.toUpperCase());
}

async function updateServiceFileWithEnvVars(
  projectDir: string,
  envVars: string[],
  hasFileManager: boolean,
): Promise<void> {
  const indexPath = path.join(projectDir, "src", "index.ts");

  try {
    if (!fs.existsSync(indexPath)) {
      console.error(`❌ index.ts 파일을 찾을 수 없습니다: ${indexPath}`);
      return;
    }

    let content = fs.readFileSync(indexPath, "utf8");
    let serviceName = ""; // 찾은 서비스 클래스 이름 저장

    // 정규 표현식 수정: execute: new ServiceName() 부분을 찾고 ServiceName을 캡처
    const constructorRegex =
      /(\bexecute\s*:\s*new\s+)(\w+Service)(\s*\(\s*\))/g;
    const match = constructorRegex.exec(content);

    if (!match) {
      console.warn(
        `⚠️ ${indexPath} 파일에서 'execute: new ...Service()' 패턴을 찾을 수 없습니다.`,
      );
      // 파일 구조가 예상과 다를 수 있음. 추가적인 패턴 검색이나 로직 필요 가능성.
      // 예를 들어, 생성자가 이미 인자를 가지고 있을 경우를 대비한 다른 정규식
      const existingArgsRegex =
        /(\bexecute\s*:\s*new\s+)(\w+Service)(\s*\([^)]*\))/g;
      const existingMatch = existingArgsRegex.exec(content);
      if (existingMatch) {
        console.log(
          "ℹ️ 이미 인자가 있는 생성자 패턴이 발견되었습니다. 업데이트를 시도합니다.",
        );
        serviceName = existingMatch[2]; // 서비스 이름 추출
        // 이미 인자가 있는 경우, 덮어쓰기 또는 병합 로직 필요 (여기서는 덮어쓰기로 가정)
        // 이 부분은 더 복잡한 로직이 필요할 수 있습니다. 일단 간단한 케이스만 처리
      } else {
        return; // 일치하는 패턴 없음
      }
    } else {
      serviceName = match[2]; // 매치된 그룹에서 서비스 이름 추출 (예: "ArxivSearchService")
    }

    console.log(`ℹ️ 대상 서비스 감지: ${serviceName}`);

    // 1. 기본 서비스의 props 객체 생성
    let servicePropsStr = ""; // 기본값: 환경변수 없을 시 공백
    if (envVars.length > 0) {
      servicePropsStr = "{\n";
      envVars.forEach((envVar) => {
        const camelCaseKey = toCamelCase(envVar);
        // process.env 값이 없을 경우를 대비해 undefined 또는 '' 처리 추가 가능
        servicePropsStr += `      ${camelCaseKey}: process.env.${envVar}!,\n`;
      });
      servicePropsStr += "    }";
    }

    // 2. 최종 생성자 문자열 조합
    let newConstructorArgs = "";
    if (hasFileManager) {
      // AwsS3Service에 필요한 환경 변수 정의 (표준 AWS SDK 변수 사용 가정)
      const awsEnvVars = [
        "AWS_ACCESS_KEY_ID",
        "AWS_SECRET_ACCESS_KEY",
        "AWS_S3_BUCKET",
        "AWS_S3_REGION", // 필요에 따라 추가/제외
      ];
      let awsPropsStr = "{\n";
      awsEnvVars.forEach((envVar) => {
        const camelCaseKey = toCamelCase(envVar);
        // 실제로는 process.env 값 확인 및 기본값 설정 등이 필요할 수 있음
        awsPropsStr += `      ${camelCaseKey}: process.env.${envVar}!,\n`;
      });
      awsPropsStr += "    }";

      newConstructorArgs = `(${servicePropsStr}, new AwsS3Service(${awsPropsStr}))`; // 인자 2개

      // AwsS3Service import 추가 (이미 있는지 확인)
      if (!content.includes("AwsS3Service")) {
        // @wrtnlabs/connector-aws-s3 설치
        console.log(
          `🛠️  ${projectDir} 에 @wrtnlabs/connector-aws-s3 설치 중...`,
        );
        try {
          await runNpmCommand("install @wrtnlabs/connector-aws-s3", projectDir);
          console.log("✅ @wrtnlabs/connector-aws-s3 설치 완료");
        } catch (installError) {
          console.error(
            "❌ @wrtnlabs/connector-aws-s3 설치 실패:",
            installError,
          );
          // 설치 실패 시 진행이 어려울 수 있으므로 에러 throw 또는 반환 고려
          throw installError;
        }

        // import 구문 추가 (파일 상단에 추가하는 것이 일반적)
        const importLine = `import { AwsS3Service } from "@wrtnlabs/connector-aws-s3";\n`;
        // 기존 import 구문들 아래에 추가하거나, 파일 최상단에 추가
        // 간단하게 파일 시작 부분에 추가
        if (!content.startsWith(importLine)) {
          content = importLine + content;
        }
      }
    } else {
      // FileManager가 없을 경우, 서비스 props만 인자로 전달
      newConstructorArgs = `(${servicePropsStr})`;
    }

    // 3. 파일 내용 교체
    // 기존 정규식을 사용하여 교체 (match가 null 이 아닐 때)
    // 또는 existingMatch가 null이 아닐 때 해당 패턴으로 교체
    const regexToUse = match
      ? constructorRegex
      : /(\bexecute\s*:\s*new\s+)(\w+Service)(\s*\([^)]*\))/g;
    const replacementString = `$1${serviceName}${newConstructorArgs}`; // 그룹 참조 사용

    // 정규식의 global flag(g) 때문에 exec 후 lastIndex가 변경되므로, replace 전에 reset 또는 새로 생성
    const finalRegex = new RegExp(regexToUse.source, "g"); // global flag 유지하며 재생성

    content = content.replace(finalRegex, replacementString);

    // 4. 수정된 내용 파일에 쓰기
    fs.writeFileSync(indexPath, content, "utf8");
    console.log(`✅ ${indexPath} 파일 업데이트 완료.`);
  } catch (error) {
    console.error(`❌ ${indexPath} 파일 업데이트 중 오류 발생:`, error);
    // 오류 발생 시 re-throw 하여 main 함수에서 인지하도록 할 수 있음
    throw error;
  }
}

async function validateNpmStart(
  connector: string,
  projectDir: string,
): Promise<void> {
  console.log("--------NPM START VALIDATION--------");
  console.log(`📦 ${connector} - npm install 시작`);
  await runNpmCommand("install", projectDir);
  console.log(`✅ ${connector} - npm install 완료`);

  console.log(`🛠️ ${connector} - npm run build 시작`);
  await runNpmCommand("run build", projectDir);
  console.log(`✅ ${connector} - npm run build 완료`);

  console.log(`▶️ ${connector} - npm run start 시작`);
  const startOutput = await runNpmCommand("run start", projectDir);
  console.log(`✅ ${connector} - npm run start 완료`);
  console.log(`npm run start 출력: ${startOutput}`);
}

async function main() {
  const args = process.argv.slice(2);
  const ignoreList = args[1]
    ? args[1].split(",").concat(["api", "shared", "backend"])
    : ["api", "shared", "backend"];

  const config: AutomationConfig = {
    ignoreList,
  };

  const packagesPath = path.resolve("../../packages");
  const availableConnectors = getAvailableConnectors(
    packagesPath,
    config.ignoreList,
  );

  if (availableConnectors.length === 0) {
    console.error("❌ 사용 가능한 커넥터가 없습니다.");
    return;
  }

  console.log("사용 가능한 커넥터 목록:");
  availableConnectors.forEach((connector, index) => {
    console.log(`${index + 1}. ${connector}`);
  });

  // Extract information about each connector's service
  const connectorInfo: ConnectorEnvMapping = {};
  availableConnectors.forEach((connector) => {
    const info = extractServiceInfo(connector, packagesPath);
    connectorInfo[connector] = info;
    console.log(`🔍 ${connector} 환경 변수 목록:`, info.envList);
    console.log(`🔍 ${connector} FileManager 필요:`, info.hasFileManager);
  });

  await ArrayUtil.asyncMap(availableConnectors)(async (connector, i) => {
    try {
      // 커넥터별로 프로젝트 생성
      await automateAgenticaStart(
        connector,
        process.env.OPENAI_API_KEY || "",
        i,
      );
      console.log(`✅ ${connector} 프로젝트 생성 완료`);

      const projectDir = path.resolve(`./test-${connector}`);
      const envFilePath = path.join(projectDir, ".env"); // .env 파일 경로

      // 필요한 환경 변수와 FileManager 정보 가져오기
      const { envList, hasFileManager } = connectorInfo[connector] || {
        envList: [],
        hasFileManager: false,
      };

      // 환경 변수 설정을 위한 .env 파일 생성
      const requiredEnvVars = new Set<string>([...envList]);
      if (hasFileManager) {
        const awsVars = [
          "AWS_ACCESS_KEY_ID",
          "AWS_SECRET_ACCESS_KEY",
          "AWS_REGION",
          "AWS_S3_BUCKET",
        ];
        awsVars.forEach((v) => requiredEnvVars.add(v));
      }

      // 2. 기존 .env 파일 읽기 및 기존 키 추출
      let existingContent = "";
      const existingKeys = new Set<string>();

      // .env 파일이 존재하는지 확인하고 읽기 (없으면 빈 내용으로 시작)
      if (fs.existsSync(envFilePath)) {
        existingContent = fs.readFileSync(envFilePath, "utf8");
        existingContent.split("\n").forEach((line) => {
          const trimmedLine = line.trim();
          if (trimmedLine && !trimmedLine.startsWith("#")) {
            const key = trimmedLine.split("=")[0]?.trim();
            if (key) {
              existingKeys.add(key);
            }
          }
        });
        console.log(
          `[${connector}] 기존 .env 파일 로드 완료. 감지된 키:`,
          Array.from(existingKeys),
        );
      } else {
        console.warn(
          `[${connector}] .env 파일(${envFilePath})을 찾을 수 없습니다. 새로 생성합니다.`,
        );
      }

      // 3. 기존에 없는 변수만 필터링하여 추가할 내용 생성
      let contentToAppend = "";
      requiredEnvVars.forEach((envVar) => {
        if (!existingKeys.has(envVar)) {
          // 기존 키 목록에 없으면 추가할 내용에 포함
          contentToAppend += `${envVar}=PLACEHOLDER_VALUE_FOR_${envVar}\n`;
        } else {
          console.log(
            `[${connector}] .env에 이미 존재하는 변수 (추가 안 함): ${envVar}`,
          );
        }
      });

      // 4. 추가할 내용이 있으면 파일에 바로 append
      if (contentToAppend) {
        // 기존 내용 끝에 개행 문자가 없으면 추가
        if (existingContent && !existingContent.endsWith("\n")) {
          existingContent += "\n";
        }
        // 기존 내용 + 추가할 내용을 파일에 쓰기
        fs.writeFileSync(
          envFilePath,
          existingContent + contentToAppend,
          "utf8",
        );
        console.log(`✅ ${connector} .env 파일 업데이트 (내용 추가) 완료.`);
      } else {
        console.log(`ℹ️ ${connector} .env 파일에 새로 추가할 변수가 없습니다.`);
      }

      // 서비스 파일 업데이트
      await updateServiceFileWithEnvVars(projectDir, envList, hasFileManager);

      // 실제 실행 테스트
      await validateNpmStart(connector, projectDir);
    } catch (error) {
      console.error(`⚠️ ${connector} 테스트 중 오류 발생:`, error);
    }
  });

  console.log("✅ 모든 커넥터 테스트가 완료되었습니다!");
}

main().catch((error) => {
  console.error("메인 실행 중 오류 발생:", error);
});
