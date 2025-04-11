/**
 * @title A가 B가 되게 형변환해주는 타입
 */
export type Allow<A, B> = A extends B ? A : never;
