import { OpenDataService } from "@wrtnlabs/connector-open-data";
import typia from "typia";

export const test_open_data_typia_validation = async () => {
  typia.llm.application<OpenDataService, "chatgpt">();
};
