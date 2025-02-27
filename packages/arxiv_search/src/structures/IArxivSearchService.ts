export namespace IArxivSearchService {
  export interface IArxivSearchParams {
    /**
     * Search phrases to use when searching the archive.
     *
     * @title Search Phrase
     */
    search_query: string;

    /**
     * Sets how many search results to retrieve.
     *
     * @title Number of search results
     */
    max_results?: number;
  }
}
