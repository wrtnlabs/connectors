import { tags } from "typia";
import {
  MyPick,
  PickPartial,
  SnakeToCamel,
  StrictOmit,
} from "@wrtnlabs/connector-shared";

export const ENV_LIST = ["GITHUB_REFRESH_TOKEN"] as const;

export namespace IGithubService {
  export type IProps = {
    [K in SnakeToCamel<(typeof ENV_LIST)[number]>]: string;
  };

  export interface ICommonPaginationOutput {
    /**
     * However, since true and false are judged by comparing the number of requested objects with the number of searched objects,
     * even if true, the next page may be empty.
     *
     * @title true if there is a next page
     */
    nextPage: boolean;

    /**
     * @title after
     *
     * If this is the response value for cursor-based pagenation, it provides a hash code for the next page.
     */
    after?: string;

    /**
     * @title before
     *
     * If this is the response value for cursor-based pagenation, it provides a hash code for the previous page.
     */
    before?: string;

    /**
     * If this is a response by offset-based pagenation, provide metadata for the next page.
     * This means the previous page.
     *
     * @title prev
     */
    prev?: number | null;

    /**
     * If this is a response by offset-based pagenation, provide metadata for the next page.
     * This means the next page.
     *
     * @title next
     */
    next?: number | null;

    /**
     * If this is a response by offset-based pagenation, provide metadata for the next page.
     * This means the last page.
     *
     * @title last
     */
    last?: number;

    /**
     * If this is a response by offset-based pagenation, provide metadata for the next page.
     * This means the first page.
     *
     * @title first
     */
    first?: number;
  }

  export interface ICommonPaginationInput {
    /**
     * The number of results per page (max 100).
     *
     * @title per_page
     */
    per_page?: number &
      tags.Type<"uint64"> &
      tags.Default<30> &
      tags.Maximum<100>;

    /**
     * The page number of the results to fetch.
     *
     * @title page
     */
    page?: number & tags.Type<"uint64"> & tags.Default<1>;

    /**
     * Determines whether the first search result returned is the highest number of matches (desc) or lowest number of matches (asc).
     * This parameter is ignored unless you provide sort.
     *
     * @title order
     */
    order?: ("desc" | "asc") & tags.Default<"desc">;
  }

  export type __IAnalyzeInput = (
    | (RepositoryFolder & {
        /**
         * For folders, you may have other files or folders inside.
         * This should also be a folder or file type object,
         * but here, we specify it as any type to prevent it because it can be recursively infinitely large.
         *
         * @title children
         */
        children: any[];
      })
    | StrictOmit<IGithubService.RepositoryFile, "encoding" | "content">
  )[];

  export type MileStone = {
    /**
     * @title id
     */
    id: number;

    /**
     * @title number
     */
    number: number;

    /**
     * @title state
     */
    state: "open" | "closed"; // 더 확인이 필요

    /**
     * @title title
     */
    title: string;

    /**
     * @title description
     */
    description: string;

    /**
     * @title creator
     */
    creator: MyPick<User, "id" | "login" | "type">;

    /**
     * @title open_issues
     */
    open_issues: number & tags.Type<"uint64"> & tags.Minimum<0>;

    /**
     * @title closed_issues
     */
    closed_issues: number & tags.Type<"uint64"> & tags.Minimum<0>;

    /**
     * @title created_at
     */
    created_at: string & tags.Format<"date-time">;

    /**
     * @title updated_at
     */
    updated_at: string & tags.Format<"date-time">;

    /**
     * @title closed_at
     */
    closed_at: string & tags.Format<"date-time">;

    /**
     * @title due_on
     */
    due_on: string & tags.Format<"date-time">;
  };

  export interface ReviewComment extends StrictOmit<Comment, "pages"> {
    /**
     * @title pull_request_review_id
     */
    pull_request_review_id: number & tags.Type<"uint64">;

    /**
     * diff_hunk is a form for representing a change in code in github.
     * It consists of strings, and the first line, based on the new line character,
     * has meta information about the change point between the symbols @@ and @@.
     * This meta information includes how many lines were affected based on the file before the change,
     * and how many lines were affected based on the file after the change.
     * Like `@@ -45,4 +45,23 @@`
     *
     * @title diff_hunk
     */
    diff_hunk: string;

    /**
     * The relative path to the file that necessitates a review comment.
     *
     * @title path
     */
    path: string;

    /**
     * This parameter is closing down. Use 'line' instead.
     *
     * The position in the diff where you want to add a review comment.
     * Note this value is not the same as the line number in the file.
     * The position value equals the number of lines down from the first "@@" hunk header in the file you want to add a comment.
     * The line just below the "@@" line is position 1, the next line is position 2, and so on. The position in the diff continues to increase through lines of whitespace and additional hunks until the beginning of a new file.
     *
     * Position value, which is the number of rows based on diff_hunk.
     *
     * @title position
     * @deprecated
     */
    position?: (number & tags.Type<"uint64">) | null;

    /**
     * @title original_position
     *
     * Original position value, which is the number of rows based on diff_hunk.
     */
    original_position: number & tags.Type<"uint64">;

    /**
     * The SHA of the commit needing a comment.
     * Not using the latest commit SHA may render your comment outdated
     * if a subsequent commit modifies the line you specify as the position.
     *
     * @title commit_id
     */
    commit_id: Commit["sha"];

    /**
     * @title original_commit_id
     */
    original_commit_id: Commit["sha"];

    /**
     * @title in_reply_to_id
     *
     * In_reply_to_id is a field used by GitHub's review or comment API that is used to write a reply to a particular review or comment.
     */
    in_reply_to_id?: number & tags.Type<"uint64">;

    /**
     * @title user
     */
    user: Collaborator;

    /**
     * @title html_url
     */
    html_url: string & tags.Format<"iri">;

    /**
     * @title author_association
     */
    author_association: IGithubService.AuthorAssociation;
  }

  export interface IGetReviewCommentOutput
    extends IGithubService.ICommonPaginationOutput {
    /**
     * @title result
     */
    result: IGithubService.ReviewComment[];
  }

  export interface IGetReviewCommentInput
    extends IReadPullRequestDetailInput,
      MyPick<ICommonPaginationInput, "page" | "per_page"> {
    /**
     * @title review_id
     */
    review_id: Review["id"];
  }

  export interface ISingleLinePullRequestComment
    extends MyPick<IGithubService.ReviewComment, "path" | "body"> {
    /**
     * The line of the blob in the pull request diff that the comment applies to.
     * For a multi-line comment, the last line of the range that your comment applies to.
     *
     * @title line
     */
    line?: number & tags.Type<"uint64"> & tags.Minimum<1>;

    /**
     * In a split diff view, the side of the diff that the pull request's changes appear on.
     * Can be LEFT or RIGHT. Use LEFT for deletions that appear in red.
     * Use RIGHT for additions that appear in green or unchanged lines that appear
     * in white and are shown for context.
     *
     * For a multi-line comment, side represents whether the last line of the comment range
     * is a deletion or addition. For more information, see "Diff view options"
     * in the GitHub Help documentation.
     *
     * @title side
     */
    side?: ("LEFT" | "RIGHT") & tags.Default<"RIGHT">;
  }

  /**
   * @title Comment of Pull Request
   */
  export interface IPullRequestComment
    extends MyPick<IGithubService.ReviewComment, "path" | "body"> {
    /**
     * The line of the blob in the pull request diff that the comment applies to.
     * For a multi-line comment, the last line of the range that your comment applies to.
     *
     * @title line
     */
    line?: number & tags.Type<"uint64"> & tags.Minimum<1>;

    /**
     * In a split diff view, the side of the diff that the pull request's changes appear on.
     * Can be LEFT or RIGHT. Use LEFT for deletions that appear in red.
     * Use RIGHT for additions that appear in green or unchanged lines that appear
     * in white and are shown for context.
     *
     * For a multi-line comment, side represents whether the last line of the comment range
     * is a deletion or addition. For more information, see "Diff view options"
     * in the GitHub Help documentation.
     *
     * @title side
     */
    side?: ("LEFT" | "RIGHT") & tags.Default<"RIGHT">;

    /**
     * **Required when using multi-line comments unless using in_reply_to.**
     *
     * The start_line is the first line in the pull request diff that your
     * multi-line comment applies to. To learn more about multi-line comments,
     * see "Commenting on a pull request" in the GitHub Help documentation.
     *
     * @title start_line
     */
    start_line?: number & tags.Type<"uint64">;

    /**
     * **Required when using multi-line comments unless using in_reply_to.**
     *
     * The start_side is the starting side of the diff that the comment applies to.
     * Can be LEFT or RIGHT. To learn more about multi-line comments,
     * see "Commenting on a pull request" in the GitHub Help documentation.
     * See side in this table for additional context.
     *
     * @title start_side
     */
    start_side?: ("LEFT" | "RIGHT") & tags.Default<"RIGHT">;

    /**
     * The ID of the review comment to reply to.
     * To find the ID of a review comment with "List review comments on a pull request".
     * When specified, all parameters other than body in the request body are ignored.
     *
     * @title in_reply_to
     */
    in_reply_to?: string;
  }

  export type IReviewPullRequestOutput = MyPick<IGithubService.Review, "id">;

  export interface IReviewPullRequestInput extends IReadPullRequestDetailInput {
    /**
     * The SHA of the commit that needs a review.
     * Not using the latest commit SHA may render your review comment outdated if a subsequent commit modifies the line you specify as the position.
     * Defaults to the most recent commit in the pull request when you do not specify a value.
     *
     * @title commit_id
     */
    commit_id?: string;

    /**
     * Required when using REQUEST_CHANGES or COMMENT for the event parameter.
     * The body text of the pull request review.
     *
     * @title body
     */
    body?: string;

