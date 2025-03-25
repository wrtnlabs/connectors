import typia from "typia";
import { TypeformService } from "@wrtnlabs/connector-typeform";
import { TestGlobal } from "../TestGlobal";

export const test_typeform_get_form = async () => {
  const typeformService = new TypeformService({
    clientId: TestGlobal.env.TYPEFORM_CLIENT_ID,
    clientSecret: TestGlobal.env.TYPEFORM_CLIENT_SECRET,
    secret: TestGlobal.env.TYPEFORM_TEST_SECRET,
  });

  /**
   * Get Forms
   */
  const res = await typeformService.getForms();
  typia.assert(res);
  return res;
};
