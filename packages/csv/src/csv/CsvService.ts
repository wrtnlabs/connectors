import { parse } from "csv-parse/sync";
import ExcelJS from "exceljs";
import * as csv from "fast-csv";
import * as streamBuffers from "stream-buffers";
import { WritableStreamBuffer } from "stream-buffers";

import { Readable } from "stream";
import { ICsvService } from "../structures/ICsvService";
import { AwsS3Service } from "@wrtnlabs/connector-aws-s3";

export class CsvService {
  private readonly s3: AwsS3Service;

  constructor(private readonly props: ICsvService.IProps) {
    this.s3 = new AwsS3Service({
      ...this.props.aws.s3,
    });
  }

  async read(input: ICsvService.IReadInput): Promise<ICsvService.IReadOutput> {
    try {
      const { s3Url, delimiter } = input;
      const match = s3Url.match(this.s3.S3BucketURL);

      const body: string = await (async (): Promise<string> => {
        if (match) {
          return (await this.s3.getObject({ filename: match[0] })).toString(
            "utf-8",
          );
        } else {
          const response: Response = await fetch(s3Url);
          return response.text();
        }
      })();
      const res = parse(body, {
        columns: true,
        delimiter: delimiter,
        relaxColumnCount: true,
      });

      return { data: res };
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  async write(
    input: ICsvService.IWriteInput,
  ): Promise<ICsvService.IWriteOutput> {
    const { values, fileName: filename, delimiter } = input;
    let existValues = [];
    try {
      const response =
        (await this.s3.getObject({ filename })).toString("utf-8") || "";
      existValues = parse(response, {
        columns: true,
        delimiter: delimiter,
      });
    } catch (err: unknown) {
      if ((err as any).Code !== "NoSuchKey") {
        console.error("Error reading file:", err);
        throw err;
      }
    }

    const insertValues = [...existValues, ...values];

    const s3 = this.s3;

    const csvBuffer = new streamBuffers.WritableStreamBuffer();
    await new Promise<void>((resolve, reject) =>
      csv
        .write(insertValues, { headers: true, delimiter: delimiter })
        .pipe(csvBuffer)
        .on("finish", async function () {
          try {
            const bufferContent = csvBuffer.getContents() || Buffer.from("");

            await s3.uploadObject({
              key: filename,
              data: bufferContent,
              contentType: "text/csv",
            });
            resolve();
          } catch (err) {
            console.error("Error uploading file:", err);
            reject(err);
          }
        }),
    );
    // TODO: override bucket
    return {
      s3Url: `https://${this.props.aws.s3.bucket}.s3.amazonaws.com/${filename}`,
    };
  }

  async convertCsvToExcel(
    input: ICsvService.ICsvToExcelInput,
  ): Promise<ICsvService.ICsvToExcelOutput> {
    const { s3Url, delimiter } = input;
    const match = s3Url.match(this.s3.S3BucketURL);
    if (!match) throw new Error("Invalid S3 URL");

    const filename = match[3]!;
    const s3Buffer = await this.s3.getObject({ filename: filename });

    // Buffer를 스트림으로 변환
    const s3Stream = new Readable();
    s3Stream.push(s3Buffer);
    s3Stream.push(null); // 스트림의 끝을 나타냄

    const buffer = new WritableStreamBuffer();
    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: buffer });
    const worksheet = workbook.addWorksheet("Sheet1");
    let headers;

    const key = `${filename.split(".").slice(0, -1).join(".")}.xlsx`;

    await new Promise<void>((resolve, reject) => {
      try {
        s3Stream
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

            const uploadParams = {
              key: key,
              data: buffer.getContents() || Buffer.from(""), // 버퍼 내용이 없을 경우 빈 버퍼 처리
              contentType:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            };
            await this.s3.uploadObject(uploadParams);
            resolve();
          });
      } catch (err) {
        reject(err);
      }
    });
    return {
      url: `https://${this.props.aws.s3.bucket}.s3.ap-northeast-2.amazonaws.com/${key}`,
    };
  }
}
