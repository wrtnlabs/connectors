import { tags } from "typia";

export namespace ICsvService {
  /**
   * @title Csv file information
   */
  export interface IReadInput {
    /**
     * This is the Csv file to read encoded in base64.
     *
     * @title file
     */
    csvBase64: string & tags.Format<"byte">;

    /**
     * This is the CSV file delimiter to read.
     *
     * @title delimiter
     */
    delimiter: string;
  }

  /**
   * @title Csv file reading result
   */
  export interface IReadOutput {
    /**
     * Read csv file data.
     *
     * @title csv data list
     */
    data: {
      [key: string]: string;
    }[];
  }

  /**
   * @title Information needed to convert a Csv file to an Excel file
   */
  export interface ICsvToExcelInput {
    /**
     * This is the Csv file to read encoded in base64.
     *
     * @title file
     */
    csvBase64: string & tags.Format<"byte">;

    /**
     * This is the file delimiter to convert from csv to excel.
     *
     * @title delimiter
     */
    delimiter: string;
  }

  /**
   * @title Csv file to Excel file conversion result
   */
  export interface ICsvToExcelOutput {
    /**
     * This is the Excel file encoded in base64.
     *
     * @title excel file
     */
    excelBase64: string & tags.Format<"byte">;
  }
}