    /**
     * The review action you want to perform.
     * The review actions include: APPROVE, REQUEST_CHANGES, or COMMENT.
     * By leaving this blank, you set the review action state to PENDING, which means you will need to submit the pull request review when you are ready.
     *
     * @title event
     */
    event?:
      | tags.Constant<"APPROVE", { title: "APPROVE" }>
      | tags.Constant<"REQUEST_CHANGES", { title: "REQUEST_CHANGES" }>
      | tags.Constant<"COMMENT", { title: "COMMENT" }>;

    /**
     * @title Comments
     *
     * Use the following table to specify the location, destination, and contents of the draft review comment.
     *
     * An optional array of comments associated with the pull request.
     * Each comment provides details such as the file path, line numbers,
     * and content of the comment.
     *
     * - For single-line comments:
     *   The `line` property specifies the exact line number in the file.
     *   The `side` property indicates whether the line is from the original version (`LEFT`)
     *   or the updated version (`RIGHT`) of the file.
     *
     * - For multi-line comments:
     *   The `start_line` and `start_side` properties define the beginning of the range,
     *   while the `line` and `side` properties define the end of the range.
     *   Both the starting and ending positions can refer to either `LEFT` or `RIGHT`.
     *
     * Diff Analysis Guide:
     * 1. Use `\@\@` to locate the changed lines:
     * - Format: \@\@ -, +, \@\@
     * - Example: \@\@ -55,9 +55,9 \@\@
     * - Old file: starts at line 55, spans 9 lines.
     * - New file: starts at line 55, spans 9 lines.
     *
     * 2. Identify changes:
     * - Lines starting with `-` are removed.
     * - Lines starting with `+` are added.
     *
     * 3. Map changes to line numbers:
     * - Use `` as the base for added lines.
     * - Example: If `\@\@ -55,9 +55,9 \@\@` and the 4th line is added, it maps to line 58 (55 + 3).
     *
     * 4. Repeat for all `\@\@` blocks to track all changes.
     *
     *
     * // Example: Shortened diff snippet
     *
     * If there is no change, the line numbers of LEFT and RIGHT are treated as the same.
     * ```diff
     * \@\@ -55,9 +55,9 \@\@
     * -   "@nestia/agent": "^0.3.3", // left 55 line.
     * +   "@nestia/agent": "^0.3.6", // right 55 line.
     * -   "@nestia/sdk": "^4.5.1", // left 56 line.
     * +   "@nestia/sdk": "^4.6.0", // right 56 line.
     * \@\@ -97,7 +97,7 \@\@
     * -   "@nestia/core": "^4.5.1", // left 97 line.
     * +   "@nestia/core": "^4.6.0", // right 98 line.
     * \@\@ -114,7 +114,7 \@\@
     * -   "@wrtnio/schema": "^3.2.0", // left 114 line.
     * +   "@wrtnio/schema": "^3.2.1", // right 114 line.
     * `;
     * ```
     *
     * Analyze the diff to extract changed line numbers.
     *
     */
    comments?: IPullRequestComment[];
  }

  export interface IReadPullRequestFileOutput
    extends IGithubService.ICommonPaginationOutput {
    /**
     * @title result
     */
    result: File[];
  }

  export interface IReadPullRequestFileInput
    extends IReadPullRequestDetailInput,
      MyPick<ICommonPaginationInput, "page" | "per_page"> {}

  export interface IReadPullRequestCommitOutput
    extends IGithubService.ICommonPaginationOutput {
    /**
     * @title commit list of this pull request
     */
    result: StrictOmit<Commit, "sha">[];
  }

  export interface IReadPullRequestCommitInput
    extends IReadPullRequestDetailInput,
      MyPick<ICommonPaginationInput, "page" | "per_page"> {}

  export interface IReadPullRequestRequestedReviewerOutput {
    /**
     * @title requested reviewers
     */
    users: Collaborator[];

    /**
     * @title team
     */
    teams: MyPick<
      Team,
      | "id"
      | "name"
      | "description"
      | "notification_setting"
      | "permission"
      | "privacy"
      | "slug"
    >[];
  }

  export interface IReadPullRequestReviewOutput
    extends IGithubService.ICommonPaginationOutput {
    /**
     * @title commit list of this pull request
     */
    result: Review[];
  }

  export type AuthorAssociation =
    | "COLLABORATOR"
    | "CONTRIBUTOR"
    | "FIRST_TIMER"
    | "FIRST_TIME_CONTRIBUTOR"
    | "MANNEQUIN"
    | "MEMBER"
    | "NONE"
    | "OWNER";

  export interface Review {
    /**
     * @title id
     */
    id: number & tags.Type<"uint32">;

    /**
     * @title reviewer
     */
    user: Collaborator;

    /**
     * @title body
     */
    body: string;

    /**
     * @title state
     */
    state: string;

    /**
     * @title html_url
     */
    html_url: string & tags.Format<"iri">;

    /**
     * @title pull_request_url
     */
    pull_request_url: string & tags.Format<"iri">;

    /**
     * @title submitted_at
     */
    submitted_at?: string & tags.Format<"date-time">;

    /**
     * A commit SHA for the review.
     * If the commit object was garbage collected or forcibly deleted, then it no longer exists in Git and this value will be `null`.
     *
     * @title commit_id
     */
    commit_id: string | null;

    /**
     * @title author_association
     */
    author_association: IGithubService.AuthorAssociation;
  }

  export interface IReadPullRequestReviewInput
    extends IReadPullRequestDetailInput,
      MyPick<ICommonPaginationInput, "page" | "per_page"> {}

  export interface IRequestReviewerInput extends IReadPullRequestDetailInput {
    /**
     * An array of user logins that will be requested.
     *
     * @title reviewers
     */
    reviewers?: User["login"][];

    /**
     * An array of team slugs that will be requested.
     *
     * @title team_reviewers
     */
    team_reviewers?: Team["slug"][];
  }

  export type IReadPullRequestDetailOutput = PullRequest;

  export type IReadPullRequestDiffOutput =
    | {
        /**
         * Called diff, and if it comes out in the form of a string,
         * it's in the form of 'application/vnd.github.v3.diff'.
         *
         * Explains the GitHub diff header format, such as `-48,6 +49,8`.
         *
         * Description:
         * This format appears in GitHub code diffs to describe the location and size of changes in a file.
         * It provides information for both the original (LEFT) and modified (RIGHT) versions of the file.
         *
         * Parameters:
         * - diffHeader (string): The diff header string, such as `-48,6 +49,8`.
         *
         * Example:
         * Understanding the components of the diff header:
         * - `-48,6` refers to the LEFT side (original file):
         *    - `48`: The starting line number of the changed block in the original file.
         *    - `6`: The number of lines in the block from the original file.
         *
         * - `+49,8` refers to the RIGHT side (modified file):
         *    - `49`: The starting line number of the changed block in the modified file.
         *    - `8`: The number of lines in the block from the modified file.
         *
         * - Additional context (if any) follows the header, describing the location of changes, such as the function
         *   or class name. This is optional and may be omitted if no specific context exists.
         *
         * # Diff Analysis Guide:
         * 1. Use `\@\@` to locate the changed lines:
         * - Format: \@\@ -, +, \@\@
         * - Example: \@\@ -55,9 +55,9 \@\@
         * - Old file: starts at line 55, spans 9 lines.
         * - New file: starts at line 55, spans 9 lines.
         *
         * 2. Identify changes:
         * - Lines starting with `-` are removed.
         * - Lines starting with `+` are added.
         *
         * 3. Map changes to line numbers:
         * - Use `` as the base for added lines.
         * - Example: If `\@\@ -55,9 +55,9 \@\@` and the 4th line is added, it maps to line 58 (55 + 3).
         *
         * 4. Repeat for all `\@\@` blocks to track all changes.
         *
         *
         * // Example: Shortened diff snippet
         *
         * If there is no change, the line numbers of LEFT and RIGHT are treated as the same.
         * ```diff
         * \@\@ -55,9 +55,9 \@\@
         * -   "@nestia/agent": "^0.3.3", // left 55 line.
         * +   "@nestia/agent": "^0.3.6", // right 55 line.
         * -   "@nestia/sdk": "^4.5.1", // left 56 line.
         * +   "@nestia/sdk": "^4.6.0", // right 56 line.
         * \@\@ -97,7 +97,7 \@\@
         * -   "@nestia/core": "^4.5.1", // left 97 line.
         * +   "@nestia/core": "^4.6.0", // right 98 line.
         * \@\@ -114,7 +114,7 \@\@
         * -   "@wrtnio/schema": "^3.2.0", // left 114 line.
         * +   "@wrtnio/schema": "^3.2.1", // right 114 line.
         * `;
         * ```
         *   *
         * Notes:
         * - Ensure that the line counts (`6`, `8`) are accurate, even if newline characters are included.
         * - LEFT represents the original state of the file, and RIGHT represents the modified state.
         * - Line counts refer to consecutive lines in the changed block.
         *
         * @title Diff or Error
         */
        diff: string;
      }
    | {
        /**
         * @title Error Message
         */
        message: string;
        /**
         * @title error objects
         * @todo change to single object type
         */
        errors: Array<{
          resource: "PullRequest";
          field: "diff";
          code: "too_large";
        }> &
          tags.MinItems<1> &
          tags.MaxItems<1>;

        /**
         * @title error code
         */
        status: string;
      };

  export interface IReadPullRequestDetailInput {
    /**
     * The owner's name and the repository's name can be combined to form '${owner}/${repo}' and can be a unique path name for a single repository.
     * So the owner here is the nickname of the repository owner, not the name of the person committing or the author.
     *
     * @title owner's name
     */
    owner: User["login"];

    /**
     * @title repository name
     *
     * The owner's name and the repository's name can be combined to form '${owner}/${repo}' and can be a unique path name for a single repository.
     */
    repo: Repository["name"];

    /**
     * @title pull request number to update
     */
    pull_number: number & tags.Type<"uint64"> & tags.Minimum<1>;
  }

  export interface IGetUserOrganizationOutput
    extends IGithubService.ICommonPaginationOutput {
    /**
     * @title result
     */
    result: Organization[];
  }

