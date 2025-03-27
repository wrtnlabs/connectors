import typia from "typia";
import { TestGlobal } from "../TestGlobal";
import { GoogleAdsService } from "@wrtnlabs/connector-google-ads/lib/google_ads/GoogleAdsService";
import { test_google_ads_get_clients } from "./test_google_ads_get_clients";

export const test_google_ads_get_campaigns = async () => {
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

  const clients = await test_google_ads_get_clients();

  const id = clients.map((el) => el.id).find((el) => el === "8655555186")!; // individual account.
  const campaigns = await googleAdsService.getCampaigns({
    customerId: id,
  });

  typia.assert(campaigns);
  return campaigns;
};
