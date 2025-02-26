import { GoogleSheetService } from "@wrtnlabs/connector-google-sheet";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

export const test_write_headers_google_sheet = async (): Promise<void> => {
  const googleSheetService = new GoogleSheetService({
    clientId: TestGlobal.env.GOOGLE_CLIENT_ID,
    clientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
    secret: TestGlobal.env.GOOGLE_TEST_SECRET,
  });

  const input = {
    url: "https://docs.google.com/spreadsheets/d/1t5N42ZfMFICZlPPT-sLxRgMNNiR-2j0Fb49SMQyVXRo/edit#gid=0",
    index: 0,
    headerNames: ["test1", "test2"],
  };

  const result = await googleSheetService.writeHeaders(input);
  typia.assert(result);
  return result;
};
