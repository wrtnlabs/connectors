import type { DeepStrictMerge } from "./DeepStrictMerge";
import { DeepStrictObjectKeys } from "./DeepStrictObjectKeys";
import { DeepStrictOmit } from "./DeepStrictOmit";
import type { RemoveArraySymbol } from "./RemoveArraySymbol";
import { StringToDeepObject } from "./StringToDeepObject";
import { ToObject } from "./ToObject";

type __FirstElementsOfTuples<T extends [string, any?][]> = T extends [
  infer First extends [string, any?],
  ...infer Rest extends [string, any?][],
]
  ? [First[0], ...__FirstElementsOfTuples<Rest>]
  : [];

/**
 * @title 인터페이스에서 특정 타입의 이름과 위치를 변경하는 타입.
 */
export type Typing<
  T extends object,
  Commands extends [DeepStrictObjectKeys<T>, any][],
  AllKeys extends
    DeepStrictObjectKeys<T> = __FirstElementsOfTuples<Commands>[number],
> = Commands extends [
  [infer Before extends DeepStrictObjectKeys<T>, infer Type extends any],
  ...infer RestCommands extends [DeepStrictObjectKeys<T>, any][],
]
  ? DeepStrictMerge<
      DeepStrictMerge<
        DeepStrictOmit<T, AllKeys>,
        ToObject<StringToDeepObject<RemoveArraySymbol<Before>, Type>>
      >,
      Typing<T, RestCommands, AllKeys>
    >
  : {};
