/**
 * @packageDocumentation
 * @module api.functional.connector.notion.find_item_list
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection, Primitive, Resolved } from "@nestia/fetcher";
import { NestiaSimulator } from "@nestia/fetcher/lib/NestiaSimulator";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import typia from "typia";

import type { INotion } from "../../../../structures/connector/notion/INotion";

/**
 * 테이블 데이터베이스에 존재하는 아이템 목록을 조회합니다.
 *
 * @param databaseId 아이템 목록을 가져올 데이터베이스를 선택해 주세요.
 * @summary 데이터베이스 아이템 목록 조회
 * @returns 조회된 데이터베이스 아이템 목록 정보
 * @tag Notion
 * @tag 노션
 * @tag 노트
 * @tag 메모
 * @tag 작업 관리
 * @tag 프로젝트 관리
 * @tag 할 일 목록
 * @tag 일정 관리
 * @tag 문서 작성
 * @tag 회의록 작성
 * @tag 체크리스트
 * @tag 아이디어 정리
 * @tag 업무 기록
 * @tag 학습 노트
 * @tag 스터디 플래너
 * @tag 제품기획
 * @tag 이력서
 * @tag 포트폴리오
 * @tag 협업
 * @tag 문서
 * @tag Note
 * @tag Memo
 * @tag Task Management
 * @tag Project Management
 * @tag To do list
 * @tag Schedule Management
 * @tag Document Creation
 * @tag Meeting Notes
 * @tag Checklist
 * @tag Idea Organization
 * @tag Work Logging
 * @tag Study Notes
 * @tag Study Planner
 * @tag Product Management
 * @tag Resume
 * @tag Portfolio
 * @tag Collaboration
 * @tag Document
 *
 * @controller NotionController.getDatabaseItemList
 * @path POST /connector/notion/find-item-list/:databaseId
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function getDatabaseItemList(
  connection: IConnection,
  input: getDatabaseItemList.Input,
  databaseId: string,
): Promise<getDatabaseItemList.Output> {
  return !!connection.simulate
    ? getDatabaseItemList.simulate(connection, input, databaseId)
    : PlainFetcher.fetch(
        {
          ...connection,
          headers: {
            ...connection.headers,
            "Content-Type": "application/json",
          },
        },
        {
          ...getDatabaseItemList.METADATA,
          template: getDatabaseItemList.METADATA.path,
          path: getDatabaseItemList.path(databaseId),
        },
        input,
      );
}
export namespace getDatabaseItemList {
  export type Input = Primitive<INotion.ISecret>;
  export type Output = Primitive<Array<INotion.IDatabaseItemOutput>>;

  export const METADATA = {
    method: "POST",
    path: "/connector/notion/find-item-list/:databaseId",
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

  export const path = (databaseId: string) =>
    `/connector/notion/find-item-list/${encodeURIComponent(databaseId ?? "null")}`;
  export const random = (
    g?: Partial<typia.IRandomGenerator>,
  ): Resolved<Primitive<Array<INotion.IDatabaseItemOutput>>> =>
    typia.random<Primitive<Array<INotion.IDatabaseItemOutput>>>(g);
  export const simulate = (
    connection: IConnection,
    input: getDatabaseItemList.Input,
    databaseId: string,
  ): Output => {
    const assert = NestiaSimulator.assert({
      method: METADATA.method,
      host: connection.host,
      path: path(databaseId),
      contentType: "application/json",
    });
    assert.body(() => typia.assert(input));
    assert.param("databaseId")(() => typia.assert(databaseId));
    return random(
      "object" === typeof connection.simulate && null !== connection.simulate
        ? connection.simulate
        : undefined,
    );
  };
}
