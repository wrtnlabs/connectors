/**
 * ```ts
 * type b = GetMember<"a.b", "a">;
 * type b_c = GetMember<"a.b.c", "a">;
 * ```
 *
 * @title 어떤 키로부터 멤버만을 조회하는 타입.
 */
export type GetMember<
  T extends string,
  O extends string,
> = T extends `${O}.${infer Rest}` ? Rest : never;

/**
 * @title 어떤 키로부터 요소 멤버의 키를 조회하는 타입.
 */
export type GetElementMember<
  T extends string,
  First extends string,
> = T extends `${First}[*].${infer Rest}` ? Rest : GetMember<T, First>;
