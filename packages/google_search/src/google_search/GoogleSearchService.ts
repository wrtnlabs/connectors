import { IGoogleSearchService } from "../structures/IGoogleSearchService";
import { makeQuery } from "@wrtnlabs/connector-shared";
import { getJson } from "serpapi";

export class GoogleSearchService {
  private readonly defaultParams: {
    engine: string;
    api_key: string;
    safe: string;
    hl: string;
    gl: string;
  };

  constructor(private readonly props: IGoogleSearchService.IProps) {
    this.defaultParams = {
      engine: "google",
      api_key: this.props.apiKey,
      safe: "active",
      hl: "ko",
      gl: "kr",
    };
  }

  /**
   * Google Search Service.
   *
   * Search Google for the search term you entered
   */
  async search(
    input: IGoogleSearchService.IRequest,
  ): Promise<IGoogleSearchService.IResponse[]> {
    return this.searchResult(input);
  }

  /**
   * Google Search Service.
   *
   * Search Google for the search term you entered
   */
  async searchResult(
    input: IGoogleSearchService.IRequest,
  ): Promise<IGoogleSearchService.IResponse[]> {
    const { targetSite } = input;
    try {
      const maxResultPerPage: number = 10;
      let start: number = 0;

      let searchQuery = makeQuery(
        input.andKeywords,
        input.orKeywords ?? [],
        input.notKeywords ?? [],
      );

      const output: IGoogleSearchService.IResponse[] = [];

      /**
       * 한 페이지에 최대 10개의 결과물이 response되기 때문에
       * 사용자가 원하는 결과물의 갯수가 10개 보다 많은 경우 처리하기 위함.
       */
      while (output.length < input.max_results) {
        const params = {
          ...this.defaultParams,
          q: searchQuery,
          start: start,
          num: maxResultPerPage,
          ...(targetSite && { as_sitesearch: targetSite }),
        };
        const res = await getJson(params);
        if (!res["organic_results"]) {
          return [];
        }

        const results = res["organic_results"];

        if (!results || results.length === 0) {
          return [];
        }

        for (const result of results) {
          if (output.length === input.max_results) {
            break;
          }

          const data: IGoogleSearchService.IResponse = {
            title: result.title,
            link: result.link,
            snippet: result.snippet,
            thumbnail: result.thumbnail,
          };

          output.push(data);
        }

        /**
         * 검색 결과가 10개보다 적은 경우
         */
        if (results.length < maxResultPerPage) {
          break;
        }
        start += maxResultPerPage;
      }

      return output;
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }
}
