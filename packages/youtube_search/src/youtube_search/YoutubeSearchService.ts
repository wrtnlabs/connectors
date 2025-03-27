import { getJson } from "serpapi";
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
}
