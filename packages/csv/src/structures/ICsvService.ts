import { tags } from "typia";
import { ContentMediaType } from "typia/lib/tags";

export namespace ICsvService {
  /**
   * @title Csv file information
   */
  export interface IReadInput {
    /**
     * This is the uri of Csv file to read.
     *
     * @title file uri
     */
    uri: string & tags.Format<"iri"> & ContentMediaType<"text/csv">;

    /**
     * This is the CSV file delimiter to read.
     *
     * Default is ","
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
   * @title Information required to create a CSV file
   */
  export interface IWriteInput {
    /**
     * The path of the Csv file to be created, including the file name.
     *
     * @title File path
     */
    path: string;

    /**
     * The Csv file delimiter to be generated.
     *
     * @title delimiter
     */
    delimiter: string;

    /**
     * These are the data values to be placed in the Csv file to be created.
     *
     * @title File data values
     */
    values: {
      [key: string]: string;
    }[];
  }

  /**
   * @title Csv file creation result
   */
  export interface IWriteOutput {
    /**
     * This is the uri of the csv file that was created.
     *
     * @title csv file uri
     */
    uri: string & tags.Format<"iri"> & ContentMediaType<"text/csv">;
  }

  /**
   * @title Information needed to convert a Csv file to an Excel file
   */
  export interface ICsvToExcelInput {
    /**
     * This is the uri of Csv file to read.
     *
     * @title file uri
     */
    uri: string & tags.Format<"iri"> & ContentMediaType<"text/csv">;

    /**
     * This is the file delimiter to convert from csv to excel.
     *
     * Default is ","
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
     * Here is the uri of converted excel file.
     *
     * @title uri
     */
    uri: string & tags.Format<"iri"> & ContentMediaType<"text/csv">;
  }
}
