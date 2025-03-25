import { HancellService } from "@wrtnlabs/connector-hancell";
import typia from "typia";

export const test_hancell_typia_validation = async () => {
  typia.llm.application<HancellService, "chatgpt">();
};
