import { KoreaEximbankService } from "@wrtnlabs/connector-korea-eximbank";
import typia from "typia";

export const test_korea_eximbank_typia_validator = async () => {
  typia.llm.application<KoreaEximbankService, "chatgpt">();
};
