import { tags } from "typia";
import {
  BlockObjectRequest,
  CreatePageParameters,
} from "@notionhq/client/build/src/api-endpoints";

import { Hierarchy, MyPick, StrictOmit } from "@wrtnlabs/connector-shared";

export namespace INotionService {
  export interface IProps {
    /**
     * Notion Refresh Token.
     */
    secret: string;
  }

  /**
   * @title color
   */
  type Color =
    | "default"
    | "gray"
    | "brown"
    | "orange"
    | "yellow"
    | "green"
    | "blue"
    | "purple"
    | "pink"
    | "red";

  /**
   * @title Database Date Attribute
   */
  type DateDatabaseProperty = {
    /**
     * @title id
     */
    id: string;

    /**
     * @title name
     */
    name: string;

    /**
     * @title type
     */
    type: "date";

    /**
     * @title date
     */
    date: Record<string, never>;
  };

  /**
   * @title Database Checkbox Properties
   */
  type CheckboxDatabaseProperty = {
    /**
     * @title id
     */
    id: string;

    /**
     * @title name
     */
    name: string;

    /**
     * @title type
     */
    type: "checkbox";

    /**
     * @title checkbox
     */
    checkbox: Record<string, never>;
  };

  /**
   * @title Database Creator Attributes
   */
  type CreatedByDatabaseProperty = {
    /**
     * @title id
     */
    id: string;

    /**
     * @title name
     */
    name: string;

    /**
     * @title type
     */
    type: "created_by";
  };

  /**
   * @title Database Creation Time Attribute
   */
  type CreatedTimeDatabaseProperty = {
    /**
     * @title id
     */
    id: string;

    /**
     * @title name
     */
    name: string;

    /**
     * @title type
     */
    type: "created_time";

    /**
     * @title created_time
     */
    created_time: Record<string, never>;
  };

  /**
   * @title Database Email Attributes
   */
  type EmailDatabaseProperty = {
    /**
     * @title id
     */
    id: string;

    /**
     * @title name
     */
    name: string;

    /**
     * @title type
     */
    type: "email";

    /**
     * @title email
     */
    email: Record<string, never>;
  };

  /**
   * @title Database File Properties
   */
  type FilesDatabaseProperty = {
    /**
     * @title id
     */
    id: string;

    /**
     * @title name
     */
    name: string;

    /**
     * @title type
     */
    type: "files";

    /**
     * @title files
     */
    files: Record<string, never>;
  };

  /**
   * @title Database official properties
   */
  type FormulaDatabaseProperty = {
    /**
     * @title id
     */
    id: string;

    /**
     * @title name
     */
    name: string;

    /**
     * @title type
     */
    type: "formula";

    /**
     * @title formula
     */
    formula: {
      /**
       * @title expression
       */
      expression: string;
    };
  };

  /**
   * @title Database Last Modified Attribute
   */
  type LastEditedByDatabaseProperty = {
    /**
     * @title id
     */
    id: string;

    /**
     * @title name
     */
    name: string;

    /**
     * @title type
     */
    type: "last_edited_by";

    /**
     * @title last_edited_by
     */
    last_edited_by: Record<string, never>;
  };

  /**
   * @title Database Modification Time Attribute
   */
  type LastEditedTimeDatabaseProperty = {
    /**
     * @title id
     */
    id: string;

    /**
     * @title name
     */
    name: string;

    /**
     * @title type
     */
    type: "last_edited_time";

    /**
     * @title last_edited_time
     */
    last_edited_time: Record<string, never>;
  };

  /**
   * @title Database Multi-Select Attribute
   */
  type MultiSelectDatabaseProperty = {
    /**
     * @title id
     */
    id: string;

    /**
     * @title name
     */
    name: string;

    /**
     * @title type
     */
    type: "multi_select";

    /**
     * @title multi_select
     */
    multi_select: {
      /**
       * @title options
       */
      options: {
        /**
         * @title id
         */
        id: string;

        /**
         * @title name
         */
        name: string;

        /**
         * @title color
         */
        color: Color;
      }[];
    };
  };

  /**
   * @title Database Number Format
   */
  type NumberFormat =
    | "number"
    | "number_with_commas"
    | "percent"
    | "dollar"
    | "canadian_dollar"
    | "singapore_dollar"
    | "euro"
    | "pound"
    | "yen"
    | "ruble"
    | "rupee"
    | "won"
    | "yuan"
    | "real"
    | "lira"
    | "rupiah"
    | "franc"
    | "hong_kong_dollar"
    | "new_zealand_dollar"
    | "krona"
    | "norwegian_krone"
    | "mexican_peso"
    | "rand"
    | "new_taiwan_dollar"
    | "danish_krone"
    | "zloty"
    | "baht"
    | "forint"
    | "koruna"
    | "shekel"
    | "chilean_peso"
    | "philippine_peso"
    | "dirham"
    | "colombian_peso"
    | "riyal"
    | "ringgit"
    | "leu"
    | "argentine_peso"
    | "uruguayan_peso"
    | "peruvian_sol";

  /**
   * @title Database numeric properties
   */
  type NumberDatabaseProperty = {
    /**
     * @title id
     */
    id: string;

    /**
     * @title name
     */
    name: string;

    /**
     * @title type
     */
    type: "number";

    /**
     * @title number
     */
    number: {
      /**
       * @title format
       */
      format: NumberFormat;
    };
  };

  /**
   * @title database people properties
   */
  type PeopleDatabaseProperty = {
    /**
     * @title id
     */
    id: string;

    /**
     * @title name
     */
    name: string;

    /**
     * @title type
     */
    type: "people";

    /**
     * @title people
     */
    people: Record<string, never>;
  };

  /**
   * @title Database Phone Number Attribute
   */
  type PhoneNumberDatabaseProperty = {
    /**
     * @title id
     */
    id: string;

    /**
     * @title name
     */
    name: string;

    /**
     * @title type
     */
    type: "phone_number";

    /**
     * @title phone_number
     */
    phone_number: Record<string, never>;
  };

  /**
   * @title Database Relationship Properties
   */
  type RelationDatabaseProperty = {
    /**
     * @title id
     */
    id: string;

    /**
     * @title name
     */
    name: string;

    /**
     * @title type
     */
    type: "relation";

    /**
     * @title relation
     */
    relation: {
      /**
       * @title database_id
       */
      database_id: string;

      /**
       * @title synced_property_id
       */
      synced_property_id: string;

      /**
       * @title synced_property_name
       */
      synced_property_name: string;
    };
  };