  export interface IGetUserOrganizationInput
    extends IGetAuthenticatedUserOrganizationInput {
    /**
     * @title user's nickname
     */
    username: User["login"];
  }

  export interface IGetAuthenticatedUserOrganizationOutput
    extends IGithubService.ICommonPaginationOutput {
    /**
     * @title result
     */
    result: Organization[];
  }

  export interface IGetAuthenticatedUserOrganizationInput
    extends MyPick<
      IGithubService.ICommonPaginationInput,
      "page" | "per_page"
    > {}

  export type IGetRepositoryFolderStructureOutput = (
    | (RepositoryFolder & {
        /**
         * For folders, you may have other files or folders inside.
         * This should also be a folder or file type object,
         * but here, we specify it as any type to prevent it because it can be recursively infinitely large.
         *
         * @title children
         */
        children: any[];
      })
    | StrictOmit<IGithubService.RepositoryFile, "encoding" | "content">
  )[];

  export interface IGetRepositoryFolderStructureInput
    extends MyPick<IGithubService.IGetFileContentInput, "owner" | "repo"> {
    /**
     * The path delivered is treated like a Root folder and continues the navigation from this folder.
     * Browse by this folder, and it must be a folder, not a file.
     * If omitted, start the circuit based on the top Root folder.
     *
     * @title folder name
     */
    path?: string & tags.Default<"">;

    depth?: number;
    includeMediaFile?: boolean;
  }

  export type IGetFileContentOutput =
    | (StrictOmit<RepositoryFile, "encoding" | "content"> | RepositoryFolder)[]
    | RepositoryFile
    | {
        /**
         * @title type
         */
        type: "null";

        /**
         * @title size
         */
        size: 0;

        /**
         * @title message
         */
        message: "No files exist corresponding to the path.";
      };

  export type RepositoryFolder = {
    /**
     * @title type
     */
    type: "dir";

    /**
     * @title Indicates the file size in bytes
     */
    size: 0;

    /**
     * @title name of this folder
     */
    name: File["filename"];

    /**
     * @title path
     *
     * It must be unique as a path for identifying that file in the root folder.
     */
    path: string;

    /**
     * @title sha
     */
    sha: string;
  };

  export type RepositoryFile = {
    /**
     * @title type
     */
    type: "file";

    /**
     * @title encoding
     */
    encoding: string;

    /**
     * @title Indicates the file size in bytes
     */
    size: number;

    /**
     * @title name of this file
     */
    name: File["filename"];

    /**
     * @title path
     *
     * It must be unique as a path for identifying that file in the root folder.
     */
    path: string;

    /**
     * @title content
     */
    content: string;

    /**
     * @title sha
     */
    sha: string;

    /**
     * @title url
     *
     * A link that allows you to view the contents of the file as an Url value for viewing the details of the file.
     */
    url: string;

    /**
     * @title download_url
     *
     * The url that allows you to download a file, which is useful if it is a media file containing an image.
     */
    download_url?: string | null;
  };

  export type IGetReadmeFileContentOutput = RepositoryFile | null;

  export type IGetBulkFileContentOutput = IGetFileContentOutput[];

  export interface IGetBulkFileContentInput {
    /**
     * The owner's name and the repository's name can be combined to form '${owner}/${repo}' and can be a unique path name for a single repository.
     * So the owner here is the nickname of the repository owner, not the name of the person committing or the author.
     *
     * @title owner's name
     */
    owner: User["login"];

    /**
     * @title repository name
     *
     * The owner's name and the repository's name can be combined to form '${owner}/${repo}' and can be a unique path name for a single repository.
     */
    repo: Repository["name"];

    /**
     * It refers to the path of the file, and is the path of the file including folders and extensions.
     * If you want to make index.ts in src, you need to add 'src/index.ts'.
     *
     * @title path parameters
     */
    paths?: string[];

    /**
     * @title branch name
     */
    branch?: Branch["name"];
  }

  export type IGetReadmeFileContentInput = MyPick<
    IGithubService.IGetFileContentInput,
    "owner" | "repo"
  >;

  export interface IGetFileContentInput {
    /**
     * The owner's name and the repository's name can be combined to form '${owner}/${repo}' and can be a unique path name for a single repository.
     * So the owner here is the nickname of the repository owner, not the name of the person committing or the author.
     *
     * If it is an organization's repository, it can also be the name of the organization.
     *
     * @title owner's name
     */
    owner: User["login"] | Organization["login"];

    /**
     * @title repository name
     *
     * The owner's name and the repository's name can be combined to form '${owner}/${repo}' and can be a unique path name for a single repository.
     */
    repo: Repository["name"];

    /**
     * It refers to the path of the file, and is the path of the file including folders and extensions.
     * If you want to make index.ts in src, you need to add 'src/index.ts'.
     *
     * @title path parameters
     */
    path?: string;

    /**
     * @title branch name
     */
    branch?: Branch["name"];
  }

  export type IDeleteFileContentInput = StrictOmit<
    IUpdateFileContentInput,
    "content"
  >;

  export interface IGetCollaboratorOutput extends ICommonPaginationOutput {
    /**
     * @title result
     */
    result: IGithubService.Collaborator[];
  }

  export type Collaborator = MyPick<
    IGithubService.User,
    "id" | "login" | "html_url" | "avatar_url" | "type"
  >;

  export interface IGetCollaboratorInput
    extends MyPick<ICommonPaginationInput, "page" | "per_page"> {
    /**
     * The owner's name and the repository's name can be combined to form '${owner}/${repo}' and can be a unique path name for a single repository.
     * So the owner here is the nickname of the repository owner, not the name of the person committing or the author.
     *
     * @title owner's name
     */
    owner: User["login"];

    /**
     * @title repository name
     *
     * The owner's name and the repository's name can be combined to form '${owner}/${repo}' and can be a unique path name for a single repository.
     */
    repo: Repository["name"];

    /**
     * Filter collaborators returned by their affiliation.
     * outside means all outside collaborators of an organization-owned repository. direct means all collaborators with permissions to an organization-owned repository, regardless of organization membership status. all means all collaborators the authenticated user can see.
     * It must be one of: "outside", "direct", "all".
     *
     * @title affiliation
     */
    affiliation?: (
      | tags.Constant<"outside", { title: "outside" }>
      | tags.Constant<"direct", { title: "direct" }>
      | tags.Constant<"all", { title: "all" }>
    ) &
      tags.Default<"all">;

    /**
     * Filter collaborators by the permissions they have on the repository. If not specified, all collaborators will be returned.
     * It must be one of: "pull", "triage", "push", "maintain", "admin".
     *
     * @title permission
     */
    permission?:
      | tags.Constant<"pull", { title: "pull" }>
      | tags.Constant<"triage", { title: "triage" }>
      | tags.Constant<"push", { title: "push" }>
      | tags.Constant<"maintain", { title: "maintain" }>
      | tags.Constant<"admin", { title: "admin" }>;
  }

  export interface IUpdateFileContentInput extends ICreateFileContentInput {
    /**
     * As the sha value of the file to be modified, a conflict may occur if it is not the latest sha value among the sha values of the file.
     * It's safe when you look up a list of files through API to check sha and put in a value, or want to re-modify the sha value of a file you just created.
     *
     * @title sha of file content
     */
    sha: IUpsertFileContentOutput["content"]["sha"];
  }

  export interface IUpsertFileContentOutput {
    /**
     * @title content
     */
    content: {
      /**
       * @title file or folder name
       */
      name: string;

      /**
       * @title file or folder path
       */
      path: string;

      /**
       * @title sha
       */
      sha: string;

      /**
       * @title size
       */
      size: number;
    };

    /**
     * @title commit
     */
    commit: {
      /**
       * @title sha
       */
      sha: string;
    };
  }

  export interface ICreateFileContentInput {
    /**
     * The owner's name and the repository's name can be combined to form '${owner}/${repo}' and can be a unique path name for a single repository.
     * So the owner here is the nickname of the repository owner, not the name of the person committing or the author.
     *
     * @title owner's name
     */
    owner: User["login"];

    /**
     * @title repository name
     *
     * The owner's name and the repository's name can be combined to form '${owner}/${repo}' and can be a unique path name for a single repository.
     */
    repo: Repository["name"];

    /**
     * It refers to the path of the file, and is the path of the file including folders and extensions.
     * If you want to make index.ts in src, you need to add 'src/index.ts'.
     *
     * @title path parameters
     */
    path: string;

    /**
     * @title commit message
     * Many repositories are working on commit conventions. Before committing, it's a good idea to look up the commit-list to see how you leave the commit message.
     */
    message: Commit["message"];

    /**
     * Meaning of the file is text and text.
     * If you want to create code content, you should write code content.
     * Since it encodes with base64 internally, we need to deliver text here before encoding.
     *
     * @title the new file content
     */
    content: string;

    /**
     * @title branch name
     *
     * The branch name. Default: the repository’s default branch
     */
    branch?: Branch["name"];

    /**
     * If you don't put anything in, your own information will be injected, so you can leave the value alone.
     * Since the user's email cannot necessarily be guaranteed to be the same as Github's email, it is advantageous not to get confirmation from the user or put it in.
     *
     * Default: the authenticated user.
     *
     * @title The person that committed the file
     */
    committer?: {
      /**
       * @title The name of the author or committer of the commit
       */
      name: string;

      /**
       * @title The email of the author or committer of the commit
       */
      email: string;

      /**
       * @title date
       */
      date: string & tags.Format<"date-time">;
    };

    /**
     * If you don't put anything in, your own information will be injected, so you can leave the value alone.
     * Since the user's email cannot necessarily be guaranteed to be the same as Github's email, it is advantageous not to get confirmation from the user or put it in.
     *
     * Default: The committer or the authenticated user if you omit committer.
     *
     * @title The author of the file
     */
    author?: {
      /**
       * @title The name of the author or committer of the commit
       */
      name: string;

      /**
       * @title The email of the author or committer of the commit
       */
      email: string;

      /**
       * @title date
       */
      date: string & tags.Format<"date-time">;
    };
  }

