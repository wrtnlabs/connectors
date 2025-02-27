import axios from "axios";
import { ISweetTrackerService } from "../structures/ISweetTrackerService";

export class SweetTrackerService {
  constructor(private readonly props: ISweetTrackerService.IProps) {}

  async getRecommendedCompanyList(
    input: ISweetTrackerService.IGetRecommendedCompanyListInput,
  ): Promise<ISweetTrackerService.IGetRecommendedCompanyListOutput> {
    try {
      const queryParams =
        Object.entries({
          ...input,
          t_key: this.props.secret,
        })
          .map(([key, value]) => `${key}=${value}`)
          .join("&") ?? "";

      const res = await axios.get(
        `https://info.sweettracker.co.kr/api/v1/recommend?${queryParams}`,
      );

      return res.data;
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  async getCompanyList(): Promise<ISweetTrackerService.IGetCompanyListOutput> {
    try {
      const res = await axios.get(
        "https://info.sweettracker.co.kr/api/v1/companylist/refresh",
      );
      return res.data;
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  async getTrackingInfo(
    input: ISweetTrackerService.IGetTrackingInfoInput,
  ): Promise<ISweetTrackerService.IGetTrackingInfoOutput> {
    try {
      const queryParams =
        Object.entries({
          ...input,
          t_key: this.props.secret,
        })
          .map(([key, value]) => `${key}=${value}`)
          .join("&") ?? "";

      const res = await axios.get(
        `https://info.sweettracker.co.kr/api/v1/trackingInfo?${queryParams}`,
      );
      return res.data;
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }
}
