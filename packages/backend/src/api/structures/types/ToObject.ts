/**
 * @title 타입을 `object` 타입으로 변환해주는 타입
 */
export type ToObject<T> = T extends Record<any, any> ? T : never;
