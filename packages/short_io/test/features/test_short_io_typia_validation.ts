import { ShortIoService } from "@wrtnlabs/connector-short-io";
import typia from "typia";

export const test_short_io_typia_validation = async () => {
  typia.llm.application<ShortIoService, "chatgpt">();
};
