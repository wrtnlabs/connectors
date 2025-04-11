export type MyPartial<T> = {
  [K in keyof T]?: T[K];
};
