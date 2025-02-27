import {
  GoogleHotelService,
  IGoogleHotelService,
} from "@wrtnlabs/connector-google-hotel";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

export const test_google_hotel = async () => {
  const googleHotelService = new GoogleHotelService({
    apiKey: TestGlobal.env.SERP_API_KEY,
  });

  const today = new Date();
  const oneWeekLater = new Date();
  oneWeekLater.setDate(today.getDate() + 7);

  const formatDate = (date: Date) => date.toISOString().split("T")[0]!;
  const results = await googleHotelService.search({
    keyword: "Tokyo",
    check_in_date: formatDate(today),
    check_out_date: formatDate(oneWeekLater),
    adults: 2,
    children: 0,
    // sort_by: "3",
    // rating: "8",
    // type: ["12", "13"],
    // hotel_class: ["4", "5"],
    // free_cancellation: true,
    max_results: 10,
  });
  typia.assert<IGoogleHotelService.IResponse[]>(results);
};
