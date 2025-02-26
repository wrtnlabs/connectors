// import { CsvService } from "@wrtnlabs/connector-csv/lib/csv/CsvService";
// import { ICsvService } from "@wrtnlabs/connector-csv/lib/structures/ICsvService";
// import typia from "typia";
// import { TestGlobal } from "../TestGlobal";

// export const test_csv = async () => {
//   const csvService = new CsvService({
//     aws: {
//       s3: {
//         accessKeyId: TestGlobal.env.AWS_ACCESS_KEY_ID,
//         bucket: TestGlobal.env.AWS_S3_BUCKET,
//         region: "ap-northeast-2",
//         secretAccessKey: TestGlobal.env.AWS_SECRET_ACCESS_KEY,
//       },
//     },
//   });

//   /**
//    * read csv file from s3
//    */
//   const readCsvInput = {
//     s3Url: `https://${TestGlobal.env.AWS_S3_BUCKET}.s3.ap-northeast-2.amazonaws.com/a.csv`,
//     delimiter: ",",
//   };
//   const result = await csvService.read(readCsvInput);
//   typia.assert<ICsvService.IReadOutput>(result);

//   /**
//    * write csv file to s3
//    */
//   const headers = Object.keys(result.data[0]!);
//   const values = headers.reduce((obj: { [key: string]: string }, header) => {
//     obj[header] = "connector-test";
//     return obj;
//   }, {});
//   const writeCsvInput = {
//     fileName: "connector-test.csv",
//     delimiter: ";",
//     values: [values],
//   };

//   const writeResult = await csvService.write(writeCsvInput);
//   typia.assert(writeResult);

//   // /**
//   //  * convert csv to excel
//   //  */
//   // const csvToExcelInput = {
//   //   s3Url: `https://${ConnectorGlobal.env.AWS_S3_BUCKET}.s3.ap-northeast-2.amazonaws.com/a.csv`,
//   //   delimiter: ";",
//   // };
//   // const csvToExcelResult =
//   //   await csvService.csv_to_excel.csvToExcel(
//   //
//   //     csvToExcelInput,
//   //   );
//   // typia.assert<ICsvService.ICsvToExcelOutput>(csvToExcelResult);
// };
