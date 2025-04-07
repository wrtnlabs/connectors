import typia from "typia";
import { XService } from "../../src/x/XService";
import { TestGlobal } from "../TestGlobal";

export const test_x_get_users = async () => {
  const xService = new XService({
    xClientId: TestGlobal.env.X_CLIENT_ID,
    xClientSecret: TestGlobal.env.X_CLIENT_SECRET,
    xBearerToken: TestGlobal.env.X_TEST_SECRET,
  });

  const res = await xService.getUsers({
    userNames: [
      "elonmusk",
      "ivanhzhao",
      "sama",
      "POTUS",
      "realDonaldTrump",
      "hwchase17",
      "ilyasut",
      "miramurati",
    ],
  });
  typia.assert(res);
  return res;
};
