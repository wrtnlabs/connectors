import { getJson } from "serpapi";

import { IYoutubeSearch } from "@wrtn/connector-api/lib/structures/connector/youtube_search/IYoutubeSearch";

import { ConnectorGlobal } from "../../../ConnectorGlobal";
import { makeQuery } from "../../../utils/generate-search-query.util";
import { Injectable } from "@nestjs/common";

@Injectable()
export class YoutubeSearchProvider {
  async search(
    input: IYoutubeSearch.ISearchInput,
  ): Promise<IYoutubeSearch.ISearchOutput[]> {
    const defaultParams = {
      engine: "youtube",
      api_key: ConnectorGlobal.env.SERP_API_KEY,
    };
    const searchQuery = makeQuery(
      input.and_keywords,
      input.or_keywords ?? [],
      input.not_keywords ?? [],
    );

    const params: IYoutubeSearch.ISerpApiParams = {
      ...defaultParams,
      search_query: searchQuery,
    };

    try {
      const res = await getJson(params);
      const results: IYoutubeSearch.ISerpApiVideoResult[] =
        res["video_results"];
      const output: IYoutubeSearch.ISearchOutput[] = [];

      for (const result of results) {
        const youtubeSearch: IYoutubeSearch.ISearchOutput = {
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
