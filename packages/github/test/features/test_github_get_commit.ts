import typia from "typia";
import { GithubService } from "@wrtnlabs/connector-github/lib/github/GithubService";
import { TestGlobal } from "../TestGlobal";

export const test_github_get_commit_list = async () => {
  const githubService = new GithubService({
    githubAccessToken: TestGlobal.env.G_GITHUB_TEST_SECRET,
  });

  const res = await githubService.getCommitList({
    owner: "samchon",
    repo: "nestia",
  });

  typia.assert(res);

  return res;
};

export const test_github_get_commit = async () => {
  const githubService = new GithubService({
    githubAccessToken: TestGlobal.env.G_GITHUB_TEST_SECRET,
  });

  const list = await test_github_get_commit_list();

  const res = await githubService.getCommit({
    owner: "samchon",
    repo: "nestia",
    ref: list.result.at(0)?.sha as string,
  });

  typia.assert(res);

  return res;
};

export const test_github_get_commit_without_ref = async () => {
  const githubService = new GithubService({
    githubAccessToken: TestGlobal.env.G_GITHUB_TEST_SECRET,
  });

  const res = await githubService.getCommit({
    owner: "samchon",
    repo: "nestia",
  });

  typia.assert(res);

  return res;
};

export const test_github_get_commit_diff = async () => {
  const githubService = new GithubService({
    githubAccessToken: TestGlobal.env.G_GITHUB_TEST_SECRET,
  });

  const list = await test_github_get_commit_list();

  const res = await githubService.getCommitDiff({
    owner: "samchon",
    repo: "nestia",
    ref: list.result.at(0)?.sha as string,
  });

  typia.assert(res);

  return res;
};

export const test_github_get_pull_requests_associated_with_a_commit =
  async () => {
    const githubService = new GithubService({
      githubAccessToken: TestGlobal.env.G_GITHUB_TEST_SECRET,
    });

    const list = await test_github_get_commit_list();

    const res = await githubService.getPullRequestAssociatedWithACommit({
      owner: "samchon",
      repo: "nestia",
      commit_sha: list.result.at(0)!.sha,
    });

    typia.assert(res);

    return res;
  };

export const test_github_get_commit_heads = async () => {
  const githubService = new GithubService({
    githubAccessToken: TestGlobal.env.G_GITHUB_TEST_SECRET,
  });

  const list = await test_github_get_commit_list();

  const res = await githubService.getCommitHeads({
    owner: "samchon",
    repo: "nestia",
    commit_sha: list.result.at(0)!.sha,
  });

  typia.assert(res);

  return res;
};
