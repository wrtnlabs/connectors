import { changeImageSize } from "@wrtnlabs/connector-shared/src/utils/imageUtil";
import { deepStrictEqual } from "assert";

/**
 * 정방형 이미지의 가로형으로의 편집
 */
export const test_google_ads_get_size_1_1 = async () => {
  const response = changeImageSize({
    left: 0,
    top: 0,
    width: 600,
    height: 600,
    ratio: 1.91,
  });

  deepStrictEqual(response, { left: 0, top: 143, width: 600, height: 314 });
};

/**
 * 정방형 이미지를 정방형으로 편집하는 경우
 */
export const test_google_ads_get_size_1_2 = async () => {
  const response = changeImageSize({
    left: 0,
    top: 0,
    width: 600,
    height: 600,
    ratio: 1,
  });

  deepStrictEqual(response, { left: 0, top: 0, width: 600, height: 600 });
};

/**
 * 정방형 이미지를 세로형으로 편집하는 경우
 */
export const test_google_ads_get_size_1_3 = async () => {
  const response = changeImageSize({
    left: 0,
    top: 0,
    width: 600,
    height: 600,
    ratio: 0.8,
  });

  deepStrictEqual(response, { left: 60, top: 0, width: 480, height: 600 });
};

/**
 * 세로형 이미지의 가로형으로의 편집
 */
export const test_google_ads_get_size_2_1 = async () => {
  const response = changeImageSize({
    left: 0,
    top: 0,
    width: 600,
    height: 800,
    ratio: 1.91,
  });

  deepStrictEqual(response, { left: 0, top: 243, width: 600, height: 314 });
};

/**
 * 세로형 이미지를 정방형으로 편집하는 경우
 */
export const test_google_ads_get_size_2_2 = async () => {
  const response = changeImageSize({
    left: 0,
    top: 0,
    width: 600,
    height: 800,
    ratio: 1,
  });

  deepStrictEqual(response, { left: 0, top: 100, width: 600, height: 600 });
};

/**
 * 세로형 이미지를 세로형으로 편집하는 경우
 */
export const test_google_ads_get_size_2_3 = async () => {
  const response = changeImageSize({
    left: 0,
    top: 0,
    width: 600,
    height: 800,
    ratio: 0.8,
  });

  deepStrictEqual(response, { left: 0, top: 25, width: 600, height: 750 });
};

/**
 * 가로형 이미지의 가로형으로의 편집
 */
export const test_google_ads_get_size_3_1 = async () => {
  const response = changeImageSize({
    left: 0,
    top: 0,
    width: 800,
    height: 600,
    ratio: 1.91,
  });

  deepStrictEqual(response, { left: 0, top: 91, width: 800, height: 419 });
};

/**
 * 가로형 이미지를 정방형으로 편집하는 경우
 */
export const test_google_ads_get_size_3_2 = async () => {
  const response = changeImageSize({
    left: 0,
    top: 0,
    width: 800,
    height: 600,
    ratio: 1,
  });

  deepStrictEqual(response, { left: 100, top: 0, width: 600, height: 600 });
};

/**
 * 가로형 이미지를 세로형으로 편집하는 경우
 */
export const test_google_ads_get_size_3_3 = async () => {
  const response = changeImageSize({
    left: 0,
    top: 0,
    width: 800,
    height: 600,
    ratio: 0.8,
  });

  deepStrictEqual(response, { left: 160, top: 0, width: 480, height: 600 });
};