  export interface IGetReceivedEventInput extends IGetEventInput {
    /**
     * @title user's nickname
     */
    username: User["login"];
  }

  export type IGetPullRequestOutput = StrictOmit<
    PullRequest,
    | "mergeable"
    | "rebaseable"
    | "mergeable_state"
    | "merged_by"
    | "maintainer_can_modify"
    | "comments"
    | "review_comments"
    | "commits"
    | "additions"
    | "deletions"
    | "changed_files"
  >[];

  export interface IGetPullRequestInput {
    /**
     * @title user's nickname
     */
    owner: User["login"];

    /**
     * @title The name of the repository
     */
    repo: Repository["name"];

    /**
     * @title commit_sha
     *
     * The SHA of the commit.
     */
    commit_sha: string;
  }
  export type IAnalyzeOutput = string[];

  export type IAnalyzeInput = StrictOmit<
    IGetRepositoryFolderStructureInput,
    "path"
  >;

  export type IGetCommitHeadOutput = {
    /**
     * @title sha
     */
    sha: Commit["sha"];

    /**
     * @title commit
     */
    commit: MyPick<
      Commit,
      "author" | "committer" | "comment_count" | "message" | "tree" | "url"
    >;

    /**
     * @title files
     */
    files: IGithubService.File[];
  };

  export interface IGetCommitHeadInput {
    /**
     * @title user's nickname
     */
    owner: User["login"];

    /**
     * @title The name of the repository
     */
    repo: Repository["name"];

    /**
     * @title commit_sha
     *
     * The SHA of the commit.
     */
    commit_sha: string;
  }

  export interface ICallInput {
    /**
     * @title github api endpoint
     */
    url: string &
      tags.Format<"uri"> &
      tags.Pattern<"^https://api.github.com/(.*)">;
  }

  export interface IGetEventOutput extends ICommonPaginationOutput {
    /**
     * @title event
     */
    result: {
      /**
       * @title id
       */
      id: string;

      /**
       * @title event type
       * There are various events such as `WatchEvent`, `CreateEvent`, `ForkEvent`.
       */
      type:
        | tags.Constant<
            "CommitCommentEvent",
            {
              title: "CommitCommentEvent";
              description: "Triggered when a comment is added to a commit.";
            }
          >
        | tags.Constant<
            "CreateEvent",
            {
              title: "CreateEvent";
              description: "Triggered when a new branch, tag, or repository is created.";
            }
          >
        | tags.Constant<
            "DeleteEvent",
            {
              title: "DeleteEvent";
              description: "Triggered when a branch or tag is deleted.";
            }
          >
        | tags.Constant<
            "ForkEvent",
            {
              title: "ForkEvent";
              description: "Triggered when a user forks a repository.";
            }
          >
        | tags.Constant<
            "GollumEvent",
            {
              title: "GollumEvent";
              description: "Triggered when a Wiki page is created or updated.";
            }
          >
        | tags.Constant<
            "IssueCommentEvent",
            {
              title: "IssueCommentEvent";
              description: "Triggered when a comment is added to an issue.";
            }
          >
        | tags.Constant<
            "IssuesEvent",
            {
              title: "IssuesEvent";
              description: "Triggered when an issue is opened, edited, or closed.";
            }
          >
        | tags.Constant<
            "MemberEvent",
            {
              title: "MemberEvent";
              description: "Triggered when a user is added as a collaborator to a repository.";
            }
          >
        | tags.Constant<
            "PublicEvent",
            {
              title: "PublicEvent";
              description: "Triggered when a private repository is made public.";
            }
          >
        | tags.Constant<
            "PullRequestEvent",
            {
              title: "PullRequestEvent";
              description: "Triggered when a pull request is opened, edited, merged, or closed.";
            }
          >
        | tags.Constant<
            "PullRequestReviewEvent",
            {
              title: "PullRequestReviewEvent";
              description: "Triggered when a review is submitted for a pull request.";
            }
          >
        | tags.Constant<
            "PullRequestReviewCommentEvent",
            {
              title: "PullRequestReviewCommentEvent";
              description: "Triggered when a comment is added to a pull request's review.";
            }
          >
        | tags.Constant<
            "PullRequestReviewThreadEvent",
            {
              title: "PullRequestReviewThreadEvent";
              description: "Triggered when a review thread in a pull request has a change.";
            }
          >
        | tags.Constant<
            "PushEvent",
            {
              title: "PushEvent";
              description: "Triggered when commits are pushed to a repository.";
            }
          >
        | tags.Constant<
            "ReleaseEvent",
            {
              title: "ReleaseEvent";
              description: "Triggered when a release is published.";
            }
          >
        | tags.Constant<
            "SponsorshipEvent",
            {
              title: "SponsorshipEvent";
              description: "Triggered when a sponsorship is started or modified.";
            }
          >
        | tags.Constant<
            "WatchEvent",
            {
              title: "WatchEvent";
              description: "Triggered when a user stars a repository.";
            }
          >
        | null;

      /**
       * @title user
       */
      actor: MyPick<User, "id" | "login">;

      /**
       * @title repo
       */
      repo: MyPick<Repository, "id" | "name">;

      /**
       * @title org
       */
      org?: MyPick<Organization, "id" | "display_login" | "login">;

      /**
       * @@title payload
       */
      payload: IGithubService.Payload;

      /**
       * @title whather is public
       */
      public: boolean;

      /**
       * @title created_at
       */
      created_at: (string & tags.Format<"date-time">) | null;
    }[];
  }

  export type IGetOrganizationUserEventInput = IGetOrganizationEventInput;

  export interface IGetOrganizationEventInput extends IGetEventInput {
    /**
     * @title organization's name
     *
     * You can also change it to your nickname.
     */
    organization: Organization["login"];
  }

  export interface IGetRepoEventInput extends IGetUserEventInput {
    /**
     * @title The name of the repository
     */
    repo: Repository["name"];
  }

  export interface IGetUserEventInput extends IGetEventInput {
    /**
     * @title user's nickname
     */
    username: User["login"];
  }

  export interface IGetEventInput
    extends StrictOmit<ICommonPaginationInput, "order"> {}

  export interface IGetRepositoryActivityOutput
    extends ICommonPaginationOutput {
    /**
     * @title result of repository activities
     */
    result: Activity[];
  }

  export interface IGetRepositoryActivityInput
    extends StrictOmit<ICommonPaginationInput, "order" | "page"> {
    /**
     * The order to sort by.
     * Default: asc when using full_name, otherwise desc.
     *
     * @title direction
     */
    direction?: ICommonPaginationInput["order"];

    /**
     * A cursor, as given in the Link header.
     * If specified, the query only searches for results before this cursor.
     *
     * @title before
     */
    before?: IGetRepositoryActivityOutput["before"];

    /**
     * A cursor, as given in the Link header.
     * If specified, the query only searches for results after this cursor.
     *
     * @title after
     */
    after?: IGetRepositoryActivityOutput["after"];

    /**
     * @title user's nickname
     */
    owner: User["login"];

    /**
     * @title The name of the repository
     */
    repo: Repository["name"];

    /**
     * @title ref
     *
     * The name of one of the branches of this repository.
     */
    ref?: Branch["name"];

    /**
     * @title username
     */
    actor?: User["login"];

    /**
     * @title time_period
     */
    time_period?: "day" | "week" | "month" | "quarter" | "year";

    /**
     * @title activity_type
     */
    activity_type?: Activity["activity_type"];
  }

  export interface IGetFolloweeOutput extends ICommonPaginationOutput {
    /**
     * @title followees
     */
    result: MyPick<User, "id" | "login" | "avatar_url" | "html_url">[];
  }

  export type IUpdateIssueOutput = IGithubService.Issue;

  export interface IUpdateIssueInput
    extends PickPartial<ICreateIssueInput, "title"> {
    /**
     * @title issue number to update
     */
    issue_number: number & tags.Type<"uint64"> & tags.Minimum<1>;
  }

  export type ICreateIssueOutput = IGithubService.Issue;

  export interface ICreateIssueInput {
    /**
     * @title user's nickname
     */
    owner: User["login"];

    /**
     * @title The name of the repository
     */
    repo: Repository["name"];

    /**
     * @title tite of this issue
     */
    title: string;

    /**
     * It can be markdown format
     * If you provide text in utf-8 format, which can be recognized by a person, in markdown format, it will be written as it is.
     *
     * @title body of this issue
     */
    body?: string;

    /**
     * @title assignees
     *
     * Deliver the user nickname to be designated as the person in charge in the array.
     */
    assignees?: User["login"][];

    /**
     * @title labels
     */
    labels?: string[];
  }

  export interface IGetFolloweeInput extends ICommonPaginationInput {
    /**
     * @title user's nickname
     */
    username: User["login"];
  }

  export interface IGetLabelOutput extends ICommonPaginationOutput {
    /**
     * @title result
     */
    result: IGithubService.Label[];
  }

  export type Label = {
    /**
     * @title label name
     */
    name: string;

    /**
     * @title color
     */
    color: string;

    /**
     * @title default
     *
     * True if it is not created by the user but automatically created from the beginning.
     */
    default: boolean;

    /**
     * @title description
     */
    description: string | null;
  };

  export interface IGetLabelInput
    extends MyPick<ICommonPaginationInput, "per_page" | "page"> {
    /**
     * @title user's nickname
     */
    owner: User["login"];

    /**
     * @title The name of the repository
     */
    repo: Repository["name"];
  }

  export interface IGetFollowerOutput extends ICommonPaginationOutput {
    /**
     * @title followers
     */
    result: MyPick<User, "id" | "login" | "avatar_url" | "html_url">[];
  }

  export interface IGetFollowerInput extends ICommonPaginationInput {
    /**
     * @title user's nickname
     */
    username: User["login"];
  }

