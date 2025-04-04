import typia from "typia";
import { test_create_google_sheet } from "./test_google_sheet_create";
import {
  GoogleSheetService,
  IGoogleSheetService,
} from "@wrtnlabs/connector-google-sheet";
import { TestGlobal } from "../TestGlobal";

export const test_append_google_sheet = async (): Promise<void> => {
  const googleSheetService = new GoogleSheetService({
    googleClientId: TestGlobal.env.GOOGLE_CLIENT_ID,
    googleClientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
    googleRefreshToken: TestGlobal.env.GOOGLE_TEST_SECRET,
  });

  const spreadsheetId = (await test_create_google_sheet()).spreadsheetId;
  const input: IGoogleSheetService.IAppendToSheetInput = {
    spreadSheetId: spreadsheetId,
    values: [["test1"], ["test2"], ["test3"]],
  };
  const result = await googleSheetService.appendToSheet(input);
  typia.assert(result);
};
