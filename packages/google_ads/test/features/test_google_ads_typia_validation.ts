import typia from "typia";
import { GoogleAdsService } from "@wrtnlabs/connector-google-ads";

export const test_google_ads_typia_validation = async () => {
  typia.llm.application<GoogleAdsService, "chatgpt">();
};
