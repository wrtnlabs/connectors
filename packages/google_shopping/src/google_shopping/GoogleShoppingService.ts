import { getJson } from "serpapi";
import { IGoogleShoppingService } from "../structures/IGoogleShoppingService";

export class GoogleShoppingService {
  private readonly defaultParams: {
    engine: string;
    api_key: string;
    google_domain: string;
    location_requested: string;
    location_used: string;
    device: string;
    hl: string;
    gl: string;
  };

  constructor(private readonly props: IGoogleShoppingService.IProps) {
    this.defaultParams = {
      engine: "google_shopping",
      api_key: this.props.apiKey,
      google_domain: "google.com",
      location_requested: "South Korea",
      location_used: "South Korea",
      device: "desktop",
      hl: "ko",
      gl: "kr",
    };
  }

  async getGoogleShoppingResults(
    input: IGoogleShoppingService.IRequestStandAlone,
  ): Promise<IGoogleShoppingService.IResponse[]> {
    const { tbs } = input;
    try {
      const maxResultPerPage = 60;
      let start = 0;
      const output: IGoogleShoppingService.IResponse[] = [];

      while (output.length < input.max_results) {
        // const num = Math.min(
        //   input.max_results - output.length,
        //   maxResultPerPage,
        // );
        const res = await getJson({
          ...this.defaultParams,
          tbs: tbs,
          q: input.keyword,
          start: start,
          // num: num,
          num: 5,
        });
        const results = res["shopping_results"];

        if (!results || results.length === 0) {
          return [];
        }
        for (const result of results) {
          if (output.length === input.max_results) {
            break;
          }
          const data = {
            title: result.title,
            link: result.link,
            price: result.price,
            source: result?.source,
            deliveryCost: result?.delivery,
            thumbnail: result.thumbnail,
            rating: result?.rating,
          };
          output.push(data);
        }

        if (results.length < maxResultPerPage) {
          break;
        }
        start += maxResultPerPage;
      }

      return output;
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   *  패션 카테고리
   */
  async musinsa(
    input: IGoogleShoppingService.IRequestStandAlone,
  ): Promise<IGoogleShoppingService.IResponse[]> {
    return this.getGoogleShoppingResults(input);
  }

  async twentyNineCentimeter(
    input: IGoogleShoppingService.IRequestStandAlone,
  ): Promise<IGoogleShoppingService.IResponse[]> {
    return this.getGoogleShoppingResults(input);
  }

  async hansumEQL(
    input: IGoogleShoppingService.IRequestStandAlone,
  ): Promise<IGoogleShoppingService.IResponse[]> {
    return this.getGoogleShoppingResults(input);
  }

  async oco(
    input: IGoogleShoppingService.IRequestStandAlone,
  ): Promise<IGoogleShoppingService.IResponse[]> {
    return this.getGoogleShoppingResults(input);
  }

  async uniqlo(
    input: IGoogleShoppingService.IRequestStandAlone,
  ): Promise<IGoogleShoppingService.IResponse[]> {
    return this.getGoogleShoppingResults(input);
  }

  /**
   * 상품이 안나오는 것들이 있어서 보류.
   */
  // async wconcept(
  //   input: IGoogleShopping.IRequestStandAlone,
  // ): Promise<IGoogleShopping.IResponse[]> {
  //   return this.getGoogleShoppingResults(input, "mr:1,merchagg:m118597626")
  // }

  /**
   * Google Shopping Service.
   *
   * Search for products on Coupang
   */
  async coupang(
    input: IGoogleShoppingService.IRequestStandAlone,
  ): Promise<IGoogleShoppingService.IResponse[]> {
    return this.getGoogleShoppingResults(input);
  }

  /**
   * Google Shopping Service.
   *
   * Search for products on Kurly
   * Kurly is a service where you can purchase groceries.
   */
  async kurly(
    input: IGoogleShoppingService.IRequestStandAlone,
  ): Promise<IGoogleShoppingService.IResponse[]> {
    return this.getGoogleShoppingResults(input);
  }

  /**
   * Google Shopping Service.
   *
   * Search for products on iHerb
   * iHerb is a service that allows you to purchase Nutritional supplement.
   */
  async iherb(
    input: IGoogleShoppingService.IRequestStandAlone,
  ): Promise<IGoogleShoppingService.IResponse[]> {
    return this.getGoogleShoppingResults(input);
  }

  /**
   * Google Shopping Service.
   *
   * Search for products on AliExpress
   */
  async aliExpress(
    input: IGoogleShoppingService.IRequestStandAlone,
  ): Promise<IGoogleShoppingService.IResponse[]> {
    return this.getGoogleShoppingResults(input);
  }

  /**
   * Google Shopping Service.
   *
   * Search for products at Olive Young
   * Olive Young is a service that allows you to purchase cosmetics.
   */
  async oliveYoung(
    input: IGoogleShoppingService.IRequestStandAlone,
  ): Promise<IGoogleShoppingService.IResponse[]> {
    return this.getGoogleShoppingResults(input);
  }

  /**
   * Google Shopping Service.
   *
   * Search for products at Today House
   * Today House is a service that allows you to purchase home appliances.
   */
  async todayHouse(
    input: IGoogleShoppingService.IRequestStandAlone,
  ): Promise<IGoogleShoppingService.IResponse[]> {
    return this.getGoogleShoppingResults(input);
  }

  /**
   * Google Shopping Service.
   *
   * Search for products on yes24
   * yes24 is a service that allows you to purchase books.
   */
  async yes24(
    input: IGoogleShoppingService.IRequestStandAlone,
  ): Promise<IGoogleShoppingService.IResponse[]> {
    const extractInputKeywords = [
      "윤석열",
      "한덕수",
      "이종섭",
      "추경호",
      "박진",
      "김기현",
      "이재명",
      "주호영",
      "박광온",
      "김건희",
      "심상정",
      "문재인",
      "박근혜",
      "이명박",
      "안철수",
      "홍준표",
      "오세훈",
      "유승민",
      "김동연",
      "이낙연",
      "원희룡",
      "나경원",
      "이준석",
      "박영선",
      "하태경",
      "조국",
      "유시민",
      "박용진",
      "장혜영",
      "국민의힘",
      "더불어민주당",
      "정의당",
      "새누리당",
      "김정은",
      "한나라당",
      "민주당",
      "추미애",
      "윤미향",
      "송영길",
      "민형배",
    ];
    const normalizedKeyword = input.keyword.trim();
    const isSensitiveKeyword = extractInputKeywords.some((keyword) =>
      normalizedKeyword.includes(keyword),
    );

    if (isSensitiveKeyword) {
      throw new Error(`Contains sensitive keyword: ${input.keyword}`);
    }
    return this.getGoogleShoppingResults(input);
  }

  /**
   * Google Shopping Service.
   *
   * Search for products in Aladdin
   * Aladdin is a service that allows you to purchase used books.
   */
  async aladine(
    input: IGoogleShoppingService.IRequestStandAlone,
  ): Promise<IGoogleShoppingService.IResponse[]> {
    return this.getGoogleShoppingResults(input);
  }
}
