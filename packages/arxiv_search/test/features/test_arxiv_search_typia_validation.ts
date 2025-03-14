import { ArxivSearchService } from "@wrtnlabs/connector-arxiv-search";
import typia from "typia";

export const test_arxiv_search_typia_validation = async () => {
  typia.llm.application<ArxivSearchService, "chatgpt">();
};
