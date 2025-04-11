export namespace StringType {
  /**
   * @title 문자열을 자르는 타입
   *
   * String.prototype.split을 타입 레벨로 구현한 것이다.
   */
  export type Split<
    T extends string,
    P extends string = "",
  > = T extends `${infer F}${P}${infer Rest}`
    ? [F, ...Split<Rest, P>]
    : T extends ""
      ? []
      : [T];

  /**
   * @title 문자열에 특정 문자열이 포함관계인지를 구별하는 타입.
   *
   * String.prototype.includes를 타입 레벨로 구현한 것이다.
   */
  export type Includes<
    T extends string,
    P extends string,
  > = T extends `${string}${P}${string}` ? true : false;

  /**
   * @title 타입을 `string` 타입으로 변환해주는 타입
   */
  export type ToString<T> = T extends string ? T : never;

  /**
   * @title 튜플 안의 문자열을 합하는 타입.
   *
   * String.prototype.join을 타입 레벨로 구현한 것이다.
   */
  export type Join<
    T extends readonly string[],
    U extends string = ",",
  > = T extends readonly []
    ? ""
    : T extends readonly [infer F]
      ? F
      : `${T[0]}${U}${Join<Tail<T>, U>}`;

  /**
   * @title 배열의 마지막 요소를 추론하는 타입.
   */
  export type Tail<T extends readonly string[]> = T extends readonly [
    unknown,
    ...infer Rest,
  ]
    ? Rest
    : [];
}
