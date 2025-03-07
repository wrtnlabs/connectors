import core from "@nestia/core";
import { Controller } from "@nestjs/common";
import {
  Prerequisite,
  RouteIcon,
  SelectBenchmark,
  Standalone,
} from "@wrtnio/decorators";

import { IGoogleDrive } from "@wrtn/connector-api/lib/structures/connector/google_drive/IGoogleDrive";

import { ApiTags } from "@nestjs/swagger";
import { GoogleDriveProvider } from "../../../providers/connector/google_drive/GoogleDriveProvider";

@Controller("connector/google-drive")
export class GoogleDriveController {
  /**
   * Get a list of folders in Google Drive
   *
   * @summary Get a list of Google Drive folders
   * @param headers Information for accessing Google Drive
   * @returns A list of Google Drive folders
   */
  @SelectBenchmark("구글 드라이브에 폴더 목록 좀 봐줘")
  @Standalone()
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/google_drive.svg",
  )
  @ApiTags("Google Drive")
  @core.TypedRoute.Patch("get/folders")
  async folderList(
    @core.TypedBody()
    input: IGoogleDrive.ISecret,
  ): Promise<IGoogleDrive.IFolderListGoogleDriveOutput> {
    return await GoogleDriveProvider.folderList(input);
  }

  /**
   * Get a list of files in Google Drive
   *
   * @summary Get a list of Google Drive files
   * @param query Information for getting a list of files
   * @returns A list of Google Drive files
   */
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/google_drive.svg",
  )
  @SelectBenchmark("드라이브에 파일 좀 찾아줘")
  @SelectBenchmark("드라이브에 파일 좀 조회해줘")
  @ApiTags("Google Drive")
  @core.TypedRoute.Patch("get/files")
  async fileList(
    @core.TypedBody() input: IGoogleDrive.IFileListGoogleDriveInput,
  ): Promise<IGoogleDrive.IFileListGoogleDriveOutput> {
    return await GoogleDriveProvider.fileList(input);
  }

  /**
   * Create a new folder in Google Drive
   *
   * @summary Create a Google Drive folder
   * @param headers
   * @param input The name of the folder to be created
   * @returns The unique ID of the created folder
   */
  @SelectBenchmark("드라이브에 폴더 좀 생성해줘")
  @Standalone()
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/google_drive.svg",
  )
  @ApiTags("Google Drive")
  @core.TypedRoute.Post("/folder")
  async createFolder(
    @core.TypedBody() input: IGoogleDrive.ICreateFolderGoogleDriveInput,
  ): Promise<IGoogleDrive.ICreateFolderGoogleDriveOutput> {
    return await GoogleDriveProvider.createFolder(input);
  }

  /**
   * Create a new file in Google Drive
   *
   * @summary Create a Google Drive file
   * @param input The name of the file to be created and the unique ID of the folder where the file will be created
   * @returns The unique ID of the created file
   */
  @SelectBenchmark("드라이브에 파일 좀 생성해줘")
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/google_drive.svg",
  )
  @ApiTags("Google Drive")
  @core.TypedRoute.Post("/file")
  async createFile(
    @core.TypedBody() input: IGoogleDrive.IUploadFileInput,
  ): Promise<IGoogleDrive.ICreateFileGoogleDriveOutput> {
    return await GoogleDriveProvider.uploadFile(input);
  }

  /**
   * Delete a file in Google Drive
   *
   * @summary Delete a Google Drive file
   * @param id The unique ID of the file to be deleted
   */
  @SelectBenchmark("드라이브에 파일 좀 삭제해줘")
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/google_drive.svg",
  )
  @ApiTags("Google Drive")
  @core.TypedRoute.Delete("/file/:id")
  async deleteFile(
    /**
     * @title File to delete
     * @description Please select the file to delete
     */
    @Prerequisite({
      neighbor: () => GoogleDriveController.prototype.fileList,
      jmesPath: "data[].{value: id || '', label: name || ''}",
    })
    @core.TypedParam("id")
    id: string,
    @core.TypedBody()
    input: IGoogleDrive.ISecret,
  ): Promise<void> {
    return await GoogleDriveProvider.deleteFile(id, input);
  }

  /**
   * Delete a folder in Google Drive
   *
   * @summary Delete a Google Drive folder
   * @param id The unique ID of the folder to be deleted
   */
  @SelectBenchmark("드라이브에 폴더 좀 삭제해줘")
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/google_drive.svg",
  )
  @ApiTags("Google Drive")
  @core.TypedRoute.Delete("/folder/:id")
  async deleteFolder(
    /**
     * @title Folder to delete
     * @description Please select the folder to delete
     */
    @Prerequisite({
      neighbor: () => GoogleDriveController.prototype.folderList,
      jmesPath: "data[].{value: id || '', label: name || ''}",
    })
    @core.TypedParam("id")
    id: string,
    @core.TypedBody()
    input: IGoogleDrive.ISecret,
  ): Promise<void> {
    return await GoogleDriveProvider.deleteFolder(id, input);
  }

  /**
   * Grants permission to access a file or folder
   *
   * @summary Grant Google Drive permission
   * @param input Information for granting permission
   */
  @SelectBenchmark("드라이브 파일에 접근 권한 좀 설정해줘")
  @SelectBenchmark("드라이브 폴더에 접근 권한 좀 설정해줘")
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/google_drive.svg",
  )
  @ApiTags("Google Drive")
  @core.TypedRoute.Post("permission")
  async permission(
    @core.TypedBody() input: IGoogleDrive.IPermissionGoogleDriveInput,
  ): Promise<void> {
    return await GoogleDriveProvider.permission(input);
  }

  /**
   * Read text from a file
   *
   * @summary Read text from a Google Drive file
   * @param id Unique ID of the file
   * @returns The text content of the file
   */
  @SelectBenchmark("드라이브 파일에 텍스트 좀 읽어줘")
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/google_drive.svg",
  )
  @ApiTags("Google Drive")
  @core.TypedRoute.Patch("get/file/:id")
  async readFile(
    /**
     * @title File to read
     * @description Please select the file to read
     */
    @Prerequisite({
      neighbor: () => GoogleDriveController.prototype.fileList,
      jmesPath: "data[].{value: id || '', label: name || ''}",
    })
    @core.TypedParam("id")
    id: string,
    @core.TypedBody()
    input: IGoogleDrive.ISecret,
  ): Promise<IGoogleDrive.IGetFileOutput> {
    return await GoogleDriveProvider.getFile(id, input);
  }
}
