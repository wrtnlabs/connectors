import { google } from "googleapis";
import * as stream from "stream";
import axios from "axios";
import mime from "mime-types";
import { IGoogleDriveService } from "../structures/IGoogleDriveService";

export class GoogleDriveService {
  constructor(private readonly props: IGoogleDriveService.IProps) {}

  /**
   * Google Drive Service.
   *
   * Get a list of folders in Google Drive
   */
  async folderList(): Promise<IGoogleDriveService.IFolderListGoogleDriveOutput> {
    const accessToken = await this.refreshAccessToken();
    const authClient = new google.auth.OAuth2();

    authClient.setCredentials({ access_token: accessToken });

    const drive = google.drive({ version: "v3", auth: authClient });
    const res = await drive.files.list({
      q: "mimeType = 'application/vnd.google-apps.folder' and trashed = false",
    });
    const files = res.data.files;
    if (!files || !files.length) {
      return { data: [] };
    }

    const output = files.map((file) => {
      return {
        id: file.id,
        name: file.name,
      };
    });
    return { data: output };
  }

  async getFolderByName(input: { name: string }): Promise<string | null> {
    const accessToken = await this.refreshAccessToken();
    const authClient = new google.auth.OAuth2();

    authClient.setCredentials({ access_token: accessToken });

    try {
      const drive = google.drive({ version: "v3", auth: authClient });
      const res = await drive.files.list({
        q: `mimeType = 'application/vnd.google-apps.folder' and trashed = false and name = '${input.name}'`,
      });

      return res.data.files?.at(0)?.id ?? null;
    } catch (err) {
      console.error(JSON.stringify((err as any)?.response.data));
      throw err;
    }
  }

  /**
   * Google Drive Service.
   *
   * Get a list of files in Google Drive
   */
  async fileList(
    input: IGoogleDriveService.IFileListGoogleDriveInput,
  ): Promise<IGoogleDriveService.IFileListGoogleDriveOutput> {
    const { folderId } = input;

    const authClient = new google.auth.OAuth2();
    const accessToken = await this.refreshAccessToken();
    authClient.setCredentials({
      access_token: accessToken,
    });
    const drive = google.drive({ version: "v3", auth: authClient });
    const res = await drive.files.list({
      pageSize: 10,
      fields: "nextPageToken, files(id, name)",
      q: folderId
        ? `'${folderId}' in parents and trashed = false`
        : `trashed = false`,
    });
    const files = res.data.files;
    if (!files || !files.length) {
      return { data: [] };
    }
    const output = files.map((file) => {
      return {
        id: file.id,
        name: file.name,
        webContentLink: file.webContentLink,
      };
    });

    return { data: output };
  }

  /**
   * Google Drive Service.
   *
   * Create a new folder in Google Drive
   */
  async createFolder(
    input: IGoogleDriveService.ICreateFolderGoogleDriveInput,
  ): Promise<IGoogleDriveService.ICreateFolderGoogleDriveOutput> {
    const { name } = input;

    const accessToken = await this.refreshAccessToken();
    const authClient = new google.auth.OAuth2();

    authClient.setCredentials({ access_token: accessToken });

    const drive = google.drive({ version: "v3", auth: authClient });
    const res = await drive.files.create({
      requestBody: {
        name: name,
        mimeType: "application/vnd.google-apps.folder",
      },
    });
    const id = res.data.id;
    if (!id) {
      throw new Error("Failed to create new folder");
    }

    return { id };
  }

  /**
   * Google Drive Service.
   *
   * Delete a folder in Google Drive
   */
  async deleteFolder(input: { id: string }): Promise<void> {
    const accessToken = await this.refreshAccessToken();
    const authClient = new google.auth.OAuth2();

    authClient.setCredentials({ access_token: accessToken });

    const drive = google.drive({ version: "v3", auth: authClient });
    await drive.files.delete({
      fileId: input.id,
    });
  }

