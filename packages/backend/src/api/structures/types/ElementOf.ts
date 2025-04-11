/**
 * @title 배열의 요소 타입을 추론하는 타입.
 */
export type ElementOf<T extends Array<any>> =
  T extends Array<infer Element> ? Element : never;
