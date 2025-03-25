import { DiscordService } from "@wrtnlabs/connector-discord";
import typia from "typia";

export const test_discord_typia_validation = async () => {
  typia.llm.application<DiscordService, "chatgpt">();
};
