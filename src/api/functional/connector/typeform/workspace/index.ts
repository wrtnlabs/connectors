/**
 * @packageDocumentation
 * @module api.functional.connector.typeform.workspace
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection, Primitive, Resolved } from "@nestia/fetcher";
import { NestiaSimulator } from "@nestia/fetcher/lib/NestiaSimulator";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import typia from "typia";

import type { ITypeform } from "../../../../structures/connector/typeform/ITypeform";

/**
 * 워크스페이스를 생성합니다.
 *
 * @summary 타입폼 워크스페이스 생성.
 * @param input 생성할 워크스페이스 제목.
 * @returns 생성된 워크스페이스 ID, 제목, URL.
 * @tag Typeform
 * @internal
 *
 * @controller TypeformController.createWorkspace
 * @path POST /connector/typeform/workspace
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function createWorkspace(
  connection: IConnection,
  input: createWorkspace.Input,
): Promise<createWorkspace.Output> {
  return !!connection.simulate
    ? createWorkspace.simulate(connection, input)
    : PlainFetcher.fetch(
        {
          ...connection,
          headers: {
            ...connection.headers,
            "Content-Type": "application/json",
          },
        },
        {
          ...createWorkspace.METADATA,
          path: createWorkspace.path(),
        },
        input,
      );
}
export namespace createWorkspace {
  export type Input = Primitive<ITypeform.ICreateWorkspaceInput>;
  export type Output = Primitive<ITypeform.ICreateWorkspaceOutput>;

  export const METADATA = {
    method: "POST",
    path: "/connector/typeform/workspace",
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

  export const path = () => "/connector/typeform/workspace";
  export const random = (
    g?: Partial<typia.IRandomGenerator>,
  ): Resolved<Primitive<ITypeform.ICreateWorkspaceOutput>> =>
    typia.random<Primitive<ITypeform.ICreateWorkspaceOutput>>(g);
  export const simulate = (
    connection: IConnection,
    input: createWorkspace.Input,
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

/**
 * 워크스페이스를 삭제합니다.
 *
 * @summary 타입폼 워크스페이스 삭제.
 * @param workspaceId 삭제할 워크스페이스 ID.
 * @tag Typeform
 * @internal
 *
 * @controller TypeformController.deleteWorkspace
 * @path DELETE /connector/typeform/workspace/:workspaceId
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function deleteWorkspace(
  connection: IConnection,
  workspaceId: string,
): Promise<void> {
  return !!connection.simulate
    ? deleteWorkspace.simulate(connection, workspaceId)
    : PlainFetcher.fetch(connection, {
        ...deleteWorkspace.METADATA,
        path: deleteWorkspace.path(workspaceId),
      });
}
export namespace deleteWorkspace {
  export const METADATA = {
    method: "DELETE",
    path: "/connector/typeform/workspace/:workspaceId",
    request: null,
    response: {
      type: "application/json",
      encrypted: false,
    },
    status: null,
  } as const;

  export const path = (workspaceId: string) =>
    `/connector/typeform/workspace/${encodeURIComponent(workspaceId ?? "null")}`;
  export const random = (
    g?: Partial<typia.IRandomGenerator>,
  ): Resolved<Primitive<void>> => typia.random<Primitive<void>>(g);
  export const simulate = (
    connection: IConnection,
    workspaceId: string,
  ): void => {
    const assert = NestiaSimulator.assert({
      method: METADATA.method,
      host: connection.host,
      path: path(workspaceId),
      contentType: "application/json",
    });
    assert.param("workspaceId")(() => typia.assert(workspaceId));
    return random(
      "object" === typeof connection.simulate && null !== connection.simulate
        ? connection.simulate
        : undefined,
    );
  };
}
