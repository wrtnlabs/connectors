import { IFileManager } from "../structures";

/**
 * File Uploader Interface for example AWS S3, Azure Blob Storage, etc.
 */
export interface FileManager {
  /**
   * Upload file to storage and Get Url.
   *
   * Recommand to write `@hidden` when you use this as connector becuase Agentica history can be overflowed according to file size.
   */
  upload(input: IFileManager.IUploadInput): Promise<IFileManager.IUploadOutput>;

  /**
   * Read file from storage.
   *
   * Recommand to write `@hidden` when you use this as connector becuase Agentica history can be overflowed according to file size.
   */
  read(input: IFileManager.IReadInput): Promise<IFileManager.IReadOutput>;

  /**
   * Check file uri is match to file path.
   */
  isMatch(input: IFileManager.IMatchInput): boolean;
}
