import { FigmaService } from "@wrtnlabs/connector-figma";
import typia from "typia";

export const test_figma_typia_validation = () => {
  typia.llm.application<FigmaService, "chatgpt">();
};
