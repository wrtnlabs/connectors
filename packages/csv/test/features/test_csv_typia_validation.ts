import { CsvService } from "@wrtnlabs/connector-csv";
import typia from "typia";

export const test_csv_typia_validation = () => {
  typia.llm.application<CsvService, "chatgpt">();
};
