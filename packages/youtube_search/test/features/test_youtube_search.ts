import { IYoutubeSearchService } from "@wrtnlabs/connector-youtube-search";
import { YoutubeSearchService } from "@wrtnlabs/connector-youtube-search/lib/youtube_search/YoutubeSearchService";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

export const test_youtube_search = async (): Promise<
  IYoutubeSearchService.ISearchOutput[]
> => {
  const youtubeSearchService = new YoutubeSearchService({
    serpApiKey: TestGlobal.env.SERP_API_KEY,
  });

  const result = await youtubeSearchService.search({
    and_keywords: ["뤼튼", "AI"],
    or_keywords: ["스튜디오", "생태계"],
    not_keywords: ["정치", "폭력"],
  });
  typia.assert(result);
  return result;
};
