import type { DeepStrictMerge } from "./DeepStrictMerge";
import { DeepStrictObjectKeys } from "./DeepStrictObjectKeys";
import { DeepStrictOmit } from "./DeepStrictOmit";
import { GetType } from "./GetType";
import type { RemoveArraySymbol } from "./RemoveArraySymbol";
import { StringToDeepObject } from "./StringToDeepObject";
import { ToObject } from "./ToObject";

type __FirstElementsOfTuples<T extends [string, string, any?][]> = T extends [
  infer First extends [string, string, any?],
  ...infer Rest extends [string, string, any?][],
]
  ? [First[0], ...__FirstElementsOfTuples<Rest>]
  : [];

/**
 * ```ts
 * type Example = Rename<{ a: {}; b: number }, [["b", "a.b"]]>; // { a: { b: number } }
 * ```
 *
 * @title 인터페이스에서 특정 타입의 이름과 위치를 변경하는 타입.
 */
export type Rename<
  T extends object,
  Commands extends [DeepStrictObjectKeys<T>, string, any?][],
  AllKeys extends
    DeepStrictObjectKeys<T> = __FirstElementsOfTuples<Commands>[number],
> = Commands extends [
  [
    infer Before extends DeepStrictObjectKeys<T>,
    infer After extends string,
    infer Type extends any,
  ],
  ...infer RestCommands extends [DeepStrictObjectKeys<T>, string, any?][],
]
  ? DeepStrictMerge<
      DeepStrictMerge<
        DeepStrictOmit<T, AllKeys>,
        ToObject<StringToDeepObject<RemoveArraySymbol<After>, Type>>
      >,
      Rename<T, RestCommands, AllKeys>
    >
  : Commands extends [
        [
          infer Before extends DeepStrictObjectKeys<T>,
          infer After extends string,
        ],
        ...infer RestCommands extends [DeepStrictObjectKeys<T>, string, any?][],
      ]
    ? DeepStrictMerge<
        DeepStrictMerge<
          DeepStrictOmit<T, AllKeys>,
          ToObject<
            StringToDeepObject<RemoveArraySymbol<After>, GetType<T, Before>>
          >
        >,
        Rename<T, RestCommands, AllKeys>
      >
    : {};
