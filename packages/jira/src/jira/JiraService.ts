import axios, { AxiosError } from "axios";
import typia from "typia";
import { IJiraService } from "../structures/IJiraService";
import { createQueryParameter } from "@wrtnlabs/connector-shared";
import { markdownToJiraBlock } from "../utils/markdownToJiraBlock";

export class JiraService {
  constructor(private readonly props: IJiraService.IProps) {}

  async getUsersAssignableInIssue(
    input: IJiraService.__IGetIssueAssignableInput,
  ): Promise<IJiraService.IGetIssueAssignableOutput> {
    try {
      const config = await this.getAuthorizationAndDomain(input);
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

  async getStatusCategories(
    input: IJiraService.__IGetStatusCategoryInput,
  ): Promise<IJiraService.IGetStatusCategoryOutput> {
    try {
      const config = await this.getAuthorizationAndDomain(input);
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

  async getUsersAssignableInProject(
    input: IJiraService.__IGetProjectAssignableInput,
  ): Promise<IJiraService.IGetProjectAssignableOutput> {
    try {
      const config = await this.getAuthorizationAndDomain(input);
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

  async getIssueStatuses(
    input: IJiraService.__IGetIssueStatusInput,
  ): Promise<IJiraService.IGetIssueStatusOutput> {
    try {
      const projectId = input.projectId;
      const config = await this.getAuthorizationAndDomain(input);
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

  async getIssueLabels(
    input: IJiraService.__IGetIssueLabelInput,
  ): Promise<IJiraService.IGetIssueLabelOutput> {
    try {
      const config = await this.getAuthorizationAndDomain(input);
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

  async getIssuePriorities(
    input: IJiraService.__IGetIssuePriorityInput,
  ): Promise<IJiraService.IGetIssuePriorityOutput> {
    try {
      const config = await this.getAuthorizationAndDomain(input);
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

  async getIssueTypes(
    input: IJiraService.__IGetIssueTypeInput,
  ): Promise<IJiraService.IGetIssueTypeOutput> {
    try {
      const config = await this.getAuthorizationAndDomain(input);
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

  async getProjects(
    input:
      | IJiraService.__IGetProjectInputByBasicAuth
      | IJiraService.IGetProjectInputBySecretKey,
  ) {
    try {
      const config = await this.getAuthorizationAndDomain();
      const queryParameter = createQueryParameter({
        maxResults: input.maxResults,
        orderBy: input.orderBy,
        startAt: input.startAt,
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

  async getIssueDetail(
    input: IJiraService.__IGetIssueDetailInput,
  ): Promise<IJiraService.IGetIssueDetailOutput> {
    try {
      const config = await this.getAuthorizationAndDomain(input);
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

  async getIssues(
    input:
      | IJiraService.__IGetIssueInputByBasicAuth
      | IJiraService.IGetIssueInputBySecretKey,
  ): Promise<IJiraService.IGetIssueOutput> {
    try {
      const config = await this.getAuthorizationAndDomain();
      const res = await axios.post(
        `${config.baseUrl}/search`,
        {
          jql: `
          project = "${input.project_key}"
          ${input.issuetype ? ` AND issuetype = "${input.issuetype}" ` : ""}
          ${input.status ? ` AND status = "${input.status}" ` : ""}
          ${input.assignee ? ` AND assignee = "${input.assignee}" ` : ""}
          ${input.reporter ? ` AND reporter = "${input.reporter}" ` : ""}
          ${input.priority ? ` AND priority = "${input.priority}" ` : ""}
          ${input.labels?.length ? ` AND labels IN (${input.labels.map((label) => `"${label}"`)}) ` : ""}
          ${input.created_start_date ? ` AND created >= "${input.created_start_date}" ` : ""}
          ${input.created_end_date ? ` AND created < "${input.created_end_date}" ` : ""}
          ${input.keyword ? ` AND text ~ "${input.keyword}" ` : ""}
          `,
          ...(input.maxResults && { maxResults: input.maxResults }),
          ...(input.startAt && { startAt: input.startAt }),
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

  async getAuthorizationAndDomain(
    input?: IJiraService.BasicAuthorization,
  ): Promise<{ Authorization: string; baseUrl: string; domain?: string }> {
    const Authorization = await this.getAuthorization(input);
    if (input && "email" in input && "token" in input) {
      const baseUrl = `${input.domain}/rest/api/3`;
      return { Authorization, baseUrl: baseUrl, domain: input.domain };
    } else {
      // OAuth
      const accessTokenDto = await this.refresh();
      const { id: cloudId } = await this.getAccessibleResources(accessTokenDto);
      const baseUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3`;
      return { Authorization, baseUrl: baseUrl };
    }
  }

  async getAuthorization(
    input?: Pick<IJiraService.BasicAuthorization, "token" | "email">,
  ) {
    // secretKey를 가지고 있지만 OAuth가 아닌 경우가 있을 수 있기 때문에 email, token 검증을 먼저 하게 한다. (basic auth 우선)
    if (input && "email" in input && "token" in input) {
      const basicAuth = `${input.email}:${input.token}`;
      return `Basic ${Buffer.from(basicAuth).toString("base64")}`;
    } else {
      const { access_token } = await this.refresh();
      return `Bearer ${access_token}`;
    }
  }

  private async refresh() {
    try {
      const url = `https://auth.atlassian.com/oauth/token` as const;
      const res = await axios.post(
        url,
        {
          grant_type: "refresh_token",
          client_id: this.props.clientId,
          client_secret: this.props.clientSecret,
          redirect_uri: this.props.redirectUri,
          refresh_token: this.props.secret,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return res.data as { access_token: string };
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(JSON.stringify(err.response?.data));
      } else {
        console.error(JSON.stringify(err));
      }
      throw err;
    }
  }

  async deleteComment(
    input: IJiraService.__IDeleteCommentInput,
  ): Promise<void> {
    try {
      const config = await this.getAuthorizationAndDomain(input);
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

  async createComment(
    input: IJiraService.__ICreateCommentByMarkdownInput,
  ): Promise<IJiraService.ICreateCommentOutput> {
    try {
      const config = await this.getAuthorizationAndDomain(input);
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

  async getComments(
    input: IJiraService.__IGetCommentInput,
  ): Promise<IJiraService.IGetCommentOutput> {
    try {
      const config = await this.getAuthorizationAndDomain(input);
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

  async unassign(input: IJiraService.__IUnAssignInput): Promise<void> {
    try {
      await this.updateIssue({
        id: input.issueId,
        email: input.email,
        token: input.token,
        domain: input.domain,
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

  async assign(input: IJiraService.__IAssignInput): Promise<void> {
    try {
      await this.updateIssue({
        id: input.issueId,
        email: input.email,
        token: input.token,
        domain: input.domain,
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

  async getTransitions(
    input: IJiraService.__IGetTransitionInput,
  ): Promise<IJiraService.IGetTransitionOutput> {
    try {
      const config = await this.getAuthorizationAndDomain(input);
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

  async updateIssueStatus(
    input: IJiraService.__IUpdateStatusInput,
  ): Promise<void> {
    try {
      const config = await this.getAuthorizationAndDomain(input);
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

  async updateIssue(
    input: IJiraService.__IUpdateIssueInput & { id: IJiraService.Issue["id"] },
  ): Promise<void> {
    try {
      const copiedInput = JSON.parse(JSON.stringify(input));
      if (typeof input.fields.description?.content === "string") {
        const content = markdownToJiraBlock(input.fields.description.content);
        copiedInput.fields.description.content = content;
      }

      const config = await this.getAuthorizationAndDomain(copiedInput);
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

  async createIssueByMarkdown(
    input: IJiraService.ICreateIssueByMarkdownInput,
  ): Promise<{ id: string; key: string }> {
    try {
      const copiedInput = JSON.parse(JSON.stringify(input));
      if (typeof input.fields.description?.content === "string") {
        const content = markdownToJiraBlock(input.fields.description.content);
        copiedInput.fields.description.content = content;
      }

      const config = await this.getAuthorizationAndDomain(copiedInput);
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
        console.error(JSON.stringify(err.response?.data));
      } else {
        console.error(JSON.stringify(err));
      }
      throw err;
    }
  }

  async createIssue(
    input: IJiraService.ICreateIssueInput,
  ): Promise<{ id: string; key: string }> {
    try {
      const config = await this.getAuthorizationAndDomain(input);
      const res = await axios.post(
        `${config.baseUrl}/issue`,
        {
          fields: input.fields,
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

  parseSecretKey(input: {
    secretKey: string;
  }): IJiraService.BasicAuthorization {
    return typia.json.assertParse<IJiraService.BasicAuthorization>(
      input.secretKey,
    );
  }
}