  /**
   * @title database text property
   */
  type RichTextDatabaseProperty = {
    /**
     * @title id
     */
    id: string;

    /**
     * @title name
     */
    name: string;

    /**
     * @title type
     */
    type: "rich_text";

    /**
     * @title rich_text
     */
    rich_text: Record<string, never>;
  };

  /**
   * @title Aggregate Function
   */
  type RollupFunction =
    | "count"
    | "count_values"
    | "empty"
    | "not_empty"
    | "unique"
    | "show_unique"
    | "percent_empty"
    | "percent_not_empty"
    | "sum"
    | "average"
    | "median"
    | "min"
    | "max"
    | "range"
    | "earliest_date"
    | "latest_date"
    | "date_range"
    | "checked"
    | "unchecked"
    | "percent_checked"
    | "percent_unchecked"
    | "count_per_group"
    | "percent_per_group"
    | "show_original";

  /**
   * @title Database Aggregate Properties
   */
  type RollupDatabaseProperty = {
    /**
     * @title type
     */
    type: "rollup";

    /**
     * @title rollup
     */
    rollup: {
      /**
       * @title rollup_property_name
       */
      rollup_property_name: string;

      /**
       * @title relation_property_name
       */
      relation_property_name: string;

      /**
       * @title rollup_property_id
       */
      rollup_property_id: string;

      /**
       * @title relation_property_id
       */
      relation_property_id: string;

      /**
       * @title function
       */
      function: RollupFunction;
    };

    /**
     * @title id
     */
    id: string;

    /**
     * @title name
     */
    name: string;
  };

  /**
   * @title Database Selection Attributes
   */
  type SelectDatabaseProperty = {
    /**
     * @title id
     */
    id: string;

    /**
     * @title name
     */
    name: string;

    /**
     * @title type
     */
    type: "select";

    /**
     * @title select
     */
    select: {
      /**
       * @title options
       */
      options: {
        /**
         * @title id
         */
        id: string;

        /**
         * @title name
         */
        name: string;

        /**
         * @title color
         */
        color: Color;
      }[];
    };
  };

  /**
   * @title Database status properties
   */
  type StatusDatabaseProperty = {
    /**
     * @title id
     */
    id: string;

    /**
     * @title name
     */
    name: string;

    /**
     * @title type
     */
    type: "status";

    /**
     * @title status
     */
    status: {
      /**
       * @title options
       */
      options: {
        /**
         * @title id
         */
        id: string;

        /**
         * @title name
         */
        name: string;

        /**
         * @title color
         */
        color: Color;
      }[];

      /**
       * @title groups
       */
      groups: {
        /**
         * @title id
         */
        id: string;

        /**
         * @title name
         */
        name: string;

        /**
         * @title color
         */
        color: Color;

        /**
         * @title option_ids
         */
        option_ids: Array<string>;
      }[];
    };
  };

  /**
   * @title Database title property
   */
  type TitleDatabaseProperty = {
    /**
     * @title type
     */
    type: "title";

    /**
     * @title title
     */
    title: Record<string, never>;

    /**
     * @title id
     */
    id: string;

    /**
     * @title name
     */
    name: string;
  };

  /**
   * @title Database Url property
   */
  type UrlDatabaseProperty = {
    /**
     * @title type
     */
    type: "url";

    /**
     * @title url
     */
    url: Record<string, never>;

    /**
     * @title id
     */
    id: string;

    /**
     * @title name
     */
    name: string;
  };

  /**
   * @title database properties
   */
  export type DatabaseProperty =
    | NumberDatabaseProperty
    | FormulaDatabaseProperty
    | SelectDatabaseProperty
    | MultiSelectDatabaseProperty
    | StatusDatabaseProperty
    | RelationDatabaseProperty
    | RollupDatabaseProperty
    | TitleDatabaseProperty
    | RichTextDatabaseProperty
    | UrlDatabaseProperty
    | PeopleDatabaseProperty
    | FilesDatabaseProperty
    | EmailDatabaseProperty
    | PhoneNumberDatabaseProperty
    | DateDatabaseProperty
    | CheckboxDatabaseProperty
    | CreatedByDatabaseProperty
    | CreatedTimeDatabaseProperty
    | LastEditedByDatabaseProperty
    | LastEditedTimeDatabaseProperty;

  /**
   * - database: database
   * - page: page
   * - user: person
   * - block: block
   * - property_item: property item
   * - list: list
   * - comment: comment
   *
   * @title Notion Object Type
   */
  export type NotionObject =
    | "database"
    | "page"
    | "user"
    | "block"
    | "property_item"
    | "list"
    | "comment";

  /**
   * - emoji: emoji
   * - external: external image
   * - file: image file
   *
   * @title Type of Notion page icon
   */
  type IconType = "emoji" | "external" | "file";

  export type AccurateMarkdownBlock = {
    /**
     * @title type
     */
    type?: string;

    /**
     * @title id
     */
    id: string & tags.Format<"uuid">;

    /**
     * @title text
     */
    text?: string;

    /**
     * @title children
     */
    children?: MarkdownBlock[];

    /**
     * @title hasChild
     */
    hasChild?: boolean;
  };

  export type MarkdownBlock = StrictOmit<AccurateMarkdownBlock, "children"> & {
    /**
     * @title children
     */
    children?: MarkdownBlock[];
  };

  export type IMarkdownBlock = StrictOmit<AccurateMarkdownBlock, "children"> & {
    // 재귀 타입은 빌드가 불가능하기 때문에 any로 바꾸되, Provider 레벨에서는 `MarkdownBlock` 타입을 쓴다.

    /**
     * @title children
     */
    children?: any[];
  };

  export interface IReadPageContentInput {
    /**
     * Indicates the ID of the page.
     *
     * The unique ID of the page from which you want to read the content.
     *
     * @title pageId
     */
    pageId: PageIdInput["pageId"];
  }

  export interface IReadPageContentOutput {
    /**
     * The contents of the page you  read.
     *
     * The contents are in Markdown format.
     *
     * @title content
     */
    content: string;
  }

  /**
   * @title Conditions required to create a page
   */
  export interface ICreatePageInput {
    /**
     * @title parentPageId
     */
    parentPageId: PageIdInput["pageId"];

