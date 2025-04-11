import { writeFileSync } from "fs";
import path from "path";
import * as NESTIA_CONFIG from "../../nestia.config";

const main = async (): Promise<void> => {
  const outputs = NESTIA_CONFIG.default
    .slice(1)
    .map((el) => el.swagger?.output)
    .filter((output) => output !== undefined)
    .map((filename) => {
      return filename.replace(
        /^packages\/api\/connectors/g,
        "https://wrtnio.github.io/connectors/swagger/connectors",
      );
    });

  writeFileSync(
    path.join(__dirname, "../../packages/api/connectors/index.json"),
    JSON.stringify(outputs ?? []),
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
