import { CalendlyService } from "@wrtnlabs/connector-calendly";
import typia from "typia";

export const test_calendly_typia_validation = async () => {
  typia.llm.application<CalendlyService, "chatgpt">();
};
