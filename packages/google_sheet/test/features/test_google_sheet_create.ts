import {
  GoogleSheetService,
  IGoogleSheetService,
} from "@wrtnlabs/connector-google-sheet";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

export const test_create_google_sheet =
  async (): Promise<IGoogleSheetService.ICreateGoogleSheetOutput> => {
    const googleSheetService = new GoogleSheetService({
      googleClientId: TestGlobal.env.GOOGLE_CLIENT_ID,
      googleClientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
      googleRefreshToken: TestGlobal.env.GOOGLE_TEST_SECRET,
    });

    const input: IGoogleSheetService.ICreateGoogleSheetInput = {
      title: "Sheet 생성 테스트",
    };

    const result = await googleSheetService.createSpreadsheet(input);
    typia.assert(result);
    return result;
  };
