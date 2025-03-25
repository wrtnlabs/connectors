import { ImageService } from "@wrtnlabs/connector-image";
import typia from "typia";

export const test_image_typia_validation = async () => {
  typia.llm.application<ImageService, "chatgpt">();
};
