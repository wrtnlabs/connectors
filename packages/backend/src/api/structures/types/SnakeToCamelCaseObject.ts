import { ElementOf } from "./ElementOf";

type SnakeToCamel<
  S extends string,
  Cap extends boolean = false,
> = S extends `${infer Head}_${infer Tail}`
  ? `${Cap extends true ? Capitalize<Head> : Head}${SnakeToCamel<Tail, true>}`
  : Cap extends true
    ? Capitalize<S>
    : S;

type TerminalTypes = number | boolean | symbol | bigint | Function;

/**
 * 재귀적으로 순회하며 객체와 배열을 모두 카멜케이스로 변환하는 타입
 */
export type Camelize<T> = {
  default: {
    [K in keyof T as Camelize<K>]: Camelize<T[K]>;
  };
  array: T extends [infer Head, ...infer Tail]
    ? [Camelize<Head>, ...Camelize<Tail>]
    : Camelize<ElementOf<T extends any[] ? T : []>>[];
  string: SnakeToCamel<T & string>;
  terminal: T;
}[T extends any[]
  ? "array"
  : T extends TerminalTypes
    ? "terminal"
    : T extends string
      ? "string"
      : /**
         * default
         */
        "default"];
