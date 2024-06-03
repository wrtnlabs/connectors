/**
 * @packageDocumentation
 * @module api.functional.connector.google_docs.template
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection, Primitive, Resolved } from "@nestia/fetcher";
import { NestiaSimulator } from "@nestia/fetcher/lib/NestiaSimulator";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import typia from "typia";

import type { IGoogleDocs } from "../../../../structures/connector/google_docs/IGoogleDocs";

/**
 * 이미 존재하는 구글 docs를 복사하여 새로운 구글 docs를 생성합니다.
 *
 * @summary 구글 docs 복사.
 * @param input 복사할 구글 docs 링크와 생성할 구글 docs 제목.
 * @returns 생성된 구글 docs 고유 ID.
 * @tag Google Docs
 *
 * @controller GoogleDocsController.createDocByTemplate
 * @path POST /connector/google-docs/template
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function createDocByTemplate(
  connection: IConnection,
  input: createDocByTemplate.Input,
): Promise<createDocByTemplate.Output> {
  return !!connection.simulate
    ? createDocByTemplate.simulate(connection, input)
    : PlainFetcher.fetch(
        {
          ...connection,
          headers: {
            ...connection.headers,
            "Content-Type": "application/json",
          },
        },
        {
          ...createDocByTemplate.METADATA,
          path: createDocByTemplate.path(),
        },
        input,
      );
}
export namespace createDocByTemplate {
  export type Input = Primitive<IGoogleDocs.ICreateDocByTemplateInput>;
  export type Output = Primitive<IGoogleDocs.ICreateDocByTemplateOutput>;

  export const METADATA = {
    method: "POST",
    path: "/connector/google-docs/template",
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

  export const path = () => "/connector/google-docs/template";
  export const random = (
    g?: Partial<typia.IRandomGenerator>,
  ): Resolved<Primitive<IGoogleDocs.ICreateDocByTemplateOutput>> =>
    typia.random<Primitive<IGoogleDocs.ICreateDocByTemplateOutput>>(g);
  export const simulate = (
    connection: IConnection,
    input: createDocByTemplate.Input,
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
