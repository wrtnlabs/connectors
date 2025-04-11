/**
 * @title 유니온을 인터섹션 타입으로 바꿔주는 타입.
 */
export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;
