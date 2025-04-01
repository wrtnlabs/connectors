import typia from "typia";
import { ImageService } from "@wrtnlabs/connector-image";
export const test_image = async () => {
  const imageService = new ImageService();

  const res = await imageService.getCroppedImage({
    imageUrl:
      "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
    ratio: 1.91,
  });

  typia.assert(res);

  const size = imageService.changeImageSize({
    width: res.size.width,
    height: res.size.height,
    top: 0,
    left: 0,
    ratio: 1,
  });

  typia.assert(size);
};