    /**
     * New page title to be created
     *
     * @title Page title
     */
    title: string;
  }

  export interface ICreatePageContentInput
    extends MyPick<CreatePageParameters, "children"> {
    /**
     * @title children
     */
    children: BlockObjectRequest[];
  }

  export type LookUp<U extends { type?: string }, T> = U extends { type?: T }
    ? U
    : never;

  export interface ICreateChildContentTypeFileInput
    extends PageIdInput,
      StrictOmit<
        LookUp<BlockObjectRequest, `file`>,
        "type" | "object" | "file"
      > {
    /**
     * @title file
     */
    file: {
      /**
       * @title external
       */
      external: {
        /**
         * @title url
         *
         * You can enter the path of the file you want to upload.
         */
        url: string & tags.Format<"iri">;
      };

      /**
       * @title filename
       */
      name?: string;

      /**
       * @title caption for this file
       */
      caption?: INotionService.OnlyOneTextLine;
    };
  }

  export interface ICreateChildContentTypeEmbedInput
    extends PageIdInput,
      StrictOmit<
        LookUp<BlockObjectRequest, `embed`>,
        "type" | "object" | "embed"
      > {
    /**
     * @title embed
     */
    embed: {
      /**
       * @title url
       *
       * You can enter the path of the file you want to embed.
       */
      url: string & tags.Format<"iri">;

      /**
       * @title caption of this embed
       */
      caption?: INotionService.OnlyOneTextLine;
    };
  }

  export interface ICreateChildContentTypeBookmarkInput
    extends PageIdInput,
      StrictOmit<
        LookUp<BlockObjectRequest, `bookmark`>,
        "type" | "object" | "bookmark"
      > {
    /**
     * @title bookmark
     */
    bookmark: {
      /**
       * @title url
       *
       * You can enter the path of the file you want to bookmark.
       */
      url: string & tags.Format<"iri">;

      /**
       * @title caption of this bookmark
       */
      caption?: INotionService.OnlyOneTextLine;
    };
  }

  export interface ICreateChildContentTypeImageInput
    extends PageIdInput,
      StrictOmit<
        LookUp<BlockObjectRequest, `image`>,
        "type" | "object" | "image"
      > {
    /**
     * @title image
     */
    image: {
      /**
       * @title external
       */
      external: {
        /**
         * image file's extension is one of: 'bmp', 'gif', 'heic', 'jpg', 'jpeg', 'png', 'svg', 'tif', 'tiff'.
         *
         * @title url
         */
        url: string &
          tags.Format<"uri"> &
          tags.Pattern<".*\\.(bmp|gif|heic|jpe?g|png|svg|tiff?)(\\?.*)?">;
      };

      /**
       * @title caption of this image
       */
      caption?: INotionService.OnlyOneTextLine;
    };
  }

  export interface ICreateChildContentTypeVideoInput
    extends PageIdInput,
      StrictOmit<
        LookUp<BlockObjectRequest, `video`>,
        "type" | "object" | "video"
      > {
    /**
     * @title video
     */
    video: {
      /**
       * @title external
       */
      external: {
        /**
         * video file must be one of: 'amv' ,'asf' ,'avi' ,'f4v' ,'flv' ,'gifv' ,'mkv' ,'mov' ,'mpg' ,'mpeg' ,'mpv' ,'mp4' ,'m4v' ,'qt' ,'wmv'
         * OR
         * YouTube video links that include embed or watch.
         * E.g. https://www.youtube.com/watch?v=[id], https://www.youtube.com/embed/[id]
         *
         * @title url
         */
        url: string & tags.Format<"iri">;
      };

      /**
       * @title caption of this embed
       */
      caption?: INotionService.OnlyOneTextLine;
    };
  }

  export interface ICreateChildContentTypePdfInput
    extends PageIdInput,
      StrictOmit<LookUp<BlockObjectRequest, `pdf`>, "type" | "object" | "pdf"> {
    /**
     * @title pdf
     */
    pdf: {
      /**
       * @title external
       */
      external: {
        /**
         * @title url
         */
        url: string & tags.Format<"iri"> & tags.Pattern<".*\\.(pdf)(\\?.*)?">;
      };

      /**
       * @title caption of this pdf
       */
      caption?: INotionService.OnlyOneTextLine;
    };
  }

  export interface ICreateChildContentTypeAudioInput
    extends PageIdInput,
      StrictOmit<
        LookUp<BlockObjectRequest, `audio`>,
        "type" | "object" | "audio"
      > {
    /**
     * @title audio
     */
    audio: {
      /**
       * @title external
       */
      external: {
        /**
         * @title url
         */
        url: string & tags.Format<"iri">;
      };

      /**
       * @title caption of this embed
       */
      caption?: INotionService.OnlyOneTextLine;
    };
  }

  export interface ICreateChildContentTypeCodeInput
    extends PageIdInput,
      StrictOmit<
        LookUp<BlockObjectRequest, `code`>,
        | "code" // 코드를 완전히 새로 구현하기 위함
        | "type"
        | "object"
      > {
    /**
     * @title code
     */
    code: {
      /**
       * @title programming language name
       */
      language:
        | "abap"
        | "agda"
        | "arduino"
        | "assembly"
        | "bash"
        | "basic"
        | "bnf"
        | "c"
        | "c#"
        | "c++"
        | "clojure"
        | "coffeescript"
        | "coq"
        | "css"
        | "dart"
        | "dhall"
        | "diff"
        | "docker"
        | "ebnf"
        | "elixir"
        | "elm"
        | "erlang"
        | "f#"
        | "flow"
        | "fortran"
        | "gherkin"
        | "glsl"
        | "go"
        | "graphql"
        | "groovy"
        | "haskell"
        | "html"
        | "idris"
        | "java"
        | "javascript"
        | "json"
        | "julia"
        | "kotlin"
        | "latex"
        | "less"
        | "lisp"
        | "livescript"
        | "llvm ir"
        | "lua"
        | "makefile"
        | "markdown"
        | "markup"
        | "matlab"
        | "mathematica"
        | "mermaid"
        | "nix"
        | "notion formula"
        | "objective-c"
        | "ocaml"
        | "pascal"
        | "perl"
        | "php"
        | "plain text"
        | "powershell"
        | "prolog"
        | "protobuf"
        | "purescript"
        | "python"
        | "r"
        | "racket"
        | "reason"
        | "ruby"
        | "rust"
        | "sass"
        | "scala"
        | "scheme"
        | "scss"
        | "shell"
        | "solidity"
        | "sql"
        | "swift"
        | "toml"
        | "typescript"
        | "vb.net"
        | "verilog"
        | "vhdl"
        | "visual basic"
        | "webassembly"
        | "xml"
        | "yaml"
        | "java/c/c++/c#";

      /**
       * @title rich text for this codebox
       */
      rich_text: INotionService.MultipleTextLine;
    };
  }

