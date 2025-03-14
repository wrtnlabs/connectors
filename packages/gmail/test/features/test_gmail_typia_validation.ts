import { GmailService } from "@wrtnlabs/connector-gmail";
import typia from "typia";

export const test_gmail_typia_validation = async () => {
  typia.llm.application<GmailService, "chatgpt">();
};
