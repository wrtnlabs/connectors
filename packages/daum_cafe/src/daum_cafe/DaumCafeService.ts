import axios from "axios";
import { IDaumCafeService } from "../structures/IDaumCafeService";

export class DaumCafeService {
  constructor(private readonly props: IDaumCafeService.IProps) {}

  async search(
    input: IDaumCafeService.ISearchInput,
  ): Promise<IDaumCafeService.ICafeOutput> {
    const {
      andKeywords,
      orKeywords,
      notKeywords,
      size = 10,
      page = 1,
      sort = "accuracy",
    } = input;
    const query = this.makeQuery(
      andKeywords.split(","),
      orKeywords?.split(",") ?? [],
      notKeywords?.split(",") ?? [],
    );
    try {
      const res = await axios.get(
        `https://dapi.kakao.com/v2/search/cafe?query=${query}&sort=${sort}&size=${size}&page=${page}`,
        {
          headers: {
            Authorization: `KakaoAK ${this.props.apiKey}`,
          },
        },
      );
      const { total_count, pageable_count, is_end } = res.data.meta;
      const meta = {
        totalCount: total_count,
        pageableCount: pageable_count,
        isEnd: is_end,
      };
      const documents = res.data.documents.map((doc: any) => {
        const { title, contents, url, datetime, cafename, thumbnail } = doc;
        return {
          title,
          contents,
          url,
          dateTime: datetime,
          cafeName: cafename,
          thumbnail,
        };
      });
      return {
        meta,
        documents,
      };
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