  export interface ICreateChildContentTypeEquationInput
    extends PageIdInput,
      StrictOmit<
        LookUp<BlockObjectRequest, `equation`>,
        "type" | "object" | "equation"
      > {
    /**
     * @title equation
     */
    equation: {
      /**
       * @title expression
       *
       * an equation in mathematics
       */
      expression: "y = 2x";
    };
  }

  export interface ICreateChildContentTypeDividerInput
    extends PageIdInput,
      StrictOmit<LookUp<BlockObjectRequest, `divider`>, "type" | "object"> {
    /**
     * @title divider
     */
    divider: Record<string, never>;
  }

  export interface ICreateChildContentTypeBreadcrumbInput
    extends PageIdInput,
      StrictOmit<LookUp<BlockObjectRequest, `breadcrumb`>, "type" | "object"> {
    /**
     * @title breadcrumb
     *
     * You only need to match the key name correctly, so you just need to pass on an empty object.
     */
    breadcrumb: Record<string, never>;
  }

  export interface ICreateChildContentTypeTableOfContentsInput
    extends PageIdInput,
      StrictOmit<
        LookUp<BlockObjectRequest, `table_of_contents`>,
        "type" | "object" | "table_of_contents"
      > {
    /**
     * @title table_of_contents
     */
    table_of_contents: {
      /**
       * It must be one of :
       * "default", "gray", "brown", "orange", "yellow", "green", "blue", "purple", "pink", "red", "gray_background", "brown_background", "orange_background", "yellow_background", "green_background", "blue_background", "purple_background", "pink_background", "red_background"
       *
       * @title color
       */
      color: ApiColor;
    };
  }

  export interface ICreateChildContentTypeLinkToPageInput
    extends PageIdInput,
      StrictOmit<
        LookUp<BlockObjectRequest, `link_to_page`>,
        "type" | "object" | "link_to_page"
      > {
    /**
     * @title link_to_page
     */
    link_to_page: {
      /**
       * You can look up the page by passing the page ID as a parameter at the end of the notion link.
       * For example, in the format 'https://www.notion.so/ :pageId'.
       *
       * @title page_id
       */
      page_id: string & PageIdInput["pageId"];
    };
  }

  export interface ICreateChildContentTypeTableRowInput
    extends PageIdInput,
      StrictOmit<LookUp<BlockObjectRequest, `table_row`>, "type" | "object"> {}

  export interface ICreateChildContentTypeTableInput
    extends PageIdInput,
      StrictOmit<LookUp<BlockObjectRequest, `table`>, "type" | "object"> {}

  export interface ICreateChildContentTypeColumnListInput
    extends PageIdInput,
      StrictOmit<
        LookUp<BlockObjectRequest, `column_list`>,
        "type" | "object"
      > {}

  export interface ICreateChildContentTypeColumnInput
    extends PageIdInput,
      StrictOmit<LookUp<BlockObjectRequest, `column`>, "type" | "object"> {}

  export interface ICreateChildContentTypeHeading_1Input
    extends PageIdInput,
      StrictOmit<
        LookUp<BlockObjectRequest, `heading_1`>,
        "type" | "object" | "heading_1"
      > {
    /**
     * @title heading_1
     */
    heading_1: {
      /**
       * @title rich_text
       */
      rich_text: INotionService.MultipleTextLine;
    };
  }

  export interface ICreateChildContentTypeHeading_2Input
    extends PageIdInput,
      StrictOmit<
        LookUp<BlockObjectRequest, `heading_2`>,
        "type" | "object" | "heading_2"
      > {
    /**
     * @title heading_2
     */
    heading_2: {
      /**
       * @title rich_text
       */
      rich_text: INotionService.MultipleTextLine;
    };
  }

  export interface ICreateChildContentTypeHeading_3Input
    extends PageIdInput,
      StrictOmit<
        LookUp<BlockObjectRequest, `heading_3`>,
        "type" | "object" | "heading_3"
      > {
    /**
     * @title heading_3
     */
    heading_3: {
      /**
       * @title rich_text
       */
      rich_text: INotionService.MultipleTextLine;
    };
  }

  export interface ICreateChildContentTypeParagraphInput
    extends PageIdInput,
      StrictOmit<
        LookUp<BlockObjectRequest, `paragraph`>,
        "type" | "object" | "paragraph"
      >,
      WithChilden<
        {
          /**
           * @title paragraph
           */
          paragraph: {
            /**
             * @title rich_text
             */
            rich_text: INotionService.MultipleTextLine;
          };
        },
        "paragraph"
      > {}

  export interface ICreateChildContentTypeBulletedListItemInput
    extends PageIdInput,
      StrictOmit<
        LookUp<BlockObjectRequest, `bulleted_list_item`>,
        "type" | "object" | "bulleted_list_item"
      >,
      WithChilden<
        {
          /**
           * @title bulleted_list_item
           */
          bulleted_list_item: {
            /**
             * @title rich_text
             */
            rich_text: INotionService.MultipleTextLine;
          };
        },
        "bulleted_list_item"
      > {}

  export interface ICreateChildContentTypeNumberedListItemInput
    extends PageIdInput,
      StrictOmit<
        LookUp<BlockObjectRequest, `numbered_list_item`>,
        "type" | "object" | "numbered_list_item"
      >,
      WithChilden<
        {
          /**
           * @title numbered_list_item
           */
          numbered_list_item: {
            /**
             * @title rich_text
             */
            rich_text: INotionService.MultipleTextLine;
          };
        },
        "numbered_list_item"
      > {}

  export interface ICreateChildContentTypeQuoteInput
    extends PageIdInput,
      StrictOmit<
        LookUp<BlockObjectRequest, `quote`>,
        "type" | "object" | "quote"
      >,
      WithChilden<
        {
          /**
           * @title quote
           */
          quote: {
            /**
             * @title rich_text
             */
            rich_text: INotionService.MultipleTextLine;
          };
        },
        "quote"
      > {}

