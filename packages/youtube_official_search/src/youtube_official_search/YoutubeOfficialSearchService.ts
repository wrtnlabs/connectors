import { IYoutubeOfficialSearchService } from "../structures/IYoutubeOfficialSearchService";
import axios from "axios";

export class YoutubeOfficialSearchService {
  constructor(private readonly props: IYoutubeOfficialSearchService.IProps) {}

  /**
   * Youtube Search Service.
   *
   * Get YouTube video search results
   *
   * This function use the official YouTube API to search for videos.
   *
   * If you want users to use the official YouTube API, use this function.
   *
   * If you think you need to call an endpoint that retrieves YouTube video captions without explicitly specifying that you want to use the official YouTube API, call this endpoint.
   * For example, in a scenario like "Get the content of the Galaxy Watch 7 review videos. Then, organize the user reviews of the product into pros and cons based on the content and organize which comments were made by whom. Please write the comments as they were made.",
   * you need to retrieve the video content and the YouTuber's comments. This can be figured out from the YouTube video transcriptions, so you can see that you need to call an endpoint that retrieves YouTube video transcriptions. In this case, you should call this endpoint.
   *
   * The search results have the video title and link.
   *
   * If most users are going to use this feature, they probably want to watch the video, so it's better to provide a URL.
   *
   * In order to filter the period that the user wants, you should use the response field "published_date".
   *
   * For example, if the user wants to retrieve only this year's videos, you should exclude videos that were uploaded in a period that the user does not want, such as "1 year ago" or "2 years ago" with a published_date.
   *
   * It's great to use with the /transcript endpoint when summarizing videos, analyzing content, extracting keywords, etc.
   *
   * Extract the URL from the YouTube video information obtained from the execution result of the corresponding function and use it as the input of the /transcript endpoint.
   *
   * Based on the transcripts obtained from the execution result of the /transcript endpoint, perform tasks such as summarizing videos, analyzing content, and extracting keywords.
   *
   * Example Use Cases:
   * Product Reviews: Extract product names, pros, cons, and recommendations from air purifier review videos.
   * Tutorials: Create text-based tutorials or step-by-step guides from instructional videos.
   *
   * @summary YouTube video search
   * @param input
   * @returns
   */
  async searchVideo(
    input: IYoutubeOfficialSearchService.IYoutubeSearchVideoRequest,
  ): Promise<IYoutubeOfficialSearchService.IYoutubeSearchVideoResponse[]> {
    try {
      const query = this.createYoutubeSearchQuery(
        input.and_keywords,
        input.or_keywords ?? [],
        input.not_keywords ?? [],
      );
      const res = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            key: this.props.googleApiKey,
            part: "snippet",
            q: query,
            order: "viewCount",
            type: "video",
            videoCaption: "closedCaption",
            videoEmbeddable: "true",
            ...(input.publishedAfter && {
              publishedAfter: input.publishedAfter,
            }),
            ...(input.publishedBefore && {
              publishedBefore: input.publishedBefore,
            }),
            maxResults: 50,
          },
        },
      );

      const results: IYoutubeOfficialSearchService.IYoutubeSearchVideoResponse[] =
        [];
      for (const item of res.data.items) {
        const video: IYoutubeOfficialSearchService.IYoutubeSearchVideoResponse =
          {
            videoId: item.id.videoId,
            title: item.snippet.title,
            link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            channel_name: item.snippet.channelTitle,
            channel_link: `https://www.youtube.com/channel/${item.snippet.channelId}`,
            published_date: item.snippet.publishTime,
            thumbnail: item.snippet.thumbnails.default.url,
          };
        results.push(video);
      }

      return results;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  private createYoutubeSearchQuery(
    andKeywords: string[],
    orKeywords: string[],
    notKeywords: string[],
  ): string {
    let query = andKeywords.join(" "); // andKeywords는 공백으로 연결

    if (orKeywords.length > 0) {
      query += ` (${orKeywords.join("|")})`;
    }

    if (notKeywords.length > 0) {
      query += ` -${notKeywords.join(" -")}`;
    }

    return query;
  }
}
