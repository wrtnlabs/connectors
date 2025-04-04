import typia from "typia";
import { TestGlobal } from "../TestGlobal";
import { TypeformService } from "@wrtnlabs/connector-typeform";

export const test_typeform_create_empty_form = async () => {
  const typeformService = new TypeformService({
    typeformClientId: TestGlobal.env.TYPEFORM_CLIENT_ID,
    typeformClientSecret: TestGlobal.env.TYPEFORM_CLIENT_SECRET,
    typeformRefreshToken: TestGlobal.env.TYPEFORM_TEST_SECRET,
  });

  /**
   * Create Empty form
   */
  const res = await typeformService.createEmptyForm({
    name: "create-empty-form-test",
  });
  typia.assert(res);
  return res;
};
