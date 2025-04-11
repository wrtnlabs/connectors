import type { Allow } from "./Allow";
import type { DeepStrictObjectKeys } from "./DeepStrictObjectKeys";
import type { RemoveArraySymbol } from "./RemoveArraySymbol";
import type { StringType } from "./StringType";
import type { ToObject } from "./ToObject";
import type { ValueOf } from "./ValueOf";

/**
 * ```ts
 * type Example1 = GetType<{ a: { b: { c: number } } }, "a.b">; // { c: number }
 * type Example = GetType<{ a: { b: { c: number } } }, "a.b.c">; // number
 * ```
 *
 * @title 어떤 인터페이스의 특정 키의 타입을 꺼내는 타입.
 */
export type GetType<T extends object, K extends DeepStrictObjectKeys<T>> =
  StringType.Split<K, "."> extends [infer First extends keyof T]
    ? ValueOf<ToObject<Pick<T, First>>>
    : StringType.Split<K, "."> extends [
          infer First extends string,
          ...infer Rest extends string[],
        ]
      ? RemoveArraySymbol<First> extends keyof T
        ? ValueOf<ToObject<Pick<T, RemoveArraySymbol<First>>>> extends object
          ? ValueOf<ToObject<Pick<T, RemoveArraySymbol<First>>>> extends Array<
              infer E
            >
            ? E extends object
              ? GetType<
                  E,
                  Allow<StringType.Join<Rest, ".">, DeepStrictObjectKeys<E>>
                >
              : E
            : GetType<
                ValueOf<ToObject<Pick<T, RemoveArraySymbol<First>>>>,
                Allow<
                  StringType.Join<Rest, ".">,
                  DeepStrictObjectKeys<
                    ValueOf<ToObject<Pick<T, RemoveArraySymbol<First>>>>
                  >
                >
              >
          : never
        : never
      : never;
