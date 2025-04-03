import typia from "typia";
import { deepStrictEqual } from "assert";
import { ExcelService, IExcelService } from "@wrtnlabs/connector-excel";
import { TestGlobal } from "../TestGlobal";
import { AwsS3Service } from "@wrtnlabs/connector-aws-s3";

export const test_excel_create_file_witnout_sheet_name = async () => {
  const awsS3Service = new AwsS3Service({
    awsAccessKeyId: TestGlobal.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: TestGlobal.env.AWS_SECRET_ACCESS_KEY,
    awsS3Bucket: TestGlobal.env.AWS_S3_BUCKET,
    awsS3Region: "ap-northeast-2",
  });

  const excelService = new ExcelService(awsS3Service);
  const file = await excelService.createSheets({
    path: "connector-test-create-file-without-sheet-name.xlsx",
  });

  typia.assert(file);
};

export const test_excel_create_file_with_sheet_name = async () => {
  const awsS3Service = new AwsS3Service({
    awsAccessKeyId: TestGlobal.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: TestGlobal.env.AWS_SECRET_ACCESS_KEY,
    awsS3Bucket: TestGlobal.env.AWS_S3_BUCKET,
    awsS3Region: "ap-northeast-2",
  });

  const excelService = new ExcelService(awsS3Service);
  const file = await excelService.createSheets({
    path: "connector-test-create-file-with-sheet-name.xlsx",
    sheetName: "TEST",
  });

  typia.assert(file);
};

export const test_excel_insert_rows_without_file_url = async () => {
  /**
   * insert rows
   */
  // const data = {
  //   Identifier: typia.random<string>(),
  //   "First name": typia.random<string>(),
  //   "Last name": typia.random<string>(),
  // };

  const awsS3Service = new AwsS3Service({
    awsAccessKeyId: TestGlobal.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: TestGlobal.env.AWS_SECRET_ACCESS_KEY,
    awsS3Bucket: TestGlobal.env.AWS_S3_BUCKET,
    awsS3Region: "ap-northeast-2",
  });

  const excelService = new ExcelService(awsS3Service);

  const file = await excelService.createSheets({
    path: "connector-test-insert-rows-without-file-url.xlsx",
    sheetName: "TEST",
  });

  const res = await excelService.insertRows({
    uri: file.uri,
    data: [
      {
        row: 1,
        column: 1,
        snapshot: {
          type: "text",
          value: "Identifier",
        },
      },
      {
        row: 1,
        column: 2,
        snapshot: {
          type: "text",
          value: "First name",
        },
      },
      {
        row: 1,
        column: 3,
        snapshot: {
          type: "text",
          value: "Last name",
        },
      },
      {
        row: 2,
        column: 1,
        snapshot: {
          type: "text",
          value: typia.random<string>(),
        },
      },
      {
        row: 2,
        column: 2,
        snapshot: {
          type: "text",
          value: typia.random<string>(),
        },
      },
      {
        row: 2,
        column: 3,
        snapshot: {
          type: "text",
          value: typia.random<string>(),
        },
      },
    ],
  });

  typia.assert(res);
};

export const test_excel_insert_rows_with_file_url = async () => {
  const awsS3Service = new AwsS3Service({
    awsAccessKeyId: TestGlobal.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: TestGlobal.env.AWS_SECRET_ACCESS_KEY,
    awsS3Bucket: TestGlobal.env.AWS_S3_BUCKET,
    awsS3Region: "ap-northeast-2",
  });

  const excelService = new ExcelService(awsS3Service);
  const file = await excelService.createSheets({
    path: "connector-test-insert-rows-with-file-url.xlsx",
    sheetName: "TEST",
  });

  /**
   * insert rows
   */
  const res = await excelService.insertRows({
    uri: file.uri,
    data: [
      {
        row: 1,
        column: 1,
        snapshot: {
          type: "text",
          value: "Identifier",
        },
      },
      {
        row: 1,
        column: 2,
        snapshot: {
          type: "text",
          value: "First name",
        },
      },
      {
        row: 1,
        column: 3,
        snapshot: {
          type: "text",
          value: "Last name",
        },
      },
      {
        row: 2,
        column: 1,
        snapshot: {
          type: "text",
          value: typia.random<string>(),
        },
      },
      {
        row: 2,
        column: 2,
        snapshot: {
          type: "text",
          value: typia.random<string>(),
        },
      },
      {
        row: 2,
        column: 3,
        snapshot: {
          type: "text",
          value: typia.random<string>(),
        },
      },
    ],
  });

  typia.assert(res);
};

