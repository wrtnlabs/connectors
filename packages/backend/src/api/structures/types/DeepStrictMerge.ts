export type DeepStrictMergeHelper<T extends object, P extends object> = {
  [key in keyof T | keyof P]: key extends keyof T
    ? key extends keyof P
      ? T[key] extends object
        ? P[key] extends object
          ? T[key] extends Array<infer TE extends object>
            ? P[key] extends Array<infer PE extends object>
              ? Array<DeepStrictMergeHelper<TE, PE>>
              : never // Array와 Array가 아닌 Object의 Merge는 불가능
            : DeepStrictMergeHelper<T[key], P[key]>
          : T[key]
        : T[key]
      : T[key]
    : key extends keyof P
      ? key extends keyof T
        ? P[key] extends object
          ? T[key] extends object
            ? T[key] extends Array<infer TE extends object>
              ? P[key] extends Array<infer PE extends object>
                ? Array<DeepStrictMergeHelper<TE, PE>>
                : never // Array와 Array가 아닌 Object의 Merge는 불가능
              : DeepStrictMergeHelper<T[key], P[key]>
            : P[key]
          : P[key]
        : P[key]
      : never;
};

/**
 * @title 두 인터페이스를 합성하되, 배열인 경우 두 요소 타입이 합성된 배열로 추론되게 하는 타입.
 *
 * 두 타입 T와 P를 합성한 타입을 추론하되, 배열인 경우 배열의 요소들이 합성된 배열로 추론된다.
 */
export type DeepStrictMerge<T extends object, P extends object> =
  T extends Array<infer TE extends object>
    ? P extends Array<infer PE extends object>
      ? DeepStrictMergeHelper<TE, PE>[] // 첫 요소들부터 배열 타입이 들어온 경우를 대비한다.
      : never
    : DeepStrictMergeHelper<T, P>;
