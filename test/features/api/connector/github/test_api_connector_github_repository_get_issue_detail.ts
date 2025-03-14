import CApi from "@wrtn/connector-api/lib/index";
import typia from "typia";
import { ConnectorGlobal } from "../../../../../src/ConnectorGlobal";

export async function test_api_connector_github_repository_read_issue_detail(
  connection: CApi.IConnection,
) {
  const res =
    await CApi.functional.connector.github.repositories.get_issues.getRepositoryIssues(
      connection,
      {
        owner: "samchon",
        repo: "nestia",
        direction: "DESC",
        sort: "COMMENTS",
        per_page: 10,
        state: "OPEN",
        secretKey: ConnectorGlobal.env.G_GITHUB_TEST_SECRET,
      },
    );

  if ("error_message" in res) {
    // 에러로 인한 실패
    throw new Error(res.error_message);
  }

  const fetchedIssues = res.fetchedIssues;
  typia.assert(fetchedIssues);

  for await (const issue of fetchedIssues) {
    const detail =
      await CApi.functional.connector.github.repositories.issues.get_detail.getIssueDetail(
        connection,
        {
          owner: "samchon",
          repo: "nestia",
          issue_number: issue.number as number,
          secretKey: ConnectorGlobal.env.G_GITHUB_TEST_SECRET,
        },
      );

    typia.assert(detail);
  }
}
