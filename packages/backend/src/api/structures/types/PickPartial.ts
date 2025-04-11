import { StrictOmit } from "./strictOmit";

/**
 * Pick된 대상만을 Partial로 감싸는 타입
 */
export type PickPartial<T extends object, K extends keyof T> = Partial<{
  [Key in K]: T[Key];
}> & {
  [Key in keyof StrictOmit<T, K>]: T[Key];
};
