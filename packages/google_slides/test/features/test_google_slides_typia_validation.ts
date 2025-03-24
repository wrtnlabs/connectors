import { GoogleSlidesService } from "@wrtnlabs/connector-google-slides";
import typia from "typia";

export const test_google_slides_typia_validation = async () => {
  typia.llm.application<GoogleSlidesService, "chatgpt">();
};
