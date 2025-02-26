import axios from "axios";
import { IDaumBlogService } from "../structures/IDaumBlogService";

export class DaumBlogService {
  constructor(private readonly props: IDaumBlogService.IProps) {}

  async search(
    input: IDaumBlogService.ISearchInput,
  ): Promise<IDaumBlogService.IBlogOutput> {
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
        `https://dapi.kakao.com/v2/search/blog?query=${query}&sort=${sort}&size=${size}&page=${page}`,
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
        const { title, contents, url, datetime, blogname, thumbnail } = doc;
        return {
          title,
          contents,
          url,
          dateTime: datetime,
          blogName: blogname,
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
