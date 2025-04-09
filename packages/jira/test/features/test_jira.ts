// Jira Workspace was removed. so not implemented.

import { JiraService } from "@wrtnlabs/connector-jira";
import { TestGlobal } from "../TestGlobal";

export async function test_api_jira() {
  const service = new JiraService({
    domain: "https://wrtn-ecosystem.atlassian.net",
    email: "studio@wrtn.io",
    token: TestGlobal.env.JIRA_TEST_SECRET,
  });

  const projects = await service.getProjects({ props: {} });
  const project = projects.values.find((el) => el.key === "WRTNLABS");
  const issueTypes = await service.getIssueTypes({
    projectId: project?.id!,
  });

  const response = await service.createIssueByMarkdown({
    fields: {
      issuetype: {
        id: issueTypes.issuetypes[0]?.id!,
      },
      project: {
        key: "WRTNLABS",
      },
      summary: "test",
    },
  });

  console.log(response);
}
