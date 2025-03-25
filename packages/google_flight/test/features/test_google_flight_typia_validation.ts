import { GoogleFlightService } from "@wrtnlabs/connector-google-flight";
import typia from "typia";

export const test_google_flight_typia_validation = async () => {
  typia.llm.application<GoogleFlightService, "chatgpt">();
};
