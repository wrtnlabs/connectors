import { tags } from "typia";
import { ContentMediaType } from "typia/lib/tags";
import { IAwsS3Service } from "@wrtnlabs/connector-aws-s3";

export namespace ICsvService {
  export interface IProps {
    /**
     * AWS
     */
    aws: {
      /**
       * S3.
       */
      s3: IAwsS3Service.IProps;
    };
  }

  /**
   * @title Csv file information
   */
  export interface IReadInput {
    /**
     * This is the Csv file to read.
     *
     * @title file
     */
    s3Url: string & tags.Format<"iri"> & ContentMediaType<"text/csv">;

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
   * @title Information required to create a CSV file
   */
  export interface IWriteInput {
    /**
     * The name of the Csv file to be created.
     *
     * @title File name
     */
    fileName: string;

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
     * This is the s3 url of the csv file that was created.
     *
     * @title csv file
     */
    s3Url: string & tags.Format<"iri"> & ContentMediaType<"text/csv">;
  }

  /**
   * @title Information needed to convert a Csv file to an Excel file
   */
  export interface ICsvToExcelInput {
    /**
     * This is the file to convert from csv to excel.
     *
     * @title file
     */
    s3Url: string & tags.Format<"iri"> & ContentMediaType<"text/csv">;

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
     * Here is the s3 url of the converted excel file.
     *
     * @title s3 url
     */
    url: string & tags.Format<"iri"> & ContentMediaType<"text/csv">;
  }
}
