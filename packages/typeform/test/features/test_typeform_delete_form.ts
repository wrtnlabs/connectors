import { TypeformService } from "@wrtnlabs/connector-typeform";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";
import { test_typeform_create_empty_form } from "./test_typeform_create_empty_form";

export const test_typeform_delete_form = async () => {
  const typeformService = new TypeformService({
    clientId: TestGlobal.env.TYPEFORM_CLIENT_ID,
    clientSecret: TestGlobal.env.TYPEFORM_CLIENT_SECRET,
    secret: TestGlobal.env.TYPEFORM_TEST_SECRET,
  });

  const form = await test_typeform_create_empty_form();

  /**
   * Delete Form
   */
  const res = await typeformService.deleteForm({ formId: form.id });
  typia.assert(res);
  return res;
};
