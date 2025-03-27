import typia from "typia";
import { TestGlobal } from "../TestGlobal";
import { GoogleAdsService } from "@wrtnlabs/connector-google-ads/lib/google_ads/GoogleAdsService";

export const test_google_ads_get_ads = async () => {
  const googleAdsService = new GoogleAdsService({
    googleAds: {
      parentSecret: TestGlobal.env.GOOGLE_ADS_PARENT_SECRET,
      accountId: TestGlobal.env.GOOGLE_ADS_ACCOUNT_ID,
      developerToken: TestGlobal.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    },
    google: {
      clientId: TestGlobal.env.GOOGLE_CLIENT_ID,
      clientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
      refreshToken: TestGlobal.env.GOOGLE_TEST_SECRET,
    },
  });

  const res = await googleAdsService.getAdGroupAds({
    customerId: "8655555186",
  });

  typia.assert(res);
};
