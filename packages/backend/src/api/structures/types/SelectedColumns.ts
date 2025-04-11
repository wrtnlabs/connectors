import { StringType } from "./StringType";

type GetColumns<T extends string> =
  Trim<T> extends `SELECT${" " | "\n"}${infer P extends string} FROM ${string}`
    ? P
    : never;

type ArrayValueOf<T extends any[]> = T[number];

type TrimLeft<S extends string> = S extends
  | ` ${infer Rest}`
  | `\n${infer Rest}`
  | `\t${infer Rest}`
  ? TrimLeft<Rest>
  : S;

type TrimRight<S extends string> = S extends
  | `${infer Rest} `
  | `${infer Rest}\n`
  | `${infer Rest}\t`
  ? TrimRight<Rest>
  : S;

type Trim<S extends string> = TrimRight<TrimLeft<S>>;

type TrimMap<T extends string[]> = T extends []
  ? []
  : T extends [infer F extends string, ...infer Rest extends string[]]
    ? [Trim<F>, ...TrimMap<Rest>]
    : [];

export type SelectedColumns<T extends string> = ArrayValueOf<
  // 5. 튜플의 요소 타입만 꺼내면 그게 칼럼 명의 유니온 타입이 된다.
  TrimMap<
    // 4. 쉼표 사이의 공백들도 제거해준 다음
    StringType.Split<
      // 3. 쉼표(,) 단위로 자른 다음
      Trim<
        // 2. 앞뒤 공백을 모두 자르고,
        GetColumns<T> // 1. 문자열 T로부터 칼럼이 속한 문자열만 추출하여,
      >,
      ","
    >
  >
>;
