import { GoogleScholarService } from "@wrtnlabs/connector-google-scholar";
import typia from "typia";

export const test_google_scholar_typia_validation = async () => {
  typia.llm.application<GoogleScholarService, "chatgpt">();
};
