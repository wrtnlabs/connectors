import { SlackService } from "@wrtnlabs/connector-slack";
import typia from "typia";

export const test_slack_typia_validation = async () => {
  typia.llm.application<SlackService, "chatgpt">();
};
