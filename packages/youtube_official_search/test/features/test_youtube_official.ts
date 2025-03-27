import typia from "typia";
import { TestGlobal } from "../TestGlobal";
import { IYoutubeOfficialSearchService } from "@wrtnlabs/connector-youtube-search/lib/structures/IYoutubeOfficialSearchService";
import { YoutubeOfficialSearchService } from "@wrtnlabs/connector-youtube-search/lib/youtube_official_search/YoutubeOfficialSearchService";

export const test_youtube_official = async (): Promise<
  IYoutubeOfficialSearchService.IYoutubeSearchVideoResponse[]
> => {
  const youtubeSearchService = new YoutubeOfficialSearchService({
    googleApiKey: TestGlobal.env.GOOGLE_API_KEY,
  });

  const result = await youtubeSearchService.searchVideo({
    and_keywords: ["귀여운", "고양이"],
    or_keywords: ["야옹", "냐옹"],
    not_keywords: ["강아지"],
  });
  typia.assert(result);
  return result;
};
