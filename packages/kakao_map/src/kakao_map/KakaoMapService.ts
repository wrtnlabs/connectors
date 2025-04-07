import axios from "axios";
import { IKakaoMapService } from "../structures/IKakaoMapService";

export class KakaoMapService {
  constructor(private readonly props: IKakaoMapService.IProps) {}

  /**
   * Kakao Map Service.
   *
   * Search with Kakao Map
   *
   * In addition to the place name company, category, and phone number,
   * it also provides lot number and road name addresses in the Korean address system.
   * It can be used with public data or other address-based connectors.
   */
  async searchByKeyword(
    input: IKakaoMapService.ISearchByKeywordInput,
  ): Promise<IKakaoMapService.ISearchByKeywordOutput> {
    try {
      const queryString = Object.entries(input)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
      const url = `https://dapi.kakao.com/v2/local/search/keyword.JSON?${queryString}`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `KakaoAK ${this.props.kakaoMapClientId}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }
}
