import { YoutubeSearchService } from "@wrtnlabs/connector-youtube-search";
import typia from "typia";

export const test_youtube_search_typia_validation = async () => {
  typia.llm.application<YoutubeSearchService, "chatgpt">();
};
