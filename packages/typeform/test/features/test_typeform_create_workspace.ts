import typia from "typia";
import { TestGlobal } from "../TestGlobal";
import { TypeformService } from "@wrtnlabs/connector-typeform";

export const test_typeform_create_workspace = async () => {
  const typeformService = new TypeformService({
    typeformClientId: TestGlobal.env.TYPEFORM_CLIENT_ID,
    typeformClientSecret: TestGlobal.env.TYPEFORM_CLIENT_SECRET,
    typeformRefreshToken: TestGlobal.env.TYPEFORM_TEST_SECRET,
  });

  /**
   * Create Workspace
   */
  const res = await typeformService.createWorkspace({
    name: "create-workspace-test",
  });
  typia.assert(res);
  return res;
};
