import { GoogleSearchService } from "@wrtnlabs/connector-google-search";
import typia from "typia";

export const testGoogleSearchTypiaValidation = () => {
  typia.llm.application<GoogleSearchService, "chatgpt">();
};
