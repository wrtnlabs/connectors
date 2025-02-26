import axios from "axios";
import { INaverBlogService } from "../structures/INaverBlogService";

export class NaverBlogService {
  constructor(private readonly props: INaverBlogService.IProps) {}

  async getBlog(
    input: INaverBlogService.INaverKeywordInput,
  ): Promise<INaverBlogService.IBlogNaverOutput> {
    try {
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

      const headers = {
        "X-Naver-Client-Id": this.props.clientId,
        "X-Naver-Client-Secret": this.props.clientSecret,
      };

      const res = await axios.get(
        `https://openapi.naver.com/v1/search/blog.json?query=${query}&sort=${sort}&display=${display}`,
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
