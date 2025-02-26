import { tags } from "typia";
import { MyPick, StrictOmit } from "../../types";

export namespace ISpreadsheetExport {
  export type ISummary = StrictOmit<
    ISpreadsheetExport,
    "spreadsheet_snapshot_id" | "deleted_at"
  >;

  export type ICreate = MyPick<
    ISpreadsheetExport,
    "provider" | "created_at" | "uid" | "url"
  >;
}

export interface ISpreadsheetExport {
  /**
   * @title Primary Key
   */
  id: string & tags.Format<"uuid">;

  /**
   * @title Snapshot ID
   */
  spreadsheet_snapshot_id: string & tags.Format<"uuid">;

  /**
   * It means the name of the service from which the post was exported,
   * and if the service name is motion,
   * it means that the same post is posted in the corresponding url of the provider service.
   *
   * @title provider name
   */
  provider: "excel" | "hancel" | "google_sheets" | (string & {});

  /**
   * @title Unique spreadsheet ID in external service
   */
  uid: string | null;

  /**
   * This is a redirect link that allows you to locate the exported spreadsheet,
   * which is stored at export time.
   *
   * @title URL
   */
  url: (string & tags.Format<"iri">) | null;

  /**
   * @title Creation time of {@link ISpreadsheetExport}
   */
  created_at: string & tags.Format<"date-time">;

  /**
   * @title Deletion time ot {@link ISpreadsheetExport}
   */
  deleted_at: (string & tags.Format<"date-time">) | null;
}
