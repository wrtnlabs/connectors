/**
 * @packageDocumentation
 * @module api.functional.connector.gmail.read_list
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection, Primitive, Resolved } from "@nestia/fetcher";
import { NestiaSimulator } from "@nestia/fetcher/lib/NestiaSimulator";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import typia from "typia";

import type { IGmail } from "../../../../structures/connector/gmail/IGmail";

/**
 * 메일 리스트를 가져옵니다.
 *
 * @summary GMAIL 리스트 가져오기.
 * @param input 메일 리스트를 가져오기 위한 정보.
 * @returns 메일 리스트.
 * @tag 지메일
 * @tag 이메일
 * @tag 메일
 * @tag 이메일 보내기
 * @tag 이메일 확인
 * @tag 메일 관리
 * @tag 스팸 메일 관리
 * @tag 이메일 검색
 * @tag 첨부파일
 * @tag 필터 설정
 * @tag 이메일 관리
 * @tag 이메일 알림
 * @tag 자동 회신
 * @tag 답장
 * @tag 이메일 아카이브
 * @tag 이메일 스레드
 * @tag 중요 표시
 * @tag 이메일 삭제
 * @tag 구글 메일
 * @tag 이메일 주소
 * @tag 메일함 용량
 * @tag 메일 전송 예약
 * @tag 메일 읽음 확인
 * @tag 중요 메일 표시
 * @tag 일정 예약
 * @tag 비즈니스 이메일
 * @tag Gmail
 * @tag Email
 * @tag Mail
 * @tag Send Email
 * @tag Check Email
 * @tag Manage Mail
 * @tag Manage Spam Mail
 * @tag Search Email
 * @tag Attachment
 * @tag Set Filter
 * @tag Manage Email
 * @tag Email Notification
 * @tag Auto Reply
 * @tag Reply
 * @tag Archive Email
 * @tag Email Thread
 * @tag Mark as Important
 * @tag Delete Email
 * @tag Google Mail
 * @tag Email Address
 * @tag Mailbox Storage
 * @tag Schedule Email Sending
 * @tag Email Read Receipt
 * @tag Mark Important Emails
 * @tag Schedule Appointments
 * @tag Business Email
 * @internal
 *
 * @controller GmailController.findEmails
 * @path POST /connector/gmail/read-list
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function findEmails(
  connection: IConnection,
  input: findEmails.Input,
): Promise<findEmails.Output> {
  return !!connection.simulate
    ? findEmails.simulate(connection, input)
    : PlainFetcher.fetch(
        {
          ...connection,
          headers: {
            ...connection.headers,
            "Content-Type": "application/json",
          },
        },
        {
          ...findEmails.METADATA,
          path: findEmails.path(),
        },
        input,
      );
}
export namespace findEmails {
  export type Input = Primitive<IGmail.IFindEmailListInput>;
  export type Output = Primitive<IGmail.IFindGmailListOutput>;

  export const METADATA = {
    method: "POST",
    path: "/connector/gmail/read-list",
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

  export const path = () => "/connector/gmail/read-list";
  export const random = (
    g?: Partial<typia.IRandomGenerator>,
  ): Resolved<Primitive<IGmail.IFindGmailListOutput>> =>
    typia.random<Primitive<IGmail.IFindGmailListOutput>>(g);
  export const simulate = (
    connection: IConnection,
    input: findEmails.Input,
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