// 이전 실패 케이스에 대한 테스트 코드 추가
export const test_excel_insert_row_fail_case_1 = async () => {
  const awsS3Service = new AwsS3Service({
    awsAccessKeyId: TestGlobal.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: TestGlobal.env.AWS_SECRET_ACCESS_KEY,
    awsS3Bucket: TestGlobal.env.AWS_S3_BUCKET,
    awsS3Region: "ap-northeast-2",
  });

  const excelService = new ExcelService(awsS3Service);
  const file = await excelService.createSheets({
    path: "connector-test-insert-rows-with-file-url-1.xlsx",
    sheetName: "TEST",
  });

  // const data = [
  //   {
  //     이름: "홍길동",
  //     나이: 25,
  //     직업: "엔지니어",
  //     이메일: "hong@example.com",
  //   },
  // ];

  const res = await excelService.insertRows({
    uri: file.uri,
    sheetName: "TEST",
    data: [
      {
        row: 1,
        column: 1,
        snapshot: {
          type: "text",
          value: "이름",
        },
      },
      {
        row: 1,
        column: 2,
        snapshot: {
          type: "text",
          value: "나이",
        },
      },
      {
        row: 1,
        column: 3,
        snapshot: {
          type: "text",
          value: "직업",
        },
      },
      {
        row: 1,
        column: 4,
        snapshot: {
          type: "text",
          value: "이메일",
        },
      },
      {
        row: 2,
        column: 1,
        snapshot: {
          type: "text",
          value: "홍길동",
        },
      },
      {
        row: 2,
        column: 2,
        snapshot: {
          type: "text",
          value: "25",
        },
      },
      {
        row: 2,
        column: 3,
        snapshot: {
          type: "text",
          value: "엔지니어",
        },
      },
      {
        row: 2,
        column: 4,
        snapshot: {
          type: "text",
          value: "hong@example.com",
        },
      },
    ],
  });

  typia.assert(res);
};

// 이전 실패 케이스에 대한 테스트 코드 추가
export const test_excel_insert_row_fail_case_2 = async () => {
  const awsS3Service = new AwsS3Service({
    awsAccessKeyId: TestGlobal.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: TestGlobal.env.AWS_SECRET_ACCESS_KEY,
    awsS3Bucket: TestGlobal.env.AWS_S3_BUCKET,
    awsS3Region: "ap-northeast-2",
  });

  const excelService = new ExcelService(awsS3Service);

  const file = await excelService.createSheets({
    path: "connector-test-insert-rows-with-file-url-2.xlsx",
    sheetName: "TEST",
  });

  const res = await excelService.insertRows({
    uri: file.uri,
    sheetName: "TEST",
    data: excelService.transform({
      data: [
        {
          AirlineName: "Air Mock",
          FlightNumber: "AM1234",
          DepartureTime: "08:00",
          ArrivalTime: "10:00",
          Status: "On Time",
        },
        {
          AirlineName: "Sky High",
          FlightNumber: "SH5678",
          DepartureTime: "09:30",
          ArrivalTime: "11:30",
          Status: "Delayed",
        },
        {
          AirlineName: "Cloud Airlines",
          FlightNumber: "CA9101",
          DepartureTime: "12:00",
          ArrivalTime: "14:00",
          Status: "Cancelled",
        },
        {
          AirlineName: "Jet Setters",
          FlightNumber: "JS2345",
          DepartureTime: "15:15",
          ArrivalTime: "17:15",
          Status: "On Time",
        },
        {
          AirlineName: "Fly Fast",
          FlightNumber: "FF6789",
          DepartureTime: "18:45",
          ArrivalTime: "20:45",
          Status: "On Time",
        },
      ],
    }),
  });

  typia.assert(res);
};

