import typia from "typia";
import { TestGlobal } from "../TestGlobal";
import { TypeformService } from "@wrtnlabs/connector-typeform";
import { test_typeform_create_workspace } from "./test_typeform_create_workspace";

export const test_typeform_delete_workspace = async () => {
  const typeformService = new TypeformService({
    typeformClientId: TestGlobal.env.TYPEFORM_CLIENT_ID,
    typeformClientSecret: TestGlobal.env.TYPEFORM_CLIENT_SECRET,
    typeformRefreshToken: TestGlobal.env.TYPEFORM_TEST_SECRET,
  });

  const workspace = await test_typeform_create_workspace();

  /**
   * Delete Workspace
   */
  const res = await typeformService.deleteWorkspace({
    workspaceId: workspace.id,
  });
  typia.assert(res);
  return res;
};
