import typia from "typia";
import { TestGlobal } from "../TestGlobal";
import { GoogleAdsService } from "@wrtnlabs/connector-google-ads/lib/google_ads/GoogleAdsService";
import { test_google_ads_get_ads_by_campaign_id } from "./test_google_ads_get_ad_group";

export const test_google_ads_get_keywords = async () => {
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
   * 테스트 용으로 만든 캠페인을 불러온다.
   */
  const [testTarget] = await test_google_ads_get_ads_by_campaign_id();
  if (!testTarget || testTarget.campaign.id !== "21445347960") {
    throw new Error("테스트 용으로 생성한 캠페인을 찾지 못했습니다.");
  }

  const res = await googleAdsService.getKeywords({
    customerId: "8655555186" as const,
    adGroupResourceName: testTarget.adGroup.resourceName,
  });

  typia.assert(res);

  return res;
};
