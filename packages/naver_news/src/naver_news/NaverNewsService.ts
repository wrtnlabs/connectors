import axios from "axios";
import { INaverNewsService } from "../structures/INaverNewsService";

export class NaverNewsService {
  constructor(private readonly props: INaverNewsService.IProps) {}

  /**
   * Naver News Service.
   *
   * Search Naver News
   */
  async getNews(
    input: INaverNewsService.INaverKeywordInput,
  ): Promise<INaverNewsService.INewsNaverOutput> {
    const headers = {
      "X-Naver-Client-Id": this.props.naverNewsClientId,
      "X-Naver-Client-Secret": this.props.naverNewsClientSecret,
    };

    try {
      const {
        andKeywords,
        orKeywords,
        notKeywords,
        display = 100,
        sort = "date",
      } = input;
      const query = this.makeQuery(
        andKeywords.split(","),
        orKeywords?.split(",") ?? [],
        notKeywords?.split(",") ?? [],
      );
      const res = await axios.get(
        `https://openapi.naver.com/v1/search/news.json?query=${query}&sort=${sort}&display=${display}`,
        {
          headers,
        },
      );
      return res.data;
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  private makeQuery(
    andKeywords: string[],
    orKeywords: string[],
    notKeywords: string[],
  ) {
    let s = "";

    for (const ok of orKeywords) {
      s += `${ok} `;
    }

    for (const ak of andKeywords) {
      if (ak.includes(" ")) {
        s += `+"${ak}" `;
      } else {
        s += `+${ak} `;
      }
    }

    for (const nk of notKeywords) {
      if (nk.includes(" ")) {
        s += `-"${nk}" `;
      } else {
        s += `-${nk} `;
      }
    }

    return s;
  }
}
