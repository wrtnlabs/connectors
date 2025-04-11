type Push<T extends any[], V> = [...T, V];

/**
 * @title 튜플 타입.
 */
export type NTpule<
  N extends number,
  DefaultType = any,
  T extends any[] = [],
> = N extends T["length"] ? T : NTpule<N, DefaultType, Push<T, DefaultType>>;
