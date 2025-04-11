export type DeepNullablePartial<T> = {
  [K in keyof T]?: DeepNullablePartial<T[K]> | null;
};
