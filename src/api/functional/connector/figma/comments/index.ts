/**
 * @packageDocumentation
 * @module api.functional.connector.figma.comments
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { Comment } from "@figma/rest-api-spec/dist/api_types";
import type { IConnection, Primitive, Resolved } from "@nestia/fetcher";
import { NestiaSimulator } from "@nestia/fetcher/lib/NestiaSimulator";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import typia from "typia";

import type { IFigma } from "../../../../structures/connector/figma/IFigma";

/**
 * 댓글을 작성합니다.
 *
 * @param input 댓글을 작성하기 위한 조건 값.
 * @summary 캔버스 내 댓글 작성하기.
 * @returns 방금 작성된 댓글의 정보.
 * @tag figma
 *
 * @controller FigmaController.addComment
 * @path POST /connector/figma/comments
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function addComment(
  connection: IConnection,
  input: addComment.Input,
): Promise<addComment.Output> {
  return !!connection.simulate
    ? addComment.simulate(connection, input)
    : PlainFetcher.fetch(
        {
          ...connection,
          headers: {
            ...connection.headers,
            "Content-Type": "application/json",
          },
        },
        {
          ...addComment.METADATA,
          template: addComment.METADATA.path,
          path: addComment.path(),
        },
        input,
      );
}
export namespace addComment {
  export type Input = Primitive<IFigma.IAddCommentInput>;
  export type Output = Primitive<Comment>;

  export const METADATA = {
    method: "POST",
    path: "/connector/figma/comments",
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

  export const path = () => "/connector/figma/comments";
  export const random = (
    g?: Partial<typia.IRandomGenerator>,
  ): Resolved<Primitive<Comment>> => typia.random<Primitive<Comment>>(g);
  export const simulate = (
    connection: IConnection,
    input: addComment.Input,
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
