import { CareerService } from "@wrtnlabs/connector-career";
import typia from "typia";

export const test_career_typia_validation = () => {
  typia.llm.application<CareerService, "chatgpt">();
};