  export interface ICreateChildContentTypeToDoInput
    extends PageIdInput,
      StrictOmit<
        LookUp<BlockObjectRequest, `to_do`>,
        "type" | "object" | "to_do"
      >,
      WithChilden<
        {
          /**
           * @title to_do
           */
          to_do: {
            /**
             * @title rich_text
             */
            rich_text: INotionService.MultipleTextLine;

            /**
             * @title checked
             */
            checked?: boolean;

            /**
             * @title color
             */
            color?: ApiColor;
          };
        },
        "to_do"
      > {}

  export interface ICreateChildContentTypeToggleInput
    extends PageIdInput,
      StrictOmit<
        LookUp<BlockObjectRequest, `toggle`>,
        "type" | "object" | "toggle"
      >,
      WithChilden<
        {
          /**
           * @title toggle
           */
          toggle: {
            /**
             * @title rich_text
             */
            rich_text: INotionService.MultipleTextLine;

            /**
             * @title color
             */
            color?: ApiColor;
          };
        },
        "toggle"
      > {}

  export interface ICreateChildContentTypeCalloutInput
    extends PageIdInput,
      StrictOmit<LookUp<BlockObjectRequest, `callout`>, "type" | "object"> {}

  export interface ICreateChildContentTypeSyncedBlockInput
    extends PageIdInput,
      StrictOmit<
        LookUp<BlockObjectRequest, `synced_block`>,
        "type" | "object"
      > {}

  export interface PageIdInput {
    /**
     * Indicates the page on which you want to add a block.
     * At the bottom of this page, a block is added to match the requested object here.
     * Calling this connector requires the correct page ID,
     * so it should only be called if you have previously created a page to obtain that ID, viewed the page,
     * or obtained a link or page ID from the user in advance.
     *
     * @title pageId
     */
    pageId: string;
  }

  export namespace Common {
    export interface IError {
      /**
       * for example, APIResponseError
       *
       * @title name
       */
      name: string;

      /**
       * for example, object_not_found
       *
       * @title code
       */
      code: string;

      /**
       * for example, 404
       *
       * @title status
       */
      status: number;

      /**
       * for example, '{"object":"error","status":404,"code":"object_not_found","message":"Could not find page with ID: 6f8304d2-de52-417d-a032-b340a421a8c1. Make sure the relevant pages and databases are shared with your integration.","request_id":"3e773c7e-c703-40a8-9b13-635ad750c3a2"}'
       *
       * @title serialized body
       */
      body: string;
    }
  }

  export type IAppendPageByMarkdownOutput =
    | {
        /**
         * Unique id of the generated page
         *
         * @title page id
         */
        id: string;

        /**
         * @title page link
         */
        link: string & tags.Format<"iri">;
      }
    | INotionService.Common.IError;

  /**
   * @title Page creation result
   */
  export interface __ICreatePageOutput {
    /**
     * Unique id of the generated page
     *
     * @title page id
     */
    id: string;

    /**
     * @title tilte
     *
     * Title of the document you just created
     */
    title: string;

    /**
     * @title page link
     */
    link: string & tags.Format<"iri">;
  }

  /**
   * @title Page creation result
   */
  export type ICreatePageOutput =
    | __ICreatePageOutput
    | INotionService.Common.IError;

  /**
   * @title User Information
   */
  export interface IUser {
    /**
     * Object type of user information
     *
     * @title Object type
     */
    object: NotionObject;

    /**
     * User unique id
     *
     * @title unique id
     */
    id: string;

    /**
     * User's name
     *
     * @title Name
     */
    name: string;

    /**
     * Profile picture url
     *
     * @title Profile picture url
     */
    avatar_url: string | null;

    /**
     * - person: person
     * - bot: automated bot
     *
     * @title User Type
     */
    type: "person" | "bot";

    /**
     * Information when the user type is human
     *
     * @title User Information
     */
    person?: {
      /**
       * User Email
       *
       * @title Email
       */
      email: string;
    };

    /**
     * Information when the user type is bot
     *
     * @title bot information
     */
    bot?: {
      /**
       * Information about the user who owns the bot
       *
       * @title Ownership Information
       */
      owner: {
        /**
         * Type of user you own
         *
         * @title Type
         */
        type: string;

        /**
         * Whether it is a workspace
         *
         * @title Whether it is a workspace
         */
        workspace: boolean;
      };
      /**
       * Workspace Name
       *
       * @title Workspace Name
       */
      workspace_name: string;
    };
  }

  /**
   * @title User list query results
   */
  export interface IUserOutput {
    /**
     * User unique id
     *
     * @title id
     */
    id: string;

    /**
     * Username
     *
     * @title Name
     */
    name: string;
  }

  /**
   * @title Page list query results
   */
  export interface IReadPageOutput {
    /**
     * 페이지 고유 id
     *
     *
     * Indicates the page on which you want to add a block.
     * At the bottom of this page, a block is added to match the requested object here.
     *
     * @title id
     */
    pageId: string;
    /**
     * Page Title
     *
     * @title Title
     */
    title: string;

    /**
     * @title page link
     */
    link: string & tags.Format<"iri">;
  }

  /**
   * @title Information needed to add content to the page
   */
  export interface IAppendPageToContentInput {
    /**
     * What to add to the page
     *
     * @title Content
     */
    content: string;
  }

  /**
   * @title Database property information
   *
   * TODO: Need to change type and inspector structure accordingly
   */
  export interface IDatabasePropertyInput {
    /**
     * The types of values that can be inserted by database properties are all different
     * First, I declared it as any, but I need to think about the structure to see if I should specify the types of values that can be inserted by property as Union.
     *
     * TODO: Type confirmation and changes to fit the inspector structure are needed
     */
    [
      /**
       * @title key value
       */
      key: string
    ]: any;
  }

  /**
   * @title Information required to add an item to the database
   */
  export interface ICreateDatabaseItemInput extends IDatabasePropertyInput {
    /**
     * Value to add to database property
     *
     * @title property value
     */
    value?: string;

    /**
     * If you add a markdown string, it will be converted appropriately according to the Notion's block.
     * Therefore, you don't have to use Unicode symbols to implement lists or decorate documents using letters.
     * Of course, this depends on the user, and there is no problem using the character string you want, such as inserting an emoji as well as Unicode.
     *
     * @title markdown
     */
    markdown: string;
  }

