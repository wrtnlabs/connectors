import { GoogleDocsService } from "@wrtnlabs/connector-google-docs";
import typia from "typia";

export const test_google_docs_typia_validation = async () => {
  typia.llm.application<GoogleDocsService, "chatgpt">();
};
