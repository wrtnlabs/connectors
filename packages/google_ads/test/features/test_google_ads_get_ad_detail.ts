// import typia from "typia";
// import { TestGlobal } from "../TestGlobal";
// import { GoogleAdsService } from "@wrtnlabs/connector-google-ads/lib/google_ads/GoogleAdsService";

// export const test_google_ads_get_ad_detail = async () => {
//   const googleAdsService = new GoogleAdsService({
//     googleAds: {
//       parentSecret: TestGlobal.env.GOOGLE_ADS_PARENT_SECRET,
//       accountId: TestGlobal.env.GOOGLE_ADS_ACCOUNT_ID,
//       developerToken: TestGlobal.env.GOOGLE_ADS_DEVELOPER_TOKEN,
//     },
//     google: {
//       clientId: TestGlobal.env.GOOGLE_CLIENT_ID,
//       clientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
//       secret: TestGlobal.env.GOOGLE_TEST_SECRET,
//     },
//   });

//   const displayAd = await googleAdsService.getAdGroupAdDetail({
//     customerId: "8655555186",
//     adGroupAdResourceName:
//       "customers/8655555186/adGroupAds/161670049861~705918049667",
//   });

//   typia.assert(displayAd);

//   const searchAd = await googleAdsService.getAdGroupAdDetail({
//     customerId: "8655555186",
//     adGroupAdResourceName:
//       "customers/8655555186/adGroupAds/166101426442~705408475349",
//   });

//   typia.assert(searchAd);
// };
