import { tags } from "typia";

export namespace ISpreadsheetFormat {}

export interface ISpreadsheetFormat {
  /**
   * @title Primary Key
   */
  id: string & tags.Format<"uuid">;

  /**
   * @title Spreadsheet ID
   */
  spreadsheet_id: string & tags.Format<"uuid">;

  /**
   * @title Name of Font
   */
  font_name: string;

  /**
   * Unit is PT
   *
   * @title Size of Font
   */
  font_size: number;

  /**
   * @title Background Color
   */
  background_color: `#${string}` & tags.MinLength<7> & tags.MaxLength<7>;

  /**
   * @title Text Alignment
   */
  text_alignment: string;

  /**
   * @title Creation time of spreadsheet format
   */
  created_at: string & tags.Format<"date-time">;

  /**
   * @title Deletion time of spreadsheet format
   */
  deleted_at: (string & tags.Format<"date-time">) | null;
}