  /**
   * @title Information required to modify an item that exists in the database
   */
  export interface IUpdateDatabaseItemInput extends IDatabasePropertyInput {
    /**
     * Page to update
     *
     * @title Page
     */
    pageId: string;

    /**
     * If you add a markdown string, it will be converted appropriately according to the Notion's block.
     * Therefore, you don't have to use Unicode symbols to implement lists or decorate documents using letters.
     * Of course, this depends on the user, and there is no problem using the character string you want, such as inserting an emoji as well as Unicode.
     *
     * @title markdown
     */
    markdown: string;

    /**
     * Database property value to update
     *
     * @title property value
     */
    value?: string;
  }

  /**
   * @title Database Information
   */
  export interface IDatabaseInfo {
    /**
     * database unique id
     *
     * @title id
     */
    id: string;

    /**
     * Database Title
     *
     * @title Title
     */
    title: string;

    /**
     * Database Page URL
     *
     * @title url
     */
    url: string & tags.Format<"iri">;

    /**
     * Database property information
     *
     * @title property
     */
    properties: Record<string, DatabaseProperty>;
  }

  /**
   * @title Database property information
   */
  export interface IDatabasePropertyInfo {
    /**
     * database property unique id
     *
     * @title id
     */
    id: string;

    /**
     * Database property name
     *
     * @title name
     */
    name: string;

    /**
     * Database property type
     *
     * @title type
     */
    type: string;

    /**
     * Database property value information
     *
     *
     * TODO: Type confirmation and inspector structure needs to be changed
     *
     * @title value
     */
    [key: string]: any;
  }

  /**
   * @title Information needed to search the page
   */
  export interface IFindPageOrDatabaseItemInput {
    /**
     * Page Title
     *
     * @title Title
     */
    title: string;
  }

  /**
   * @title Information needed to find an item in the database
   */
  export interface IFindDatabaseItemInput {
    /**
     * Database ID.
     */
    id: string;

    /**
     * The title of the item in the database item
     *
     * @title Title
     */
    title?: string;

    /**
     * Number in database item
     *
     * @title Number
     */
    number?: number & tags.Type<"int32">;

    /**
     * url in database item
     *
     * @title url
     */
    url?: string & tags.Format<"iri">;

    /**
     * Email address in database item
     *
     * @title Email address
     */
    email?: string & tags.Format<"email">;

    /**
     * Text in database item
     *
     * @title text
     */
    rich_text?: string;

    /**
     * Phone number in database item
     *
     * @title Phone number
     */
    phone_number?: string;

    /**
     * When searching for a database item, multiple attributes can come up (title, number, url, email, text, phone number)
     * Since the values coming for each attribute are different, declare it as any
     *
     * TODO: Type confirmation and changes to fit the inspector structure are needed
     */
    [key: string]: any;
  }

  /**
   * @title Page Information
   */
  interface ICommonPageOutputInterface extends __ICreatePageOutput {
    /**
     * Type of page object
     *
     * @title Object Type
     */
    object: NotionObject;

    /**
     * Date the page was created
     *
     * @title Date created
     */
    created_time: string;

    /**
     * Date the page was last modified
     *
     * @title Last modified
     */
    last_edited_time: string;

    /**
     * Information about who created the page
     *
     * @title Created by
     */
    created_by: {
      /**
       * The type of the object that created the page
       *
       * @title Object Type
       */
      object: NotionObject;

      /**
       * Unique id of the person who created the page
       *
       * @title id
       */
      id: string;
    };

    /**
     * Information about who last modified the page
     *
     * @title Last modified by
     */
    last_edited_by: {
      /**
       * The type of object that last modified the page
       *
       * @title Object Type
       */
      object: NotionObject;

      /**
       * Unique id of the last person to edit the page
       *
       * @title id
       */
      id: string;
    };

    /**
     * Page Background Image Information
     *
     * @title Background Image
     */
    cover: IPageCover | null;

    /**
     * Page Icon Information
     *
     * @title Icon
     */
    icon: IPageIcon | null;

    /**
     * Whether to archive the page
     *
     * @title Whether to archive the page
     */
    archived: boolean;

    /**
     * Page url
     *
     * @title url
     */
    url: string & tags.Format<"iri">;

    /**
     * Page public url
     *
     * @title public url
     */
    public_url: (string & tags.Format<"iri">) | null;
  }

  /**
   * @title External image information
   */
  interface IExternalImage {
    /**
     * image url
     *
     * @title url
     */
    url: string & tags.Format<"iri">;
  }

  /**
   * @title Page background image information
   */
  interface IPageCover {
    /**
     * Image Type
     *
     * @title Type
     */
    type: string;

    /**
     * Image information
     *
     * @title Image
     */
    external: IExternalImage;
  }

  /**
   * @title Page Icon Information
   */
  interface IPageIcon {
    /**
     * Icon Type
     *
     * @title Type
     */
    type: IconType;

    /**
     * Icon information when the icon type is emoji
     *
     * @title Emoji icon
     */
    emoji?: string | null;

    /**
     * Icon information when the icon type is icon
     *
     * @title Icon
     */
    external?: IExternalImage | null;

    /**
     * Icon information when the icon type is file
     *
     * @title Icon file
     */
    file?: {
      /**
       * file url
       *
       * @title url
       */
      url: string & tags.Format<"iri">;

      /**
       * Image file expiration time
       *
       * @title expiration time
       */
      expiry_time: string;
    };
  }

  /**
   * @title Page property information
   */
  interface IFindPageProperty {
    /**
     * Information about the title attribute
     *
     * @title Title attribute
     */
    title: {
      /**
       * Page property id
       *
       * @title id
       */
      id: string;

      /**
       * Page Property Type
       *
       * @title Property Type
       */
      type: string;

      /**
       * Page Title Attribute Information
       *
       * @title Title Attribute
       */
      title: IFindPageTitleProperty[];
    };
  }

  /**
   * @title Page title attribute
   */
  interface IFindPageTitleProperty {
    /**
     * Title property type
     *
     * @title type
     */
    type: string;

    /**
     * Page Title Text Information
     *
     * @title Text Information
     */
    text: IPageTitleText;

    /**
     * Page Title Additional Information
     *
     * @title Additional Information
     */
    annotations: IPageTitleAnnotation;

