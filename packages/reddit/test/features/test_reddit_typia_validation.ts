import { RedditService } from "@wrtnlabs/connector-reddit";
import typia from "typia";

export const test_reddit_typia_validation = async () => {
  typia.llm.application<RedditService, "chatgpt">();
};
