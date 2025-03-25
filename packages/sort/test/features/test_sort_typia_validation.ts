import { SortService } from "@wrtnlabs/connector-sort";
import typia from "typia";

export const test_sort_typia_validation = async () => {
  typia.llm.application<SortService, "chatgpt">();
};
