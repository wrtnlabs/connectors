import { GoogleTrendService } from "@wrtnlabs/connector-google-trend";
import typia from "typia";

export const test_google_trend_typia_validation = async () => {
  typia.llm.application<GoogleTrendService, "chatgpt">();
};
