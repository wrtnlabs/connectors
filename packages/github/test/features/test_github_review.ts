import { GithubService } from "@wrtnlabs/connector-github/lib/github/GithubService";
import assert from "assert";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

// create pull request 테스트 코드에 리뷰 요청을 추가하여 작성
export const test_github_request_review_and_delete_review = async () => {
  const githubService = new GithubService({
    githubRefreshToken: TestGlobal.env.G_GITHUB_TEST_SECRET,
  });

  const created = await githubService.createPullRequest({
    owner: "studio-pro",
    repo: "github_connector",
    draft: true,
    body: "TEST REQUEST REVIEW BODY!",
    title: "TEST REQUEST REVIEW TITLE!",
    base: "main",
    head: "kakasoo",
  });

  typia.assert(created);

  // 리뷰어 지정
  await githubService.requestReviewers({
    owner: "studio-pro",
    repo: "github_connector",
    pull_number: created.number as number,
    reviewers: ["wrtn-studio-store"],
  });

  const added = await githubService.readPullRequestRequestedReviewers({
    owner: "studio-pro",
    repo: "github_connector",
    pull_number: created.number as number,
  });

  assert(added.users.length === 1);
  assert(added.users.at(0)?.login === "wrtn-studio-store");

  const files = await githubService.readPullRequestFiles({
    owner: "studio-pro",
    repo: "github_connector",
    pull_number: created.number as number,
  });

  const first_file = files.result.at(0);

  if (!first_file) {
    throw new Error("File Not Found.");
  }

  await githubService.reviewPullRequest({
    owner: "studio-pro",
    repo: "github_connector",
    pull_number: created.number as number,
    body: "TEST REVIEW",
    event: "COMMENT",
    comments: [
      {
        path: first_file.filename,
        body: "HAHA1",
        start_line: 1,
        line: 2,
        start_side: "RIGHT",
      },
      {
        path: first_file.filename,
        body: "HAHA2",
        start_line: 3,
        line: 4,
        start_side: "RIGHT",
      },
      {
        path: first_file.filename,
        body: "HAHA3",
        line: 5,
        side: "RIGHT",
      },
    ],
  });

  const updated = await githubService.updatePullRequest({
    owner: "studio-pro",
    repo: "github_connector",
    pull_number: created.number as number,
    title: "[UPDATE] TEST REQUEST REVIEW TITLE!",
    body: "[UPDATED] TEST REQUEST REVIEW BODY!",
    state: "closed",
  });

  typia.assert(updated);
};
