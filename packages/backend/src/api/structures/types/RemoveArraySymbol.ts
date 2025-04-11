/**
 * 다른 타입에서 활용하기 위한 helper 타입으로, {@link DeepStrictObjectKeys} 로 추론된 키들 중 객체를 추론하기 위해 뒤 문자열을 자르는 타입이다.
 *
 * ```ts
 * type Example = RemoveArraySymbol<"a[*]">; // a
 * ```
 *
 * @title 멤버를 추론하는 키 네임으로부터 객체만를 뽑는 타입.
 */
export type RemoveArraySymbol<T extends string> = T extends `${infer P}[*]`
  ? P
  : T;
