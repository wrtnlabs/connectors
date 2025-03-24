import typia from "typia";
import { GoogleCalendarService } from "@wrtnlabs/connector-google-calendar";

export const test_google_calendar_typia_validation = async () => {
  typia.llm.application<GoogleCalendarService, "chatgpt">();
};
