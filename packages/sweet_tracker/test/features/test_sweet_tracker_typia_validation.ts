import { SweetTrackerService } from "@wrtnlabs/connector-sweet-tracker";
import typia from "typia";

export const test_sweet_tracker_typia_validation = async () => {
  typia.llm.application<SweetTrackerService, "chatgpt">();
};
