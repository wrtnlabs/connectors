import { deepStrictEqual } from "assert";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";
import { GoogleAdsService } from "@wrtnlabs/connector-google-ads/lib/google_ads/GoogleAdsService";

export const test_google_ads_get_clients = async () => {
  const googleAdsService = new GoogleAdsService({
    googleAds: {
      parentSecret: TestGlobal.env.GOOGLE_ADS_PARENT_SECRET,
      accountId: TestGlobal.env.GOOGLE_ADS_ACCOUNT_ID,
      developerToken: TestGlobal.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    },
    google: {
      clientId: TestGlobal.env.GOOGLE_CLIENT_ID,
      clientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
      secret: TestGlobal.env.GOOGLE_TEST_SECRET,
    },
  });

  const customers = await googleAdsService.getCustomers();

  typia.assert(customers);
  deepStrictEqual(customers.length >= 1, true);

  return customers;
};