    /**
     * Page Title Original Text
     *
     * @title Original
     */
    plain_text: string;

    /**
     * Page Link
     *
     * @title Link
     */
    href: (string & tags.Format<"iri">) | null;
  }

  /**
   * @title Page title text information
   */

  interface IPageTitleText {
    /**
     * Title Text Content
     *
     * @title Content
     */
    content: string;

    /**
     * Page Title Link
     *
     * @title Link
     */
    link: (string & tags.Format<"iri">) | null;
  }

  /**
   * @title Page title Additional information
   */
  interface IPageTitleAnnotation {
    /**
     * Title Text Bold
     *
     * @title Bold
     */
    bold: boolean;

    /**
     * Title text italicized
     *
     * @title italicized
     */
    italic: boolean;

    /**
     * Title text strikethrough
     *
     * @title strikethrough
     */
    strikethrough: boolean;

    /**
     * Title text underline
     *
     * @title underline
     */
    underline: boolean;

    /**
     * Whether the title text is wrapped in code
     *
     * @title Whether the title text is wrapped in code
     */
    code: boolean;

    /**
     * Title Text Color
     *
     * @title Color
     */
    color: string;
  }

  export interface IFindPageByTitleOutput
    extends StrictOmit<ICommonPageOutputInterface, "title" | "link"> {
    /**
     * Parent Page Information
     *
     * @title Parent Page
     */
    parent: {
      /**
       * Parent Page Object Type
       *
       * @title Type
       */
      type: string;

      /**
       * Whether the parent page is a workspace
       *
       * @title Whether the workspace is
       */
      workspace?: boolean;
    };

    /**
     * Page Properties Information
     *
     * @title property
     */
    properties: IFindPageProperty;
  }

  /**
   * @title Database item creation result
   */
  export interface IDatabaseItemOutput extends ICommonPageOutputInterface {
    /**
     * Parent Database Item Information
     *
     * @title Parent Database Item
     */
    parent: {
      /**
       * Parent database item object type
       *
       * @title type
       */
      type: string;

      /**
       * database item parent id
       *
       * @title database id
       */
      database_id: string;
    };

    /**
     * Database Item Properties
     *
     * @title Property
     */
    properties: any;
  }

  /**
   * @title OnlyOneTextLine
   *
   * Tuple that Length is 1
   */
  export type OnlyOneTextLine = {
    /**
     * @title text
     */
    text: {
      /**
       * @title content
       */
      content: string;

      /**
       * @title link
       */
      link?: {
        /**
         * @title url
         */
        url: string & tags.Format<"iri">;
      };
    };
  }[] &
    tags.MinItems<1> &
    tags.MaxItems<1>;

  export type MultipleTextLine = {
    /**
     * @title text
     */
    text: {
      /**
       * @title content
       */
      content: string;

      /**
       * @title link
       */
      link?: {
        /**
         * @title url
         */
        url: string & tags.Format<"iri">;
      };
    };
  }[] &
    tags.MaxItems<1>;

  export type ApiColor =
    | "default"
    | "gray"
    | "brown"
    | "orange"
    | "yellow"
    | "green"
    | "blue"
    | "purple"
    | "pink"
    | "red"
    | "gray_background"
    | "brown_background"
    | "orange_background"
    | "yellow_background"
    | "green_background"
    | "blue_background"
    | "purple_background"
    | "pink_background"
    | "red_background";

  /**
   * @title WithChildren
   *
   * A type that matches the same type as T received as an argument into an array T[] within its own property, children.
   */
  export type WithChilden<T extends object, P extends string> = Hierarchy<
    T,
    `${P}.children`,
    3,
    true
  >;

  export interface IDeleteBlockInput {
    /**

     * Indicates the ID of the page or block within the page to be deleted.
     * If you delete the page, it will go to the trash, so recovery is possible.
     *
     * @title block_id
     */
    block_id: PageIdInput["pageId"];
  }

  export interface IAppendPageByMarkdownInput
    extends PageIdInput,
      MarkdownInput {}

  export interface ICreatePageByMarkdownInput
    extends INotionService.ICreatePageInput,
      MarkdownInput {}

  export interface MarkdownInput {
    /**
     * If you add a markdown string, it will be converted appropriately according to the Notion's block.
     * Therefore, you don't have to use Unicode symbols to implement lists or decorate documents using letters.
     * Of course, this depends on the user, and there is no problem using the character string you want, such as inserting an emoji as well as Unicode.
     *
     * @title markdown
     */
    markdown: string;
  }

  export interface IUpdateNotionTitleInput {
    /**
     * It means title to update this page
     *
     * @title Title of Page
     */
    title: string;

    /**
     * @title Page ID to update
     */
    pageId: PageIdInput["pageId"];
  }

  export interface ICrear {
    /**
     * @title Page ID to clear
     */
    pageId: PageIdInput["pageId"];
  }

  /**
   * @title Information needed to create a gallery view database
   */
  export interface ICreateGalleryDatabaseInput {
    /**
     * @title parentPageId
     */
    parentPageId: PageIdInput["pageId"];

    /**
     * @title databaseTitle
     */
    title: string;
  }

  /**
   * @title Information created a gallery view database
   */
  export interface ICreateGalleryDatabaseOutput {
    /**
     * Database id
     *
     * @title id
     */
    id: string;

    /**
     * Title of database
     *
     * @title title
     */
    title: string;

    /**
     * Page url of database
     *
     * @title url
     */
    url: string & tags.Format<"iri">;
  }

  /**
   * @title Information needed to create a gallery view database items
   */
  export interface ICreateGalleryDatabaseItemInput {
    /**
     * Database Id what you want to add a item.
     *
     * If the database is not created, you can create a database using the `Create Gallery Database` function first.
     * The endpoint is POST: /connector/notion/create-gallery-database.
     *
     * @title databaseId
     */
    databaseId: string;

    /**
     * Information needed to create a gallery database items.
     *
     * You can add multiple items at once.
     * If you need to add multiple database items, you should add each piece of information to the info as an array.
     * You should not make multiple calls when you need to add multiple items.
     *
     * @title informations
     */
    info: ICreateGalleryDatabaseItemInfo[];
  }

  /**
   * @title Information created a gallery view database item
   */
  export interface ICreateGalleryDatabaseItemInfo {
    /**
     * Database Item Title.
     * The title of the item to be added to the database.
     *
     * @title title
     */
    title: string;

