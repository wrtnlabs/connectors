import {
  GoogleSheetService,
  IGoogleSheetService,
} from "@wrtnlabs/connector-google-sheet";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

export const test_read_google_sheet_headers =
  async (): Promise<IGoogleSheetService.IReadGoogleSheetOutput> => {
    const googleSheetService = new GoogleSheetService({
      clientId: TestGlobal.env.GOOGLE_CLIENT_ID,
      clientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
      secret: TestGlobal.env.GOOGLE_TEST_SECRET,
    });

    const input = {
      url: "https://docs.google.com/spreadsheets/d/1t5N42ZfMFICZlPPT-sLxRgMNNiR-2j0Fb49SMQyVXRo/edit#gid=0",
      index: 0,
    };

    const result = await googleSheetService.readHeaders(input);
    typia.assert(result);
    return result;
  };
