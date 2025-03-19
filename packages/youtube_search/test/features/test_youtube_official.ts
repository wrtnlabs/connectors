import typia from "typia";
import { IYoutubeSearchService } from "@wrtnlabs/connector-youtube-search";
import { YoutubeSearchService } from "@wrtnlabs/connector-youtube-search/lib/youtube_search/YoutubeSearchService";
import { TestGlobal } from "../TestGlobal";

export const test_youtube_official = async (): Promise<
  IYoutubeSearchService.IYoutubeSearchVideoResponse[]
> => {
  const youtubeSearchService = new YoutubeSearchService({
    googleApiKey: TestGlobal.env.GOOGLE_API_KEY,
    searchApiKey: TestGlobal.env.SEARCH_API_KEY,
    serpApiKey: TestGlobal.env.SERP_API_KEY,
  });

  const result = await youtubeSearchService.searchVideo({
    and_keywords: ["귀여운", "고양이"],
    or_keywords: ["야옹", "냐옹"],
    not_keywords: ["강아지"],
  });
  typia.assert(result);
  return result;
};
