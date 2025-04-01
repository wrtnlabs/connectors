import { deepStrictEqual } from "assert";
import { TestGlobal } from "../TestGlobal";
import { GoogleAdsService } from "@wrtnlabs/connector-google-ads/lib/google_ads/GoogleAdsService";

export const test_google_ads_update_ad = async () => {
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

  /**
   * 광고를 실행 후 상태를 조회하여 동일한지 확인한다.
   */
  await googleAdsService.updateAd({
    customerId: "8655555186",
    adGroupAdResourceName:
      "customers/8655555186/adGroupAds/161670049861~705918049667",
    status: "ENABLED",
  });

  const detail1 = await googleAdsService.getAdGroupAdDetail({
    customerId: "8655555186",
    adGroupAdResourceName:
      "customers/8655555186/adGroupAds/161670049861~705918049667",
  });

  deepStrictEqual(detail1.status, "ENABLED");

  /**
   * 광고를 종료 후 상태를 조회하여 동일한지 확인한다.
   */
  await googleAdsService.updateAd({
    customerId: "8655555186",
    adGroupAdResourceName:
      "customers/8655555186/adGroupAds/161670049861~705918049667",
    status: "PAUSED",
  });

  const detail2 = await googleAdsService.getAdGroupAdDetail({
    customerId: "8655555186",
    adGroupAdResourceName:
      "customers/8655555186/adGroupAds/161670049861~705918049667",
  });

  deepStrictEqual(detail2.status, "PAUSED");
};
