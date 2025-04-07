import axios from "axios";
import { IKakaoNaviService } from "../structures/IKakaoNaviService";

export class KakaoNaviService {
  constructor(private readonly props: IKakaoNaviService.IProps) {}

  /**
   * Kakao Navi Service.
   *
   * Finding directions with Kakao Navi
   */
  async getFutureDirections(
    input: IKakaoNaviService.IGetFutureDirectionsInput,
  ): Promise<IKakaoNaviService.IGetFutureDirectionsOutput> {
    try {
      const queryParams = Object.entries(input)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      const url = `https://apis-navi.kakaomobility.com/v1/future/directions?${queryParams}`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `KakaoAK ${this.props.kakaoNaviClientId}`,
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }
}
