import { IRankerService } from "../structures/IRankerService";

interface IScoredItemWithIndex {
  score: number;
  index: number;
}

export class RankerService {
  /**
   * Ranker Service.
   *
   * Sorts the given array of items in order of highest score
   */
  sortByRank(input: IRankerService.IRankInput): IRankerService.IRankOutput {
    const indices = input.items
      .map<IScoredItemWithIndex>((item, index) => ({
        score: item.score,
        index,
      }))
      .sort(this.rank)
      .map((item) => item.index);

    return {
      rankedIndices: indices,
    };
  }

  private rank(a: IScoredItemWithIndex, b: IScoredItemWithIndex): number {
    // Sort by score in descending order
    return b.score - a.score;
  }
}
