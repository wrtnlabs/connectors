import { google } from "googleapis";
import * as stream from "stream";
import axios from "axios";
import mime from "mime-types";
import { IGoogleDriveService } from "../structures/IGoogleDriveService";
import { GoogleService } from "@wrtnlabs/connector-google";

export class GoogleDriveService {
  constructor(private readonly props: IGoogleDriveService.IProps) {}

  async folderList(): Promise<IGoogleDriveService.IFolderListGoogleDriveOutput> {
    const googleService = new GoogleService({
      clientId: this.props.clientId,
      clientSecret: this.props.clientSecret,
      secret: this.props.secret,
    });

    const accessToken = await googleService.refreshAccessToken();
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
    const googleService = new GoogleService({
      clientId: this.props.clientId,
      clientSecret: this.props.clientSecret,
      secret: this.props.secret,
    });

    const accessToken = await googleService.refreshAccessToken();
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

  async fileList(
    input: IGoogleDriveService.IFileListGoogleDriveInput,
  ): Promise<IGoogleDriveService.IFileListGoogleDriveOutput> {
    const { folderId } = input;

    const googleService = new GoogleService({
      clientId: this.props.clientId,
      clientSecret: this.props.clientSecret,
      secret: this.props.secret,
    });

    const authClient = new google.auth.OAuth2();
    const accessToken = await googleService.refreshAccessToken();
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

  async createFolder(
    input: IGoogleDriveService.ICreateFolderGoogleDriveInput,
  ): Promise<IGoogleDriveService.ICreateFolderGoogleDriveOutput> {
    const { name } = input;

    const googleService = new GoogleService({
      clientId: this.props.clientId,
      clientSecret: this.props.clientSecret,
      secret: this.props.secret,
    });

    const accessToken = await googleService.refreshAccessToken();
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

  async deleteFolder(input: { id: string }): Promise<void> {
    const googleService = new GoogleService({
      clientId: this.props.clientId,
      clientSecret: this.props.clientSecret,
      secret: this.props.secret,
    });

    const accessToken = await googleService.refreshAccessToken();
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

    const googleService = new GoogleService({
      clientId: this.props.clientId,
      clientSecret: this.props.clientSecret,
      secret: this.props.secret,
    });

    const accessToken = await googleService.refreshAccessToken();
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

  async uploadFile(
    input: IGoogleDriveService.IUploadFileInput,
  ): Promise<IGoogleDriveService.ICreateFileGoogleDriveOutput> {
    const googleService = new GoogleService({
      clientId: this.props.clientId,
      clientSecret: this.props.clientSecret,
      secret: this.props.secret,
    });

    const { name, folderIds, fileUrl } = input;
    const { data: arrayBuffer } = await axios.get(fileUrl, {
      responseType: "arraybuffer",
    });

    const accessToken = await googleService.refreshAccessToken();
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

  async deleteFile(input: { id: string }): Promise<void> {
    const googleService = new GoogleService({
      clientId: this.props.clientId,
      clientSecret: this.props.clientSecret,
      secret: this.props.secret,
    });

    const accessToken = await googleService.refreshAccessToken();
    const authClient = new google.auth.OAuth2();

    authClient.setCredentials({ access_token: accessToken });

    const drive = google.drive({ version: "v3", auth: authClient });
    await drive.files.delete({
      fileId: input.id,
    });
  }

  async permission(
    input: IGoogleDriveService.IPermissionGoogleDriveInput,
  ): Promise<void> {
    const { fileId, folderId, permissions } = input;
    if (!!fileId == !!folderId) {
      throw new Error("Either a file ID or a folder ID is required.");
    }

    const googleService = new GoogleService({
      clientId: this.props.clientId,
      clientSecret: this.props.clientSecret,
      secret: this.props.secret,
    });

    const accessToken = await googleService.refreshAccessToken();
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

  async getFile(input: {
    fileId: string;
  }): Promise<IGoogleDriveService.IGetFileOutput> {
    const googleService = new GoogleService({
      clientId: this.props.clientId,
      clientSecret: this.props.clientSecret,
      secret: this.props.secret,
    });

    const accessToken = await googleService.refreshAccessToken();

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
}
