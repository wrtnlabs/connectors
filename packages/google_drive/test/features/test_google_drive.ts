import typia from "typia";
import { notDeepStrictEqual } from "assert";
import { TestGlobal } from "../TestGlobal";
import {
  GoogleDriveService,
  IGoogleDriveService,
} from "@wrtnlabs/connector-google-drive";

export const test_api_connector_google_drive_create_folder = async () => {
  const googleDriveService = new GoogleDriveService({
    clientId: TestGlobal.env.GOOGLE_CLIENT_ID,
    clientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
    secret: TestGlobal.env.GOOGLE_TEST_SECRET,
  });

  const res = await googleDriveService.createFolder({
    name: "connector-test-folder",
  });
  typia.assert(res);

  // 테스트 후 폴더 삭제
  await googleDriveService.deleteFolder({ id: res.id });
};

export const test_api_connector_google_drive_get_folder_list = async () => {
  const googleDriveService = new GoogleDriveService({
    clientId: TestGlobal.env.GOOGLE_CLIENT_ID,
    clientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
    secret: TestGlobal.env.GOOGLE_TEST_SECRET,
  });

  const res = await googleDriveService.folderList();
  typia.assert(res);
};

export const test_api_connector_google_drive = async () => {
  const googleDriveService = new GoogleDriveService({
    clientId: TestGlobal.env.GOOGLE_CLIENT_ID,
    clientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
    secret: TestGlobal.env.GOOGLE_TEST_SECRET,
  });

  const createdFolder = await googleDriveService.createFolder({
    name: "connector-test-folder",
  });

  /**
   * create new file
   */
  const createFileOutput = await googleDriveService.uploadFile({
    name: "connector-test-file",
    folderIds: [createdFolder.id!],
    fileUrl:
      "https://studio-api-bucket.s3.ap-northeast-2.amazonaws.com/rag-test-2.pdf",
  });
  typia.assert(createFileOutput);

  /**
   * get text from text file
   */
  const getTextFromFileOutput = await googleDriveService.getFile({
    fileId: createFileOutput.id!,
  });
  typia.assert(getTextFromFileOutput);

  /**
   * permission to file or folder
   */
  const permissionInput: IGoogleDriveService.IPermissionGoogleDriveInput = {
    fileId: createFileOutput.id!,
    permissions: [
      {
        email: "jake@wrtn.io",
        role: "writer",
        type: "user",
      },
    ],
  };
  const permissionOutput = await googleDriveService.permission(permissionInput);
  typia.assert(permissionOutput);

  /**
   * get file list
   */
  const findFileListInput = {
    folderId: createdFolder.id,
  };
  const findFileListOutput =
    await googleDriveService.fileList(findFileListInput);
  typia.assert(findFileListOutput);

  /**
   * get file list without folderId
   */

  const findFileListWtthoutFolderIdOutput = await googleDriveService.fileList(
    {},
  );
  typia.assert(findFileListWtthoutFolderIdOutput);

  notDeepStrictEqual(findFileListOutput, findFileListWtthoutFolderIdOutput);

  /**
   * delete file
   */
  const deleteFileInput = createFileOutput.id!;
  await googleDriveService.deleteFile({ id: deleteFileInput });

  /**
   * delete folder
   */
  const deleteFolderInput = createdFolder.id!;
  await googleDriveService.deleteFolder({ id: deleteFolderInput });

  /**
   * get folder list for delete check
   */
  const folderList = await googleDriveService.folderList();
  typia.assert(folderList.data);

  return folderList;
};
