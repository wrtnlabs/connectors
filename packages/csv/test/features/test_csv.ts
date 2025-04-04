import { CsvService } from "@wrtnlabs/connector-csv/lib/csv/CsvService";
import { ICsvService } from "@wrtnlabs/connector-csv/lib/structures/ICsvService";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";
import { AwsS3Service } from "@wrtnlabs/connector-aws-s3";

export const test_csv = async () => {
  const awsS3Service = new AwsS3Service({
    awsAccessKeyId: TestGlobal.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: TestGlobal.env.AWS_SECRET_ACCESS_KEY,
    awsS3Bucket: TestGlobal.env.AWS_S3_BUCKET,
    awsS3Region: "ap-northeast-2",
  });

  const csvService = new CsvService({
    fileManager: awsS3Service,
  });

  /**
   * read csv file from s3
   */
  const readCsvInput = {
    s3Url: `https://${TestGlobal.env.AWS_S3_BUCKET}.s3.ap-northeast-2.amazonaws.com/a.csv`,
    delimiter: ",",
  };

  const result = await csvService.read({
    uri: readCsvInput.s3Url,
    delimiter: readCsvInput.delimiter,
  });

  typia.assert<ICsvService.IReadOutput>(result);

  const csvToExcelResult = await csvService.convertCsvToExcel({
    uri: readCsvInput.s3Url,
    delimiter: readCsvInput.delimiter,
  });

  typia.assert<ICsvService.ICsvToExcelOutput>(csvToExcelResult);
};
