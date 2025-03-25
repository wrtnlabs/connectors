import { GoogleShoppingService } from "@wrtnlabs/connector-google-shopping";
import typia from "typia";

export const test_google_shopping_typia_validation = () => {
  typia.llm.application<GoogleShoppingService, "chatgpt">();
};
