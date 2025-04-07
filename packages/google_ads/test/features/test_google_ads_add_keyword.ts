import assert from "assert";
import typia from "typia";
import { v4 } from "uuid";
import { TestGlobal } from "../TestGlobal";
import { GoogleAdsService } from "@wrtnlabs/connector-google-ads/lib/google_ads/GoogleAdsService";
import { test_google_ads_get_ads_by_campaign_id } from "./test_google_ads_get_ad_group";

export const test_google_ads_add_keyword = async () => {
  const googleAdsService = new GoogleAdsService({
    googleAdsAccountId: TestGlobal.env.GOOGLE_ADS_ACCOUNT_ID,
    googleAdsParentSecret: TestGlobal.env.GOOGLE_ADS_PARENT_SECRET,
    googleAdsDeveloperToken: TestGlobal.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    googleClientId: TestGlobal.env.GOOGLE_CLIENT_ID,
    googleClientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
    googleRefreshToken: TestGlobal.env.GOOGLE_TEST_SECRET,
  });

  /**
   * 테스트 용으로 만든 캠페인을 불러온다.
   */
  const [testTarget] = await test_google_ads_get_ads_by_campaign_id();
  if (!testTarget || testTarget.campaign.id !== "21445347960") {
    throw new Error("테스트 용으로 생성한 캠페인을 찾지 못했습니다.");
  }

  /**
   * 키워드 추가
   */
  const newKeyword = v4();
  const res = await googleAdsService.createAdGroupCriteria({
    customerId: "8655555186" as const,
    adGroupResourceName: testTarget.adGroup.resourceName,
    keywords: [newKeyword],
  });

  typia.assert(res);

  /**
   * 광고 목록 조회 시 키워드가 추가되어 있는지를 광고를 조회하여 검증
   */
  const [after] = await test_google_ads_get_ads_by_campaign_id();

  assert(testTarget.keywords.every((el) => el.text !== newKeyword)); // 기존에는 해당 텍스트가 없었음
  assert(after?.keywords.some((el) => el.text === newKeyword)); // 이후에는 생겨 있음

  return res;
};

export const test_google_ads_add_duplicated_keyword = async () => {
  const googleAdsService = new GoogleAdsService({
    googleAdsAccountId: TestGlobal.env.GOOGLE_ADS_ACCOUNT_ID,
    googleAdsParentSecret: TestGlobal.env.GOOGLE_ADS_PARENT_SECRET,
    googleAdsDeveloperToken: TestGlobal.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    googleClientId: TestGlobal.env.GOOGLE_CLIENT_ID,
    googleClientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
    googleRefreshToken: TestGlobal.env.GOOGLE_TEST_SECRET,
  });

  /**
   * 테스트 용으로 만든 캠페인을 불러온다.
   */
  const [testTarget] = await test_google_ads_get_ads_by_campaign_id();
  if (!testTarget || testTarget.campaign.id !== "21445347960") {
    throw new Error("테스트 용으로 생성한 캠페인을 찾지 못했습니다.");
  }

  /**
   * 키워드 추가
   */
  const newKeyword = v4();
  const res1 = await googleAdsService.createAdGroupCriteria({
    customerId: "8655555186" as const,
    adGroupResourceName: testTarget.adGroup.resourceName,
    keywords: [newKeyword],
  });

  typia.assert(res1);

  const res2 = await googleAdsService.createAdGroupCriteria({
    customerId: "8655555186" as const,
    adGroupResourceName: testTarget.adGroup.resourceName,
    keywords: [newKeyword],
  });

  typia.assert(res2);

  /**
   * 광고 목록 조회 시 키워드가 추가되어 있는지를 광고를 조회하여 검증
   */
  const [after] = await test_google_ads_get_ads_by_campaign_id();

  assert(testTarget.keywords.every((el) => el.text !== newKeyword)); // 기존에는 해당 텍스트가 없었음
  assert(after?.keywords.some((el) => el.text === newKeyword)); // 이후에는 생겨 있음
};
