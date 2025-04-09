import typia from "typia";
import { TestGlobal } from "../TestGlobal";
import { GithubService } from "@wrtnlabs/connector-github/lib/github/GithubService";

export const test_github_get_organization_events = async () => {
  const githubService = new GithubService({
    githubAccessToken: TestGlobal.env.G_GITHUB_TEST_SECRET,
  });

  const res = await githubService.searchUser({
    q: "kakasoo",
  });

  typia.assert(res);
};
