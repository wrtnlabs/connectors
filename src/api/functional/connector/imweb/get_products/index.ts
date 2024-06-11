/**
 * @packageDocumentation
 * @module api.functional.connector.imweb.get_products
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection, Primitive, Resolved } from "@nestia/fetcher";
import { NestiaSimulator } from "@nestia/fetcher/lib/NestiaSimulator";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import typia from "typia";

import type { IImweb } from "../../../../structures/connector/imweb/IImweb";

/**
 * 아임웹에서 판매자의 상품들을 불러온다.
 *
 * @summary 자신의 상품 조회.
 * @param input 상품을 조회하기 위한 조건 DTO.
 * @returns 액세스 토큰을 담은 응답 DTO.
 *
 * @controller ImwebController.getProducts
 * @path POST /connector/imweb/get-products
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function getProducts(
  connection: IConnection,
  input: getProducts.Input,
): Promise<getProducts.Output> {
  return !!connection.simulate
    ? getProducts.simulate(connection, input)
    : PlainFetcher.fetch(
        {
          ...connection,
          headers: {
            ...connection.headers,
            "Content-Type": "application/json",
          },
        },
        {
          ...getProducts.METADATA,
          path: getProducts.path(),
        },
        input,
      );
}
export namespace getProducts {
  export type Input = Primitive<IImweb.IGetProductInput>;
  export type Output = Primitive<IImweb.IGetProductOutput>;

  export const METADATA = {
    method: "POST",
    path: "/connector/imweb/get-products",
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

  export const path = () => "/connector/imweb/get-products";
  export const random = (
    g?: Partial<typia.IRandomGenerator>,
  ): Resolved<Primitive<IImweb.IGetProductOutput>> =>
    typia.random<Primitive<IImweb.IGetProductOutput>>(g);
  export const simulate = (
    connection: IConnection,
    input: getProducts.Input,
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
