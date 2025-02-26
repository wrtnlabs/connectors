import { NotFoundException } from "@nestjs/common";
import * as Excel from "exceljs";
import { v4 } from "uuid";
import { IExcelService } from "../structures/IExcelService";
import { AwsS3Service } from "@wrtnlabs/connector-aws-s3";
import axios from "axios";
import { ISpreadsheetCell } from "@wrtnlabs/connector-shared";

export class ExcelService {
  private readonly s3: AwsS3Service;

  constructor(private readonly props: IExcelService.IProps) {
    this.s3 = new AwsS3Service({
      ...this.props.aws.s3,
    });
  }

  async readSheets(
    input: IExcelService.IGetWorksheetListInput,
  ): Promise<IExcelService.IWorksheetListOutput> {
    try {
      const { fileUrl } = input;
      const buffer = await this.s3.getObject({ fileUrl }); // AWS Provider를 사용해 S3에서 파일 읽기

      const workbook = new Excel.Workbook();
      await workbook.xlsx.load(buffer);

      const result: { id: number; sheetName: string }[] = [];
      workbook.eachSheet((sheet, id) => {
        result.push({
          id,
          sheetName: sheet.name,
        });
      });

      return { data: result };
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  getExcelData(input: {
    workbook: Excel.Workbook;
    sheetName?: string | null;
  }): IExcelService.IReadExcelOutput {
    try {
      const sheet = input.workbook.getWorksheet(input.sheetName ?? 1);
      if (!sheet) {
        throw new NotFoundException("Not existing sheet");
      }

      const result: Record<string, string>[] = [];
      let headers: string[] = [];

      sheet.eachRow(
        { includeEmpty: false },
        (row: Excel.Row, rowNumber: number) => {
          if (rowNumber === 1) {
            headers = row.values as string[];
            headers.shift(); // 첫 번째 요소(undefined)를 제거합니다.
          } else {
            const rowData: Record<string, string> = {};
            // headers 배열을 기반으로 각 열에 대해 순회합니다.
            headers.forEach((header: string, index: number) => {
              // +1을 하는 이유는 headers에서 첫 번째 undefined 값을 제거했기 때문
              // @TODO type definition
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              const value = row.values[index + 1];

              rowData[header] = value ?? "";
            });
            result.push(rowData);
          }
        },
      );

      return { headers, data: result };
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  async readHeaders(input: IExcelService.IReadExcelInput): Promise<string[]> {
    const { fileUrl, sheetName } = input;
    const workbook = await this.getExcelFile({ fileUrl });
    return this.readExcelHeaders(workbook, sheetName);
  }

  readExcelHeaders(
    workbook: Excel.Workbook,
    sheetName?: string | null,
  ): string[] {
    const worksheet = workbook.getWorksheet(sheetName ?? 1);
    const headerRow = worksheet?.getRow(1); // 첫 번째 행이 헤더라고 가정

    // 헤더 데이터를 배열로 추출
    const headers: string[] = [];
    headerRow?.eachCell((cell) => {
      headers.push(cell.value as string); // 각 셀의 값을 문자열로 변환하여 배열에 추가
    });

    return headers;
  }

  async insertRows(
    input: IExcelService.IInsertExcelRowInput,
  ): Promise<IExcelService.IExportExcelFileOutput> {
    try {
      const { sheetName, data, fileUrl } = input;
      const workbook = await this.getExcelFile({ fileUrl });
      if (
        typeof sheetName === "string" &&
        workbook.worksheets.every((worksheet) => worksheet.name !== sheetName)
      ) {
        // 유저가 제시한 시트 이름으로 아직까지 워크 시트가 만들어진 적이 없다면 우선 생성한다.
        workbook.addWorksheet(sheetName ?? "Sheet1");
      } else if (!sheetName && workbook.worksheets.length === 0) {
        // 워크 시트가 만들어진 적이 한 번도 없다면 우선 생성한다.
        workbook.addWorksheet(sheetName ?? "Sheet1");
      }

      // 0번 인덱스는 우리가 생성한 적 없는 시트이므로 패스한다.
      const CREATED_SHEET = 1 as const;
      const sheet = workbook.getWorksheet(sheetName ?? CREATED_SHEET);
      if (!sheet) {
        throw new NotFoundException("Not existing sheet");
      }

      data.forEach((data) => {
        const column = this.columnNumberToLetter(data.column);
        const position = `${column}${data.row}`; // A1, A2, ... 와 같은 형식
        sheet.getCell(position).value = data.snapshot.value;
      });

      const modifiedBuffer = await workbook.xlsx.writeBuffer();
      const key = `excel-connector/${v4()}`;
      const url = await this.s3.uploadObject({
        key,
        data: Buffer.from(modifiedBuffer),
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      return { fileId: key, fileUrl: url };
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  async getExcelFile(input: { fileUrl?: string }): Promise<Excel.Workbook> {
    if (input.fileUrl) {
      const response = await axios.get(input.fileUrl, {
        responseType: "arraybuffer",
      });

      // 워크북 로드
      return new Excel.Workbook().xlsx.load(response.data);
    }
    return new Excel.Workbook();
  }

  async createSheets(
    input: IExcelService.ICreateSheetInput,
  ): Promise<IExcelService.IExportExcelFileOutput> {
    const workbook = new Excel.Workbook();
    workbook.addWorksheet(input.sheetName ?? "Sheet1");

    const modifiedBuffer: ArrayBuffer = await workbook.xlsx.writeBuffer();
    const key = `excel-connector/${v4()}`;
    const fileUrl = await this.s3.uploadObject({
      key,
      data: Buffer.from(modifiedBuffer),
      contentType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    return { fileId: key, fileUrl };
  }

  columnNumberToLetter(column: number): string {
    let letter = "";
    while (column > 0) {
      const remainder = (column - 1) % 26;
      letter = String.fromCharCode(65 + remainder) + letter;
      column = Math.floor((column - 1) / 26);
    }
    return letter;
  }

  /**
   * 모든 행이 누락된 열이 없다고 가정한, 테스트 용 transformer 함수
   * @param input 모든 행이 누락된 열이 없다고 가정한, 즉 직사각형 형태의 시트를 의미한다.
   * @returns
   */
  transform(
    input: Record<string, string | number>[],
  ): ISpreadsheetCell.ICreate[] {
    if (input.length === 0) {
      return [];
    }

    const keys = Object.keys(input[0]!).map(
      (value, columnIndex): ISpreadsheetCell.ICreate => {
        return {
          row: 1,
          column: columnIndex + 1,
          snapshot: {
            type: "text",
            value: String(value),
          },
        };
      },
    );

    const values = input.flatMap(
      (data, rowIndex): ISpreadsheetCell.ICreate[] => {
        return Object.values(data).map(
          (value, columnIndex): ISpreadsheetCell.ICreate => {
            return {
              row: rowIndex + 1 + 1,
              column: columnIndex + 1,
              snapshot: {
                type: "text",
                value: String(value),
              },
            };
          },
        );
      },
    );

    return [...keys, ...values];
  }
}