  export interface IGetCommitListOutput extends ICommonPaginationOutput {
    /**
     * @title commit list
     */
    result: {
      /**
       * @title sha
       */
      sha: Commit["sha"];

      /**
       * @title commit
       */
      commit: MyPick<Commit, "url" | "author" | "committer" | "message">;
    }[];
  }

  export interface IGetCommitListInput extends ICommonPaginationInput {
    /**
     * @title user's nickname
     */
    owner: User["login"];

    /**
     * @title The name of the repository
     */
    repo: Repository["name"];

    /**
     * @title sha
     *
     * SHA or branch to start listing commits from. Default: the repository’s default branch (usually main).
     */
    sha?: string;

    /**
     * @title path
     *
     * Only commits containing this file path will be returned.
     */
    path?: string;

    /**
     * @title author
     *
     * GitHub username or email address to use to filter by commit author.
     */
    author?: string;

    /**
     * @title committer
     *
     * GitHub username or email address to use to filter by commit committer.
     */
    committer?: string;

    /**
     * @title since
     *
     * Only show results that were last updated after the given time. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ. Due to limitations of Git, timestamps must be between 1970-01-01 and 2099-12-31 (inclusive) or unexpected results may be returned.
     */
    since?: string & tags.Format<"date-time">;

    /**
     * @title until
     *
     * Only commits before this date will be returned. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ. Due to limitations of Git, timestamps must be between 1970-01-01 and 2099-12-31 (inclusive) or unexpected results may be returned.
     */
    until?: string & tags.Format<"date-time">;
  }

  export interface IGetCommitOutput {
    /**
     * @title hash of this commit
     */
    sha: string;

    /**
     * @title commit
     */
    commit: StrictOmit<Commit, "sha">;

    /**
     * @title html_url
     */
    html_url: string & tags.Format<"iri">;

    /**
     * @title Parents of this commit
     */
    parents: MyPick<Commit, "sha">[];

    /**
     * @title stats
     */
    stats: {
      /**
       * @title sum of additions and deletions
       */
      total: number & tags.Type<"uint64">;

      /**
       * @title lines of additions
       */
      additions: number & tags.Type<"uint64">;

      /**
       * @title lines of deletions
       */
      deletions: number & tags.Type<"uint64">;
    };

    /**
     * @title files
     *
     * You can see the changes for each file.
     */
    files: IGithubService.File[];
  }

  export interface IGetCommitInput {
    /**
     * @title user's nickname
     */
    owner: User["login"];

    /**
     * @title The name of the repository
     */
    repo: Repository["name"];

    /**
     * @title commit hash or branch name
     */
    ref?: string;
  }

  export interface IGetBranchOutput extends ICommonPaginationOutput {
    /**
     * @title branches
     */
    result: IGithubService.Branch[];
  }

  export interface IGetBranchInput
    extends StrictOmit<ICommonPaginationInput, "order"> {
    /**
     * @title user's nickname
     */
    owner: User["login"];

    /**
     * @title The name of the repository
     */
    repo: Repository["name"];
  }

  export interface ICreateBranchOutput {
    /**
     * @title ref
     */
    ref: string;

    /**
     * @title object
     */
    object: {
      /**
       * @title type
       */
      type: "commit";

      /**
       * @title sha
       */
      sha: Commit["sha"];
    };
  }

  export interface ICreateBranchInput {
    /**
     * @title user's nickname
     */
    owner: User["login"];

    /**
     * @title The name of the repository
     */
    repo: Repository["name"];

    /**
     * @title ref
     * The name of the fully qualified reference (ie: refs/heads/master). If it doesn't start with 'refs' and have at least two slashes, it will be rejected.
     */
    ref: string;

    /**
     * @title sha
     * The SHA1 value for this reference.
     */
    sha: string;
  }

  export interface IGetOrganizationRepositoryOutput
    extends ICommonPaginationOutput {
    /**
     * @title repositories
     */
    result: IGithubService.Repository[];
  }

  export interface IGetOrganizationRepositoryInput extends IGetRepositoryInput {
    /**
     * @title organization
     *
     * This refers to the name of the organization who will look up the repository.
     */
    organization: string;
  }

  export type IGetUserPinnedRepositoryOutput = Repository["name"][];

  export type IGetUserPinnedRepositoryInput = MyPick<
    IGetUserRepositoryInput,
    "username"
  >;

  export interface IGetUserRepositoryOutput extends ICommonPaginationOutput {
    /**
     * @title repositories
     */
    result: IGithubService.RepositoryWithReadmeFile[];
  }

  export interface RepositoryWithReadmeFile extends Repository {
    /**
     * @title readme
     */
    readme: IGetReadmeFileContentOutput | null;
  }

  export interface IGetUserRepositoryInput extends IGetRepositoryInput {
    /**
     * @title username
     *
     * This refers to the nickname of the user who will look up the repository.
     */
    username: string;
  }

  export interface IGetRepositoryInput
    extends StrictOmit<ICommonPaginationInput, "order" | "per_page"> {
    /**
     * The number of results per page (max 10).
     *
     * The response capacity may be very large because it even comes out with the reedy of the repository.
     * Therefore, it is recommended to check by cutting up to 10 pieces.
     *
     * @title per_page
     */
    per_page?: number &
      tags.Type<"uint64"> &
      tags.Default<10> &
      tags.Maximum<10>;

    /**
     * The property to sort the results by.
     * It must be one of: "created" | "updated" | "pushed" | "full_name"
     *
     * @title sorting condition
     */
    sort?: ("created" | "updated" | "pushed" | "full_name") &
      tags.Default<"full_name">;

    /**
     * The order to sort by.
     * Default: asc when using full_name, otherwise desc.
     *
     * @title direction
     */
    direction?: ICommonPaginationInput["order"];

    /**
     * @title since
     * Only show repositories updated after the given time. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ.
     */
    since?: string & tags.Format<"date-time">;

    /**
     * @title before
     * Only show repositories updated before the given time. This is a timestamp in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ.
     */
    before?: string & tags.Format<"date-time">;
  }

  export interface IGetRepositoryIssueOutput extends ICommonPaginationOutput {
    result: IGithubService.Issue[];
  }

  export type IUpdatePullRequestOutput = MyPick<
    PullRequest,
    "title" | "number" | "id"
  >;

  export interface IUpdatePullRequestInput
    extends PickPartial<ICreatePullRequestInput, "head" | "base">,
      MyPick<IUpdateIssueInput, "labels"> {
    /**
     * @title pull request number to update
     */
    pull_number: number & tags.Type<"uint64"> & tags.Minimum<1>;

    /**
     * State of this Pull Request. Either open or closed.
     * Can be one of: open, closed
     *
     * @title state
     */
    state?:
      | tags.Constant<"open", { title: "open" }>
      | tags.Constant<"closed", { title: "closed" }>;
  }

  export type ICreatePullRequestOutput = MyPick<
    PullRequest,
    "title" | "number" | "id"
  >;

  export interface ICreatePullRequestInput {
    /**
     * The owner's name and the repository's name can be combined to form '${owner}/${repo}' and can be a unique path name for a single repository.
     * So the owner here is the nickname of the repository owner, not the name of the person committing or the author.
     *
     * @title owner's name
     */
    owner: User["login"];

    /**
     * @title repository name
     *
     * The owner's name and the repository's name can be combined to form '${owner}/${repo}' and can be a unique path name for a single repository.
     */
    repo: Repository["name"];

    /**
     * @title title
     *
     * The title of the new pull request. Required unless issue is specified.
     */
    title?: string;

    /**
     * @title head
     *
     * The name of the branch where your changes are implemented. For cross-repository pull requests in the same network, namespace head with a user like this: username:branch.
     */
    head: string;

    /**
     * @title head_repo
     *
     * The name of the repository where the changes in the pull request were made. This field is required for cross-repository pull requests if both repositories are owned by the same organization.
     */
    head_repo?: string;

    /**
     * @title base
     *
     * The name of the branch you want the changes pulled into. This should be an existing branch on the current repository. You cannot submit a pull request to one repository that requests a merge to a base of another repository.
     */
    base: string;

    /**
     * @title body
     *
     * The contents of the pull request.
     */
    body?: string;

    /**
     * @title maintainer_can_modify
     *
     * Indicates whether maintainers can modify the pull request.
     */
    maintainer_can_modify?: boolean;

    /**
     * @title draft
     *
     * Indicates whether the pull request is a draft. See "Draft Pull Requests" in the GitHub Help documentation to learn more.
     */
    draft?: boolean;

    /**
     * @title issue
     *
     * An issue in the repository to convert to a pull request. The issue title, body, and comments will become the title, body, and comments on the new pull request. Required unless title is specified.
     */
    issue?: number;
  }

  export type IFetchRepositoryOutput =
    | {
        /**
         * @title issues
         */
        fetchedIssues: StrictOmit<FetchedIssue, "body">[];

        /**
         * @title page info
         */
        pageInfo: {
          /**
           * @title Cursor to be used to look up the next page
           */
          endCursor?: string;
          /**
           * @title hasNextPage
           *
           * true if there is a next page
           */
          hasNextPage: boolean;
        };
      }
    | {
        /**
         * @title Error Message
         */
        error_message: string;
      };

  export interface FetchedIssue
    extends MyPick<Issue, "number" | "title" | "body"> {
    /**
     * @title issue id
     */
    id: string;

    /**
     * @title issue state
     */
    state: IFetchRepositoryInput["state"];

    /**
     * @title reason of state
     */
    stateReason?: string | null;

    /**
     * @title issue title
     */
    title: string;

    /**
     * @title comments
     */
    comments: {
      /**
       * @title total count of comments
       */
      totalCount: number & tags.Minimum<0>;
    };

    /**
     * @title reactions
     */
    reactions: {
      /**
       * @title total count of reactions
       */
      totalCount: number & tags.Minimum<0>;
    };

    /**
     * @title labels
     */
    labels: {
      /**
       * @title nodes
       */
      nodes: MyPick<Label, "name" | "description">[];
    };

    /**
     * @title assignees
     */
    assignees: {
      /**
       * @title nodes
       */
      nodes: MyPick<User, "login">[];
    };

    /**
     * @title author
     */
    author: MyPick<User, "login">;

    /**
     * @title createdAt
     */
    createdAt: string & tags.Format<"date-time">;

    /**
     * @title updatedAt
     */
    updatedAt: string & tags.Format<"date-time">;
  }

