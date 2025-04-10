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

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

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
    const projectPath = `./agentica-test/test-${connectorName}`;
    const agentica = spawn("npx", ["agentica", "start"], {
      stdio: ["pipe", "pipe", "pipe"],
      shell: true,
    });
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

      await delay(3000);
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
    // 1. 경로 설정
    const connectorPackageDir = path.join(sourceDir, connectorName);
    const srcDir = path.join(connectorPackageDir, "src");
    const structuresDir = path.join(srcDir, "structures");

    // 2. structures 디렉토리 존재 확인
    if (!fs.existsSync(structuresDir)) {
      console.log(
        `[${connectorName}] structures 디렉토리가 없습니다: ${structuresDir}. ENV_LIST 및 FileManager 확인 불가.`,
      );
      return { envList: [], hasFileManager: false };
    }

    let envList: string[] = [];
    let hasFileManager = false;
    let foundEnvList = false;
    let alreadyCheckedFileManager = false;

    // 3. structures 디렉토리 내의 .ts 파일 탐색
    const structureFiles = fs
      .readdirSync(structuresDir)
      .filter((file) => file.endsWith(".ts"));

    console.log(
      `[${connectorName}] Searching in ${structuresDir} for ENV_LIST and IProps...`,
    );

    for (const file of structureFiles) {
      // 최적화: 모든 정보를 이미 찾았으면 루프 종료
      if (foundEnvList && alreadyCheckedFileManager) {
        console.log(
          `[${connectorName}] Found both ENV_LIST and confirmed FileManager status. Stopping search.`,
        );
        break;
      }

      const filePath = path.join(structuresDir, file);
      try {
        const content = fs.readFileSync(filePath, "utf8");

        // 3.1 ENV_LIST 찾기 (아직 못 찾은 경우)
        if (!foundEnvList) {
          const envListMatch = content.match(
            /export\s+const\s+ENV_LIST\s*=\s*\[([\s\S]*?)\]/,
          );
          if (envListMatch) {
            const envListStr = envListMatch[1];
            const envVarMatches = envListStr.match(/'([^']+)'|"([^"]+)"/g);
            if (envVarMatches) {
              envList = envVarMatches.map((match) =>
                match.replace(/['"]/g, ""),
              );
              console.log(
                `[${connectorName}] Found ENV_LIST in ${filePath}:`,
                envList,
              );
              foundEnvList = true; // 찾았음을 표시
            }
          }
        }

        // 3.2 IProps 정의 및 내부 FileManager 타입 확인 (아직 확인 안 한 경우)
        if (!alreadyCheckedFileManager) {
          // *** 수정된 정규식 ***
          // 'export type IProps =' 다음부터 세미콜론(;)까지의 모든 내용을 캡처
          // 여러 줄에 걸쳐 정의될 수 있으므로 [\s\S]+ 사용
          const iPropsMatch = content.match(
            /export\s+type\s+IProps\s*=\s*([\s\S]+?);/,
          );

          if (iPropsMatch) {
            console.log(
              `[${connectorName}] Found IProps definition in ${filePath}`,
            );
            const propsDefinition = iPropsMatch[1].trim(); // 타입 정의 전체 내용 (캡처 그룹 1)

            // 타입 정의 전체 내용에서 'FileManager' 라는 단어(타입)가 있는지 확인
            if (/\bFileManager\b/.test(propsDefinition)) {
              if (connectorName.includes("s3")) {
                console.log(
                  `[${connectorName}] Ignoring FileManager found in IProps for s3 connector itself.`,
                );
                // S3 자체는 FileManager를 사용하지 않는 것으로 간주하므로, hasFileManager는 false 유지
              } else {
                console.log(
                  `[${connectorName}] Found 'FileManager' type within IProps definition in ${filePath}`,
                );
                hasFileManager = true; // FileManager 사용 확인됨
              }
            } else {
              console.log(
                `[${connectorName}] IProps found in ${filePath}, but 'FileManager' type was not detected within the definition.`,
              );
            }
            // IProps 정의를 찾아서 FileManager 사용 여부를 판단했으므로, 더 이상 IProps를 찾을 필요 없음
            alreadyCheckedFileManager = true;
          }
        }
      } catch (readError) {
        console.error(
          `[${connectorName}] 파일 읽기 오류 ${filePath}:`,
          readError,
        );
      }
    } // end of for loop

    // 4. 결과 반환 전 최종 로그
    if (!foundEnvList) {
      console.log(`[${connectorName}] ENV_LIST not found in ${structuresDir}`);
    }
    if (!alreadyCheckedFileManager) {
      // IProps 정의 자체를 못 찾은 경우
      console.log(
        `[${connectorName}] IProps definition not found in any file within ${structuresDir}`,
      );
    } else if (!hasFileManager && !connectorName.includes("s3")) {
      // IProps는 찾았지만 FileManager가 없는 경우 (s3 제외)
      console.log(
        `[${connectorName}] FileManager type was not found within the IProps definition.`,
      );
    }

    return { envList, hasFileManager };
  } catch (error) {
    console.error(`[${connectorName}] 서비스 정보 추출 중 오류 발생:`, error);
    return { envList: [], hasFileManager: false };
  }
}

