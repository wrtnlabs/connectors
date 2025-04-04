import {
  GoogleImageService,
  IGoogleImageService,
} from "@wrtnlabs/connector-google-image";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

export const test_google_image = async () => {
  const googleImageService = new GoogleImageService({
    serpApiKey: TestGlobal.env.SERP_API_KEY,
  });

  const results = await googleImageService.search({
    query: "베이직 화이트 셔츠",
    lang: "ko",
    ratio: "s",
  });

  typia.assert<IGoogleImageService.IResponse[]>(results);
};
