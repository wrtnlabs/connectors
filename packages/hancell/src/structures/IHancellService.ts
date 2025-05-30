import { tags } from "typia";
import { ContentMediaType } from "typia/lib/tags";

export namespace IHancellService {
  export interface IUpsertSheetInput extends IReadHancellInput {
    /**
     * @title Sheet name
     * @description If the sheet does not exist, it will be added, and if it does exist, it will be modified.
     */
    sheetName: string;

    /**
     * @title Sheet Information
     * @description Information contained in each cell of the sheet.
     */
    cells: Cells;
  }

  export interface IUpsertSheetOutput {
    /**
     * @title New Hansel File Link
     */
    fileUrl: string &
      tags.Format<"iri"> &
      ContentMediaType<"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">;
  }

  /**
   * @title Hansel reading conditions
   */
  export type IReadHancellInput = {
    /**
     * Excel file to read
     *
     * @title Excel file
     */
    fileUrl: string &
      tags.Format<"uri"> &
      ContentMediaType<"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">;

    /**
     * S3 object path.
     */
    filePath?: string;
  };

  /**
   * @title Hansel Read Response
   */
  export type IReadHancellOutput = {
    [sheetName: string]: Cells;
  };

  /**
   * @Todo cell type needs to be specified
   */
  // export type CellName = string & tags.Pattern<"/^[A-Z]+[1-9][0-9]*$/">;

  /**
   * @title Information contained in the cell
   */
  export type Cells = Record<string, string | number>;
}
