/**
 * @packageDocumentation
 * @module api.functional.connector.google_shopping.ali_express
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection, Primitive, Resolved } from "@nestia/fetcher";
import { NestiaSimulator } from "@nestia/fetcher/lib/NestiaSimulator";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import typia from "typia";

import type { IGoogleShopping } from "../../../../structures/connector/google_shopping/IGoogleShopping";

/**
 * 상품을 알리 익스프레스에서 검색합니다.
 *
 * @summary 알리 익스프레스 검색
 * @param input 검색 조건
 * @returns 검색 결과
 *
 * @controller GoogleShoppingController.aliExpress
 * @path POST /connector/google-shopping/ali-express
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function aliExpress(
  connection: IConnection,
  input: aliExpress.Input,
): Promise<aliExpress.Output> {
  return !!connection.simulate
    ? aliExpress.simulate(connection, input)
    : PlainFetcher.fetch(
        {
          ...connection,
          headers: {
            ...connection.headers,
            "Content-Type": "application/json",
          },
        },
        {
          ...aliExpress.METADATA,
          template: aliExpress.METADATA.path,
          path: aliExpress.path(),
        },
        input,
      );
}
export namespace aliExpress {
  export type Input = Primitive<IGoogleShopping.IRequestStandAlone>;
  export type Output = Primitive<Array<IGoogleShopping.IResponse>>;

  export const METADATA = {
    method: "POST",
    path: "/connector/google-shopping/ali-express",
    request: {
      type: "application/json",
      encrypted: false,
    },
    response: {
      type: "application/json",
      encrypted: false,
    },
    status: null,
  } as const;

  export const path = () => "/connector/google-shopping/ali-express";
  export const random = (
    g?: Partial<typia.IRandomGenerator>,
  ): Resolved<Primitive<Array<IGoogleShopping.IResponse>>> =>
    typia.random<Primitive<Array<IGoogleShopping.IResponse>>>(g);
  export const simulate = (
    connection: IConnection,
    input: aliExpress.Input,
  ): Output => {
    const assert = NestiaSimulator.assert({
      method: METADATA.method,
      host: connection.host,
      path: path(),
      contentType: "application/json",
    });
    assert.body(() => typia.assert(input));
    return random(
      "object" === typeof connection.simulate && null !== connection.simulate
        ? connection.simulate
        : undefined,
    );
  };
}