// 이전 실패 케이스에 대한 테스트 코드 추가, 2번에 나눠서 저장한 경우 누적이 잘 되는지를 검증
export const test_excel_insert_row_fail_case_3 = async () => {
  const awsS3Service = new AwsS3Service({
    awsAccessKeyId: TestGlobal.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: TestGlobal.env.AWS_SECRET_ACCESS_KEY,
    awsS3Bucket: TestGlobal.env.AWS_S3_BUCKET,
    awsS3Region: "ap-northeast-2",
  });

  const excelService = new ExcelService(awsS3Service);

  const file = await excelService.createSheets({
    path: "connector-test-insert-rows-with-file-url-3.xlsx",
    sheetName: "TEST",
  });

  const first = await excelService.insertRows({
    uri: file.uri,
    sheetName: "TEST",
    data: [
      {
        row: 1,
        column: 1,
        snapshot: {
          type: "text",
          value: "AirlineName",
        },
      },
      {
        row: 1,
        column: 2,
        snapshot: {
          type: "text",
          value: "FlightNumber",
        },
      },
      {
        row: 1,
        column: 3,
        snapshot: {
          type: "text",
          value: "DepartureTime",
        },
      },
      {
        row: 1,
        column: 4,
        snapshot: {
          type: "text",
          value: "ArrivalTime",
        },
      },
      {
        row: 1,
        column: 5,
        snapshot: {
          type: "text",
          value: "Status",
        },
      },
      {
        row: 2,
        column: 1,
        snapshot: {
          type: "text",
          value: "Air Mock",
        },
      },
      {
        row: 2,
        column: 2,
        snapshot: {
          type: "text",
          value: "AM1234",
        },
      },
      {
        row: 2,
        column: 3,
        snapshot: {
          type: "text",
          value: "08:00",
        },
      },
      {
        row: 2,
        column: 4,
        snapshot: {
          type: "text",
          value: "10:00",
        },
      },
      {
        row: 2,
        column: 5,
        snapshot: {
          type: "text",
          value: "On Time",
        },
      },
    ],
  });

  const second = await excelService.insertRows({
    uri: first.uri,
    sheetName: "TEST",
    data: [
      {
        row: 3,
        column: 1,
        snapshot: {
          type: "text",
          value: "Sky High",
        },
      },
      {
        row: 3,
        column: 2,
        snapshot: {
          type: "text",
          value: "SH5678",
        },
      },
      {
        row: 3,
        column: 3,
        snapshot: {
          type: "text",
          value: "09:30",
        },
      },
      {
        row: 3,
        column: 4,
        snapshot: {
          type: "text",
          value: "11:30",
        },
      },
      {
        row: 3,
        column: 5,
        snapshot: {
          type: "text",
          value: "Delayed",
        },
      },
    ],
  });

  const res = await excelService.getExcelData({
    uri: second.uri,
    sheetName: "TEST",
  });

  const answer = {
    headers: [
      "AirlineName",
      "FlightNumber",
      "DepartureTime",
      "ArrivalTime",
      "Status",
    ],
    data: [
      {
        AirlineName: "Air Mock",
        FlightNumber: "AM1234",
        DepartureTime: "08:00",
        ArrivalTime: "10:00",
        Status: "On Time",
      },
      {
        AirlineName: "Sky High",
        FlightNumber: "SH5678",
        DepartureTime: "09:30",
        ArrivalTime: "11:30",
        Status: "Delayed",
      },
    ],
  };

  console.log(JSON.stringify(res));
  console.log("--------------------------------");
  console.log(JSON.stringify(answer));

  deepStrictEqual(JSON.stringify(res), JSON.stringify(answer));
};

// 빈 엑셀 파일에 데이터를 넣을 때에는 헤더가 추가되어야 한다.
export const test_excel_insert_row_to_empty_excel_file = async () => {
  const awsS3Service = new AwsS3Service({
    awsAccessKeyId: TestGlobal.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: TestGlobal.env.AWS_SECRET_ACCESS_KEY,
    awsS3Bucket: TestGlobal.env.AWS_S3_BUCKET,
    awsS3Region: "ap-northeast-2",
  });

  const excelService = new ExcelService(awsS3Service);

  const file = await excelService.createSheets({
    path: "connector-test-insert-rows-to-empty-excel-file.xlsx",
    sheetName: "TEST",
  });

  const res = await excelService.insertRows({
    uri: file.uri,
    sheetName: "TEST",
    data: excelService.transform({
      data: [
        {
          이름: "홍길동",
          나이: 25,
          직업: "엔지니어",
          이메일: "hong@example.com",
        },
      ],
    }),
  });

  typia.assert(res);
};

/**
 * 기존 테스트 코드
 *
 * @param connection
 */
export const test_excel = async () => {
  const awsS3Service = new AwsS3Service({
    awsAccessKeyId: TestGlobal.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: TestGlobal.env.AWS_SECRET_ACCESS_KEY,
    awsS3Bucket: TestGlobal.env.AWS_S3_BUCKET,
    awsS3Region: "ap-northeast-2",
  });

  const excelService = new ExcelService(awsS3Service);

  const file = await excelService.createSheets({
    path: "connector-test-excel.xlsx",
    sheetName: "TEST",
  });

  /**
   * read worksheet list
   */
  const worksheetListOutput = await excelService.readSheets({
    uri: file.uri,
  });
  typia.assert<IExcelService.IWorksheetListOutput>(worksheetListOutput);

  /**
   * insert rows
   */
  const insertRowsInput: IExcelService.IInsertExcelRowInput = {
    uri: file.uri,
    data: excelService.transform({
      data: [
        {
          Identifier: typia.random<string>(),
          "First name": typia.random<string>(),
          "Last name": typia.random<string>(),
        },
      ],
    }),
  };
  const insertRowsOutput = await excelService.insertRows(insertRowsInput);

  typia.assert(insertRowsOutput);

  /**
   * read rows data
   */
  const readExcelInput = {
    uri: insertRowsOutput.uri,
    sheetName: worksheetListOutput.data[0]?.sheetName,
  };

  const readExcelOutput = await excelService.getExcelData(readExcelInput);
  typia.assert<IExcelService.IReadExcelOutput>(readExcelOutput);
};