  export interface IFetchRepositoryPullRequestOutput {
    /**
     * @title Pull Requests
     */
    pullRequests: FetchedPullRequest[];

    /**
     * @title page info
     */
    pageInfo: {
      /**
       * @title Cursor to be used to look up the next page
       */
      endCursor?: string;
      /**
       * @title hasNextPage
       *
       * true if there is a next page
       */
      hasNextPage: boolean;
    };
  }

  export interface FetchedPullRequest {
    /**
     * @title issue id
     */
    id: string;

    /**
     * @title issue state
     */
    state: IFetchRepositoryInput["state"];

    /**
     * @title number of pull request
     */
    number: PullRequest["number"];

    /**
     * @title Pull request title
     */
    title: string;

    /**
     * @title comments
     */
    comments: {
      /**
       * @title total count of comments
       */
      totalCount: number & tags.Minimum<0>;
    };

    /**
     * @title reviews
     */
    reviews: {
      /**
       * @title total counr of reviews
       */
      totalCount: number & tags.Minimum<0>;
    };

    /**
     * @title reactions
     */
    reactions: {
      /**
       * @title total count of reactions
       */
      totalCount: number & tags.Minimum<0>;
    };

    /**
     * @title labels
     */
    labels: {
      nodes: MyPick<Label, "name" | "description">[];
    };

    /**
     * @title assignees
     */
    assignees: {
      /**
       * @title nodes
       */
      nodes: MyPick<User, "login">[];
    };

    /**
     * @title author
     */
    author: MyPick<User, "login">;

    /**
     * @title createdAt
     */
    createdAt: string & tags.Format<"date-time">;

    /**
     * @title updatedAt
     */
    updatedAt: string & tags.Format<"date-time">;
  }

  export interface IFetchRepositoryPullRequestInput
    extends MyPick<
      IFetchRepositoryInput,
      "owner" | "repo" | "per_page" | "after" | "state" | "labels" | "direction"
    > {
    /**
     * @title sort
     * It must be one of: "CREATED_AT", "UPDATED_AT".
     */
    sort:
      | tags.Constant<"CREATED_AT", { title: "CREATED_AT" }>
      | tags.Constant<"UPDATED_AT", { title: "UPDATED_AT" }>;
  }

  export type IGetIssueDetailOutput = DetailedIssue;

  export interface DetailedIssue extends IGithubService.Issue {
    /**
     * @title milestone
     */
    milestone: MileStone | null;

    /**
     * @title reactions
     */
    reactions: {
      /**
       * @title total_count
       */
      total_count: number & tags.Type<"uint64">;

      /**
       * @title "+1"
       */
      "+1": number & tags.Type<"uint64">;

      /**
       * @title "-1"
       */
      "-1": number & tags.Type<"uint64">;

      /**
       * @title laugh
       */
      laugh: number & tags.Type<"uint64">;

      /**
       * @title hooray
       */
      hooray: number & tags.Type<"uint64">;

      /**
       * @title confused
       */
      confused: number & tags.Type<"uint64">;

      /**
       * @title heart
       */
      heart: number & tags.Type<"uint64">;

      /**
       * @title rocket
       */
      rocket: number & tags.Type<"uint64">;

      /**
       * @title eyes
       */
      eyes: number & tags.Type<"uint64">;
    };

    /**
     * @title closed_by
     */
    closed_by?: MyPick<User, "id" | "login" | "type"> | null;
  }

  export interface IGetIssueCommentsOutput
    extends IGithubService.ICommonPaginationOutput {
    /**
     * @title issue comments
     */
    result: IssueComment[];
  }

  export interface IssueComment
    extends StrictOmit<IGithubService.Comment, "pages"> {
    /**
     * @title issue_url
     */
    issue_url: string & tags.Format<"iri">;

    /**
     * @title author_association
     */
    author_association: AuthorAssociation;
  }

  export interface IGetPullRequestCommentsInput
    extends IReadPullRequestDetailInput,
      MyPick<ICommonPaginationInput, "page" | "per_page"> {}

  export type ICreateIssueCommentOutput = IssueComment;

  export interface ICreateIssueCommentInput extends IGetIssueDetailInput {
    /**
     * @title The contents of the comment
     */
    body: string;
  }

  export interface IGetIssueCommentsInput
    extends IGetIssueDetailInput,
      MyPick<ICommonPaginationInput, "page" | "per_page"> {}

  export interface IGetIssueDetailInput {
    /**
     * @title issue number to get detailed info
     */
    issue_number: Issue["number"];

    /**
     * The owner's name and the repository's name can be combined to form '${owner}/${repo}' and can be a unique path name for a single repository.
     * So the owner here is the nickname of the repository owner, not the name of the person committing or the author.
     *
     * @title owner's name
     */
    owner: User["login"];

    /**
     * @title repository name
     *
     * The owner's name and the repository's name can be combined to form '${owner}/${repo}' and can be a unique path name for a single repository.
     */
    repo: Repository["name"];
  }

  export interface IFetchRepositoryInput {
    /**
     * @title after
     * cursor of next page
     */
    after?: string;

    /**
     * If you want to filter the issue by label, pass the string.
     * If it is an empty array, it is ignored.
     *
     * @title labels
     */
    labels?: Label["name"][];

    /**
     * The number of results per page (max 100).
     *
     * @title per_page
     */
    per_page?: ICommonPaginationInput["per_page"];

    /**
     * If you don't want to filter, you don't put anything in.
     * It must be one of: "OPEN", "CLOSED", "MERGED".
     *
     * @title state
     */
    state?:
      | tags.Constant<"OPEN", { title: "OPEN" }>
      | tags.Constant<"CLOSED", { title: "CLOSED" }>
      | tags.Constant<"MERGED", { title: "MERGED" }>;

    /**
     * @title direction
     * It must be one of: "ASC", "DESC".
     */
    direction:
      | tags.Constant<"ASC", { title: "ASC" }>
      | tags.Constant<"DESC", { title: "DESC" }>;

    /**
     * @title condition of direction
     * It must be one of: "CREATED_AT", "UPDATED_AT", "COMMENTS".
     */
    sort:
      | tags.Constant<"CREATED_AT", { title: "CREATED_AT" }>
      | tags.Constant<"UPDATED_AT", { title: "UPDATED_AT" }>
      | tags.Constant<"COMMENTS", { title: "COMMENTS" }>;

    /**
     * The owner's name and the repository's name can be combined to form '${owner}/${repo}' and can be a unique path name for a single repository.
     * So the owner here is the nickname of the repository owner, not the name of the person committing or the author.
     *
     * @title owner's name
     */
    owner: User["login"];

    /**
     * @title repository name
     *
     * The owner's name and the repository's name can be combined to form '${owner}/${repo}' and can be a unique path name for a single repository.
     */
    repo: Repository["name"];
  }

  export interface IGetRepositoryIssueInput
    extends StrictOmit<
      IGetAuthenticatedUserIssueInput,
      "filter" | "owned" | "pulls"
    > {
    /**
     * The owner's name and the repository's name can be combined to form '${owner}/${repo}' and can be a unique path name for a single repository.
     * So the owner here is the nickname of the repository owner, not the name of the person committing or the author.
     *
     * @title owner's name
     */
    owner: User["login"];

    /**
     * @title repository name
     *
     * The owner's name and the repository's name can be combined to form '${owner}/${repo}' and can be a unique path name for a single repository.
     */
    repo: Repository["name"];
  }

  export interface IGetOrganizationAuthenticationUserIssueOutput
    extends ICommonPaginationOutput {
    /**
     * @title Issues
     */
    result: IGithubService.Issue[];
  }

  export interface IGetOrganizationAuthenticationUserIssueInput
    extends IGetAuthenticatedUserIssueInput {
    /**
     * @title organization
     * The organization name. The name is not case sensitive.
     */
    organization: string;
  }

  export interface IGetAuthenticatedUserIssueOutput
    extends ICommonPaginationOutput {
    result: IGithubService.Issue[];
  }

  export interface IGetAuthenticatedUserIssueInput
    extends MyPick<ICommonPaginationInput, "page" | "per_page"> {
    /**
     * The order to sort by.
     * Default: asc when using full_name, otherwise desc.
     *
     * @title direction
     */
    direction?: ICommonPaginationInput["order"];

    /**
     * It must be one of: "assigned", "created", "mentioned", "subscribed", "repos", "all"
     *
     * Indicates which sorts of issues to return.
     * assigned means issues assigned to you.
     * created means issues created by you.
     * mentioned means issues mentioning you.
     * subscribed means issues you're subscribed to updates for.
     * all or repos means all issues you can see, regardless of participation or creation.
     *
     * @title filter
     */
    filter?: (
      | tags.Constant<
          "assigned",
          {
            title: "assigned";
            description: "Indicates which sorts of issues to return.";
          }
        >
      | tags.Constant<
          "created",
          {
            title: "created";
            description: "assigned means issues assigned to you.";
          }
        >
      | tags.Constant<
          "mentioned",
          {
            title: "mentioned";
            description: "created means issues created by you.";
          }
        >
      | tags.Constant<
          "subscribed",
          {
            title: "subscribed";
            description: "mentioned means issues mentioning you.";
          }
        >
      | tags.Constant<
          "repos",
          {
            title: "repos";
            description: "subscribed means issues you're subscribed to updates for.";
          }
        >
      | tags.Constant<
          "all",
          {
            title: "all";
            description: "all or repos means all issues you can see, regardless of participation or creation.";
          }
        >
    ) &
      tags.Default<"assigned">;

    /**
     * Indicates the state of the issues to return.
     * It must be one of: 'open', 'closed', 'all'
     *
     * @title state
     */
    state?: (
      | tags.Constant<"open", { title: "open" }>
      | tags.Constant<"closed", { title: "closed" }>
      | tags.Constant<"all", { title: "all" }>
    ) &
      tags.Default<"open">;

    /**
     * @title label
     *
     * A list of comma separated label names. Example: `bug,ui,@high`
     */
    labels?: string;

    /**
     * @title sort
     * It must be 'created', 'updated', 'comments'
     */
    sort?: (
      | tags.Constant<"created", { title: "created" }>
      | tags.Constant<"updated", { title: "updated" }>
      | tags.Constant<"comments", { title: "comments" }>
    ) &
      tags.Default<"created">;

    /**
     * @title owned
     */
    owned?: boolean;

    /**
     * @title pulls
     */
    pulls?: boolean;
  }

