import { IFileManager } from "../structures";

/**
 * File Uploader Interface for example AWS S3, Azure Blob Storage, etc.
 */
export interface FileManager {
  /**
   * Upload file to storage and Get Url.
   */
  upload(input: IFileManager.IUploadInput): Promise<IFileManager.IUploadOutput>;

  /**
   * Read file from storage.
   *
   * @hidden (becuase Agentica history can be overflowed according to file size)
   */
  read(input: IFileManager.IReadInput): Promise<IFileManager.IReadOutput>;
}
