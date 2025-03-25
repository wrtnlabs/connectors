import typia from "typia";
import { TestGlobal } from "../TestGlobal";
import { TypeformService } from "@wrtnlabs/connector-typeform";

export const test_typeform_get_workspace = async () => {
  const typeformService = new TypeformService({
    clientId: TestGlobal.env.TYPEFORM_CLIENT_ID,
    clientSecret: TestGlobal.env.TYPEFORM_CLIENT_SECRET,
    secret: TestGlobal.env.TYPEFORM_TEST_SECRET,
  });

  /**
   * Get Workspaces
   */
  const res = await typeformService.getWorkspaces();
  typia.assert(res);
  return res;
};
