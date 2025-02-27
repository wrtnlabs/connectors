import { ArxivSearchService } from "@wrtnlabs/connector-arxiv-search/lib/arxiv_search/ArxivSearchService";
import { IConnector } from "@wrtnlabs/connector-shared";
import typia from "typia";

export const test_arxiv_search =
  async (): Promise<IConnector.ISearchOutput> => {
    const arxivSearchService = new ArxivSearchService();

    const result = await arxivSearchService.search({
      and_keywords: ["biology", "ecosystem"],
      or_keywords: ["AI", "machine learning"],
      not_keywords: ["politics", "pollution"],
      num_results: 50,
    });
    typia.assert(result);
    return result;
  };