  export interface IGetUserProfileOutput
    extends MyPick<User, "id" | "login" | "avatar_url" | "type"> {
    /**
     * @title name
     * It means the actual name that the user has written, not the user's nickname.
     */
    name?: string | null;

    /**
     * As the name of the company,
     * it cannot be said to be the exact name listed as the business operator because it was written by the user himself.
     * Also, we cannot guarantee that the user wrote the company name.
     * Sometimes the user jokingly writes down strange names.
     *
     * @title comany name
     */
    company?: string | null;

    /**
     * @title blog
     *
     * Indicates the blog address.
     */
    blog?: string | null;

    /**
     * It means the location of the user.
     * Usually, I write the country down, but the user can jokingly record the strange location.
     *
     * @title location
     */
    location?: string | null;

    /**
     * @title email address
     */
    email?: string | null;

    /**
     * @title bio
     *
     * Write down what the user wants to say or a history.
     */
    bio?: string | null;

    /**
     * @title twitter_username
     */
    twitter_username?: string | null;

    /**
     * @title count of public repos
     */
    public_repos: number & tags.Type<"uint64">;

    /**
     * @title count of public gists
     */
    public_gists: number & tags.Type<"uint64">;

    /**
     * @title count of followers
     */
    followers: number & tags.Type<"uint64">;

    /**
     * @title count of follwing
     */
    following: number & tags.Type<"uint64">;

    /**
     * @title created_at
     */
    created_at: string & tags.Format<"date-time">;

    /**
     * @title updated_at
     */
    updated_at: string & tags.Format<"date-time">;

    /**
     * @title profile_repo
     */
    profile_repository: IGithubService.ProfileRepository | null;

    /**
     * @title pinned_repositories
     * It is a repository where the user puts a pin on his profile, which is usually used to display his or her proud history.
     */
    pinned_repositories: IGithubService.IGetUserPinnedRepositoryOutput;
  }

  export interface IGetUserProfileInput {
    /**
     * @title username
     */
    username: string;
  }

  export interface ISearchUserOutput extends ICommonPaginationOutput {
    /**
     * @title User Search Result Item
     *
     * User Search Result Item
     */
    result: IGithubService.User[];
  }

  export interface ISearchUserInput extends ICommonPaginationInput {
    /**
     * The query contains one or more search keywords and qualifiers.
     * Qualifiers allow you to limit your search to specific areas of GitHub.
     * The REST API supports the same qualifiers as the web interface for GitHub.
     *
     * @title keyword
     */
    q: string;

    /**
     * Sorts the results of your query by number of followers or repositories, or when the person joined GitHub. Default: best match
     * It must be one of this: "followers" | "repositories" | "joined"
     *
     * @title sorting condition
     */
    sort?: "followers" | "repositories" | "joined";
  }

  export type User = {
    /**
     * This means the user's nickname.
     * In github, nicknames are unique at least until that user changes their own nickname.
     * This means that only one person can own the nickname at a time.
     * Therefore, it may be important to know the exact nickname because the github API calls the appi using the user's nickname.
     *
     * @title login
     */
    login: string;

    /**
     * @title id
     *
     * This means the user's ID.
     */
    id: number;

    /**
     * @title avatar url
     *
     * This means the user's profile image.
     */
    avatar_url: string & tags.Format<"iri">;

    /**
     * @title html_url
     *
     * If you want to look up your profile, you can access this website.
     */
    html_url: string & tags.Format<"iri">;

    /**
     * @title type
     */
    type: "User" | "Bot" | "Organization";

    /**
     * @title score
     */
    score: number;
  };

  export type Repository = {
    /**
     * @title id
     */
    id: number;

    /**
     * @title name
     */
    name: string;

    /**
     * @title full_name
     *
     * This is in the form '{username}/{reponame}'.
     */
    full_name: string;

    /**
     * @title private
     */
    private: boolean;

    /**
     * @title html_url
     */
    html_url: string & tags.Format<"iri">;

    /**
     * @title description
     */
    description: string | null;

    /**
     * @title fork
     */
    fork: boolean;

    /**
     * @title forks_count
     */
    forks_count: number & tags.Type<"uint64">;

    /**
     * @title stargazers_count
     */
    stargazers_count: number & tags.Type<"uint64">;

    /**
     * @title watchers_count
     */
    watchers_count: number & tags.Type<"uint64">;

    /**
     * @title size
     */
    size: number;

    /**
     * @title default_branch
     */
    default_branch: string;

    /**
     * @title open_issues_count
     */
    open_issues_count: number & tags.Type<"uint64">;

    /**
     * @title is_template
     */
    is_template: boolean;

    /**
     * @title topics
     */
    topics: string[];

    /**
     * @title has_issues
     */
    has_issues: boolean;

    /**
     * @title has_projects
     */
    has_projects: boolean;

    /**
     * @title has_wiki
     */
    has_wiki: boolean;

    /**
     * @title has_pages
     */
    has_pages: boolean;

    /**
     * @title has_downloads
     */
    has_downloads: boolean;

    /**
     * @title archived
     */
    archived: boolean;

    /**
     * @title disabled
     */
    disabled: boolean;

    /**
     * @title visibility
     */
    visibility: "public" | "private";

    /**
     * @title pushed_at
     */
    pushed_at: string & tags.Format<"date-time">;

    /**
     * @title created_at
     */
    created_at: string & tags.Format<"date-time">;

    /**
     * @title updated_at
     */
    updated_at: string & tags.Format<"date-time">;

    /**
     * @title permissions
     */
    permissions?: {
      /**
       * @title admin
       */
      admin: boolean;

      /**
       * @title push
       */
      push: boolean;

      /**
       * @title pull
       */
      pull: boolean;
    };

    /**
     * @title allow_rebase_merge
     */
    allow_rebase_merge?: boolean;

    /**
     * @title allow_squash_merge
     */
    allow_squash_merge?: boolean;

    /**
     * @title allow_auto_merge
     */
    allow_auto_merge?: boolean;

    /**
     * @title delete_branch_on_merge
     */
    delete_branch_on_merge?: boolean;

    /**
     * @title allow_merge_commit
     */
    allow_merge_commit?: boolean;

    /**
     * @title subscribers_count
     */
    subscribers_count?: number & tags.Type<"uint64">;

    /**
     * @title network_count
     */
    network_count?: number & tags.Type<"uint64">;

    /**
     * @title license
     */
    license: null | {
      /**
       * @title key
       */
      key: string;

      /**
       * @title name
       */
      name: string;

      /**
       * @title url
       */
      url: string | null;

      /**
       * @title spdx_id
       */
      spdx_id: string;
    };

    /**
     * @title forks
     */
    forks: number & tags.Type<"uint64">;

    /**
     * @title open_issues
     */
    open_issues: number & tags.Type<"uint64">;

    /**
     * @title watchers
     */
    watchers: number & tags.Type<"uint64">;
  };

  export type Branch = {
    /**
     * @title name of Branch
     */
    name: string;

    /**
     * In github, branch is just another name for the last node of a commit,
     * so this property called commit is logically the same as what it means for that branch.
     *
     * @title commit
     */
    commit: StrictOmit<IGithubService.Commit, "sha">;
  };

  export type Commit = {
    /**
     * @title hash of this commit
     */
    sha: string;

    /**
     * @title uri
     *
     * uri to look up details of commitment
     */
    url: string & tags.Format<"iri">;

    /**
     * @title author
     */
    author: {
      /**
       * @title name
       */
      name: string;

      /**
       * @title email
       */
      email: string;

      /**
       * @title date
       */
      date: string & tags.Format<"date-time">;
    };

    /**
     * @title committer
     */
    committer: {
      /**
       * @title name
       */
      name: string;

      /**
       * @title email
       */
      email: string;

      /**
       * @title date
       */
      date: string & tags.Format<"date-time">;
    };

    /**
     * @title commit message
     */
    message: string;

    /**
     * @title tree
     */
    tree: {
      /**
       * @title sha
       */
      sha: string;

      /**
       * @title url
       */
      url: string & tags.Format<"iri">;
    };

    /**
     * @title comment_count
     */
    comment_count: number & tags.Type<"uint64">;
  };

  export type Activity = {
    /**
     * @title id
     */
    id: number;

    /**
     * @title ref
     */
    ref: string;

    /**
     * @title timestamp
     */
    timestamp: string & tags.Format<"date-time">;

    /**
     * @title activity type
     */
    activity_type:
      | tags.Constant<"push", { title: "push" }>
      | tags.Constant<"force_push", { title: "force_push" }>
      | tags.Constant<"branch_creation", { title: "branch_creation" }>
      | tags.Constant<"branch_deletion", { title: "branch_deletion" }>
      | tags.Constant<"pr_merge", { title: "pr_merge" }>
      | tags.Constant<"merge_queue_merge", { title: "merge_queue_merge" }>;

    /**
     * @title actor
     */
    actor: MyPick<User, "id" | "login" | "avatar_url" | "type">;
  };

