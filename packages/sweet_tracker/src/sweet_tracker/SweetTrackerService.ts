import axios from "axios";
import { ISweetTrackerService } from "../structures/ISweetTrackerService";

export class SweetTrackerService {
  constructor(private readonly props: ISweetTrackerService.IProps) {}

  /**
   * Sweet Tracker Service.
   *
   * Search for a list of couriers matching the invoice number
   *
   * A courier code is essential to search for an invoice.
   * Therefore, if a user knows the invoice number but does not know which courier will deliver his or her parcel, he or she cannot search for the invoice.
   * To solve this problem, this connector provides a function that infers the courier matching the invoice number.
   * However, even if this function is called, multiple couriers that may be couriers may appear, so it is impossible to know which company will transport this parcel.
   *
   * Of course, if there is only one target in the list, the probability that it will be that courier is almost 100%.
   */
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

  /**
   * Sweet Tracker Service.
   *
   * Search for the courier list
   *
   * Search for all domestic and international courier companies in Korea.
   * When searching for delivery through the invoice number later, you will need the courier code, so you must search for the courier list first.
   * After searching for the courier list, find your courier and provide the courier code when searching for the invoice.
   */
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

  /**
   * Sweet Tracker Service.
   *
   * Search for the invoice number
   *
   * To search for an invoice, you need the courier code in addition to the invoice number you want to search for.
   * If you know which courier will transport your package, you can search for the courier and get the courier code from the courier whose name matches the courier code.
   * If you know the invoice number but do not know the courier code, you can use 'Search for a list of couriers matching the invoice number' to infer the courier that will transport your package.
   * When you search for a package, you can find out the current location and time of the package, as well as who is transporting the package.
   * In some cases, there may be a phone number, but it is not absolute.
   * In addition, in cases where the product is delivered directly by an commerce company such as Coupang, there are cases where you cannot search even if you have the invoice number.
   */
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
