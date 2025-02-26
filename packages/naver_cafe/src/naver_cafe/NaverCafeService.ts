import axios from "axios";
import { INaverCafeService } from "../structures/INaverCafeService";

export class NaverCafeService {
  constructor(private readonly props: INaverCafeService.IProps) {}

  async getCafe(
    input: INaverCafeService.INaverKeywordInput,
  ): Promise<INaverCafeService.ICafeNaverOutput> {
    const {
      andKeywords,
      orKeywords,
      notKeywords,
      display = 10,
      sort = "sim",
    } = input;
    const query = this.makeQuery(
      andKeywords.split(","),
      orKeywords?.split(",") ?? [],
      notKeywords?.split(",") ?? [],
    );
    try {
      const headers = {
        "X-Naver-Client-Id": this.props.clientId,
        "X-Naver-Client-Secret": this.props.clientSecret,
      };

      const res = await axios.get(
        `https://openapi.naver.com/v1/search/cafearticle.json?query=${query}&sort=${sort}&display=${display}`,
        {
          headers,
        },
      );

      return { data: res.data };
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  makeQuery(
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
