import typia from "typia";
import { XService } from "../../src/x/XService";
import { TestGlobal } from "../TestGlobal";

export const test_x_get_pre_defined_influencers = async () => {
  const xService = new XService({
    xClientId: TestGlobal.env.X_CLIENT_ID,
    xClientSecret: TestGlobal.env.X_CLIENT_SECRET,
    xBearerToken: TestGlobal.env.X_TEST_SECRET,
  });

  const res = await xService.getPreDefinedInfluencers();

  typia.assert(res);
  return res;
};
