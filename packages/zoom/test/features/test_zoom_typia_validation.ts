import { ZoomService } from "@wrtnlabs/connector-zoom";
import typia from "typia";

export const test_zoom_typia_validation = async () => {
  typia.llm.application<ZoomService, "chatgpt">();
};
