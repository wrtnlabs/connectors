import { CsvService } from "@wrtnlabs/connector-csv/lib/csv/CsvService";
import { ICsvService } from "@wrtnlabs/connector-csv/lib/structures/ICsvService";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";
// import * as fs from "node:fs/promises";
import { stringToBase64 } from "@wrtnlabs/connector-shared";

export const test_csv = async () => {
  const csvService = new CsvService();

  /**
   * read csv file from s3
   */
  const readCsvInput = {
    s3Url: `https://${TestGlobal.env.AWS_S3_BUCKET}.s3.ap-northeast-2.amazonaws.com/a.csv`,
    delimiter: ",",
  };

  const response = await fetch(readCsvInput.s3Url);
  const body = await response.text();

  const csvBase64 = stringToBase64(body);

  const result = await csvService.read({
    csvBase64: csvBase64,
    delimiter: readCsvInput.delimiter,
  });

  typia.assert<ICsvService.IReadOutput>(result);

  // await fs.writeFile("a.csv", csvBase64, "base64");

  const csvToExcelResult = await csvService.convertCsvToExcel({
    csvBase64: csvBase64,
    delimiter: readCsvInput.delimiter,
  });

  typia.assert<ICsvService.ICsvToExcelOutput>(csvToExcelResult);

  // await fs.writeFile("a.xlsx", csvToExcelResult.excelBase64, "base64");
};
