import { deepStrictEqual } from "assert";
import { test_google_ads_get_campaigns } from "./test_google_ads_get_campaigns";
import { TestGlobal } from "../TestGlobal";
import { GoogleAdsService } from "@wrtnlabs/connector-google-ads/lib/google_ads/GoogleAdsService";

export const test_google_ads_update_campaign = async () => {
  const googleAdsService = new GoogleAdsService({
    googleAdsAccountId: TestGlobal.env.GOOGLE_ADS_ACCOUNT_ID,
    googleAdsParentSecret: TestGlobal.env.GOOGLE_ADS_PARENT_SECRET,
    googleAdsDeveloperToken: TestGlobal.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    googleClientId: TestGlobal.env.GOOGLE_CLIENT_ID,
    googleClientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
    googleRefreshToken: TestGlobal.env.GOOGLE_TEST_SECRET,
  });

  /**
   * 수정할 캠페인을 조회한다.
   */
  const before = (await test_google_ads_get_campaigns()).find(
    (el) => el.campaign.id === "21445347960",
  );

  /**
   * 비용을 수정한다.
   */
  await googleAdsService.updateCampaign({
    customerId: "8655555186",
    campaignResourceName: "customers/8655555186/campaigns/21445347960",
    campaignBudget: 2,
    endDate: "2030-01-02",
  });

  /**
   * 수정 후 재조회하여 테스트 통과 확인.
   */
  const after = (await test_google_ads_get_campaigns()).find(
    (el) => el.campaign.id === "21445347960",
  );
  deepStrictEqual(after?.campaignBudget.amountMicros, `${2 * 1000000}`);
  deepStrictEqual(after?.campaign.endDate, `2030-01-02`);

  /**
   * 다시 원상 복귀시킨다.
   */
  await googleAdsService.updateCampaign({
    customerId: "8655555186",
    campaignResourceName: "customers/8655555186/campaigns/21445347960",
    campaignBudget: Number(before?.campaignBudget.amountMicros) / 1000000,
    endDate: before?.campaign.endDate,
  });
};
