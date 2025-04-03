import { tags } from "typia";
import { ISpreadsheetCell } from "@wrtnlabs/connector-shared";

export namespace IExcelService {
  /**
   * @title file information
   */
  export interface IReadExcelInput {
    /**
     * Excel file to read
     *
     * @title Excel file URI
     */
    uri: string & tags.Format<"iri">;
    /**
     * Sheet name to read
     *
     * @title sheet name
     */
    sheetName?: string | null;
  }

  /**
   * @title Read Excel row data
   */
  interface IReadExcelRowData {
    /**
     * Object where key is header name and value is value of that row
     *
     * @title Read Excel row data
     */
    [key: string]: any;
  }

  /**
   * @title Excel file reading result
   */
  export interface IReadExcelOutput {
    /**
     * @title headers of this sheet
     */
    headers: string[];

    /**
     * @title Excel sheet data
     */
    data: IReadExcelRowData[];
  }

  /**
   * @title file information
   */
  export interface IGetWorksheetListInput {
    /**
     * The URI of the file to import list of Excel worksheets
     *
     * @title Excel file URI
     */
    uri: string & tags.Format<"iri">;
  }

  /**
   * @title List of imported worksheets
   */
  export interface IWorksheetListOutput {
    /**
     * @title sheet list data
     */
    data: {
      /**
       * Name of the imported worksheet
       *
       * @title sheet name
       */
      sheetName: string;

      /**
       * The id of the imported worksheet.
       *
       * @title sheet id
       */
      id: number;
    }[];
  }

  /**
   * @title Information for adding data
   */
  export interface IInsertExcelRowByUploadInput extends ICreateSheetInput {
    /**
     * Excel file to add rows to
     *
     * If you have this address, take an Excel file from that path and modify it.
     * The modified file is saved as a new link and does not modify the original file in this path.
     * If this address does not exist, create a new file immediately.
     *
     * @title Excel file URI
     */
    uri?: string & tags.Format<"iri">;

    /**
     * The type of data and coordinates of each row and column
     *
     * @title Cell informations
     */
    data: ISpreadsheetCell.ICreate[];

    /**
     * Sheet name to add Excel rows to
     * If no input is entered, the first sheet is used as the default.
     *
     * @title Excel sheet name
     */
    sheetName?: (string & tags.MaxLength<31>) | null;
  }

  /**
   * @title Information for adding data
   */
  export interface IInsertExcelRowInput {
    /**
     * Excel file to add rows to
     *
     * If you have this address, take an Excel file from that path and modify it.
     * The modified file is saved as a new link and does not modify the original file in this path.
     * If this address does not exist, create a new file immediately.
     *
     * @title Excel file URI
     */
    uri?: string & tags.Format<"iri">;

    /**
     * The type of data and coordinates of each row and column
     *
     * @title Cell informations
     */
    data: ISpreadsheetCell.ICreate[];

    /**
     * Sheet name to add Excel rows to
     * If no input is entered, the first sheet is used as the default.
     *
     * @title Excel sheet name
     */
    sheetName?: (string & tags.MaxLength<31>) | null;
  }

  export interface ICreateSheetInput {
    /**
     * The Path of the Excel file including the file name.
     * The File Path that you want to save the Excel file.
     *
     * @title Excel file path
     */
    path: string & tags.Format<"iri">;

    /**
     * Sheet name to add Excel rows to
     * If no input is entered, the first sheet is used as the default.
     *
     * @title Excel sheet name
     */
    sheetName?: (string & tags.MaxLength<31>) | null;
  }

  /**
   * @title Excel row addition result
   */
  export interface IExportExcelFileOutput {
    /**
     * @title Generated Excel file URI
     */
    uri: string & tags.Format<"iri">;
  }
}
