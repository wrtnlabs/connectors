import { Allow } from "@wrtnio/decorators";
import { NTpule } from "./NTuple";
import { StringToDeepObject } from "./StringToDeepObject";

export type Sub<A extends number, B extends number> =
  NTpule<A> extends [...NTpule<B>, ...infer R] ? R["length"] : never;

export type ToPlural<T, P extends boolean> = P extends true ? T[] : T;

export type Hierarchy<
  T extends object,
  PropertyName extends string,
  Depth extends number,
  IsPlural extends boolean = true,
> = Depth extends 0
  ? T
  : Allow<
      T &
        StringToDeepObject<
          PropertyName,
          ToPlural<
            Hierarchy<T, PropertyName, Sub<Depth, 1>, IsPlural>,
            IsPlural
          >
        >,
      object
    >;
