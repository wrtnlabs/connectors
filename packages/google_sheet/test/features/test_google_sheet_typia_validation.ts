import { GoogleSheetService } from "@wrtnlabs/connector-google-sheet";
import typia from "typia";

export const test_google_sheet_typia_validation = () => {
  typia.llm.application<GoogleSheetService, "chatgpt">();
};
