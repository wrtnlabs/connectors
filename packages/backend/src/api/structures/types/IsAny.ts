/**
 * @title `any` 타입을 검증하는 타입.
 */
export type IsAny<T> = 0 extends 1 & T ? true : false;