// --- 이전에 Service 파일 생성자를 확인하던 로직은 제거됨 ---

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

    // 정규 표현식 수정: execute: new ServiceName(...) 부분을 찾고 ServiceName을 캡처
    // 생성자 인자가 없거나, 하나 이상 있는 경우 모두 포함
    const constructorRegex =
      /(\bexecute\s*:\s*new\s+)(\w+Service)(\s*\([^)]*\))/g; // global flag 유지
    const match = constructorRegex.exec(content); // 첫 번째 매치 찾기

    if (!match) {
      console.warn(
        `⚠️ ${indexPath} 파일에서 'execute: new ...Service(...)' 패턴을 찾을 수 없습니다.`,
      );
      return; // 일치하는 패턴 없음
    }

    serviceName = match[2]; // 매치된 그룹에서 서비스 이름 추출 (예: "StableDiffusionBetaService")
    const originalConstructorCall = match[0]; // 원본 생성자 호출 부분 저장 (예: "execute: new StableDiffusionBetaService()")
    console.log(`ℹ️ 대상 서비스 감지: ${serviceName}`);
    console.log(`ℹ️ 원본 생성자 호출: ${originalConstructorCall}`);

    // --- AWS S3 Service 처리 (필요한 경우) ---
    let awsPropsStr = "";
    if (hasFileManager) {
      const awsEnvVars = [
        "AWS_ACCESS_KEY_ID",
        "AWS_SECRET_ACCESS_KEY",
        "AWS_S3_BUCKET",
        "AWS_S3_REGION",
      ];
      awsPropsStr = "{\n"; // 여기서 awsPropsStr 초기화
      awsEnvVars.forEach((envVar) => {
        const camelCaseKey = toCamelCase(envVar);
        awsPropsStr += `        ${camelCaseKey}: process.env.${envVar}!,\n`;
      });
      awsPropsStr += "      }"; // 들여쓰기 조정

      // AwsS3Service import 및 패키지 설치 확인
      if (!content.includes("AwsS3Service")) {
        console.log(
          `🛠️  ${projectDir} 에 @wrtnlabs/connector-aws-s3 설치 중...`,
        );
        try {
          await runNpmCommand("install @wrtnlabs/connector-aws-s3", projectDir);
          console.log("✅ @wrtnlabs/connector-aws-s3 설치 완료");

          const importLine = `import { AwsS3Service } from "@wrtnlabs/connector-aws-s3";\n`;
          if (!content.includes(importLine)) {
            const importMatches = content.match(/^import\s+.*;?$/gm);
            if (importMatches && importMatches.length > 0) {
              const lastImportStatement =
                importMatches[importMatches.length - 1];
              const lastImportEndIndex =
                content.lastIndexOf(lastImportStatement) +
                lastImportStatement.length;
              content =
                content.slice(0, lastImportEndIndex) +
                "\n" +
                importLine +
                content.slice(lastImportEndIndex);
              console.log(
                `ℹ️ ${indexPath}에 AwsS3Service import 구문 추가됨 (기존 import 뒤).`,
              );
            } else {
              content = importLine + content;
              console.log(
                `ℹ️ ${indexPath}에 AwsS3Service import 구문 추가됨 (파일 상단).`,
              );
            }
          }
        } catch (installError) {
          console.error(
            "❌ @wrtnlabs/connector-aws-s3 설치 실패:",
            installError,
          );
          throw installError; // 설치 실패 시 중단
        }
      }
    }
    // --- AWS S3 Service 처리 끝 ---

    // *** 수정된 로직: 생성자 인자 결정 ***
    let newConstructorArgs: string;
    const needsProps = envVars.length > 0 || hasFileManager; // props 객체가 필요한지 여부 결정

    if (needsProps) {
      // 환경 변수나 파일 매니저가 필요하면 props 객체 생성
      let servicePropsStr = "{\n"; // 객체 시작

      // 1.1 기본 환경 변수 추가
      envVars.forEach((envVar) => {
        const camelCaseKey = toCamelCase(envVar);
        servicePropsStr += `      ${camelCaseKey}: process.env.${envVar}!,\n`;
      });

      // 1.2 FileManager 추가 (필요한 경우)
      if (hasFileManager) {
        servicePropsStr += `      fileManager: new AwsS3Service(${awsPropsStr}),\n`;
      }

      servicePropsStr += "    }"; // props 객체 닫기
      newConstructorArgs = `(${servicePropsStr})`; // 최종 생성자 인자 문자열 (괄호 포함)
    } else {
      // 환경 변수도 없고 파일 매니저도 필요 없으면 빈 괄호 사용
      newConstructorArgs = "()";
    }
    // *** 생성자 인자 결정 로직 끝 ***

    // 3. 파일 내용 교체
    // 원본 생성자 호출 부분을 정확히 타겟하여 교체 (정규식 재사용 대신 문자열 교체)
    // 주의: 이 방식은 해당 라인에 동일한 new ServiceName(...) 호출이 여러 번 있으면 문제가 될 수 있음
    // 하지만 execute: new ... 형태는 보통 하나만 존재하므로 괜찮을 가능성이 높음
    const replacementString = `execute: new ${serviceName}${newConstructorArgs}`; // 교체될 전체 문자열 생성

    // 정규 표현식을 다시 사용하여 정확한 위치를 찾아 교체 (더 안전한 방법)
    // global flag(g) 때문에 lastIndex가 변경되었으므로 새로 생성하거나 lastIndex 리셋 필요
    constructorRegex.lastIndex = 0; // lastIndex 리셋
    content = content.replace(
      constructorRegex,
      (fullMatch, prefix, svcName, oldArgs) => {
        // 정규식으로 찾은 서비스 이름이 현재 처리 중인 서비스 이름과 같은지 확인
        if (svcName === serviceName) {
          // 동일하면 계산된 newConstructorArgs로 교체
          return `${prefix}${svcName}${newConstructorArgs}`;
        }
        // 다른 서비스 생성자 호출이면 그대로 둠
        return fullMatch;
      },
    );

    // 4. 수정된 내용 파일에 쓰기
    fs.writeFileSync(indexPath, content, "utf8");
    console.log(
      `✅ ${indexPath} 파일 업데이트 완료. 생성자 호출: ${replacementString}`,
    );
  } catch (error) {
    console.error(`❌ ${indexPath} 파일 업데이트 중 오류 발생:`, error);
    throw error; // 오류 발생 시 re-throw
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

const rmdir = async (str: string) => {
  try {
    await fs.promises.rm(str, { recursive: true });
  } catch {}
};

async function main() {
  await rmdir(path.resolve("./agentica-test"));
  console.log("agentica-test 디렉토리 삭제 완료");

  const args = process.argv.slice(2);
  const ignoreList = args[1]
    ? args[1]
        .split(",")
        .concat([
          "api",
          "shared",
          "backend",
          "dall_e_3",
          "daum_blog",
          "daum_cafe",
          "hancell",
          "imweb",
          "kakao_map",
          "kakao_navi",
          "kakao_talk",
          "korea_eximbank",
          "naver_blog",
          "naver_cafe",
          "naver_news",
          "sweet_tracker",
        ])
    : [
        "api",
        "shared",
        "backend",
        "dall_e_3",
        "daum_blog",
        "daum_cafe",
        "hancell",
        "imweb",
        "kakao_map",
        "kakao_navi",
        "kakao_talk",
        "korea_eximbank",
        "naver_blog",
        "naver_cafe",
        "naver_news",
        "sweet_tracker",
      ];

  const config: AutomationConfig = {
    ignoreList,
  };

  const packagesPath = path.resolve(__dirname, "../../packages");
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
        process.env.OPENAI_API_KEY ?? "",
        i,
      );
      console.log(`✅ ${connector} 프로젝트 생성 완료`);

      const projectDir = path.resolve(`./agentica-test/test-${connector}`);
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
      await delay(2000);
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
