import { ExcelService } from "@wrtnlabs/connector-excel";
import typia from "typia";

export const test_excel_typia_validation = async () => {
  typia.llm.application<ExcelService, "chatgpt">();
};
