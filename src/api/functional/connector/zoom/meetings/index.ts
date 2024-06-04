/**
 * @packageDocumentation
 * @module api.functional.connector.zoom.meetings
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection, Primitive, Resolved } from "@nestia/fetcher";
import { NestiaSimulator } from "@nestia/fetcher/lib/NestiaSimulator";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import typia from "typia";

import type { IZoom } from "../../../../structures/zoom/IZoom";

export * as registrants from "./registrants";

/**
 * zoom 미팅을 생성합니다.
 *
 * @summary zoom 미팅 생성.
 * @returns 생성된 zoom 미팅 정보 DTO.
 * @param input 미팅을 생성하고자 하는 유저 정보 및 조건에 대한 DTO.
 * @tag zoom
 *
 * @controller ZoomController.createMeeting
 * @path POST /connector/zoom/meetings
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function createMeeting(
  connection: IConnection,
  input: createMeeting.Input,
): Promise<createMeeting.Output> {
  return !!connection.simulate
    ? createMeeting.simulate(connection, input)
    : PlainFetcher.fetch(
        {
          ...connection,
          headers: {
            ...connection.headers,
            "Content-Type": "application/json",
          },
        },
        {
          ...createMeeting.METADATA,
          path: createMeeting.path(),
        },
        input,
      );
}
export namespace createMeeting {
  export type Input = Primitive<IZoom.ICreateMeetingInput>;
  export type Output = Primitive<IZoom.Meeting>;

  export const METADATA = {
    method: "POST",
    path: "/connector/zoom/meetings",
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

  export const path = () => "/connector/zoom/meetings";
  export const random = (
    g?: Partial<typia.IRandomGenerator>,
  ): Resolved<Primitive<IZoom.Meeting>> =>
    typia.random<Primitive<IZoom.Meeting>>(g);
  export const simulate = (
    connection: IConnection,
    input: createMeeting.Input,
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
