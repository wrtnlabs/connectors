import {
  Comment,
  Component,
  ComponentSet,
  GetCommentsQueryParams,
  GetCommentsResponse,
  PostCommentRequestBody,
  PostCommentResponse,
  Style,
} from "@figma/rest-api-spec";
import { tags } from "typia";
import { MyPick } from "@wrtnlabs/connector-shared";

export namespace IFigmaService {
  export interface IProps {
    /**
     * Figma Client ID.
     */
    clientId: string;

    /**
     * Figma Client Secret.
     */
    clientSecret: string;

    /**
     * Figma Refresh Token.
     */
    secret: string;
  }

  /**
   * A DTO that retrieves files from a specific Figma frame.
   *
   * You can read files from one frame at a time.
   */
  export interface IReadFileInput {
    /**
     * It means the key of the file.
     *
     * Here, the file key means the Figma frame.
     *
     * @title A unique key value for each Figma file or component
     */
    fileKey: string;

    /**
     * The specific version ID to retrieve. If omitted, the current version of the file is retrieved.
     *
     * @title The specific version ID to retrieve
     */
    version?: string;

    /**
     * A comma-separated list of nodes of interest in the document. If specified, only the node, its children, and all subsets between the root node and the listed nodes will be returned.
     *
     * Note: Other nodes outside the ancestor chain of the desired node may be included in the returned JSON. The response may also include dependencies of things in the node's subtree. For example, if the node's subtree contains instances of local components located elsewhere in the file, those components and their ancestor chains will also be included.
     *
     * For historical reasons, the top-level canvas node is always returned, regardless of whether it is listed in the `ids` parameter. This quirk may be removed in a future API version.
     *
     * @title A comma-separated list of nodes of interest in the document
     */
    ids?: string;

    /**
     * A positive integer indicating how deep to traverse the document tree. For example, setting this to 1 will return only pages, while setting it to 2 will return the pages and all top-level objects for each page. If this parameter is not set, all nodes will be returned.
     *
     * @title A positive integer indicating how deep to traverse the document tree
     */
    depth?: number & tags.Type<"int64">;

    /**
     * Set to "paths" when exporting vector data.
     *
     * @title Vector data to export
     */
    geometry?: string;

    /**
     * A comma-separated list of plugin IDs and/or the string "shared". All data in the document created by that plugin will be included in the `pluginData` and `sharedPluginData` properties of the result.
     *
     * @title A comma-separated list of plugin IDs and/or the string "shared"
     */
    plugin_data?: string;

    /**
     * Returns branch metadata for the requested file. If the file is a branch, the returned response also includes the main file key. If the file has a branch, its metadata is also returned. Default: false.
     *
     * @title Indicates whether to return branch metadata for the requested file
     */
    branch_data?: boolean & tags.Default<false>;
  }

  /**
   * DTO corresponding to the information in the read Figma file.
   */
  export interface IReadFileOutput {
    /**
     * The name of the file in the editor.
     *
     * @title The name of the file in the editor
     */
    name: string;

    /**
     * The role of the user performing the API request related to the file.
     *
     * @title The role of the user performing the request
     */
    role: "owner" | "editor" | "viewer";

    /**
     * The UTC ISO 8601 time the file was last modified.
     *
     * @title The time the file was last modified
     */
    lastModified: string & tags.Format<"date-time">;

    /**
     * The type of editor associated with this file.
     *
     * @title The type of editor associated with the file
     */
    editorType: "figma" | "figjam";

    /**
     * A URL to the thumbnail image for the file.
     *
     * @title Thumbnail Image
     */
    thumbnailUrl?: string;

    /**
     * The version number of the file. This number is incremented each time the file is modified and can be used to determine if the file has changed between requests.
     *
     * @title The version number of the file
     */
    version: string;

    /**
     * @todo Removed for now due to recursion problem
     */
    // document: DocumentNode;

    /**
     * Mapping between component ID and component metadata.
     *
     * @title Mapping between component ID and component metadata
     */
    components: {
      [
        /**
         * @title component id
         */
        key: string
      ]: Component;
    };

    /**
     * A mapping between a component set ID and component set metadata.
     *
     * @title A mapping between a component set ID and component set metadata
     */
    componentSets: { [key: string]: ComponentSet };

    /**
     * The version of the file schema used by this file.
     *
     * @title The version of the file schema used by this file
     */
    schemaVersion: number;

    /**
     * Mapping between style ID and style metadata.
     *
     * @title Mapping between style ID and style metadata
     */
    styles: { [key: string]: Style };

