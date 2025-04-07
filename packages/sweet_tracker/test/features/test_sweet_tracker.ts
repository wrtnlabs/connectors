import { SweetTrackerService } from "@wrtnlabs/connector-sweet-tracker";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

export const test_sweet_tracker_get_companies = async () => {
  const sweetTrackerService = new SweetTrackerService({
    sweetTrackerApiKey: TestGlobal.env.TEST_SWEET_TRACKER_KEY,
  });

  const res = await sweetTrackerService.getCompanyList();

  typia.assert(res);
  return res;
};

export const test_sweet_tracker_get_recommended_companies = async () => {
  const sweetTrackerService = new SweetTrackerService({
    sweetTrackerApiKey: TestGlobal.env.TEST_SWEET_TRACKER_KEY,
  });

  const res = await sweetTrackerService.getRecommendedCompanyList({
    t_invoice: TestGlobal.env.TEST_SWEET_TRACKER_T_INVOICE,
  });

  typia.assert(res);
  return res;
};

export const test_sweet_tracker_get_tracking_info = async () => {
  const companies = await test_sweet_tracker_get_recommended_companies();

  const sweetTrackerService = new SweetTrackerService({
    sweetTrackerApiKey: TestGlobal.env.TEST_SWEET_TRACKER_KEY,
  });

  const res = await sweetTrackerService.getTrackingInfo({
    t_invoice: TestGlobal.env.TEST_SWEET_TRACKER_T_INVOICE,
    t_code: companies.Recommend.at(0)?.Code as string,
  });

  typia.assert(res);
  return res;
};

export const test_sweet_tracker_get_tracking_info_2 = async () => {
  const sweetTrackerService = new SweetTrackerService({
    sweetTrackerApiKey: TestGlobal.env.TEST_SWEET_TRACKER_KEY,
  });

  const res = await sweetTrackerService.getTrackingInfo({
    t_invoice: "52429929001",
    t_code: "17",
  });

  return res;
};
