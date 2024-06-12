/**
 * @packageDocumentation
 * @module api.functional.connector.kakao_talk
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection, Primitive, Resolved } from "@nestia/fetcher";
import { NestiaSimulator } from "@nestia/fetcher/lib/NestiaSimulator";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import typia from "typia";

import type { IKakaoTalk } from "../../../structures/connector/kakao_talk/IKakaoTalk";

export * as calendars from "./calendars";
export * as get_events from "./get_events";
export * as get_calendars from "./get_calendars";
export * as auth from "./auth";

/**
 * 카카오톡 내게 쓰기로 메시지를 보냅니다.
 *
 * @summary 카카오톡 내게 쓰기.
 * @param input 메시지를 보내기 위한 요청 DTO.
 * @returns 응답 코드.
 * @tag 카카오톡
 *
 * @controller KakaoTalkController.memo
 * @path POST /connector/kakao-talk/memo
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function memo(
  connection: IConnection,
  input: memo.Input,
): Promise<memo.Output> {
  return !!connection.simulate
    ? memo.simulate(connection, input)
    : PlainFetcher.fetch(
        {
          ...connection,
          headers: {
            ...connection.headers,
            "Content-Type": "application/json",
          },
        },
        {
          ...memo.METADATA,
          path: memo.path(),
        },
        input,
      );
}
export namespace memo {
  export type Input = Primitive<IKakaoTalk.ISendKakaoTalkInput>;
  export type Output = Primitive<IKakaoTalk.IMemoOutput>;

  export const METADATA = {
    method: "POST",
    path: "/connector/kakao-talk/memo",
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

  export const path = () => "/connector/kakao-talk/memo";
  export const random = (
    g?: Partial<typia.IRandomGenerator>,
  ): Resolved<Primitive<IKakaoTalk.IMemoOutput>> =>
    typia.random<Primitive<IKakaoTalk.IMemoOutput>>(g);
  export const simulate = (
    connection: IConnection,
    input: memo.Input,
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
 * 카카오톡 액세스 토큰 갱신.
 *
 * @internal
 * @param input Refresh를 위한 요청 DTO.
 *
 * @controller KakaoTalkController.refresh
 * @path POST /connector/kakao-talk/refresh
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function refresh(
  connection: IConnection,
  input: refresh.Input,
): Promise<refresh.Output> {
  return !!connection.simulate
    ? refresh.simulate(connection, input)
    : PlainFetcher.fetch(
        {
          ...connection,
          headers: {
            ...connection.headers,
            "Content-Type": "application/json",
          },
        },
        {
          ...refresh.METADATA,
          path: refresh.path(),
        },
        input,
      );
}
export namespace refresh {
  export type Input = Primitive<IKakaoTalk.IRefreshAccessTokenInput>;
  export type Output = Primitive<IKakaoTalk.IRefreshAccessTokenOutput>;

  export const METADATA = {
    method: "POST",
    path: "/connector/kakao-talk/refresh",
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

  export const path = () => "/connector/kakao-talk/refresh";
  export const random = (
    g?: Partial<typia.IRandomGenerator>,
  ): Resolved<Primitive<IKakaoTalk.IRefreshAccessTokenOutput>> =>
    typia.random<Primitive<IKakaoTalk.IRefreshAccessTokenOutput>>(g);
  export const simulate = (
    connection: IConnection,
    input: refresh.Input,
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
