import typia from "typia";
import { XService } from "../../src/x/XService";
import { TestGlobal } from "../TestGlobal";

export const test_x_get_users = async () => {
  const xService = new XService({
    clientId: TestGlobal.env.X_CLIENT_ID,
    clientSecret: TestGlobal.env.X_CLIENT_SECRET,
    bearerToken: TestGlobal.env.X_TEST_SECRET,
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
