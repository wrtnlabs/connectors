import type { DeepStrictObjectKeys } from "./DeepStrictObjectKeys";
import type { DeepStrictOmit } from "./DeepStrictOmit";
import type { ElementOf } from "./ElementOf";

type RemoveLastProperty<S extends string> =
  S extends `${infer First}.${infer Last}`
    ? First extends `${infer ObjectPart}[*]`
      ? ObjectPart | `${First}.${RemoveLastProperty<Last>}`
      : `${First}` | `${First}.${RemoveLastProperty<Last>}`
    : never;

type RemoveAfterDot<
  T extends object,
  K extends string,
> = K extends `${infer First}.${infer Last}`
  ? First extends keyof T
    ? T[First] extends Array<any>
      ? `${First}[*].${string}`
      : T[First] extends object
        ? `${First}.${RemoveAfterDot<T[First], Last>}`
        : never
    : First extends "[*]"
      ? T extends Array<any>
        ? RemoveAfterDot<ElementOf<T>, Last>
        : never
      : First extends `${infer Second extends string}[*]`
        ? Second extends keyof T
          ? T[Second] extends object
            ? RemoveAfterDot<T[Second], Last>
            : never
          : never
        : never
  : K extends keyof T
    ? T[K] extends Array<any>
      ? `${K}[*].${string}`
      : `${K}.${string}`
    : never;

/**
 * {@link DeepStrictObjectKeys} 을 이용해서 뽑을 키를 고를 수 있다.
 *
 * ```ts
 * type Example1 = DeepStrictMyPick<{ a: { b: 1; c: 2 } }, "a.b">;
 * type Example2 = DeepStrictMyPick<{ a: { b: 1; c: { d: number }[] } }, "a.c[*].d">;
 * type Example3 = DeepStrictMyPick<{ a: 1 }[], "[*].a">;
 * ```
 *
 * @title 인터페이스에서 특정 키만을 뽑는 타입.
 */
export type DeepStrictPick<
  T extends object,
  K extends DeepStrictObjectKeys<T>,
> = DeepStrictOmit<
  T,
  Exclude<
    DeepStrictObjectKeys<T>,
    K | RemoveLastProperty<K> | RemoveAfterDot<T, K>
  >
>;
