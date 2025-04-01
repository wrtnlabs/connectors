import { getJson } from "serpapi";
import axios from "axios";
import { IYoutubeSearchService } from "../structures/IYoutubeSearchService";
import { makeQuery } from "@wrtnlabs/connector-shared";

export class YoutubeSearchService {
  constructor(private readonly props: IYoutubeSearchService.IProps) {}

  /**
   * Youtube Search Service.
   *
   * Get YouTube video search results
   *
   * Results include video titles and URLs, as most users likely want to watch the videos.
   * Use the published_date field to filter videos by the desired period (e.g., exclude "1 year ago").
   * Ideal for summarizing, analyzing, or extracting keywords using the /transcript endpoint.
   * Extract URLs from video data and input them into the /transcript endpoint.
   * Use the transcripts for tasks like summarization, content analysis, or keyword extraction.
   * Example Use Cases:
   *  Product Reviews: Extract details (e.g., product names, pros, cons) from review videos.
   *  Tutorials: Create text-based guides or step-by-step instructions from instructional videos.
   */
  async search(
    input: IYoutubeSearchService.ISearchInput,
  ): Promise<IYoutubeSearchService.ISearchOutput[]> {
    const defaultParams = {
      engine: "youtube",
      api_key: this.props.serpApiKey,
    };
    const searchQuery = makeQuery(
      input.and_keywords,
      input.or_keywords ?? [],
      input.not_keywords ?? [],
    );

    const params: IYoutubeSearchService.ISerpApiParams = {
      ...defaultParams,
      search_query: searchQuery,
    };

    try {
      const res = await getJson(params);
      const results: IYoutubeSearchService.ISerpApiVideoResult[] =
        res["video_results"];
      const output: IYoutubeSearchService.ISearchOutput[] = [];

      for (const result of results) {
        const youtubeSearch: IYoutubeSearchService.ISearchOutput = {
          title: result.title,
          link: result.link,
          thumbnail: result.thumbnail.static,
          view_count: Number(result.views ?? 0),
          channel_name: result.channel.name,
          channel_link: result.channel.link,
          published_date: result.published_date,
        };
        output.push(youtubeSearch);
      }
      output.sort((a, b) => {
        const viewCountA = a.view_count;
        const viewCountB = b.view_count;
        return viewCountB - viewCountA;
      });
      return output;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * YouTube Search Service.
   *
   * Retrieves YouTube video search results using the official YouTube API.
   * If users need video transcriptions, call this endpoint to get video titles and URLs.
   *
   * Use the "published_date" field to filter videos by upload date.
   * For example, exclude videos older than a year if the user requests recent content.
   *
   * Combine with the /transcript endpoint for tasks like:
   * - Summarizing videos
   * - Extracting keywords
   * - Analyzing content
   *
   * Example Use Cases:
   * - Product Reviews: Extract pros/cons from review videos.
   * - Tutorials: Generate text-based guides from instructional videos.
   */
  async searchVideo(
    input: IYoutubeSearchService.IYoutubeSearchVideoRequest,
  ): Promise<IYoutubeSearchService.IYoutubeSearchVideoResponse[]> {
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

      const results: IYoutubeSearchService.IYoutubeSearchVideoResponse[] = [];
      for (const item of res.data.items) {
        const video: IYoutubeSearchService.IYoutubeSearchVideoResponse = {
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

  /**
   * Youtube Search Service.
   *
   * Extracts YouTube Video Transcripts
   *
   * This function retrieves the text transcript of a YouTube video.
   *
   * It's essential for tasks like video summarization, content analysis, and keyword extraction.
   *
   * By analyzing the transcript, you can identify key points, main topics, and sentiment expressed in the video.
   *
   * Example Use Cases:
   * Product Reviews: Extract product names, pros, cons, and recommendations from air purifier review videos.
   * Tutorials: Create text-based tutorials or step-by-step guides from instructional videos.
   *
   * @summary Get Youtube video transcripts
   * @param input video url
   * @returns transcripts of video
   */
  async transcript(
    input: IYoutubeSearchService.ITranscriptYoutubeRequest,
  ): Promise<IYoutubeSearchService.ITranscriptYoutubeResponse> {
    try {
      const videoId = this.parsedVideoId(input.url);
      const videoMetaData = await this.getVideoMetaData(videoId);

      if (!videoMetaData) {
        throw new Error("invalid_video_id: videoId: " + videoId);
      }

      const channelName = videoMetaData.channel.name;
      const title = videoMetaData.video.title;
      const uploadedAt = videoMetaData.video.published_time;
      const viewCount = Number(videoMetaData.video.views);

      const defaultAudioLanguage = "ko";
      const transcript = await this.getVideoTranscripts(
        videoId,
        defaultAudioLanguage,
      );

      // Filter out auto-generated captions from available languages
      transcript.available_languages = transcript.available_languages.filter(
        (lang) => !lang.name.includes("auto-generated"),
      );

      // If no available languages after filtering, return no captions
      if (transcript.available_languages.length === 0) {
        return {
          id: videoId,
          title,
          channelName,
          uploadedAt,
          viewCount,
          captionLines: [],
          hasCaption: false,
          hasAutoGeneratedCaption: true,
        };
      }

      if (transcript.transcripts) {
        return {
          id: videoId,
          title,
          channelName,
          uploadedAt,
          viewCount,
          captionLines: transcript.transcripts,
          hasCaption: true,
          hasAutoGeneratedCaption: false,
        };
      }

      const secondTranscript = await this.getVideoTranscripts(
        videoId,
        transcript.available_languages[0]!.lang,
      );

      if (secondTranscript.transcripts) {
        return {
          id: videoId,
          title,
          channelName,
          uploadedAt,
          viewCount,
          captionLines: secondTranscript.transcripts,
          hasCaption: true,
          hasAutoGeneratedCaption: false,
        };
      }

      throw new Error(`Unsupported Youtube Video. videoId: ${videoId}`);
    } catch (err) {
      console.error(JSON.stringify(err));
      throw new Error("Unsupported Youtube Video");
    }
  }

  private parsedVideoId(url: string): string {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch (err) {
      throw new Error(`malformed youtube url: ${url}`);
    }

    let videoId: string | null = null;

    if (
      parsedUrl.hostname.endsWith("youtube.com") &&
      parsedUrl.pathname === "/watch"
    ) {
      videoId = parsedUrl.searchParams.get("v");
    } else if (parsedUrl.host.endsWith("youtu.be")) {
      videoId = parsedUrl.pathname.split("/")[1]!;
    }

    if (videoId === null) {
      throw new Error(`malformed youtube url: ${url}`);
    }

    return videoId;
  }

  private async getVideoMetaData(
    videoId: string,
  ): Promise<IYoutubeSearchService.IYoutubeVideoMetaData> {
    try {
      const res = await axios.get(`https://www.searchapi.io/api/v1/search`, {
        params: {
          video_id: videoId,
          engine: "youtube_video",
          api_key: this.props.searchApiKey,
          gl: "kr",
          hl: "ko",
        },
      });
      return res.data;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  private async getVideoTranscripts(
    videoId: string,
    language: string,
  ): Promise<IYoutubeSearchService.IYoutubeTranscriptResponse> {
    try {
      const res = await axios.get(
        `https://www.searchapi.io/api/v1/search?engine=youtube_transcripts`,
        {
          params: {
            video_id: videoId,
            lang: language,
            transcript_type: "manual",
            engine: "youtube_transcripts",
            api_key: this.props.searchApiKey,
            gl: "kr",
            hl: "ko",
          },
        },
      );
      return res.data;
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
