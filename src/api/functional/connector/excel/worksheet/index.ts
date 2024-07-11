/**
 * @packageDocumentation
 * @module api.functional.connector.excel.worksheet
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection, Primitive, Resolved } from "@nestia/fetcher";
import { NestiaSimulator } from "@nestia/fetcher/lib/NestiaSimulator";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import typia from "typia";

import type { IExcel } from "../../../../structures/connector/excel/IExcel";

/**
 * 입력된 파일 url에 존재하는 엑셀 워크 시트 목록을 가져옵니다.
 *
 * @param input 워크 시트 목록을 가져올 엑셀 파일 url
 * @summary 액셀 워크 시트 목록 가져오기
 * @returns 엑셀 워크 시트 목록.
 * @tag Excel 엑셀 파일
 * @tag 엑셀
 * @tag 파일
 * @tag 내보내기
 * @tag 다운로드
 * @tag 추출
 * @tag 추출하기
 * @tag 스프레드시트
 * @tag 데이터 저장
 * @tag 데이터 불러오기
 * @tag 데이터 분석
 * @tag 데이터 베이스
 * @tag 데이터 내보내기
 * @tag 데이터 가져오기
 * @tag 엑셀 변환
 * @tag 텍스트 파일
 * @tag 데이터 처리
 * @tag 대량 데이터
 * @tag 데이터 편집
 * @tag 파일 분할
 * @tag 데이터 통합
 * @tag 엑셀 만들기
 * @tag 엑셀 파일 열기
 * @tag 데이터 추출
 * @tag 데이터 필터링
 * @tag 데이터 병합
 * @tag Excel
 * @tag File
 * @tag Export
 * @tag Download
 * @tag Extract
 * @tag Spreadsheet
 * @tag Save Data
 * @tag Load Data
 * @tag Data Analysis
 * @tag Database
 * @tag Export Data
 * @tag Import Data
 * @tag Convert to Excel
 * @tag Text File
 * @tag Data Processing
 * @tag Large Data
 * @tag Edit Data
 * @tag Split File
 * @tag Integrate Data
 * @tag Create Excel
 * @tag Open Excel File
 * @tag Extract Data
 * @tag Filter Data
 * @tag Merge Data
 *
 * @controller ExcelController.worksheetList
 * @path POST /connector/excel/worksheet
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function worksheetList(
  connection: IConnection,
  input: worksheetList.Input,
): Promise<worksheetList.Output> {
  return !!connection.simulate
    ? worksheetList.simulate(connection, input)
    : PlainFetcher.fetch(
        {
          ...connection,
          headers: {
            ...connection.headers,
            "Content-Type": "application/json",
          },
        },
        {
          ...worksheetList.METADATA,
          template: worksheetList.METADATA.path,
          path: worksheetList.path(),
        },
        input,
      );
}
export namespace worksheetList {
  export type Input = Primitive<IExcel.IGetWorksheetListInput>;
  export type Output = Primitive<IExcel.IWorksheetListOutput>;

  export const METADATA = {
    method: "POST",
    path: "/connector/excel/worksheet",
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

  export const path = () => "/connector/excel/worksheet";
  export const random = (
    g?: Partial<typia.IRandomGenerator>,
  ): Resolved<Primitive<IExcel.IWorksheetListOutput>> =>
    typia.random<Primitive<IExcel.IWorksheetListOutput>>(g);
  export const simulate = (
    connection: IConnection,
    input: worksheetList.Input,
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
