import typia from "typia";
import { v4 } from "uuid";
import { TestGlobal } from "../TestGlobal";
import { IHancellService } from "@wrtnlabs/connector-hancell/lib/structures/IHancellService";
import { HancellService } from "@wrtnlabs/connector-hancell/lib/hancell/HancellService";

const exampleFile = `https://${TestGlobal.env.AWS_S3_BUCKET}.s3.ap-northeast-2.amazonaws.com/example.cell`;

export const test_hancell_read_file = async () => {
  /**
   * read worksheet list
   */
  const worksheetListInput: IHancellService.IReadHancellInput = {
    fileUrl: exampleFile,
  };

  const hancellService = new HancellService({
    aws: {
      s3: {
        accessKeyId: TestGlobal.env.AWS_ACCESS_KEY_ID,
        bucket: TestGlobal.env.AWS_S3_BUCKET,
        region: "ap-northeast-2",
        secretAccessKey: TestGlobal.env.AWS_SECRET_ACCESS_KEY,
      },
    },
  });

  const res = await hancellService.getHancellData(worksheetListInput);

  typia.assert(res);

  return res;
};

export const test_hancell_insert_rows = async () => {
  /**
   * 이전 데이터 조회
   */
  const targetCell = "B3";
  const before = await test_hancell_read_file();
  const beforeData = before["Sheet1"]?.[targetCell];

  /**
   * 특정 셀 수정
   */
  const hancellService = new HancellService({
    aws: {
      s3: {
        accessKeyId: TestGlobal.env.AWS_ACCESS_KEY_ID,
        bucket: TestGlobal.env.AWS_S3_BUCKET,
        region: "ap-northeast-2",
        secretAccessKey: TestGlobal.env.AWS_SECRET_ACCESS_KEY,
      },
    },
  });

  const testValue = v4();
  const updated = await hancellService.upsertSheet({
    fileUrl: exampleFile,
    sheetName: "Sheet1",
    cells: {
      [targetCell]: testValue,
    },
  });

  /**
   * 수정 후 조회
   */
  const after = await hancellService.getHancellData({
    fileUrl: updated.fileUrl,
  });

  const afterData = after["Sheet1"]?.[targetCell];

  typia.assert<false>(beforeData === afterData);
  typia.assert<true>(afterData === testValue);
};

export const test_hancell_insert_rows_outside_of_start_point = async () => {
  /**
   * 이전 데이터 조회
   */
  const targetCell = "A1";
  const before = await test_hancell_read_file();
  const beforeData = before["Sheet1"]?.[targetCell]; // 시작 지점 바깥에 존재한다.

  /**
   * 특정 셀 수정
   */
  const hancellService = new HancellService({
    aws: {
      s3: {
        accessKeyId: TestGlobal.env.AWS_ACCESS_KEY_ID,
        bucket: TestGlobal.env.AWS_S3_BUCKET,
        region: "ap-northeast-2",
        secretAccessKey: TestGlobal.env.AWS_SECRET_ACCESS_KEY,
      },
    },
  });

  const testValue = v4();
  const updated = await hancellService.upsertSheet({
    fileUrl: exampleFile,
    sheetName: "Sheet1",
    cells: {
      [targetCell]: testValue,
    },
  });

  /**
   * 수정 후 조회
   */
  const after = await hancellService.getHancellData({
    fileUrl: updated.fileUrl,
  });

  const afterData = after["Sheet1"]?.[targetCell];

  typia.assert<false>(beforeData === afterData);
  typia.assert<true>(afterData === testValue);
};

export const test_hancell_insert_rows_outside_of_end_point = async () => {
  /**
   * 이전 데이터 조회
   */
  const targetCell = "Z1";
  const before = await test_hancell_read_file();
  const beforeData = before["Sheet1"]?.[targetCell]; // 시트 범위 종료 지점 바깥에 존재한다.

  /**
   * 특정 셀 수정
   */

  const hancellService = new HancellService({
    aws: {
      s3: {
        accessKeyId: TestGlobal.env.AWS_ACCESS_KEY_ID,
        bucket: TestGlobal.env.AWS_S3_BUCKET,
        region: "ap-northeast-2",
        secretAccessKey: TestGlobal.env.AWS_SECRET_ACCESS_KEY,
      },
    },
  });

  const testValue = v4();
  const updated = await hancellService.upsertSheet({
    fileUrl: exampleFile,
    sheetName: "Sheet1",
    cells: {
      [targetCell]: testValue,
    },
  });

  /**
   * 수정 후 조회
   */
  const after = await hancellService.getHancellData({
    fileUrl: updated.fileUrl,
  });

  const afterData = after["Sheet1"]?.[targetCell];

  typia.assert<false>(beforeData === afterData);
  typia.assert<true>(afterData === testValue);
};
