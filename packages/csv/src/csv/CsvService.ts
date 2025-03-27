import { parse } from "csv-parse/sync";
import ExcelJS from "exceljs";
import * as csv from "fast-csv";
import { WritableStreamBuffer } from "stream-buffers";

import { Readable } from "stream";
import { ICsvService } from "../structures/ICsvService";
import { base64ToString } from "@wrtnlabs/connector-shared";

export class CsvService {
  /**
   * Csv Service.
   *
   * Read CSV file contents from base64 encoded string.
   */
  async read(input: ICsvService.IReadInput): Promise<ICsvService.IReadOutput> {
    try {
      const { csvBase64, delimiter } = input;

      const body: string = base64ToString(csvBase64);

      const res = parse(body, {
        columns: true,
        delimiter: delimiter,
        relaxColumnCount: true,
      });

      return { data: res };
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Csv Service.
   *
   * Convert CSV file to Excel file.
   */
  async convertCsvToExcel(
    input: ICsvService.ICsvToExcelInput,
  ): Promise<ICsvService.ICsvToExcelOutput> {
    const { csvBase64, delimiter } = input;

    // base64 디코딩
    const csvData = Buffer.from(csvBase64, "base64").toString("utf-8");

    // CSV 데이터를 스트림으로 변환
    const csvStream = new Readable();
    csvStream.push(csvData);
    csvStream.push(null);

    const buffer = new WritableStreamBuffer();
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: buffer });
    const worksheet = workbook.addWorksheet("Sheet1");
    let headers;

    await new Promise<void>((resolve, reject) => {
      try {
        csvStream
          .pipe(csv.parse({ headers: true, delimiter: delimiter }))
          .on("headers", (receivedHeaders: string[]) => {
            headers = receivedHeaders;
            worksheet.columns = headers.map((header: string) => ({
              header,
              key: header,
            }));
          })
          .on("data", (row: { [key: string]: string }) => {
            worksheet.addRow(row).commit();
          })
          .on("end", async () => {
            await workbook.commit();
            resolve();
          });
      } catch (err) {
        reject(err);
      }
    });

    const res = buffer.getContents();

    if (!res) {
      throw new Error("Fail to convert csv to excel");
    }

    return {
      excelBase64: res.toString("base64"),
    };
  }
}
