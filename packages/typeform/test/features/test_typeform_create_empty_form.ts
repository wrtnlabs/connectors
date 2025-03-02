import typia from "typia";
import { TestGlobal } from "../TestGlobal";
import { TypeformService } from "@wrtnlabs/connector-kakao-map/lib/typeform/TypeformService";

export const test_typeform_create_empty_form = async () => {
  const typeformService = new TypeformService({
    clientId: TestGlobal.env.TYPEFORM_CLIENT_ID,
    clientSecret: TestGlobal.env.TYPEFORM_CLIENT_SECRET,
    secret: TestGlobal.env.TYPEFORM_TEST_SECRET,
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
