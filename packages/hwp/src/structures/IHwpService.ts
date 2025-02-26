import { tags } from "typia";
import { ContentMediaType } from "typia/lib/tags/ContentMediaType";

export namespace IHwpService {
  export interface IProps {
    /**
     * Server URL.
     */
    url: string;
  }

  /**
   * @title Information for parsing hwp files
   */
  export interface IParseInput {
    /**
     * hwp file to parse.
     *
     * @title hwp file
     */
    fileUrl: string &
      tags.Format<"uri"> &
      ContentMediaType<"application/vnd.hancom.hwp">;
  }

  /**
   * @title hwp file parsing result
   */

  export interface IParseOutput {
    /**
     * Text of the parsed hwp file
     *
     * @title text
     */
    text: string;
  }
}
