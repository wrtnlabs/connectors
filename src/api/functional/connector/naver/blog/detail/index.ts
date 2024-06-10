/**
 * @packageDocumentation
 * @module api.functional.connector.naver.blog.detail
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection, Primitive, Resolved } from "@nestia/fetcher";
import { NestiaSimulator } from "@nestia/fetcher/lib/NestiaSimulator";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import typia from "typia";

import type { INaver } from "../../../../../structures/connector/naver/INaver";

/**
 * 네이버 블로그 컨텐츠를 불러옵니다.
 *
 * @summary 네이버 블로그 상세
 * @param input 네이버 블로그 상세를 위한 blog url
 * @tag Naver 네이버 블로그
 *
 * @controller NaverController.blogDetail
 * @path POST /connector/naver/blog/detail
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function blogDetail(
  connection: IConnection,
  input: blogDetail.Input,
): Promise<blogDetail.Output> {
  return !!connection.simulate
    ? blogDetail.simulate(connection, input)
    : PlainFetcher.fetch(
        {
          ...connection,
          headers: {
            ...connection.headers,
            "Content-Type": "application/json",
          },
        },
        {
          ...blogDetail.METADATA,
          path: blogDetail.path(),
        },
        input,
      );
}
export namespace blogDetail {
  export type Input = Primitive<INaver.INaverBlogInput>;
  export type Output = Primitive<INaver.INaverBlogOutput>;

  export const METADATA = {
    method: "POST",
    path: "/connector/naver/blog/detail",
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

  export const path = () => "/connector/naver/blog/detail";
  export const random = (
    g?: Partial<typia.IRandomGenerator>,
  ): Resolved<Primitive<INaver.INaverBlogOutput>> =>
    typia.random<Primitive<INaver.INaverBlogOutput>>(g);
  export const simulate = (
    connection: IConnection,
    input: blogDetail.Input,
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
