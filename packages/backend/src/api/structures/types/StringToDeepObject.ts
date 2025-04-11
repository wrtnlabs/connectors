import type { StringType } from "./StringType";
import type { UnionToIntersection } from "./UnionToIntersection";
import type { ValueOf } from "./ValueOf";

type _BeforeDot<T extends string> = T extends `${infer Before}.${infer _}`
  ? Before
  : never;

type _AfterDot<T extends string> = T extends `${infer _}.${infer After}`
  ? After
  : never;

/**
 * SQL의 SELECT문을 생각해볼 때, 각각의 selected columns들이 매핑되는 인터페이스를 추론해볼 수 있을 것이다.
 *
 *
 * ```ts
 * type Example = StringToDeepObject<'cat.name,cat.kind,cat.age.minimum,cat.age.maximum'>; // { cat: { name: any; kind: any; age: { minimum:any; maximum: any } } }
 * ```
 *
 * @title 문자열을 기준으로 객체를 만드는 타입.
 */
export type StringToDeepObject<
  TargetString extends string,
  Type = any,
  P extends string[] = StringType.Split<TargetString, ",">,
> = UnionToIntersection<
  ValueOf<{
    [key in P[number]]: StringType.Includes<key, "."> extends true
      ? _BeforeDot<key> extends `${infer PropertyName}[*]`
        ? PropertyName extends "" // PropertyName이 빈 문자라면 `[*].a`와 같이 배열 타입에 해당한다.
          ? StringToDeepObject<StringType.ToString<_AfterDot<key>>, Type>[]
          : Record<
              PropertyName, // PropertyName이 존재하는 경우에는 내부 타입이 배열에 해당한다.
              StringToDeepObject<StringType.ToString<_AfterDot<key>>, Type>[]
            >
        : Record<
            _BeforeDot<key>,
            StringToDeepObject<StringType.ToString<_AfterDot<key>>, Type>
          >
      : Record<key, Type>;
  }>
>;