  /**
   * @param input
   * @returns
   */
  async createFile(
    input: IGoogleDriveService.ICreateFileGoogleDriveInput,
  ): Promise<IGoogleDriveService.ICreateFileGoogleDriveOutput> {
    const { name, folderIds, content } = input;

    const accessToken = await this.refreshAccessToken();
    const authClient = new google.auth.OAuth2();

    authClient.setCredentials({ access_token: accessToken });
    const drive = google.drive({ version: "v3", auth: authClient });
    const fileMetadata = {
      name: name,
      mimeType: content,
      parents: folderIds,
    };
    const res = await drive.files.create({
      requestBody: fileMetadata,
    });
    const id = res.data.id;
    // response id can be null even when exception wasn't explictly thrown, so handle as unknown error
    if (!id) {
      throw new Error("Failed to create new file");
    }

    return { id };
  }

  /**
   * Google Drive Service.
   *
   * Create a new file in Google Drive
   */
  async uploadFile(
    input: IGoogleDriveService.IUploadFileInput,
  ): Promise<IGoogleDriveService.ICreateFileGoogleDriveOutput> {
    const { name, folderIds, fileUrl } = input;
    const { data: arrayBuffer } = await axios.get(fileUrl, {
      responseType: "arraybuffer",
    });

    const accessToken = await this.refreshAccessToken();
    const authClient = new google.auth.OAuth2();

    const mimeType = mime.lookup(fileUrl);
    authClient.setCredentials({ access_token: accessToken });
    const drive = google.drive({ version: "v3", auth: authClient });
    const body = stream.Readable.from(Buffer.from(arrayBuffer));
    const { default: fileType } = await import("file-type");
    const fileTypeResponse = await fileType.fromBuffer(arrayBuffer);
    const res = await drive.files.create({
      media: { body: body },
      requestBody: {
        mimeType: mimeType
          ? mimeType
          : (fileTypeResponse?.mime ?? "application/octet-stream"),
        name,
        parents: folderIds,
      },
    });

    const id = res.data.id;
    // response id can be null even when exception wasn't explictly thrown, so handle as unknown error
    if (!id) {
      throw new Error("Failed to create new file");
    }

    return { id };
  }

  /**
   * Google Drive Service.
   *
   * Delete a file in Google Drive
   */
  async deleteFile(input: { id: string }): Promise<void> {
    const accessToken = await this.refreshAccessToken();
    const authClient = new google.auth.OAuth2();

    authClient.setCredentials({ access_token: accessToken });

    const drive = google.drive({ version: "v3", auth: authClient });
    await drive.files.delete({
      fileId: input.id,
    });
  }

  /**
   * Google Drive Service.
   *
   * Grants permission to access a file or folder
   */
  async permission(
    input: IGoogleDriveService.IPermissionGoogleDriveInput,
  ): Promise<void> {
    const { fileId, folderId, permissions } = input;
    if (!!fileId == !!folderId) {
      throw new Error("Either a file ID or a folder ID is required.");
    }

    const accessToken = await this.refreshAccessToken();
    const authClient = new google.auth.OAuth2();

    authClient.setCredentials({ access_token: accessToken });

    try {
      const drive = google.drive({ version: "v3", auth: authClient });
      for (const permission of permissions) {
        const input = {
          emailAddress: permission.email,
          role: permission.role,
          type: permission.type,
        };
        await drive.permissions.create({
          fileId: fileId || folderId,
          requestBody: input,
          sendNotificationEmail: false,
        });
      }
    } catch (err) {
      console.error(JSON.stringify((err as any)?.response.data));
      throw err;
    }
  }

  /**
   * Google Drive Service.
   *
   * Read text from a file
   */
  async getFile(input: {
    fileId: string;
  }): Promise<IGoogleDriveService.IGetFileOutput> {
    const accessToken = await this.refreshAccessToken();

    try {
      const res = await axios.get(
        `https://www.googleapis.com/drive/v2/files/${input.fileId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return res.data;
    } catch (err) {
      console.error(JSON.stringify((err as any)?.response.data));
      throw err;
    }
  }

  /**
   * Google Auth Service.
   *
   * Request to reissue Google access token
   */
  private async refreshAccessToken(): Promise<string> {
    const client = new google.auth.OAuth2(
      this.props.clientId,
      this.props.clientSecret,
    );

    client.setCredentials({
      refresh_token: decodeURIComponent(this.props.refreshToken),
    });
    const { credentials } = await client.refreshAccessToken();
    const accessToken = credentials.access_token;

    if (!accessToken) {
      throw new Error("Failed to refresh access token");
    }

    return accessToken;
  }
}
