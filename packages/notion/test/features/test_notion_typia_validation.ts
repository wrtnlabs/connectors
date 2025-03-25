import { NotionService } from "@wrtnlabs/connector-notion";
import typia from "typia";

export const test_notion_typia_validation = async () => {
  typia.llm.application<NotionService, "chatgpt">();
};
