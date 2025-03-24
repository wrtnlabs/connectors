import { GoogleImageService } from "@wrtnlabs/connector-google-image";
import typia from "typia";

export const test_google_image_typia_validation = () => {
  typia.llm.application<GoogleImageService, "chatgpt">();
};
