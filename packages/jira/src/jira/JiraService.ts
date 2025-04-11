import { createQueryParameter } from "@wrtnlabs/connector-shared";
import axios, { AxiosError } from "axios";
import { IJiraService } from "../structures/IJiraService";
import { markdownToJiraBlock } from "../utils/markdownToJiraBlock";

export class JiraService {
  constructor(private readonly props: IJiraService.IProps) {}
  /**
   * Jira Service.
   *
   * Find a person within the issue who can be assigned as assignee.
   */
  async getUsersAssignableInIssue(
    input: IJiraService.__IGetIssueAssignableInput,
  ): Promise<IJiraService.IGetIssueAssignableOutput> {
    try {
      const config = await this.getAuthorizationAndDomain();
      const queryParameter = createQueryParameter({
        maxResults: input.maxResults,
        startAt: input.startAt,
        project: input.project,
        issueKey: input.issueKey,
      });

      const url = `${config.baseUrl}/user/assignable/search?${queryParameter}`;
      const res = await axios.get(url, {
        headers: {
          Authorization: config.Authorization,
        },
      });
      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(JSON.stringify(err.response?.data));
      } else {
        console.error(JSON.stringify(err));
      }
      throw err;
    }
  }

  /**
   * Jira Service.
   *
   * Get status categories
   */
  async getStatusCategories(): Promise<IJiraService.IGetStatusCategoryOutput> {
    try {
      const config = await this.getAuthorizationAndDomain();
      const res = await axios.get(`${config.baseUrl}/statuscategory`, {
        headers: {
          Authorization: config.Authorization,
          Accept: "application/json",
        },
      });

      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(JSON.stringify(err.response?.data));
      } else {
        console.error(JSON.stringify(err));
      }
      throw err;
    }
  }

  /**
   * Jira Service.
   *
   * Find a person within the project who can be assigned as assignee.
   */
  async getUsersAssignableInProject(
    input: IJiraService.__IGetProjectAssignableInput,
  ): Promise<IJiraService.IGetProjectAssignableOutput> {
    try {
      const config = await this.getAuthorizationAndDomain();
      const queryParameter = createQueryParameter({
        maxResults: input.maxResults,
        startAt: input.startAt,
        projectKeys: input.project_key,
      });
      const url = `${config.baseUrl}/user/assignable/multiProjectSearch?${queryParameter}`;
      const res = await axios.get(url, {
        headers: {
          Authorization: config.Authorization,
        },
      });
      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(JSON.stringify(err.response?.data));
      } else {
        console.error(JSON.stringify(err));
      }
      throw err;
    }
  }

  /**
   * Jira Service.
   *
   * Find issue statuses for searching issue
   */
  async getIssueStatuses(
    input: IJiraService.__IGetIssueStatusInput,
  ): Promise<IJiraService.IGetIssueStatusOutput> {
    try {
      const projectId = input.projectId;
      const config = await this.getAuthorizationAndDomain();
      const url = `${config.baseUrl}/status`;
      const res = await axios.get(url, {
        headers: {
          Authorization: config.Authorization,
          Accept: "application/json",
        },
      });

      return {
        statuses: res.data
          .filter((status: { scope?: { project: { id: string } } }) =>
            // 프로젝트로 필터링하고자 projectId를 프론트에서 전달한 경우, 상태의 범위가 프로젝트를 모두 포괄하거나 또는 해당 프로젝트에 속한 경우만 전달
            projectId
              ? status.scope?.project.id === projectId ||
                !status.scope?.project.id
              : true,
          )
          .map((status: { scope?: { project: { id: string } } }) => {
            const fixedProjectId = status.scope?.project.id ?? projectId;
            return { ...status, projectId: fixedProjectId };
          }),
      };
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(JSON.stringify(err.response?.data));
      } else {
        console.error(JSON.stringify(err));
      }
      throw err;
    }
  }

  /**
   * Jira Service.
   *
   * Find issue labels
   */
  async getIssueLabels(): Promise<IJiraService.IGetIssueLabelOutput> {
    try {
      const config = await this.getAuthorizationAndDomain();
      const url = `${config.baseUrl}/label`;
      const res = await axios.get(url, {
        headers: {
          Authorization: config.Authorization,
        },
      });

      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(JSON.stringify(err.response?.data));
      } else {
        console.error(JSON.stringify(err));
      }
      throw err;
    }
  }

  /**
   * Jira Service.
   *
   * There are five priorities: 'Highest', 'High', 'Medium', 'Low', and 'Lowest'.
   * Therefore, it can be used as an enum value without requesting this API,
   * and this API is already deprecated on the Jira REST API document.
   * However, for projects that can already be specified by creating a priority level, this connector is added just in case.
   */
  async getIssuePriorities(): Promise<IJiraService.IGetIssuePriorityOutput> {
    try {
      const config = await this.getAuthorizationAndDomain();
      const url = `${config.baseUrl}/priority`;
      const res = await axios.get(url, {
        headers: {
          Authorization: config.Authorization,
        },
      });

      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(JSON.stringify(err.response?.data));
      } else {
        console.error(JSON.stringify(err));
      }
      throw err;
    }
  }

  /**
   * Jira Service.
   *
   * Find issue types
   *
   * In order for the user to inquire about the issue type, the ID of the project is required.
   * If the user mentioned the key or name of the project,
   * it is necessary to first inquire the project and get the correct project ID.
   * The ID of the project is a numeric character type.
   */
  async getIssueTypes(
    input: IJiraService.__IGetIssueTypeInput,
  ): Promise<IJiraService.IGetIssueTypeOutput> {
    try {
      const config = await this.getAuthorizationAndDomain();
      const url = `${config.baseUrl}/issuetype/project?projectId=${input.projectId}`;
      const res = await axios.get(url, {
        headers: {
          Authorization: config.Authorization,
        },
      });

      return { issuetypes: res.data };
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(JSON.stringify(err.response?.data));
      } else {
        console.error(JSON.stringify(err));
      }
      throw err;
    }
  }

  /**
   * Jira Service.
   *
   * Find the Jira projects
   *
   * The Jira project has a unique key and can then be used to query issues with the key.
   * Returns a paginated list of projects visible to the user.
   *
   * In order to inquire about any issues within the project, you must first inquire about the project and find out the key of the project.
   */
  async getProjects(input: {
    props:
      | IJiraService.__IGetProjectInputByBasicAuth
      | IJiraService.IGetProjectInputBySecretKey;
  }): Promise<IJiraService.IGetProjectOutput> {
    try {
      const config = await this.getAuthorizationAndDomain();
      const queryParameter = createQueryParameter({
        maxResults: input.props.maxResults,
        orderBy: input.props.orderBy,
        startAt: input.props.startAt,
      });

      const url = `${config.baseUrl}/project/search?${queryParameter}`;
      const res = await axios.get(url, {
        headers: {
          Authorization: config.Authorization,
        },
      });

      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(JSON.stringify(err.response?.data));
      } else {
        console.error(JSON.stringify(err));
      }
      throw err;
    }
  }

  /**
   * Jira Service.
   *
   * Get detailed issue information
   *
   * Provides more accurate and detailed information, including the title and body of the issue
   *
   * It can be used to look up the issue list first, or if you already know the key or ID of the issue.
   * If you do not know the key or ID, it is recommended to use the issue inquiry connector first.
   */
  async getIssueDetail(
    input: IJiraService.__IGetIssueDetailInput,
  ): Promise<IJiraService.IGetIssueDetailOutput> {
    try {
      const config = await this.getAuthorizationAndDomain();
      const res = await axios.get(
        `${config.baseUrl}/issue/${input.issueIdOrKey}`,
        {
          headers: {
            Authorization: config.Authorization,
            Accept: "application/json",
          },
        },
      );

      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(JSON.stringify(err.response?.data));
      } else {
        console.error(JSON.stringify(err));
      }
      throw err;
    }
  }

  /**
   * Jira Service.
   *
   * Find Jira issues
   *
   * In order to inquire about any issues within the project, you must first inquire about the project and find out the key of the project.
   */
  async getIssues(input: {
    props:
      | IJiraService.__IGetIssueInputByBasicAuth
      | IJiraService.IGetIssueInputBySecretKey;
  }): Promise<IJiraService.IGetIssueOutput> {
    try {
      const config = await this.getAuthorizationAndDomain();
      const res = await axios.post(
        `${config.baseUrl}/search`,
        {
          jql: `
              project = "${input.props.project_key}"
              ${input.props.issuetype ? ` AND issuetype = "${input.props.issuetype}" ` : ""}
              ${input.props.status ? ` AND status = "${input.props.status}" ` : ""}
              ${input.props.assignee ? ` AND assignee = "${input.props.assignee}" ` : ""}
              ${input.props.reporter ? ` AND reporter = "${input.props.reporter}" ` : ""}
              ${input.props.priority ? ` AND priority = "${input.props.priority}" ` : ""}
              ${input.props.labels?.length ? ` AND labels IN (${input.props.labels.map((label) => `"${label}"`)}) ` : ""}
              ${input.props.created_start_date ? ` AND created >= "${input.props.created_start_date}" ` : ""}
              ${input.props.created_end_date ? ` AND created < "${input.props.created_end_date}" ` : ""}
              ${input.props.keyword ? ` AND text ~ "${input.props.keyword}" ` : ""}
              `,
          ...(input.props.maxResults && { maxResults: input.props.maxResults }),
          ...(input.props.startAt && { startAt: input.props.startAt }),
        },
        {
          headers: {
            Authorization: config.Authorization,
            Accept: "application/json",
          },
        },
      );

      const issues = res.data.issues as Pick<
        IJiraService.Issue,
        "fields" | "id" | "key"
      >[];

      res.data.issues = issues.map((issue) => {
        const link = `${config.domain}/browse/${issue.key}` as const;
        return { ...issue, link };
      });

      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(JSON.stringify(err.response?.data));
      } else {
        console.error(JSON.stringify(err));
      }
      throw err;
    }
  }

  /**
   * Jira Service.
   *
   * Get user profile
   */
  async getUserProfile(input: {
    access_token: string;
  }): Promise<{ email: string }> {
    const url = `https://api.atlassian.com/me`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${input.access_token}`,
      },
    });

    return res.data;
  }

  /**
   * Jira Service.
   *
   * Get accessible resources
   */
  async getAccessibleResources(input: {
    access_token: string;
  }): Promise<IJiraService.IGetAccessibleResourcesOutput> {
    const url = `https://api.atlassian.com/oauth/token/accessible-resources`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${input.access_token}`,
      },
    });

    return res.data[0];
  }

  /**
   * Jira Service.
   *
   * Delete the comment
   *
   * Delete the comments on the issue.
   * In order to delete the comments on the issue, you need the issue ID or key and the ID of the comment to be deleted.
   * Please be careful because deleted comments will not be able to be viewed again.
   */
  async deleteComment(
    input: IJiraService.__IDeleteCommentInput,
  ): Promise<void> {
    try {
      const config = await this.getAuthorizationAndDomain();
      await axios.delete(
        `${config.baseUrl}/issue/${input.issueIdOrKey}/comment/${input.commentId}`,
        {
          headers: {
            Authorization: config.Authorization,
          },
        },
      );
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(JSON.stringify(err.response?.data));
      } else {
        console.error(JSON.stringify(err));
      }
      throw err;
    }
  }

  /**
   * Jira Service.
   *
   * Creates a comment on an issue
   * Here, user can write the body of the comment you want to write with the ID or key of the issue.
   */
  async createComment(
    input: IJiraService.__ICreateCommentByMarkdownInput,
  ): Promise<IJiraService.ICreateCommentOutput> {
    try {
      const config = await this.getAuthorizationAndDomain();
      const copiedInput: Pick<IJiraService.ICreateCommentInput, "body"> =
        JSON.parse(JSON.stringify(input));

      if (typeof input.body.content === "string") {
        const content = markdownToJiraBlock(input.body.content);
        copiedInput.body.content = content;
      }

      const res = await axios.post(
        `${config.baseUrl}/issue/${input.issueIdOrKey}/comment`,
        {
          body: copiedInput.body,
        },
        {
          headers: {
            Authorization: config.Authorization,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );

      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(JSON.stringify(err.response?.data));
      } else {
        console.error(JSON.stringify(err));
      }
      throw err;
    }
  }

  /**
   * Jira Service.
   *
   * Get comments by issue id or key
   *
   * This connector uses the issue's key or ID value to query the comments written on the issue.
   * Comments are also visible when looking up issues,
   * but not all comments inside are visible,
   * so user have to use this connector to look up them in pagination.
   */
  async getComments(
    input: IJiraService.__IGetCommentInput,
  ): Promise<IJiraService.IGetCommentOutput> {
    try {
      const config = await this.getAuthorizationAndDomain();
      const res = await axios.get(
        `${config.baseUrl}/issue/${input.issueIdOrKey}/comment`,
        {
          headers: {
            Authorization: config.Authorization,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );
      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(JSON.stringify(err.response?.data));
      } else {
        console.error(JSON.stringify(err));
      }
      throw err;
    }
  }

  /**
   * Jira Service.
   *
   * Unassign the assignee from the Jira issue
   */
  async unassign(input: IJiraService.__IUnAssignInput): Promise<void> {
    try {
      await this.updateIssue({
        id: input.issueId,
        ...this.props,
        fields: {
          assignee: {
            id: null,
          },
        },
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(JSON.stringify(err.response?.data));
      } else {
        console.error(JSON.stringify(err));
      }
      throw err;
    }
  }

  /**
   * Jira Service.
   *
   * Assign the assignee from the Jira issue
   */
  async assign(input: IJiraService.__IAssignInput): Promise<void> {
    try {
      await this.updateIssue({
        id: input.issueId,
        ...this.props,
        fields: {
          assignee: {
            id: input.asigneeId,
          },
        },
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(JSON.stringify(err.response?.data));
      } else {
        console.error(JSON.stringify(err));
      }
      throw err;
    }
  }

  /**
   * Jira Service.
   *
   * Inquire the transition of an issue, which is an edge on a workflow that allows you to change the status of an issue
   * If the person who designed the workflow for the project defined three states that could be moved from the current state, there would be three edges.
   * In Jira, just because there is a status that can be viewed in a project or issue does not mean that you can change the status unconditionally.
   * When designing an edge, for example, you can also design an issue in the 'backoff' state to go through the 'in progress' state once.
   * In this case, you need to move two edges to turn the backoff issue into 'done'.
   */
  async getTransitions(
    input: IJiraService.__IGetTransitionInput,
  ): Promise<IJiraService.IGetTransitionOutput> {
    try {
      const config = await this.getAuthorizationAndDomain();
      const res = await axios.get(
        `${config.baseUrl}/issue/${input.issueIdOrKey}/transitions`,
        {
          headers: {
            Authorization: config.Authorization,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );

      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(JSON.stringify(err.response?.data));
      } else {
        console.error(JSON.stringify(err));
      }
      throw err;
    }
  }

  /**
   * Jira Service.
   *
   * Change issue status
   *
   * Changing the status of an issue must be done after inquiring about changeable Transitions from the current issue.
   * This is forced by the person who designed the workflow in the project, so you must change the status in the order set.
   */
  async updateIssueStatus(
    input: IJiraService.__IUpdateStatusInput,
  ): Promise<void> {
    try {
      const config = await this.getAuthorizationAndDomain();
      await axios.post(
        `${config.baseUrl}/issue/${input.issueIdOrKey}/transitions`,
        {
          transition: {
            id: input.transitionId,
          },
        },
        {
          headers: {
            Authorization: config.Authorization,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(JSON.stringify(err.response?.data));
      } else {
        console.error(JSON.stringify(err));
      }
      throw err;
    }
  }

  /**
   * Jira Service.
   *
   * modify comment
   *
   * Modify the comment. You can only modify the body of the comment here.
   * To create comment in issue, Just write markdown string format contents.
   */
  async updateComment(
    input: IJiraService.IUpdateCommentByMarkdownInput,
  ): Promise<void> {
    try {
      const config = await this.getAuthorizationAndDomain();
      const copiedInput = JSON.parse(JSON.stringify(input));
      if (typeof input.body.content === "string") {
        const content = markdownToJiraBlock(input.body.content);
        copiedInput.body.content = content;
      }

      const { commentId, issueIdOrKey } = input;
      await axios.put(
        `${config.baseUrl}/issue/${issueIdOrKey}/comment/${commentId}`,
        {
          body: copiedInput.body,
        },
        {
          headers: {
            Authorization: config.Authorization,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(JSON.stringify(err.response?.data));
      } else {
        console.error(JSON.stringify(err));
      }
      throw err;
    }
  }

  /**
   * Jira Service.
   *
   * Update an issue
   *
   * You can modify any element in the field.
   * It can be used to modify the issue type, person in charge, summary, and description.
   *
   * In order to write the body of an issue, you must create the body as if you were assembling several blocks.
   * There are pre-designated content types, so please check this type information carefully.
   */
  async updateIssue(
    input: IJiraService.__IUpdateIssueInput & {
      id: IJiraService.Issue["id"];
    },
  ): Promise<void> {
    try {
      const copiedInput = JSON.parse(JSON.stringify(input));
      if (typeof input.fields.description?.content === "string") {
        const content = markdownToJiraBlock(input.fields.description.content);
        copiedInput.fields.description.content = content;
      }

      const config = await this.getAuthorizationAndDomain();
      await axios.put(
        `${config.baseUrl}/issue/${input.id}`,
        {
          fields: copiedInput.fields,
        },
        {
          headers: {
            Authorization: config.Authorization,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(JSON.stringify(err.response?.data));
      } else {
        console.error(JSON.stringify(err));
      }
      throw err;
    }
  }

  /**
   * Jira Service.
   *
   * Create an Issue with Markdown
   *
   * Required: issue type, project, and summary. Use other connectors to find IDs for issue or priority types if unknown.
   * Write the body using predefined content blocks. Check content type guidelines carefully.
   * Prioritization depends on project settings. If prioritization fails, remove priority and retry.
   * Assignees must exist in the system and may differ from names in other services (e.g., Slack). Verify names within Jira.
   * For errors, create a basic issue using the project key, ID, and text, then update assignee or priority incrementally.
   * Provide a link for users to verify the created issue and confirm allocable attributes like assignees and priorities.
   */
  async createIssueByMarkdown(
    input: IJiraService.ICreateIssueByMarkdownInput,
  ): Promise<{ id: string; key: string }> {
    try {
      const copiedInput = JSON.parse(JSON.stringify(input));
      if (typeof input.fields.description?.content === "string") {
        const content = markdownToJiraBlock(input.fields.description.content);
        copiedInput.fields.description.content = content;
      }

      const config = await this.getAuthorizationAndDomain();
      const res = await axios.post(
        `${config.baseUrl}/issue`,
        {
          fields: copiedInput.fields,
        },
        {
          headers: {
            Authorization: config.Authorization,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );

      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        throw new Error(JSON.stringify(err.response?.data));
      } else if (err instanceof Error) {
        throw new Error(err.message);
      } else {
        throw new Error("에러가 발생하였습니다.");
      }
    }
  }

  /**
   * Jira Service.
   *
   * Get authorization and domain
   */
  private async getAuthorizationAndDomain(): Promise<{
    Authorization: string;
    baseUrl: string;
    domain?: string;
  }> {
    const basicAuth = `${this.props.email}:${this.props.token}`;
    const Authorization = `Basic ${Buffer.from(basicAuth).toString("base64")}`;
    const baseUrl = `${this.props.domain}/rest/api/3`;
    return { Authorization, baseUrl: baseUrl, domain: this.props.domain };
  }
}
