import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

/**
 * packages 폴더 내의 모든 패키지 폴더에 들어가서
 * pnpm run build && pnpm run test를 실행하는 함수
 */
async function buildAndTestPackages() {
  const packagesDir = path.resolve("./");
  const originalDir = process.cwd();

  try {
    // packages 디렉토리 내의 모든 폴더 조회
    const packageDirs = fs
      .readdirSync(packagesDir)
      .filter((dir) => fs.statSync(path.join(packagesDir, dir)).isDirectory());

    console.log(`Found ${packageDirs.length} package directories`);

    // 성공 및 실패한 패키지 추적
    const results: {
      success: string[];
      failed: string[];
    } = {
      success: [],
      failed: [],
    };

    for (const dir of packageDirs) {
      const packageDir = path.join(packagesDir, dir);
      const packageJsonPath = path.join(packageDir, "package.json");

      // package.json 파일이 존재하는지 확인
      if (!fs.existsSync(packageJsonPath)) {
        console.log(`No package.json found in ${dir}, skipping...`);
        continue;
      }

      console.log(`\n==== Processing ${dir} ====`);

      try {
        // 패키지 디렉토리로 이동
        process.chdir(packageDir);
        console.log(`Changed directory to: ${packageDir}`);

        // pnpm run build && pnpm run test 실행
        console.log(`Running build and test for ${dir}...`);
        execSync("pnpm run build && pnpm run test", { stdio: "inherit" });

        // 성공 기록
        results.success.push(dir);
        console.log(`\n✅ Successfully built and tested ${dir}`);
      } catch (err: unknown) {
        // 실패 기록
        results.failed.push(dir);
        console.error(
          `\n❌ Failed to build and test ${dir}:`,
          err instanceof Error ? err.message : String(err),
        );
      } finally {
        // 원래 디렉토리로 복귀
        process.chdir(originalDir);
      }
    }

    // 결과 요약 출력
    console.log("\n==== Build and Test Summary ====");
    console.log(`Total packages: ${packageDirs.length}`);
    console.log(`Successful: ${results.success.length}`);
    console.log(`Failed: ${results.failed.length}`);

    if (results.success.length > 0) {
      console.log("\nSuccessful packages:");
      results.success.forEach((pkg, index) => {
        console.log(`  ${index + 1}. ${pkg}`);
      });
    }

    if (results.failed.length > 0) {
      console.log("\nFailed packages:");
      results.failed.forEach((pkg, index) => {
        console.log(`  ${index + 1}. ${pkg}`);
      });
      process.exit(1);
    }
  } catch (err) {
    console.error("Error accessing packages directory:", err);
    process.exit(1);
  }
}

// 함수 실행
buildAndTestPackages().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
