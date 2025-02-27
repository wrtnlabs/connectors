import axios from "axios";
import { parseString } from "xml2js";
import { IConnector } from "@wrtnlabs/connector-shared";
import { IArxivSearchService } from "../structures/IArxivSearchService";

export class ArxivSearchService {
  async search(
    input: IConnector.ISearchInput,
  ): Promise<IConnector.ISearchOutput> {
    try {
      const searchQuery = this.generateSearchQuery(
        input.and_keywords,
        input.or_keywords ?? [],
        input.not_keywords ?? [],
      );
      const params: IArxivSearchService.IArxivSearchParams = {
        search_query: searchQuery,
        max_results: input.num_results,
      };

      /**
       * arxiv api를 통해 검색 결과 가져옴
       * xml 형식
       */
      const arxivSearchXmlResults = await axios.get(
        "https://export.arxiv.org/api/query",
        {
          params,
        },
      );

      /**
       * xml 형식을 json 형식으로 변환
       */
      const arxivSearchJsonResults = await this.convertXmlToJson(
        arxivSearchXmlResults.data,
      );

      if (
        arxivSearchJsonResults === undefined ||
        arxivSearchJsonResults.feed.entry === null ||
        arxivSearchJsonResults.feed.entry === undefined
      ) {
        return { references: [] };
      }

      const output: IConnector.IReferenceContent[] = [];

      for (const result of arxivSearchJsonResults.feed.entry) {
        const arxivSearch: IConnector.IReferenceContent = {
          title: result.title[0],
          type: "research_paper",
          source: "arxiv",
          url: result.id[0],
          contents: result.summary[0],
        };
        output.push(arxivSearch);
      }
      return { references: output };
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * arxiv api를 통해 검색하기 위한 쿼리 생성
   * https://info.arxiv.org/help/api/user-manual.html#query_details
   */
  private generateSearchQuery = (
    andKeyWords: string[],
    orKeywords: string[],
    notKeywords: string[],
  ) => {
    let query = "";
    // 키워드가 2개 이상일 때만 괄호로 감싸줌
    const wrapWithParenthesesIfPluralKeyword = (
      keywords: string[],
      joinBy: string,
    ) => {
      if (keywords.length > 1) {
        return "(" + keywords.join(joinBy) + ")";
      } else {
        return keywords.join(joinBy);
      }
    };

    if (andKeyWords && andKeyWords.length > 0) {
      const andQuery = andKeyWords.map((kw) => `all:${kw}`);
      query += wrapWithParenthesesIfPluralKeyword(andQuery, " AND ");
    }

    if (orKeywords && orKeywords.length > 0) {
      if (query !== "") query += " OR ";
      const orQuery = orKeywords.map((kw) => `all:${kw}`);
      query += wrapWithParenthesesIfPluralKeyword(orQuery, " OR ");
    }

    if (notKeywords && notKeywords.length > 0) {
      if (query !== "") query += " ANDNOT ";
      const notQuery = notKeywords.map((kw) => `all:${kw}`);
      query += wrapWithParenthesesIfPluralKeyword(notQuery, " AND ");
    }

    return query;
  };

  /**
   *
   * @param xmlData xml 형식의 데이터
   * @returns xml 형식의 데이터를 json 형식으로 변환
   */
  private async convertXmlToJson(xmlData: string): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        parseString(xmlData, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    } catch (err) {
      throw new Error("Failed to convert xml to json");
    }
  }
}
