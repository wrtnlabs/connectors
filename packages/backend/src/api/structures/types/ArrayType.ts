import { ElementOf } from "./ElementOf";

export type ReadonlyOrNot<T extends any[]> =
  | ElementOf<T>[]
  | readonly ElementOf<T>[];

export namespace ArrayType {
  /**
   * Get length of tuple or string literal type.
   */
  export type Length<T extends ReadonlyOrNot<any[]>> = T["length"];

  export type Push<T extends ReadonlyOrNot<any[]>, V> = [...T, V];

  export type Take<
    T extends ReadonlyOrNot<any[]>,
    P extends number,
    R extends ReadonlyOrNot<any[]> = [],
  > =
    ArrayType.Length<R> extends P
      ? R
      : T extends [infer F, ...infer Rest]
        ? Take<Rest, P, ArrayType.Push<R, F>>
        : R;
}
