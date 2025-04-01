// import typia from "typia";
// import { TestGlobal } from "../TestGlobal";
// import { IYoutubeSearchService } from "@wrtnlabs/connector-youtube-search";
// import { YoutubeSearchService } from "@wrtnlabs/connector-youtube-search/lib/youtube_search/YoutubeSearchService";

// export const test_youtube_search_transcript =
//   async (): Promise<IYoutubeSearchService.ITranscriptYoutubeResponse> => {
//     const youtubeSearchService = new YoutubeSearchService({
//       googleApiKey: TestGlobal.env.GOOGLE_API_KEY,
//       searchApiKey: TestGlobal.env.SEARCH_API_KEY,
//       serpApiKey: TestGlobal.env.SERP_API_KEY,
//     });

//     const result = await youtubeSearchService.transcript({
//       url: "https://www.youtube.com/watch?v=n7e_Ek2g7FM&t=4s",
//     });
//     typia.assert(result);
//     return result;
//   };
