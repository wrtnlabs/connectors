import { GoogleMapService } from "@wrtnlabs/connector-google-map";
import typia from "typia";

export const test_google_map_typia_validation = async () => {
  typia.llm.application<GoogleMapService, "chatgpt">();
};
