import typia from "typia";
import { GoogleService } from "@wrtnlabs/connector-google";

export const test_google_typia_validation = async () => {
  typia.llm.application<GoogleService, "chatgpt">();
};
