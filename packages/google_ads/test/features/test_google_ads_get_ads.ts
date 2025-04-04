import typia from "typia";
import { TestGlobal } from "../TestGlobal";
import { GoogleAdsService } from "@wrtnlabs/connector-google-ads/lib/google_ads/GoogleAdsService";

export const test_google_ads_get_ads = async () => {
  const googleAdsService = new GoogleAdsService({
    googleAdsAccountId: TestGlobal.env.GOOGLE_ADS_ACCOUNT_ID,
    googleAdsParentSecret: TestGlobal.env.GOOGLE_ADS_PARENT_SECRET,
    googleAdsDeveloperToken: TestGlobal.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    googleClientId: TestGlobal.env.GOOGLE_CLIENT_ID,
    googleClientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
    googleRefreshToken: TestGlobal.env.GOOGLE_TEST_SECRET,
  });

  const res = await googleAdsService.getAdGroupAds({
    customerId: "8655555186",
  });

  typia.assert(res);
};
