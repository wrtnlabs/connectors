import typia from "typia";
import { TestGlobal } from "../TestGlobal";
import { TypeformService } from "@wrtnlabs/connector-kakao-map/lib/typeform/TypeformService";

export const test_typeform_update_form = async () => {
  const typeformService = new TypeformService({
    clientId: TestGlobal.env.TYPEFORM_CLIENT_ID,
    clientSecret: TestGlobal.env.TYPEFORM_CLIENT_SECRET,
    secret: TestGlobal.env.TYPEFORM_TEST_SECRET,
  });

  /**
   * Update Dropdown, Multiple Choice or Ranking Question Options in Typeform.
   */
  const res = await typeformService.updateFormFieldValue({
    formId: "ZbhNmUjP",
    fieldId: "gqa4A59aC2QC",
    value: ["가", "나", "다", "라", "마"],
  });
  typia.assert(res);
  return res;
};
