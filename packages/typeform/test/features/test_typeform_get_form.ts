import typia from "typia";
import { TypeformService } from "@wrtnlabs/connector-typeform";
import { TestGlobal } from "../TestGlobal";

export const test_typeform_get_form = async () => {
  const typeformService = new TypeformService({
    typeformClientId: TestGlobal.env.TYPEFORM_CLIENT_ID,
    typeformClientSecret: TestGlobal.env.TYPEFORM_CLIENT_SECRET,
    typeformRefreshToken: TestGlobal.env.TYPEFORM_TEST_SECRET,
  });

  /**
   * Get Forms
   */
  const res = await typeformService.getForms();
  typia.assert(res);
  return res;
};
