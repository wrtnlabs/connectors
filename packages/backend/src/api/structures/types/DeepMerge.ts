/**
 * ```ts
 * type Example = DeepMerge<{ a: { b: 1 } }, { a: { c: 2 } }> // { a: { b: 1, c: 2 } }
 * ```
 *
 * @title 두 객체 제네릭 타입 T, P를 받아 중첩된 객체 내부를 따라가며 합성해주는 타입.
 */
export type DeepMerge<T extends object, P extends object> = {
  [key in keyof T | keyof P]: key extends keyof T
    ? key extends keyof P
      ? T[key] extends object
        ? P[key] extends object
          ? DeepMerge<T[key], P[key]>
          : T[key]
        : T[key]
      : T[key]
    : key extends keyof P
      ? key extends keyof T
        ? P[key] extends object
          ? T[key] extends object
            ? DeepMerge<T[key], P[key]>
            : P[key]
          : P[key]
        : P[key]
      : never;
};
