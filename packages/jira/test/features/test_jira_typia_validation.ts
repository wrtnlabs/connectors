import { JiraService } from "@wrtnlabs/connector-jira";
import typia from "typia";

export const test_jira_typia_validation = async () => {
  typia.llm.application<JiraService, "chatgpt">();
};
