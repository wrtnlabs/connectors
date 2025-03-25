import { GoogleDriveService } from "@wrtnlabs/connector-google-drive";
import typia from "typia";

export const test_google_drive_typia_validation = async () => {
  typia.llm.application<GoogleDriveService, "chatgpt">();
};
