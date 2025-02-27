import {
  GoogleMapService,
  IGoogleMapService,
} from "@wrtnlabs/connector-google-map";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

export const test_google_map = async () => {
  const googleMapService = new GoogleMapService({
    googleApiKey: TestGlobal.env.GOOGLE_API_KEY,
    serpApiKey: TestGlobal.env.SERP_API_KEY,
  });

  const results = await googleMapService.search({
    keyword: "도쿄 맛집",
  });
  typia.assert<IGoogleMapService.IResponse[]>(results);

  const reviews = await googleMapService.review({
    place_id: results[0]!.place_id,
  });
  typia.assert<IGoogleMapService.IReviewResponse[]>(reviews);
};
