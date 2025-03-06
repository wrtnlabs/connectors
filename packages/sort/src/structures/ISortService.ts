export namespace ISortService {
  /**
   * @title Items to sort
   */
  export interface IScoredItem {
    /**
     * Item Score
     *
     * @title Score
     */
    score: number;
  }

  /**
   * @title Input for sorting
   */
  export interface IRankInput {
    /**
     * List of items to sort
     *
     * @title List of items
     */
    items: IScoredItem[];
  }

  /**
   * @title Sorted results
   */
  export interface IRankOutput {
    /**
     * Array of indexes of sorted items
     *
     * @title Array of indexes of sorted items
     */
    rankedIndices: number[];
  }
}
