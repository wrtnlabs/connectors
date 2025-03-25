import typia from "typia";
import { HwpService, IHwpService } from "@wrtnlabs/connector-hwp";
import { TestGlobal } from "../TestGlobal";

export const test_hwp = async () => {
  const hwpService = new HwpService({
    url: TestGlobal.env.CONNECTOR_BRANCH_API_SERVER,
  });

  const parseInput = {
    fileUrl: `https://${TestGlobal.env.AWS_S3_BUCKET}.s3.ap-northeast-2.amazonaws.com/example.hwp`,
  };

  const parseOutput = await hwpService.parseHwp(parseInput);
  typia.assert<IHwpService.IParseOutput>(parseOutput);
};
