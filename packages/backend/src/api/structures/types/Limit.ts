import { tags } from "typia";

export type Limit<
  Minimum extends number,
  Maximum extends number,
  Default extends number,
> = number &
  tags.Type<"int64"> &
  tags.Minimum<Minimum> &
  tags.Maximum<Maximum> &
  tags.Default<Default>;
