import {
  GoogleSheetService,
  IGoogleSheetService,
} from "@wrtnlabs/connector-google-sheet";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

export const test_read_worksheet_google_sheet =
  async (): Promise<IGoogleSheetService.IReadGoogleSheetRowsOutput> => {
    const googleSheetService = new GoogleSheetService({
      clientId: TestGlobal.env.GOOGLE_CLIENT_ID,
      clientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
      secret: TestGlobal.env.GOOGLE_TEST_SECRET,
    });

    const input: IGoogleSheetService.IReadGoogleSheetRowsInput = {
      url: "https://docs.google.com/spreadsheets/d/1t5N42ZfMFICZlPPT-sLxRgMNNiR-2j0Fb49SMQyVXRo/edit#gid=0",
      workSheetTitle: "Sheet1",
    };

    const result = await googleSheetService.readRows(input);

    typia.assert(result);
    return result;
  };
