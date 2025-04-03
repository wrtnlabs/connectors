import { parse } from "csv-parse/sync";
import ExcelJS from "exceljs";
import * as csv from "fast-csv";
import { WritableStreamBuffer } from "stream-buffers";

import { Readable } from "stream";
import { ICsvService } from "../structures/ICsvService";
import { FileManager } from "@wrtnlabs/connector-shared";

export class CsvService {
  constructor(private readonly fileManager: FileManager) {}
  /**
   * Csv Service.
   *
   * Read CSV file contents from base64 encoded string.
   */
  async read(input: ICsvService.IReadInput): Promise<ICsvService.IReadOutput> {
    try {
      const { uri, delimiter } = input;

      const body: string = await (async (): Promise<string> => {
        const isMatch = this.fileManager.isMatch({ uri });

        if (isMatch) {
          return (
            await this.fileManager.read({ props: { type: "url", url: uri } })
          ).data.toString("utf-8");
        } else {
          const response: Response = await fetch(uri);
          return await response.text();
        }
      })();

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
    const { uri, delimiter } = input;

    const isMatch = this.fileManager.isMatch({ uri });
    if (!isMatch) {
      throw new Error("Invalid File URL");
    }

    const csvData = await this.fileManager.read({
      props: { type: "url", url: uri },
    });

    // Convert Buffer to stream
    const csvStream = new Readable();
    csvStream.push(csvData.data);
    csvStream.push(null); // Indicates end of stream

    const buffer = new WritableStreamBuffer();
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: buffer });
    const worksheet = workbook.addWorksheet("Sheet1");
    let headers;

    const filename =
      uri.split("//").at(1)?.split("/").slice(1).join("/") ?? uri;

    if (!filename) {
      throw new Error(`Invalid File name: ${filename}`);
    }

    const excelFilename = `${filename.split(".").slice(0, -1).join(".")}.xlsx`;

    const res = await new Promise<string>((resolve, reject) => {
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

            const response = await this.fileManager.upload({
              props: {
                type: "object",
                path: excelFilename,
                data: buffer.getContents() || Buffer.from(""), // 버퍼 내용이 없을 경우 빈 버퍼 처리
                contentType:
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              },
            });

            resolve(response.uri);
          });
      } catch (err) {
        reject(err);
      }
    });

    return {
      uri: res,
    };
  }
}
