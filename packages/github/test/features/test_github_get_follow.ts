import { GithubService } from "@wrtnlabs/connector-github/lib/github/GithubService";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

export const test_github_get_followees = async () => {
  const githubService = new GithubService({
    githubAccessToken: TestGlobal.env.G_GITHUB_TEST_SECRET,
  });

  const res = await githubService.getFollowees({
    username: "samchon",
  });

  typia.assert(res);
};

export const test_github_get_followers = async () => {
  const githubService = new GithubService({
    githubAccessToken: TestGlobal.env.G_GITHUB_TEST_SECRET,
  });

  const res = await githubService.getFollowers({
    username: "samchon",
  });

  typia.assert(res);
};
