/**
 * @packageDocumentation
 * @module api.functional.connector.gmail.get
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection, Primitive, Resolved } from "@nestia/fetcher";
import { NestiaSimulator } from "@nestia/fetcher/lib/NestiaSimulator";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import typia from "typia";

import type { ICommon } from "../../../../structures/connector/common/ISecretValue";
import type { IGmail } from "../../../../structures/connector/gmail/IGmail";

/**
 * 메일의 정보를 가져옵니다.
 *
 * @summary GMAIL 정보 가져오기.
 * @param id 해당 메일의 고유 ID.
 * @returns 해당 메일의 정보.
 * @tag Gmail
 *
 * @controller GmailController.findEmail
 * @path POST /connector/gmail/get/:id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function findEmail(
  connection: IConnection,
  id: string,
  input: findEmail.Input,
): Promise<findEmail.Output> {
  return !!connection.simulate
    ? findEmail.simulate(connection, id, input)
    : PlainFetcher.fetch(
        {
          ...connection,
          headers: {
            ...connection.headers,
            "Content-Type": "application/json",
          },
        },
        {
          ...findEmail.METADATA,
          path: findEmail.path(id),
        },
        input,
      );
}
export namespace findEmail {
  export type Input = Primitive<
    ICommon.ISecret<"google", ["https://mail.google.com/"]>
  >;
  export type Output = Primitive<IGmail.IFindGmailOutput>;

  export const METADATA = {
    method: "POST",
    path: "/connector/gmail/get/:id",
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

  export const path = (id: string) =>
    `/connector/gmail/get/${encodeURIComponent(id ?? "null")}`;
  export const random = (
    g?: Partial<typia.IRandomGenerator>,
  ): Resolved<Primitive<IGmail.IFindGmailOutput>> =>
    typia.random<Primitive<IGmail.IFindGmailOutput>>(g);
  export const simulate = (
    connection: IConnection,
    id: string,
    input: findEmail.Input,
  ): Output => {
    const assert = NestiaSimulator.assert({
      method: METADATA.method,
      host: connection.host,
      path: path(id),
      contentType: "application/json",
    });
    assert.param("id")(() => typia.assert(id));
    assert.body(() => typia.assert(input));
    return random(
      "object" === typeof connection.simulate && null !== connection.simulate
        ? connection.simulate
        : undefined,
    );
  };
}
