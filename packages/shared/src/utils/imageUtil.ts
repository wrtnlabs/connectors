import axios from "axios";
import { IImage } from "../structures";
import sharp from "sharp";

/**
 * Image Service.
 *
 * Get cropped image file from url.
 *
 * @param input - Image url and target ratio.
 * @returns Base64 image.
 */
export async function getCroppedImage(
  input: IImage.IGetImageFileInput,
): Promise<IImage.IGetImageFileOutput> {
  const { data } = await axios.get(input.imageUrl, {
    responseType: "arraybuffer",
  });
  const image = sharp(data);

  const metadata = await image.metadata();

  const size: IImage.ISize = {
    left: 0,
    top: 0,
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
  };

  const targetSize = changeImageSize({ ...input, ...size });

  const cropped = await image.extract(targetSize).toBuffer();

  return {
    base64Image: cropped.toString("base64"),
    size: targetSize,
  };
}

/**
 * Image Service.
 *
 * Calculate size of image according to target ratio.
 *
 * @param input - Original size of image and target ratio.
 * @returns Size of image.
 */
export function changeImageSize(input: IImage.IGetSizeInput): IImage.ISize {
  let maxWidth: number;
  let maxHeight: number;

  if (input.width / input.height > input.ratio) {
    // 원본 사각형이 비율보다 더 넓을 때, 높이를 기준으로 최대 너비 계산
    maxHeight = input.height;
    maxWidth = Math.round(input.height * input.ratio);
  } else {
    // 원본 사각형이 비율보다 더 좁을 때, 너비를 기준으로 최대 높이 계산
    maxWidth = input.width;
    maxHeight = Math.round(input.width / input.ratio);
  }

  return {
    top: Math.round((input.height - maxHeight) / 2),
    left: Math.round((input.width - maxWidth) / 2),
    width: maxWidth,
    height: maxHeight,
  };
}
