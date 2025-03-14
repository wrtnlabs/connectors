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

  /**
   * Excel Service.
   *
   * Get a list of Excel worksheets that exist in the input file url
   */
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

  /**
   * Excel Service.
   *
   * Get the contents of the corresponding Excel file based on the input file information
   */
  async getExcelData(
    input: IExcelService.IReadExcelInput,
  ): Promise<IExcelService.IReadExcelOutput> {
    const workbook = await this.getExcelFile({ fileUrl: input.fileUrl });

    try {
      const sheet = workbook.getWorksheet(input.sheetName ?? 1);
      if (!sheet) {
        throw new Error("Not existing sheet");
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

  /**
   * Excel Service.
   *
   * Based on the input file information, the headers of the corresponding Excel file are retrieved
   */
  async readHeaders(input: IExcelService.IReadExcelInput): Promise<string[]> {
    const { fileUrl, sheetName } = input;
    const workbook = await this.getExcelFile({ fileUrl });
    return this.readExcelHeaders({ workbook, sheetName });
  }

  private readExcelHeaders(input: {
    workbook: Excel.Workbook;
    sheetName?: string | null;
  }): string[] {
    const { workbook, sheetName } = input;
    const worksheet = workbook.getWorksheet(sheetName ?? 1);
    const headerRow = worksheet?.getRow(1); // 첫 번째 행이 헤더라고 가정

    // 헤더 데이터를 배열로 추출
    const headers: string[] = [];
    headerRow?.eachCell((cell) => {
      headers.push(cell.value as string); // 각 셀의 값을 문자열로 변환하여 배열에 추가
    });

    return headers;
  }

  /**
   * Excel Service.
   *
   * Upload an Excel file to add data to the file
   *
   * When adding data to Excel, sheet creation precedes if it is a sheet that does not exist yet.
   * Therefore, this feature can also be used for sheet creation.
   * If you want to create a sheet only and create an empty file without any data,
   * you just need to specify the name of the sheet without any data.
   *
   * When adding rows to an already existing sheet,
   * it is supposed to be added to the lower line, so it is recommended to check the data before adding it.
   * If you provide fileUrl, you can modify it after you work on it. After modification, the file will be issued as a new link.
   *
   * It is a connector that allows users to upload files by drag and drop.
   */
  async insertRowsByUpload(
    input: IExcelService.IInsertExcelRowByUploadInput,
  ): Promise<IExcelService.IExportExcelFileOutput> {
    return this.insertRows(input);
  }

  /**
   * Excel Service.
   *
   * Add data to the Excel file with an Excel file link
   *
   * If the sheet doesn’t exist, it will be created, allowing both sheet creation and data addition.
   * To create an empty sheet, specify only the sheet name without data.
   * Rows added to an existing sheet will appear on the next line; verify data before adding.
   * If you provide a file URL, modifications are saved, and a new link is issued.
   * This connector updates Excel files directly via file links, improving user experience over uploading files.
   * A link is generated immediately after file creation, making data management more efficient.
   */
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
        throw new Error("Not existing sheet");
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

  private async getExcelFile(input: {
    fileUrl?: string;
  }): Promise<Excel.Workbook> {
    if (input.fileUrl) {
      const response = await axios.get(input.fileUrl, {
        responseType: "arraybuffer",
      });

      // 워크북 로드
      return new Excel.Workbook().xlsx.load(response.data);
    }
    return new Excel.Workbook();
  }

  /**
   * Excel Service.
   *
   * Add Excel files and sheet
   *
   * Create an Excel file and get the link back.
   * You can also forward this link to the following connector to reflect further modifications.
   * When creating a sheet with this feature, the default name 'Sheet1' is created if the sheet name is not provided.
   */
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

  private columnNumberToLetter(column: number): string {
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
   *
   * @hidden
   * @param input 모든 행이 누락된 열이 없다고 가정한, 즉 직사각형 형태의 시트를 의미한다.
   * @returns
   */
  transform(input: {
    data: Record<string, string | number>[];
  }): ISpreadsheetCell.ICreate[] {
    if (input.data.length === 0) {
      return [];
    }

    const keys = Object.keys(input.data[0]!).map(
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

    const values = input.data.flatMap(
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
