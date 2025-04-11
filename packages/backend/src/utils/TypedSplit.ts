import { ArrayType } from "../api/structures/types/ArrayType";
import { Equal } from "../api/structures/types/Equal";

type Falsy = false | 0 | "" | null | undefined;
type Truthy<T> = T extends Falsy ? false : true;
type Conditional<Condition, T, F> = Truthy<Condition> extends true ? T : F;

type _Split<
  Conatiner extends string,
  Splitter extends string = "",
> = Conatiner extends ""
  ? []
  : Equal<Splitter, string> extends true
    ? string[]
    : Conatiner extends `${infer FirstWord}${Splitter}${infer Rest}`
      ? [FirstWord, ..._Split<Rest, Splitter>]
      : [Conatiner];

/**
 * Split<"abcdefg"> // ["a", "b", "c", "d", "e", "f", "g"]
 * Split<"abcdefg", ""> // ["a", "b", "c", "d", "e", "f", "g"]
 * Split<"abcdefg", "", 3> // ["a", "b", "c"]
 */
export type __Split<
  Conatiner extends string,
  Splitter extends string = "",
  Limit extends number = ArrayType.Length<_Split<Conatiner, Splitter>>,
> = Conditional<
  Limit extends 0 ? true : false,
  [],
  ArrayType.Take<_Split<Conatiner, Splitter>, Limit>
>;

type A = __Split<"abcdefg", "", 3>; // ["a", "b", "c"]
/**
 * type-safe split.
 * @example StringPrototype.split('abcde', 'c', 1) // ['ab']
 *
 * @param container original string value.
 * @param splitter An object that can split a string.
 * @param limit A value used to limit the number of elements returned in the array.
 *
 * @todo support `RegExp` as splitter
 */
export function TypedSplit<
  Container extends string,
  Splitter extends string = "",
  Limit extends number = ArrayType.Length<__Split<Container, Splitter>>,
>(
  container: Container,
  splitter: Splitter,
  limit?: Limit,
): __Split<Container, Splitter, Limit> {
  return container.split(splitter, limit) as __Split<
    Container,
    Splitter,
    Limit
  >;
}