  export type Organization = {
    /**
     * @title id
     */
    id: number;

    /**
     * @title login
     */
    login: string;

    /**
     * @title display_login
     */
    display_login?: string;

    /**
     * @title description
     */
    description?: string;
  };

  export type Issue = {
    /**
     * @title issue id
     */
    id: number & tags.Type<"uint64">;

    /**
     * If you want to see the issue or pull_request on the web, you can go to this link.
     * If pull is included on this link path, it is pull_request, and if issue is included, it is issue.
     * In essence, pull_request and issue are numbered together from the beginning, so while this connector does not distinguish the two, it can be distinguished by the url path.
     *
     * @title html_url
     */
    html_url: string & tags.Format<"iri">;

    /**
     * @title issue number
     *
     * Number uniquely identifying the issue within its repository
     */
    number: number & tags.Type<"uint64">;

    /**
     * @title state
     *
     * State of the issue; either 'open' or 'closed'
     */
    state: string;

    /**
     * The reason for the current state
     *
     * @title state_reason
     */
    state_reason?: "completed" | "reopened" | "not_planned" | null;

    /**
     * title of the issue
     *
     * @title title
     */
    title: string;

    /**
     * @title user
     */
    user: MyPick<IGithubService.User, "id" | "login" | "type">;

    /**
     * Contents of the issue
     *
     * You can also render this content because it is in a markdown format.
     *
     * @title body
     */
    body?: string | null;

    /**
     * @title labels
     *
     * Labels to associate with this issue; pass one or more label names to replace the set of labels on this issue; send an empty array to clear all labels from the issue; note that the labels are silently dropped for users without push access to the repository
     */
    labels: (
      | string
      | {
          /**
           * @title id
           */
          id?: number & tags.Type<"uint64">;

          /**
           * @title url
           */
          url?: string & tags.Format<"iri">;

          /**
           * @title name
           */
          name?: string;

          /**
           * @title description
           */
          description?: string | null;

          /**
           * @title color
           */
          color?: string | null;

          /**
           * @title default
           */
          default?: boolean;
        }
    )[];

    /**
     * @title assignee
     */
    assignee: MyPick<IGithubService.User, "login"> | null;

    /**
     * @title assignees
     *
     * If there are many people in charge, you can be included in the array.
     */
    assignees?: MyPick<IGithubService.User, "login">[] | null;
  };

  export type Milestone = {
    /**
     * The title of the milestone.
     *
     * @title title
     */
    title: string;

    /**
     * @title id
     */
    id: number & tags.Type<"uint64">;

    /**
     * @title number
     */
    number: number & tags.Type<"uint64">;

    /**
     * @title description
     */
    description: string | null;

    /**
     * @title creator
     */
    creator: MyPick<IGithubService.User, "id" | "login" | "type">;

    /**
     * @title open_issues
     */
    open_issues: number & tags.Type<"uint64">;

    /**
     * @title closed_issues
     */
    closed_issues: number & tags.Type<"uint64">;

    /**
     * @title created_at
     */
    created_at: string & tags.Format<"date-time">;

    /**
     * @title updated_at
     */
    updated_at: string & tags.Format<"date-time">;

    /**
     * @title closed_at
     */
    closed_at: (string & tags.Format<"date-time">) | null;

    /**
     * @title due_on
     */
    due_on: (string & tags.Format<"date-time">) | null;
  };

  export interface PullRequest extends IGithubService.Issue {
    /**
     * @title number of this pull request
     */
    number: number & tags.Type<"uint64">;

    /**
     * @title milestone
     */
    milestone: MileStone | null;

    /**
     * @title head branch info
     */
    head: {
      /**
       * @title label
       */
      label: string;

      /**
       * @title ref
       */
      ref: string;

      /**
       * @title sha
       */
      sha: string;

      /**
       * @title user
       */
      user: MyPick<IGithubService.User, "id" | "login" | "type">;

      /**
       * @title repo
       */
      repo: MyPick<Repository, "full_name"> | null;
    };

    /**
     * @title base branch info
     */
    base: {
      /**
       * @title label
       */
      label: string;

      /**
       * @title ref
       */
      ref: string;

      /**
       * @title sha
       */
      sha: string;

      /**
       * @title user
       */
      user: MyPick<IGithubService.User, "id" | "login" | "type">;

      /**
       * @title repo
       */
      repo: MyPick<Repository, "full_name"> | null;
    };

    /**
     * @title author_association
     */
    author_association: IGithubService.AuthorAssociation;

    /**
     * @title draft
     *
     * Indicates whether or not the pull request is a draft.
     */
    draft?: boolean;

    /**
     * @title requested_reviewers
     */
    requested_reviewers: MyPick<User, "login" | "id" | "type">[];

    /**
     * @title requested_teams
     */
    requested_teams: Partial<Team>[]; // 타입이 정확히 뭐인지 파악이 안 된 상태

    /**
     * @title auto_merge
     */
    auto_merge: any;

    /**
     * @title merged
     */
    merged?: boolean;

    /**
     * @title mergeable
     */
    mergeable: boolean | null;

    /**
     * @title rebaseable
     */
    rebaseable: boolean | null;

    /**
     * @title mergeable_state
     */
    mergeable_state: string;

    /**
     * @title merged_by
     */
    merged_by: MyPick<User, "login" | "id" | "type"> | null;

    /**
     * @title maintainer_can_modify
     */
    maintainer_can_modify: boolean;

    /**
     * @title comments
     */
    comments: number & tags.Type<"uint64"> & tags.Minimum<0>;

    /**
     * @title review_comments
     */
    review_comments: number & tags.Type<"uint64"> & tags.Minimum<0>;

    /**
     * @title commits
     */
    commits: number & tags.Type<"uint64"> & tags.Minimum<0>;

    /**
     * @title additions
     */
    additions: number & tags.Type<"uint64"> & tags.Minimum<0>;

    /**
     * @title deletions
     */
    deletions: number & tags.Type<"uint64"> & tags.Minimum<0>;

    /**
     * @title changed_files
     */
    changed_files: number & tags.Type<"uint64"> & tags.Minimum<0>;

    /**
     * @title locked
     */
    locked: boolean;

    /**
     * @title created_at
     */
    created_at: string & tags.Format<"date-time">;

    /**
     * @title updated_at
     */
    updated_at: string & tags.Format<"date-time">;

    /**
     * @title closed_at
     */
    closed_at: (string & tags.Format<"date-time">) | null;

    /**
     * @title merged_at
     */
    merged_at: (string & tags.Format<"date-time">) | null;
  }

  // 타입이 정확히 뭐인지 파악이 안 된 상태
  export type Team = {
    /**
     * @title id
     */
    id: number;

    /**
     * @title name
     */
    name: string;

    /**
     * @title slug
     */
    slug: string;

    /**
     * @title description
     */
    description: string;

    /**
     * @title privacy
     */
    privacy: "open" | "closed";

    /**
     * @title notification_setting
     */
    notification_setting: string;

    /**
     * @title permission
     */
    permission: string;
  };

  export interface Payload {
    /**
     * It means what this event means.
     * Although the type of event usually has a resource or the name of the event,
     * it is necessary to view it with this property because it does not specify what actions occurred in that event are modified, deleted, created, etc.
     *
     * @title action
     */
    action?: string;

    /**
     * If it is an event for an issue, contain the issue information.
     *
     * @title issue
     */
    issue?: IGithubService.Issue;

    /**
     * If it is an event for an comment, contain the comment information.
     *
     * @title comment
     */
    comment?: IGithubService.Comment;
  }

  export interface Comment {
    /**
     * @title id
     */
    id: number & tags.Type<"uint64">;

    /**
     * @title body
     */
    body?: string;

    /**
     * @title user
     */
    user: MyPick<
      IGithubService.User,
      "id" | "login" | "type" | "avatar_url" | "html_url"
    >;

    /**
     * @title created_at
     */
    created_at: string & tags.Format<"date-time">;

    /**
     * @title updated_at
     */
    updated_at: string & tags.Format<"date-time">;

    /**
     * @title pages
     */
    pages?: IGithubService.Page[];
  }

  export interface Page {
    /**
     * @title page_name
     */
    page_name?: string;

    /**
     * @title title
     */
    title?: string;

    /**
     * @title summary
     */
    summary?: string | null;

    /**
     * @title action
     */
    action?: string;

    /**
     * @title sha
     */
    sha?: string;

    /**
     * @title html_url
     */
    html_url?: string;
  }

  export interface File {
    /**
     * @title hash of this file
     */
    sha: string;

    /**
     * @title filename
     */
    filename: string;

    /**
     * @title status of file in this commit
     */
    status:
      | "added"
      | "removed"
      | "modified"
      | "renamed"
      | "copied"
      | "changed"
      | "unchanged";

    /**
     * @title additions
     */
    additions: number & tags.Type<"uint64">;

    /**
     * @title deletions
     */
    deletions: number & tags.Type<"uint64">;

    /**
     * @title changes
     */
    changes: number & tags.Type<"uint64">;

    /**
     * @title blob_url
     *
     * This is the path through which you can view the file through the github website.
     */
    blob_url: string & tags.Format<"iri">;

    /**
     * @title raw_url
     *
     * The API path through which the contents of the file can be viewed.
     */
    raw_url: string & tags.Format<"iri">;

    /**
     * It means how much it has changed compared to previous commitments.
     * It gives you a text form to see what code has actually changed.
     *
     * @title patch
     */
    patch?: string;
  }

  /**
   * @title file to upload
   */
  export interface UploadFileInput {
    /**
     * @title files
     */
    files: MyPick<IGithubService.RepositoryFile, "path" | "content">[];

    /**
     * @title key
     */
    key: string;
  }

  /**
   * @title user profile repository
   */
  export type ProfileRepository =
    | (IGithubService.Repository & {
        readme: IGithubService.IGetReadmeFileContentOutput;
      })
    | null;
}