    /**
     * The primary file key of this file. If present, this file is a component or a set of components.
     *
     * @title The primary file key of this file
     */
    mainFileKey?: string;

    /**
     * This is a list of branches for this file.
     *
     * @title branches
     */
    branches?: {
      /**
       * This is the key of the branch.
       *
       * @title key
       */
      key: string;

      /**
       * The name of the branch.
       *
       * @title name
       */
      name: string;

      /**
       * A URL to the thumbnail image of the branch.
       *
       * @title thumbnail_url
       */
      thumbnail_url: string;

      /**
       * The UTC ISO 8601 time when the branch was last modified.
       *
       * @title last_modified
       */
      last_modified: string;
    }[];
  }

  /**
   * DTO for adding comments to a specific area.
   *
   * You can write one comment at a time, and you can write comments using coordinate values, nodes, or parent comments (root comments).
   */
  export interface IAddCommentInput extends PostCommentRequestBody {
    /**
     * It means the key of the file.
     *
     * @title A unique key value for each Figma file or component
     */
    fileKey: string;
  }
  /**
   * A DTO that retrieves comments from a specific Figma frame.
   *
   * You can read comments from one frame at a time.
   */
  export interface IReadCommentInput extends GetCommentsQueryParams {
    /**
     * It means the key of the file.
     *
     * @title A unique key value for each Figma file or component
     */
    fileKey: string;
  }

  /**
   * DTO corresponding to the information in the comment you just wrote.
   */
  export type IAddCommentOutput = PostCommentResponse;

  /**
   * DTO corresponding to the information in the read Figma comments.
   */
  export type IReadCommentOutput = GetCommentsResponse;

  /**
   * @title Project search conditions
   */
  export interface IGetProjectInput {
    /**
     * When accessing the link `https://www.figma.com/files/team`, it refers to the string attached after the `team` keyword.
     *
     * The team ID is in numeric format, and there can be multiple projects within the team.
     *
     * @title Team ID
     */
    teamId: string;
  }

  export interface IGetProjectStatisticsInput
    extends MyPick<IFigmaService.IReadCommentInput, "as_md">,
      IFigmaService.IGetProjectInput {
    team: IFigmaService.IGetProejctOutput;
  }

  export interface IGetProejctOutput {
    /**
     * @title Team Name
     */
    name: string;

    /**
     * @title Project List
     *
     * This refers to the list of projects belonging to the team.
     */
    projects: Array<Project>;
  }

  export interface Project {
    /**
     * @title Project ID
     */
    id: string;

    /**
     * @title Project Name
     */
    name: string;
  }

  export interface IGetProjectFileOutput {
    /**
     * @title Project Name
     */
    name: Project["name"];

    /**
     * A list of canvases managed by the project.
     *
     * @title Canvas List
     */
    files: Canvas[];
  }

  export interface Canvas {
    /**
     * A key that uniquely identifies a file.
     * The files mentioned here refer to the canvases managed in the project.
     * In Figma, all child component elements of a canvas, including the canvas, are called files, so be careful not to confuse the terminology.
     *
     * @title Canvas Key
     */
    key: string;

    /**
     * It means the name given by the user to identify the file.
     * The file mentioned here refers to the canvases managed in the project.
     * In Figma, all child component elements of the canvas, including the canvas, are called files, so be careful not to confuse the terminology.
     *
     * @title Canvas name
     */
    name: string;

    /**
     * As a thumbnail image, it provides the main screen of this canvas as a screenshot.
     * However, if you want to save this thumbnail as a link and use it, please note that this image is provided only for a certain period of time.
     *
     * @title Thumbnail
     */
    thumbnail_url: string &
      tags.Format<"uri"> &
      tags.ContentMediaType<"image/*">;

    /**
     * This refers to the last modification time of the canvas.
     * Based on this, you can distinguish the canvas that has been most recently changed or communicated, etc., and is maintained.
     * However, this value cannot be known unless a comment has been added or there has been a change to the canvas.
     *
     * @title Last modification time
     */
    last_modified: string & tags.Format<"date-time">;
  }

  export interface CanvasStatistics extends Canvas {
    /**
     * @title List of comments in canvas
     */
    comments: Comment[];

    /**
     * @title Statistics on comments in canvas
     */
    statistics: {
      /**
       * @title List of people who participated in the discussion
       */
      users: string[];

      /**
       * @title Number of comments per person
       */
      counts: Record<string, number>;
    };
  }

  export interface IGetStatisticsOutput extends MyPick<Project, "id" | "name"> {
    /**
     * @title Statistics by canvas within the project
     */
    canvasList: CanvasStatistics[];
  }
}
