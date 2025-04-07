import typia from "typia";
import { TestGlobal } from "../TestGlobal";
import { GoogleAdsService } from "@wrtnlabs/connector-google-ads/lib/google_ads/GoogleAdsService";
import { test_google_ads_get_clients } from "./test_google_ads_get_clients";

export const test_google_ads_get_campaigns = async () => {
  const googleAdsService = new GoogleAdsService({
    googleAdsAccountId: TestGlobal.env.GOOGLE_ADS_ACCOUNT_ID,
    googleAdsParentSecret: TestGlobal.env.GOOGLE_ADS_PARENT_SECRET,
    googleAdsDeveloperToken: TestGlobal.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    googleClientId: TestGlobal.env.GOOGLE_CLIENT_ID,
    googleClientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
    googleRefreshToken: TestGlobal.env.GOOGLE_TEST_SECRET,
  });

  const clients = await test_google_ads_get_clients();

  const id = clients.map((el) => el.id).find((el) => el === "8655555186")!; // individual account.
  const campaigns = await googleAdsService.getCampaigns({
    customerId: id,
  });

  typia.assert(campaigns);
  return campaigns;
};
