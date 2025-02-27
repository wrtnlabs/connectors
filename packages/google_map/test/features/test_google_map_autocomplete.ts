import { GoogleMapService } from "@wrtnlabs/connector-google-map";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

export const test_google_map_autocomplete = async () => {
  const googleMapService = new GoogleMapService({
    googleApiKey: TestGlobal.env.GOOGLE_API_KEY,
    serpApiKey: TestGlobal.env.SERP_API_KEY,
  });

  const res = await googleMapService.autocomplete({
    input: "강남역 맛집",
  });

  typia.assertEquals(res);

  const res2 = await googleMapService.autocomplete({
    input: "맛집",
    circle: {
      latitude: 37.4979, // 강남역을 의미한다.
      longitude: 127.0276,
      radius: 500,
    },
  });

  typia.assertEquals(res2);
};
