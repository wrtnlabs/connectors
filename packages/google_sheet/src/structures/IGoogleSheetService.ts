import { tags } from "typia";

/**
 * owner: Grants owner permission. Users with this permission can delete files or folders, or grant permission to other users.
 * writer: Grants write permission. Users with this permission can modify or delete files.
 * commenter: Grants comment permission. Users with this permission can read files and post comments.
 * reader: Grants read permission. Users with this permission can read files.
 *
 * @title Type of permission
 */
type PermissionRoles = "owner" | "writer" | "commenter" | "reader";

/**
 * @title Permissions Information
 */
interface IPermission {
  /**
   * The email address of the user to grant permission to.
   *
   * @title The email address of the user to grant permission to
   */
  email: string & tags.Format<"email">;

  /**
   * The type of permission to grant.
   *
   * owner: Grants owner permission. Users with this permission can delete files or folders, or grant permission to other users.
   * writer: Grants write permission. Users with this permission can modify or delete files.
   * commenter: Grants comment permission. Users with this permission can read files and post comments.
   * reader: Grants read permission. Users with this permission can read files.
   *
   * There are only four possible values: "owner", "writer", "commenter", and "reader".
   *
   * @title The permission to grant
   */
  role: PermissionRoles;
}

export namespace IGoogleSheetService {
  export interface IProps {
    /**
     * Google Client ID.
     */
    clientId: string;

    /**
     * Google Client Secret.
     */
    clientSecret: string;

    /**
     * Google Refresh Token.
     */
    secret: string;
  }

  /**
   * @title Information needed to read Google Sheets
   */
  export interface IReadGoogleSheetInput {
    /**
     * The ID of the Google Sheet to read.
     *
     * @title Google Sheet ID
     */
    sheet_id: string;

    /**
     * The range of Google Sheets to read.
     *
     * @title Range to read
     */
    range: string;
  }

  /**
   * @title Information needed to read Google Sheet header
   */
  export interface IReadGoogleSheetHeadersInput {
    /**
     * The url address of the sheet from which to read the header information.
     *
     * @title sheet url
     */
    url: string;

    /**
     * The header index of the sheet to read.
     *
     * @title Sheet header index
     */
    index?: number;
  }

  /**
   * @title Google Sheet Reading Results
   */
  export interface IReadGoogleSheetOutput {
    /**
     * This is the data from the read sheet.
     *
     * @title Sheet data
     */
    data: any;
  }

  /**
   * @title Information required to grant Google Sheets permissions
   */
  export interface IPermissionInput {
    /**
     * The url of the sheet to grant permission to.
     *
     * @title sheet url
     */
    url: string & tags.Format<"iri">;

    /**
     * Here is a list of emails to make accessible and permissions to grant.
     *
     * @title Here is a list of emails to make accessible and permissions to grant
     */
    permissions: IPermission[];
  }

  /**
   * @title Information needed to add a Google Sheet header
   */
  export interface IWriteGoogleSheetHeadersInput {
    /**
     * The url of the sheet to which you want to add the header.
     *
     * @title sheet url
     */
    url: string;

    /**
     * The index of the header to add.
     *
     * @title sheet index
     */
    index?: number;

    /**
     * A list of headers to add to the sheet.
     *
     * @title A list of headers to add to the sheet
     */
    headerNames: string[];
  }

  /**
   * @title Information needed to add rows in Google Sheets
   */
  export interface IWriteGoogleSheetRowsInput {
    /**
     * The url of the sheet to which you want to add rows.
     *
     * @title sheet url
     */
    url: string;

    /**
     * The index of the row to add.
     *
     * @title sheet index
     */
    index?: number;

    /**
     * Information about what value to add rows based on.
     *
     * @title Information about what value to add rows based on
     */
    from: string[];

    /**
     * Header information for the row to be added.
     *
     * @title Header information for the row to be added
     */
    to: string[];
  }

  /**
   * @title Information required to view worksheets
   */
  export interface IGetWorkSheetInput {
    /**
     * The url of the sheet to read.
     *
     * @title sheet url
     */
    url: string;
  }

  /**
   * @title Worksheet query results
   */
  export interface IGetWorkSheetOutput {
    /**
     * Here is a list of titles for the sheets you've read.
     *
     * @title List of worksheet titles
     */
    data: string[];
  }

  /**
   * @title Information needed to read Google Sheet rows
   */
  export interface IReadGoogleSheetRowsInput {
    /**
     * The url of the sheet from which to read the rows.
     *
     * @title sheet url
     */
    url: string;

    /**
     * The title of the sheet to work on.
     *
     * @title The title of the sheet to work on
     */
    workSheetTitle: string;
  }

  /**
   * @title Google Sheets Row Data Information
   */
  interface IReadGoogleSheetRowData {
    /**
     * An object where the key is the header name and the value is the value of the corresponding row.
     *
     * @title The read Google Sheet row data
     */
    [key: string]: any;
  }

  /**
   * @title Google Sheets Row Reading Results
   */
  export interface IReadGoogleSheetRowsOutput {
    /**
     * This is the read Google Sheet row data.
     */
    data: IReadGoogleSheetRowData[];
  }

  /**
   * @title Information needed to create a Google Spreadsheet
   */
  export interface ICreateGoogleSheetInput {
    /**
     * Please enter a title for the Google Spreadsheet you want to create.
     *
     * @title Sheet Title
     */
    title: string;
  }

  /**
   * @title Google Spreadsheet Creation Results
   */
  export interface ICreateGoogleSheetOutput {
    /**
     * The ID of the generated Google Spreadsheet.
     *
     * @title Sheet ID
     */
    spreadsheetId: string;

    /**
     * The URL of the generated Google Spreadsheet.
     *
     * @title Sheet URL
     */
    spreadsheetUrl: string;
  }

  export interface IAppendToSheetInput {
    /**
     * This is the sheet to which you want to add content.
     *
     * @title The sheet to add
     */
    spreadSheetId: string;

    /**
     * These are the values to add.
     *
     * @title These are the values to add
     */
    values: Array<Array<string | number | boolean>>;
  }
}
