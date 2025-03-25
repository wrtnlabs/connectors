import { GoogleHotelService } from "@wrtnlabs/connector-google-hotel";
import typia from "typia";

export const test_google_hotel_typia_validation = async () => {
  typia.llm.application<GoogleHotelService, "chatgpt">();
};
