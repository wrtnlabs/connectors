import {
  GoogleSheetService,
  IGoogleSheetService,
} from "@wrtnlabs/connector-google-sheet";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

export const test_create_google_sheet =
  async (): Promise<IGoogleSheetService.ICreateGoogleSheetOutput> => {
    const googleSheetService = new GoogleSheetService({
      clientId: TestGlobal.env.GOOGLE_CLIENT_ID,
      clientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
      secret: TestGlobal.env.GOOGLE_TEST_SECRET,
    });

    const input: IGoogleSheetService.ICreateGoogleSheetInput = {
      title: "Sheet 생성 테스트",
    };

    const result = await googleSheetService.createSpreadsheet(input);
    typia.assert(result);
    return result;
  };
