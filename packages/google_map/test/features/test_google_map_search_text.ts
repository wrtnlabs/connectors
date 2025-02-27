import { GoogleMapService } from "@wrtnlabs/connector-google-map";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

export const test_google_map_search_text = async () => {
  const googleMapService = new GoogleMapService({
    googleApiKey: TestGlobal.env.GOOGLE_API_KEY,
    serpApiKey: TestGlobal.env.SERP_API_KEY,
  });

  const res = await googleMapService.searchText({
    textQuery: "강남역 맛집",
  });

  typia.assert(res);
};
