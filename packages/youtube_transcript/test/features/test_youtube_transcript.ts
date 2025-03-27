import typia from "typia";
import { TestGlobal } from "../TestGlobal";
import { IYoutubeTranscriptService } from "@wrtnlabs/connector-youtube-search/lib/structures/IYoutubeTranscriptService";
import { YoutubeTranscriptService } from "@wrtnlabs/connector-youtube-search/lib/youtube_transcript/YoutubeTranscriptService";

export const test_youtube_search_transcript =
  async (): Promise<IYoutubeTranscriptService.ITranscriptYoutubeResponse> => {
    const youtubeSearchService = new YoutubeTranscriptService({
      searchApiKey: TestGlobal.env.SEARCH_API_KEY,
    });

    const result = await youtubeSearchService.transcript({
      url: "https://www.youtube.com/watch?v=n7e_Ek2g7FM&t=4s",
    });
    typia.assert(result);
    return result;
  };
