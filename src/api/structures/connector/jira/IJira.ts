import type { Placeholder, Prerequisite } from "@wrtnio/decorators";
import type { tags } from "typia";
import type { ICommon } from "../common/ISecretValue";

export namespace IJira {
  export type ISecret = ICommon.ISecret<
    "atlassian",
    [
      "offline_access",
      "read:me",
      "read:account",
      "read:jira-work",
      "manage:jira-project",
      "read:jira-user",
      "write:jira-work",
      "manage:jira-webhook",
      "manage:jira-data-provider",
    ]
  >;

  export interface BasicAuthorization {
    email: string;
    apiToken: string;
    domain: string;
  }

  export interface ICommonPaginationInput {
    /**
     * The index of the first item to return in a page of results (page offset).
     *
     * @title page offset
     */
    startAt?: number & tags.Type<"int64"> & tags.Default<0>;

    /**
     * The maximum number of items to return per page.
     *
     * @title max results
     */
    maxResults?: number & tags.Type<"int32"> & tags.Default<50>;
  }

  export interface ICommonPaginationOutput {
    total: number & tags.Type<"int64">;
    maxResults: number & tags.Type<"int32">;
    startAt: number & tags.Type<"int64">;
  }

  export interface IGetIssueInputByBasicAuth
    extends BasicAuthorization,
      ICommonPaginationInput {
    /**
     * @title key of project
     */
    project_key: Project["key"] &
      Prerequisite<{
        method: "post";
        path: "/connector/jira/get-projects";
        jmesPath: "values[].{value:key, label:name}";
      }>;
  }

  export interface IGetIssueInputBySecretKey
    extends ISecret,
      ICommonPaginationInput {
    /**
     * @title key of project
     */
    project_key: Project["key"] &
      Prerequisite<{
        method: "post";
        path: "/connector/jira/get-projects";
        jmesPath: "values[].{value:key, label:name}";
      }>;
  }

  export interface IGetIssueOutput extends ICommonPaginationOutput {
    issues: Issue[];
  }

  export interface IGetProjectInputByBasicAuth
    extends BasicAuthorization,
      ICommonPaginationInput {
    /**
     * Order the results by a field.
     *
     * - issueCount : Sorts by the total number of issues in each project.
     * - lastIssueUpdatedTime : Sorts by the last issue update time.
     * - name : Sorts by project name.
     *
     * @title order by
     */
    orderBy?:
      | tags.Constant<
          "issueCount",
          {
            title: "issueCount";
            description: "Sorts by the total number of issues in each project.";
          }
        >
      | tags.Constant<
          "lastIssueUpdatedTime",
          {
            title: "lastIssueUpdatedTime";
            description: "Sorts by the last issue update time.";
          }
        >
      | tags.Constant<
          "name",
          { title: "name"; description: "Sorts by project name." }
        >;
  }

  export interface IGetProjectInputBySecretKey
    extends ISecret,
      ICommonPaginationInput {
    /**
     * Order the results by a field.
     *
     * - issueCount : Sorts by the total number of issues in each project.
     * - lastIssueUpdatedTime : Sorts by the last issue update time.
     * - name : Sorts by project name.
     *
     * @title order by
     */
    orderBy?:
      | tags.Constant<
          "issueCount",
          {
            title: "issueCount";
            description: "Sorts by the total number of issues in each project.";
          }
        >
      | tags.Constant<
          "lastIssueUpdatedTime",
          {
            title: "lastIssueUpdatedTime";
            description: "Sorts by the last issue update time.";
          }
        >
      | tags.Constant<
          "name",
          { title: "name"; description: "Sorts by project name." }
        >;
  }

  export interface IGetProjectOutput extends ICommonPaginationOutput {
    isLast: boolean;
    values: IJira.Project[];
  }

  export interface IGetAccessibleResourcesOutput {
    id: string;
    url: string;
    name: string;
    scope: string[];
    avartarUrl: string;
  }

  export interface Issue {
    id: string;
    key: string;
    reporter?: User | null;
    creator?: User | null;
    assignee?: User | null;

    fields: {
      summary?: string;
      issuetype?: {
        id: string;
        name: string & Placeholder<"스토리">;
      };

      status: {
        description: string;
        name: string;
        id: string;
        statusCategory: {
          id: number;
          key: string;
        };
      };

      priority: {
        iconUrl: string & tags.Format<"uri">;
        name: string;
        id: string;
      };

      parent?: Omit<Issue, "parent">;
    };
  }

  export interface User {
    avatarUrls: AvartarUrls;

    /**
     * @title creator's name
     */
    displayName: string;

    active: boolean;
  }

  export interface Project {
    avatarUrls: AvartarUrls;
    id: string;
    key: string;
    name: string;
    projectCategory?: {
      description: string;
      id: string;
      name: string;
    };
  }

  export interface AvartarUrls {
    "16x16": string & tags.Format<"uri">;
    "24x24": string & tags.Format<"uri">;
    "32x32": string & tags.Format<"uri">;
    "48x48": string & tags.Format<"uri">;
  }
}