    /**
     * If you add a markdown string, it will be converted appropriately according to the Notion's block.
     * Therefore, you don't have to use Unicode symbols to implement lists or decorate documents using letters.
     * Of course, this depends on the user, and there is no problem using the character string you want, such as inserting an emoji as well as Unicode.
     *
     * @title markdown
     */
    markdown: string;
  }

  /**
   * @title Information created a gallery view database item
   */
  export interface ICreateGalleryDatabaseItemOutput {
    /**
     * Created item database id
     *
     * @title pageId
     */
    pageId: string;

    /**
     * Created item page url
     *
     * @title page url
     */
    url: string & tags.Format<"iri">;
  }

  /**
   * @title Information needed to update the page content
   */
  export interface IUpdatePageContentInput {
    /**
     * Page id what you want to update.
     *
     * @title pageId
     */
    pageId: PageIdInput["pageId"];

    /**
     * If you add a markdown string, it will be converted appropriately according to the Notion's block.
     * Therefore, you don't have to use Unicode symbols to implement lists or decorate documents using letters.
     * Of course, this depends on the user, and there is no problem using the character string you want, such as inserting an emoji as well as Unicode.
     *
     * @title markdown
     */
    markdown: string;
  }

  /**
   * This property is used when adding a text property to the database.
   * The text property can only accept text.
   * This is a property for creating items that should be expressed as text.
   * For example, when creating an English vocabulary list, if you need three properties: word, meaning, and idiom, you should be able to create the meaning and idiom as rich_text properties.
   *
   * @title Notion Database rich_text property
   */
  interface IRichTextProperty {
    rich_text: {};
  }

  /**
   * This property is used when adding a title property to a database.
   * This property must be added when creating a database.
   * It must never be omitted.
   * The title property can only accept text.
   * Items added to that property can be used as pages, and content can also be added to the pages.
   * This is a property for creating items that should be expressed as topics or titles.
   * For example, when creating an English vocabulary list, if you need three properties: word, meaning, and idiom, you should be able to create words as title properties because words can be used as topics or titles.
   *
   * @title Notion Database title property
   */
  interface ITitleProperty {
    title: {};
  }

  /**
   * These are the types that are possible as database properties.
   *
   * @title Database property
   */
  type IDatabaseProperty = IRichTextProperty | ITitleProperty;

  /**
   * @title Database Schema
   */
  export interface IDatabaseSchema {
    /**
     * The property name should be selected with appropriate words based on the user's request.
     * The type should also be selected with appropriate properties between the title property and the rich_text property based on the user's request.
     *
     * @title database property schema
     */
    [propertyName: string]: IDatabaseProperty;
  }

  /**
   * @title Information needed to create a notion database
   */
  export interface ICreateDatabaseInput {
    /**
     * @title parentPageId
     */
    parentPageId: PageIdInput["pageId"];

    /**
     * Database Title
     *
     * @title title
     */
    title: string;

    /**
     * Database Properties Schema
     *
     * @properties properties
     */
    properties: IDatabaseSchema[];
  }

  /**
   * @title Information created a notion database
   */
  export interface ICreateDatabaseOutput {
    /**
     * Database id
     *
     * @title id
     */
    id: string;

    /**
     * Database title
     *
     * @title title
     */
    title: string;

    /**
     * Database page url
     *
     * @title url
     */
    url: string & tags.Format<"iri">;
  }

  /**
   * @title Information needed to add a property to the database
   */
  export interface IAddDatabasePropertyInput {
    /**
     * Database Id what you want to delete property.
     *
     * @title databaseId
     */
    databaseId: string;

    /**
     * Database Properties Schema what want to add
     *
     * @title property
     */
    property: IDatabaseSchema;
  }

  /**
   * @title Information database for added property
   */
  export type IAddDatabasePropertyOutput = INotionService.ICreateDatabaseOutput;

  /**
   * @title Information needed to delete a property to the database
   */
  export interface IDeleteDatabasePropertyInput {
    /**
     * Database Id what you want to delete property.
     *
     * @title databaseId
     */
    databaseId: string;

    /**
     * The name of the property want to delete
     *
     * @title propertyName
     */
    propertyName: string;
  }

  /**
   * @title Information database for deleted property
   */
  export type IDeleteDatabasePropertyOutput =
    INotionService.ICreateDatabaseOutput;

  /**
   * @title Information needed to add an items to the database
   */
  export interface IAddItemsToDatabaseInput {
    /**
     * Database Id what you want to add a item.
     *
     * If the database is not created, you can create a database using the `Create Database` function first.
     * The endpoint is POST: /connector/notion/create-database.
     *
     * @title databaseId
     */
    databaseId: string;

    /**
     * These are the item combinations to be created in the database.
     * Each item combination is created for each row in the database.
     *
     * @title Items to create
     */
    items: ICreateDatabaseItem[];
  }

  /**
   * This combination of items is used to populate a row in the database.
   * For example, if the properties of the database are title, rich_text, rich_text, rich_text, date, The combination of items requires 1 title, 3 rich_texts, and 1 date.
   *
   * @title Information about the item added to the database
   */
  export interface ICreateDatabaseItem {
    /**
     * The value to be filled in the title property.
     *
     * @title title value
     */
    title: string;

    /**
     * The values to be filled in the rich_text property.
     *
     * @title rich_text value
     */
    rich_text: {
      propertyName: string;
      value: string;
    }[];

    /**
     * The value to be filled in the date property.
     * You must specify the date-time at the time the input was filled in.
     *
     * @title date value
     */
    date: string & tags.Format<"date-time">;

    /**
     * If you add a markdown string, it will be converted appropriately according to the Notion's block.
     * Therefore, you don't have to use Unicode symbols to implement lists or decorate documents using letters.
     * Of course, this depends on the user, and there is no problem using the character string you want, such as inserting an emoji as well as Unicode.
     * This Markdown string is used to add content to the page of each database row.
     *
     * @title page content
     */
    markdown?: string;
  }

  /**
   * @title Information database for added items
   */
  export type IAddItemsToDatabaseOutput = INotionService.ICreateDatabaseOutput;

  export interface IDatabasePropertyOutput {
    id: string;
    name: string;
    type: string;
    [key: string]: any;
  }

  export interface IDatabaseProperties {
    [propertyName: string]: IDatabasePropertyOutput;
  }
}
