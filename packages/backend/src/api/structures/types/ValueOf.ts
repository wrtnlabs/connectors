/**
 * @title 제네릭 T의 모든 값 타입을 추론하는 타입
 */
export type ValueOf<T> = T[keyof T];
