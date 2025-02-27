import typia from "typia";
import { XService } from "../../src/x/XService";
import { TestGlobal } from "../TestGlobal";

export const test_x_get_pre_defined_influencers = async () => {
  const xService = new XService({
    clientId: TestGlobal.env.X_CLIENT_ID,
    clientSecret: TestGlobal.env.X_CLIENT_SECRET,
    bearerToken: TestGlobal.env.X_TEST_SECRET,
  });

  const res = await xService.getPreDefinedInfluencers();

  typia.assert(res);
  return res;
};
