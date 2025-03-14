import axios, { AxiosError } from "axios";
import typia from "typia";
import { IGithubService } from "../structures/IGithubService";
import {
  createQueryParameter,
  docsExtensions,
  ElementOf,
  imageExtensions,
  PickPartial,
  videoExtensions,
} from "@wrtnlabs/connector-shared";
// import { AwsS3Service } from "@wrtnlabs/connector-aws-s3";

export class GithubService {
  // private readonly s3?: AwsS3Service;

  constructor(private readonly props: IGithubService.IProps) {
    // if (this.props.aws?.s3) {
    //   this.s3 = new AwsS3Service({
    //     ...this.props.aws.s3,
    //   });
    // }
  }

  /**
   * Github Service.
   *
   * List organizations for a user
   *
   * Look up the user's organization list, but since you can't look up the user's private organization here,
   * you can't really conclude that there isn't an empty array.
   */
  async getUserOrganizations(
    input: IGithubService.IGetUserOrganizationInput,
  ): Promise<IGithubService.IGetUserOrganizationOutput> {
    const { username, ...rest } = input;
    const per_page = input.per_page ?? 30;
    const queryParameters = createQueryParameter({ ...rest, per_page });
    const url = `https://api.github.com/users/${username}/orgs?${queryParameters}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
      },
    });

    const link = res.headers["link"];
    return { result: res.data, ...this.getCursors(link) };
  }

  /**
   * Github Service.
   *
   * List organizations for the authenticated user
   *
   * Inquire the user's repository.
   * Here, the user is an authenticated user, which means a user of that token.
   * If a user does not select an organization at login or ask the organization's admin to link it,
   * the resource might not be viewed even if the token scope has permissions.
   */
  async getAuthenticatedUserOrganizations(
    input: IGithubService.IGetAuthenticatedUserOrganizationInput,
  ): Promise<IGithubService.IGetAuthenticatedUserOrganizationOutput> {
    const per_page = input.per_page ?? 30;
    const queryParameters = createQueryParameter({ ...input, per_page });
    const url = `https://api.github.com/user/orgs?${queryParameters}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
      },
    });

    const link = res.headers["link"];
    return { result: res.data, ...this.getCursors(link) };
  }

  // async copyAllFiles(
  //   input: IGithubService.IAnalyzeInput,
  // ): Promise<IGithubService.IAnalyzeOutput> {
  //   // 이전에 분석했던 기록이 있는지 보기 위해 유니크한 키를 만든다. (owner, repo, commit hash를 이용한다.)
  //   const { default_branch: commit_sha } = await this.getRepository(input);
  //   const head = await this.getCommitHeads({ ...input, commit_sha });
  //   const AWS_KEY = `connector/github/repos/analyzed/${input.owner}/${input.repo}/${head.sha}`;

  //   // // 이미 분석한 적 있을 경우 AWS S3에서 조회하여 갖고 온다.
  //   // const fileUrl = this.s3.getFileUrl(AWS_KEY);
  //   // const isSaved = await this.s3.getGetObjectUrl(fileUrl);
  //   // console.log(isSaved, "isSaved");
  //   // if (isSaved) {
  //   //   const counts = [0, 1, 2, 3, 4] as const;
  //   //   return counts
  //   //     .map((file_count) => `${AWS_KEY}/${file_count}.txt`)
  //   //     .map((key) => this.s3.getFileUrl(key));
  //   // }

  //   const MAX_SIZE = 3 * 1024 * 1024;
  //   const MAX_DEPTH = 100;

  //   // 전체 폴더 구조 가져오기
  //   const rootFiles = await this.getRepositoryFolderStructures({
  //     ...input,
  //     depth: MAX_DEPTH,
  //     includeMediaFile: false,
  //   });

  //   // 전체 순회하며 파일인 경우 content를 가져오게 하기
  //   const traverseOption = {
  //     result: [[], [], [], [], []] as StrictOmit<
  //       IGithubService.RepositoryFile,
  //       "encoding"
  //     >[][],
  //     currentIndex: 0,
  //     currentSize: 0,
  //   };

  //   if (rootFiles instanceof Array) {
  //     await Promise.allSettled(
  //       rootFiles
  //         .filter(
  //           (file) =>
  //             !file.path.includes("test") &&
  //             !file.path.includes("benchmark") &&
  //             !file.path.includes("yarn") &&
  //             !file.path.includes("pnp") &&
  //             this.isMediaFile(file) === false,
  //         )
  //         .map(async (file) => {
  //           if (traverseOption.currentIndex === 5) {
  //             return;
  //           }

  //           const path = file.path;
  //           if (file.type === "dir") {
  //             await this.traverseTree(input, file, traverseOption);
  //           } else {
  //             const detailed = await this.getFileContents({ ...input, path });
  //             const { content } =
  //               typia.assert<IGithubService.RepositoryFile>(detailed);

  //             if (MAX_SIZE < traverseOption.currentSize + file.size) {
  //               traverseOption.currentSize = 0; // 사이즈 초기화
  //               traverseOption.currentIndex += 1; // 다음 파일 인덱스로 이전
  //               console.log(`${file.path} 파일을 만나서 파일 인덱스 증가 연산`);
  //             }

  //             if (traverseOption.currentIndex === 5) {
  //               return;
  //             }

  //             traverseOption.currentSize += file.size;
  //             traverseOption.result[traverseOption.currentIndex]?.push({
  //               ...file,
  //               content,
  //             });
  //           }
  //         }),
  //     );
  //   }

  //   const analyzedFiles = traverseOption.result.filter((el) => el.length);
  //   const links: string[] = [];
  //   if (analyzedFiles) {
  //     let FILE_NUM = 0;
  //     for await (const analyzedFile of analyzedFiles) {
  //       const key = `${AWS_KEY}/${FILE_NUM}.txt`;
  //       const link = await this.upload({ files: analyzedFile, key });
  //       links.push(link);
  //       FILE_NUM++;
  //     }
  //   }

  //   return links;
  // }

  // async upload(input: {
  //   files: Pick<IGithubService.RepositoryFile, "path" | "content">[];
  //   key: string;
  // }) {
  //   const { files, key } = input;
  //   if (!this.s3) {
  //     throw new Error("AWS S3 Not Applied.");
  //   }

  //   const stringified = files.map(({ path, content }) => ({ path, content }));
  //   const buffer = Buffer.from(JSON.stringify(stringified), "utf-8");
  //   const link = await this.s3.uploadObject({
  //     contentType: "text/plain; charset=utf-8;",
  //     data: buffer,
  //     key,
  //   });

  //   return link;
  // }

  // async analyze(
  //   input: IGithubService.IAnalyzeInput,
  // ): Promise<IRag.IAnalysisOutput> {
  //   const urls = await this.copyAllFiles(input);
  //   return await this.ragProvider.analyze({ url: urls });
  // }

  private async getRepository(input: {
    owner: string;
    repo: string;
  }): Promise<{ default_branch: string }> {
    const url = `https://api.github.com/repos/${input.owner}/${input.repo}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
      },
    });
    return res.data;
  }

  // async call(input: IGithubService.ICallInput) {
  //   const res = await axios.get(input.url, {
  //     headers: {
  //       Authorization: `Bearer ${this.props.secret}`,
  //     },
  //   });
  //   return res.data;
  // }

  /**
   * Github Service.
   *
   * Lists all branches that contain the HEAD commit of a GitHub repository.
   *
   * This function utilizes the GitHub API to retrieve a list of branches where the current
   * HEAD commit (the latest commit on the checked-out branch) is included. This is useful for
   * determining which branches contain the most recent changes.
   */
  async getCommitHeads(
    input: IGithubService.IGetCommitHeadInput,
  ): Promise<IGithubService.IGetCommitHeadOutput> {
    const { owner, repo, commit_sha } = input;

    const url = `https://api.github.com/repos/${owner}/${repo}/commits/${commit_sha}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
      },
    });
    return res.data;
  }

  /**
   * Github Service.
   *
   * List events received by the authenticated user
   *
   * These are events that you've received by watching repositories and following users.
   * If you are authenticated as the given user, you will see private events. Otherwise, you'll only see public events.
   * In this case, the "received" event includes the repository that the user is interested in or the activity of the user who is following,
   * for example, if the user has pushed to the repository, or if an issue has been created from the repository that the user is interested in.
   */
  async getReceivedEvents(
    input: IGithubService.IGetReceivedEventInput,
  ): Promise<IGithubService.IGetEventOutput> {
    const { username, ...rest } = input;
    const per_page = input.per_page ?? 30;
    const queryParameters = createQueryParameter({ ...rest, per_page });

    const url = `https://api.github.com/users/${username}/received_events?${queryParameters}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
      },
    });

    const link = res.headers["link"];
    return { result: res.data, ...this.getCursors(link) };
  }

  /**
   * Github Service.
   *
   * Lists organization events for the authenticated user
   *
   * This API endpoint retrieves events that have occurred within the organizations
   * the authenticated user is a member of. It includes activities such as issues,
   * pull requests, commits, and other actions taken within the organization's repositories.
   *
   * The events cover all repositories within the organization that the user has access to,
   * making it useful for tracking the organization's activity or monitoring the progress
   * of projects that the user is involved in within the team.
   */
  async getUserOrganizationEvents(
    input: IGithubService.IGetOrganizationUserEventInput,
  ): Promise<IGithubService.IGetEventOutput> {
    const { organization, ...rest } = input;
    const per_page = input.per_page ?? 30;
    const queryParameters = createQueryParameter({ ...rest, per_page });

    const { login } = await this.debugToken();
    const url = `https://api.github.com/users/${login}/events/orgs/${organization}?${queryParameters}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
      },
    });

    const link = res.headers["link"];
    return { result: res.data, ...this.getCursors(link) };
  }

  /**
   * Github Service.
   *
   * Get all requested reviewers
   *
   * Gets the users or teams whose review is requested for a pull request.
   * Once a requested reviewer submits a review, they are no longer considered a requested reviewer.
   * Their review will instead be returned by the List reviews for a pull request operation.
   *
   * The requested_reviewers are the ones who have been asked to review, but not yet.
   * So when you see someone who has reviewed a PR, if that person is someone who has already finished a review, he/she will be part of the reviewers, not the requested_reviewers.
   * Therefore, when you look at a reviewer, you should look at it separately between someone who has not yet reviewed it and one person who has reviewed it, which you should also call other features to see together.
   * Refer to connector `:post /connector/github/repositories/pull-requests/get-reviews`.
   */
  async readPullRequestRequestedReviewers(
    input: IGithubService.IReadPullRequestDetailInput,
  ): Promise<IGithubService.IReadPullRequestRequestedReviewerOutput> {
    const { owner, repo, pull_number } = input;
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}/requested_reviewers`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
      },
    });

    return res.data;
  }

  /**
   * Github Service.
   *
   * Removes review requests from a pull request for a given set of users and/or teams
   *
   * You should check the person who has already been requested as a reviewer, i.e., requested_reviewers, and then send out the delete request.
   * Even if you don't do that, there will be no error, but it doesn't mean anything if you delete the person who hasn't been requested as a reviewer.
   */
  async removeRequestedReviewers(
    input: IGithubService.IRequestReviewerInput,
  ): Promise<void> {
    const { owner, repo, pull_number, ...rest } = input;
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}/requested_reviewers`;
    await axios.delete(url, {
      data: { ...rest },
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
      },
    });
  }

  /**
   * Github Service.
   *
   * Request reviewers for a pull request
   *
   * Requests reviews for a pull request from a given set of users and/or teams. This endpoint triggers notifications.
   * You can specify a reviewer by the user's name alone, but not by anyone, so use a connector that looks up collaborators first.
   */
  async requestReviewers(
    input: IGithubService.IRequestReviewerInput,
  ): Promise<void> {
    const { owner, repo, pull_number, ...rest } = input;
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}/requested_reviewers`;
    await axios.post(
      url,
      {
        ...rest,
      },
      {
        headers: {
          Authorization: `Bearer ${this.props.secret}`,
        },
      },
    );
  }

  /**
   * Github Service.
   *
   * List comments for a pull request review
   *
   * Lists comments for a specific pull request review.
   */
  async readReviewComments(
    input: IGithubService.IGetReviewCommentInput,
  ): Promise<IGithubService.IGetReviewCommentOutput> {
    const { owner, repo, pull_number, review_id, ...rest } = input;
    const queryParameter = createQueryParameter(rest);
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}/reviews/${review_id}/comments?${queryParameter}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
      },
    });

    const link = res.headers["link"];
    return { result: res.data, ...this.getCursors(link) };
  }

  /**
   * Github Service.
   *
   * List reviews for a pull request
   *
   * Pull Request Reviews are groups of pull request review comments on a pull request, grouped together with a state and optional body comment.
   * Lists all reviews for a specified pull request. The list of reviews returns in chronological order.
   * Since github distinguishes requested_reviewers from those who have already completed the review,
   * if you want to see a review for any PR, you should look up both of these connectors.
   */
  async readReviews(
    input: IGithubService.IReadPullRequestReviewInput,
  ): Promise<IGithubService.IReadPullRequestReviewOutput> {
    const { owner, repo, pull_number, ...rest } = input;
    const queryParameter = createQueryParameter(rest);
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}/reviews?${queryParameter}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
      },
    });

    const link = res.headers["link"];
    return { result: res.data, ...this.getCursors(link) };
  }

  /**
   * Github Service.
   *
   * Create a review for a pull request
   *
   * PENDING pull request reviews are not submitted and therefore do not include the submitted_at property in the response. Leave the event parameter blank to create a pending review.
   * The position value indicates the line number in the file, counting from the first "@@" hunk header. The line below "@@" is position 1, the next is position 2, and so on.  Newline characters (\n), whitespace lines and additional hunks affect the position. The position resets to 1 when a new file begins.
   * Important: Differentiate between submitting a review and adding a comment to a pull request. Leave a review in the PENDING state to submit it later. Use the comment API, not the review API, to add a comment.
   * You can specify multiple lines for a comment in a pull request review using the multi-line comment functionality in the API. This is helpful for explaining larger blocks of code or providing feedback on multiple lines at once.
   */
  async reviewPullRequest(
    input: IGithubService.IReviewPullRequestInput,
  ): Promise<IGithubService.IReviewPullRequestOutput> {
    try {
      const { owner, repo, pull_number, ...rest } = input;
      const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}/reviews`;
      const res = await axios.post(
        url,
        {
          ...rest,
        },
        {
          headers: {
            Authorization: `Bearer ${this.props.secret}`,
          },
        },
      );

      return res.data;
    } catch (err) {
      console.error(JSON.stringify((err as any).response.data));
      throw err;
    }
  }

  /**
   * Github Service.
   *
   * List pull requests files
   *
   * This is useful to see what files are contained in that PR.
   * Each file's patch contains the entire format of the file.
   * However, if you want to know the changes, you should look up diff, which is implemented with a different connector, so you'd better refer to it.
   *
   * If the user wants to see each PR unit, this connector will be suitable.
   */
  async readPullRequestFiles(
    input: IGithubService.IReadPullRequestDetailInput,
  ): Promise<IGithubService.IReadPullRequestFileOutput> {
    const { owner, repo, pull_number, ...rest } = input;
    const queryParameter = createQueryParameter(rest);
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}/files?${queryParameter}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
      },
    });

    const link = res.headers["link"];
    return { result: res.data, ...this.getCursors(link) };
  }

  /**
   * Github Service.
   *
   * List commits on a pull request
   *
   * Lists a maximum of 250 commits for a pull request.
   * To receive a complete commit list for pull requests with more than 250 commits, use the List commits endpoint.
   *
   * If the user wants to see each PR unit, this connector will be suitable.
   */
  async readPullRequestCommits(
    input: IGithubService.IReadPullRequestDetailInput,
  ): Promise<IGithubService.IReadPullRequestCommitOutput> {
    const { owner, repo, pull_number, ...rest } = input;
    const queryParameter = createQueryParameter(rest);
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}/commits?${queryParameter}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
      },
    });

    const link = res.headers["link"];
    const commits = res.data.map((el: any) => el.commit);
    return { result: commits, ...this.getCursors(link) };
  }

  /**
   * Github Service.
   *
   * Get a diff of pull-request info
   *
   * This is the same as PR's ability to query files,
   * but the format that this function returns is a string, which is more suitable for identifying changes to each file than viewing each file object,
   * and in github, this is called the application/vnd.github.diff format.
   * This helps you see at a glance what codes have disappeared and been added in a form suitable for code review.
   *
   * If the user wants to see each PR unit, this connector will be suitable.
   *
   * If there are too many changes, the connector can export a 406 error.
   * In this case, it may be difficult to determine each change, but it is recommended to use the List pull requests connector.
   *
   * The numbers after the /@/@ symbol represent the number of start lines and the number of changed lines.
   * The details are given in Response Type. However, since this line represents the start line,
   * a particular line of code should be relative to the value of the position considering the letter of the line.
   */
  async readPullRequestDiff(
    input: IGithubService.IReadPullRequestDetailInput,
  ): Promise<IGithubService.IReadPullRequestDiffOutput> {
    try {
      const { owner, repo, pull_number } = input;
      const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}`;
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.props.secret}`,
          Accept: "application/vnd.github.diff",
        },
      });

      return { diff: res.data };
    } catch (err) {
      if (err instanceof AxiosError) {
        const data = err.response?.data;
        if (typia.is<IGithubService.IReadPullRequestDiffOutput>(data)) {
          return data;
        } else {
          console.log(JSON.stringify((err as any).response.data));
        }
      }
      throw err;
    }
  }

  /**
   * Github Service.
   *
   * Get a deatiled pull-request info
   *
   * You can view detailed PR information using the PR number.
   * Here, you can see the branch to be merged and the information on the branch it points to, and you can see information such as the status of the PR, the time of each state, and the person who created the PR.
   * However, it should be used with other connectors because it provides information close to the header of PR and does not provide information about each file or commit of PR.
   *
   * If the user wants to see each PR unit, this connector will be suitable.
   */
  async readPullRequestDetail(
    input: IGithubService.IReadPullRequestDetailInput,
  ): Promise<IGithubService.IReadPullRequestDetailOutput> {
    const { owner, repo, pull_number } = input;
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
      },
    });

    return res.data;
  }

  /**
   * Github Service.
   *
   * List repository pull requests
   *
   * Query pool requests to specific repositories.
   * Here, you can filter issues and see only pool requests, and you can sort them by creation and inquiry dates, or filter by open or closed status.
   * The content of the body is omitted, so if you want to see it, you should use the detailed lookup connector.
   * If the user wants to see the body property, '/connector/github/repositories/pull-requests/get-detail' connector must be called.
   */
  async getRepositoryPullRequest(
    input: IGithubService.IFetchRepositoryPullRequestInput,
  ): Promise<IGithubService.IFetchRepositoryPullRequestOutput> {
    const per_page = input.per_page ?? 30;
    const url = `https://api.github.com/graphql`;

    const query = `
    query($owner: String!, $repo: String!, $perPage: Int!, $after: String, $state: [PullRequestState!], $labels: [String!], $direction: OrderDirection!) {
      repository(owner: $owner, name: $repo) {
        id
        name
        pullRequests(
          after: $after,
          states: $state,
          labels: $labels,
          first: $perPage
          orderBy: {
            field: ${input.sort},
            direction: $direction
          }
        ) {
          edges {
            node {
              id
              url
              number
              state
              title
              createdAt
              updatedAt
              comments {
                totalCount
              }
              reviews {
                totalCount
              }
              reactions {
                totalCount
              }
              labels (first:10) {
                nodes {
                  name
                  description
                }
              }
              assignees (first:10) {
                nodes {
                  login
                }
              }
              author {
                login
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
    `;

    const variables = {
      owner: input.owner,
      repo: input.repo,
      perPage: per_page,
      after: input.after,
      sort: input.sort,
      direction: input.direction?.toUpperCase(),
      ...(input.state && { state: [input.state?.toUpperCase()] }), // 배열로 전달
      ...(input.labels?.length && { labels: input.labels }), // labels가 있으면 배열로, 없으면 빈 배열
    };

    const res = await axios.post(
      url,
      {
        query,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${this.props.secret}`,
        },
      },
    );

    const response = res.data.data?.repository?.pullRequests;
    const pageInfo = response?.pageInfo;
    const pullRequests: IGithubService.FetchedPullRequest[] =
      response.edges?.map(
        ({ node }: { node: IGithubService.FetchedPullRequest }) => node,
      );

    return { pullRequests, pageInfo };
  }

  /**
   * Github Service.
   *
   * List repository issues.
   *
   * This connector allows viewing repository issues without authentication.
   * It provides issue details, including up to 10 users and labels, but omits the body.
   *
   * To view the issue body, use the detailed lookup connector:
   * '/connector/github/repositories/issues/get-detail'.
   *
   * Issues can be filtered by open/closed status and sorted by creation time,
   * update time, comment count, or reaction count.
   *
   * Since the repository owner is unknown, users must specify the owner in the request.
   */
  async fetchRepositoryIssues(
    input: IGithubService.IFetchRepositoryInput,
  ): Promise<IGithubService.IFetchRepositoryOutput> {
    const per_page = input.per_page ?? 30;
    const url = `https://api.github.com/graphql`;

    const query = `
    query($owner: String!, $repo: String!, $perPage: Int!, $after: String, $state: [IssueState!], $labels: [String!]) {
      repository(owner: $owner, name: $repo) {
        id
        name
        issues(
          after: $after,
          states: $state,
          labels: $labels,
          first: $perPage
          orderBy: {
            field: ${input.sort},
            direction: ${input.direction}
          }
        ) {
          edges {
            node {
              id
              url
              number
              state
              stateReason
              title
              createdAt
              updatedAt
              comments {
                totalCount
              }
              reactions {
                totalCount
              }
              labels (first:10) {
                nodes {
                  name
                  description
                }
              }
              assignees (first:10) {
                nodes {
                  login
                }
              }
              author {
                login
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
    `;

    const variables = {
      owner: input.owner,
      repo: input.repo,
      perPage: per_page,
      after: input.after,
      direction: input.direction?.toUpperCase(),
      ...(input.state && { state: [input.state?.toUpperCase()] }), // 배열로 전달
      ...(input.labels?.length && { labels: input.labels }), // labels가 있으면 배열로, 없으면 빈 배열
    };

    const res = await axios.post(
      url,
      {
        query,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${this.props.secret}`,
        },
      },
    );

    if (res.data.data?.repository === null) {
      const errors = res.data.errors;
      if (errors instanceof Array) {
        const not_found_repository_error = errors.find((error) => {
          const errorMessage = error.message;
          if (typeof errorMessage === "string") {
            if (
              errorMessage.startsWith(
                "Could not resolve to a Repository with the name",
              )
            ) {
              return true;
            }
          }
          return false;
        });

        const error_message = not_found_repository_error.message;
        return { error_message };
      }
    }

    const issues = res.data.data?.repository?.issues;
    const pageInfo = issues?.pageInfo;
    const fetchedIssues: IGithubService.FetchedIssue[] = issues.edges?.map(
      ({ node }: { node: IGithubService.FetchedIssue }) => node,
    );

    return { fetchedIssues, pageInfo };
  }

  // async getRepositoryIssues(
  //   input: IGithubService.IGetRepositoryIssueInput,
  // ): Promise<IGithubService.IGetRepositoryIssueOutput> {
  //   const { owner, repo, ...rest } = input;
  //   const per_page = input.per_page ?? 30;
  //   const queryParameter = createQueryParameter({ ...rest, per_page });
  //   const url = `https://api.github.com/repos/${owner}/${repo}/issues?${queryParameter}`;
  //   const res = await axios.get(url, {
  //     headers: {
  //       Authorization: `Bearer ${this.props.secret}`,
  //       Accept: "application/vnd.github+json",
  //     },
  //   });

  //   const link = res.headers["link"];
  //   return { result: res.data, ...this.getCursors(link) };
  // }

  /**
   * Github Service.
   *
   * List organization issues assigned to the authenticated user
   *
   * Similar to the 'get-issues' connector, it is suitable for inquiring only about issues assigned within a specific organization.
   * Naturally, the user will have to be a member of that organization.
   *
   * Here, the result value can be inquired together with PR because PR on GitHub is essentially an issue-like object.
   * If you want to see the issue separately, you should use a connector that looks up the issue in the repo, not the organization.
   */
  async getOrganizationIssues(
    input: IGithubService.IGetOrganizationAuthenticationUserIssueInput,
  ): Promise<IGithubService.IGetOrganizationAuthenticationUserIssueOutput> {
    const { organization, ...rest } = input;
    const per_page = input.per_page ?? 30;
    const queryParameter = createQueryParameter({ ...rest, per_page });
    const url = `https://api.github.com/orgs/${organization}/issues?${queryParameter}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
        Accept: "application/vnd.github+json",
      },
    });

    const link = res.headers["link"];
    return { result: res.data, ...this.getCursors(link) };
  }

  /**
   * Github Service.
   *
   * List public organization events
   *
   * If you are authenticated as the given user, you will see your private events. Otherwise, you'll only see public events.
   *
   * This API endpoint retrieves a stream of public events that have occurred
   * within a specified organization. These events include activities such as
   * repository creation, issues, pull requests, and other actions taken by members
   * of the organization across all its public repositories.
   *
   * This is useful for monitoring the public activity within an organization,
   * providing insights into how the organization is managing its projects,
   * the work being done by its members, and the overall public engagement with
   * its repositories.
   */
  async getOrganizationEvents(
    input: IGithubService.IGetOrganizationEventInput,
  ): Promise<IGithubService.IGetEventOutput> {
    const { organization, ...rest } = input;
    const per_page = input.per_page ?? 30;
    const queryParameters = createQueryParameter({ ...rest, per_page });

    const url = `https://api.github.com/orgs/${organization}/events?${queryParameters}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
      },
    });

    const link = res.headers["link"];
    return { result: res.data, ...this.getCursors(link) };
  }

  /**
   * Github Service.
   *
   * List repository collaborators
   *
   * For organization-owned repositories, the list of collaborators includes outside collaborators,
   * organization members that are direct collaborators, organization members with access through team memberships,
   * organization members with access through default organization permissions, and organization owners.
   * Organization members with write, maintain, or admin privileges on the organization-owned repository can use this endpoint.
   * Team members will include the members of child teams.
   *
   * You can refer to it before specifying a person in charge of the issue or a reviewer for PR.
   */
  async getCollaborators(
    input: IGithubService.IGetCollaboratorInput,
  ): Promise<IGithubService.IGetCollaboratorOutput> {
    const { owner, repo } = input;
    const url = `https://api.github.com/repos/${owner}/${repo}/collaborators`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
      },
    });

    const link = res.headers["link"];
    return { result: res.data, ...this.getCursors(link) };
  }

  /**
   * Github Service.
   *
   * Create file content in github repository
   *
   * This connector handles file creation only. Use the modification API for existing files.
   * Creating a file is equivalent to a single commit, with commits required for changes like uploads or deletions.
   * When adding a file, confirm the target branch. Avoid default branches unless specified.
   * Users value branches reflecting their work; always confirm file content before adding or modifying.
   * For requests involving a specific PR or branch, use this connector.
   * File content input is encoded to base64 within the connector. Do not pre-encode content manually.
   */
  async createFileContents(
    input: IGithubService.ICreateFileContentInput,
  ): Promise<IGithubService.IUpsertFileContentOutput> {
    try {
      const file = await this.getFileContentsOrNull({
        owner: input.owner,
        repo: input.repo,
        path: input.path,
        branch: input.branch,
      });

      if (file !== null) {
        throw new Error("File already exists in that path.");
      }

      return await this.upsertFileContent(input);
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Github Service.
   *
   * Update file content in github repository
   *
   * Updating a file creates a single commit. Commits are hashes for saving changes like uploads, modifications, or deletions.
   * Ensure the latest sha value is used to avoid conflicts. Check sha via API or from recently created files.
   * Modifying a file overwrites it, not appends to it. Verify existing code and make partial changes if needed.
   * Confirm content with the user before adding or modifying files.
   * For specific PRs or branches, use this connector. Check commit conventions and commit-list for proper messaging.
   * File content is automatically encoded to base64 by the connector; do not pre-encode manually.
   */
  async updateFileContents(
    input: IGithubService.IUpdateFileContentInput,
  ): Promise<IGithubService.IUpsertFileContentOutput> {
    return await this.upsertFileContent(input);
  }

  async upsertFileContent(
    input: PickPartial<IGithubService.IUpdateFileContentInput, "sha">,
  ): Promise<IGithubService.IUpsertFileContentOutput> {
    const { owner, repo, path, ...rest } = input;
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const res = await axios.put(
      url,
      {
        ...rest,
        content: Buffer.from(input.content).toString("base64"),
      },
      {
        headers: {
          Authorization: `Bearer ${this.props.secret}`,
        },
      },
    );

    return res.data;
  }

  /**
   * Github Service.
   *
   * Delete file content in github repository
   *
   * To delete file content is the same as creating a single commit.
   * Commit is a hash that must be created in github to save changes, such as uploading, modifying, deleting, and so on.
   *
   * As the sha value of the file to be modified, a conflict may occur if it is not the latest sha value among the sha values of the file.
   * It's safe when you look up a list of files through API to check sha and put in a value, or want to re-modify the sha value of a file you just created.
   *
   * If the user directly asks you to add, modify, or delete a file for a specific PR or specific branch, this connector should be considered.
   * Many repositories are working on commit conventions. Before committing, it's a good idea to look up the commit-list to see how you leave the commit message.
   */
  async deleteFileContents(
    input: IGithubService.IDeleteFileContentInput,
  ): Promise<void> {
    const { owner, repo, path, ...rest } = input;
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    await axios.delete(url, {
      data: { ...rest },
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
      },
    });
  }

  /**
   * Github Service.
   *
   * Review Repository Folder Structure
   *
   * It allows you to know the overall folder structure by traversing files in the repository.
   * This feature is intended to navigate like a DFS based on folders.
   * If this function is so vast that you cannot see the entire folder, you can pass the `path` again to inquire.
   * The `path` delivered is treated like a Root folder and continues the navigation from this folder.
   * This feature is designed to navigate to the inside two more times, up to steps 0, 1 at a time, based on the root folder.
   *
   * If you want to know the details of the file, it is recommended to use the get-contents connector.
   */
  async getRepositoryFolderStructures(
    input: IGithubService.IGetRepositoryFolderStructureInput,
  ): Promise<IGithubService.IGetRepositoryFolderStructureOutput> {
    const { depth = 2, includeMediaFile = true } = input;
    const rootFiles = await this.getFileContents(input);

    return this.getRepositoryFolders(input, rootFiles, depth, includeMediaFile);
  }

  /**
   * Github Service.
   *
   * Look up repository files(bulk)
   *
   * If the file you want to inquire is a folder, internal files are provided in an array,
   * and if it is a file, it inquires about the encoding method of the file and the body content of the file.
   * Since there may be countless files and folders in the github repository, there may be many files that exceed the rate limit.
   * In this case, you can try to solve this problem by sequentially finding the folders one by one using the corresponding connector.
   * You can pass multiple file paths to view multiple files at the same time.
   * There is no limit to the number of files.
   *
   * This is suitable for viewing files on specific branches, but if the user is for the purpose of viewing details of code reviews or PR, it is recommended to use a different connector.
   * There are connectors that view the list of files changed in PR, or see the changes.
   */
  async getBulkFileContents(
    input: IGithubService.IGetBulkFileContentInput,
  ): Promise<IGithubService.IGetBulkFileContentOutput> {
    if (!input.paths?.length) {
      return [];
    }

    return await Promise.all(
      input.paths?.map(async (path) => {
        return await this.getFileContents({ ...input, path });
      }),
    );
  }

  private async getFileContentsOrNull(
    input: IGithubService.IGetFileContentInput,
  ): Promise<IGithubService.IGetFileContentOutput | null> {
    try {
      const data = await this.getFileContents(input);
      if (data instanceof Array) {
        return data;
      } else {
        return data.type === "null" ? null : data;
      }
    } catch (err) {
      return null;
    }
  }

  /**
   * Github Service.
   *
   * Look up repository files
   *
   * If the file you want to inquire is a folder, internal files are provided in an array,
   * and if it is a file, it inquires about the encoding method of the file and the body content of the file.
   * Since there may be countless files and folders in the github repository, there may be many files that exceed the rate limit.
   * In this case, you can try to solve this problem by sequentially finding the folders one by one using the corresponding connector.
   *
   * This is suitable for viewing files on specific branches, but if the user is for the purpose of viewing details of code reviews or PR, it is recommended to use a different connector.
   * There are connectors that view the list of files changed in PR, or see the changes.
   */
  async getFileContents(
    input: IGithubService.IGetFileContentInput,
  ): Promise<IGithubService.IGetFileContentOutput> {
    try {
      const { owner, repo, path, branch } = input;
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path ? path : ""}`;
      const res = await axios.get(url, {
        params: {
          ref: branch,
        },
        headers: {
          Authorization: `Bearer ${this.props.secret}`,
          "Content-Type": "application/vnd.github.object+json",
        },
      });

      if (res.data instanceof Array) {
        // 폴더를 조회한 경우 폴더 내부의 파일 목록이 조회된다.
        return res.data;
      } else {
        // 파일인 경우 상세 내용이 조회된다.
        const file: IGithubService.RepositoryFile = res.data;
        const isMediaFile = this.isMediaFile(file);

        return {
          ...file,
          ...(file.content && {
            content: isMediaFile
              ? file.content
              : Buffer.from(file.content, "base64").toString("utf-8"),
          }),
        };
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.status === 404) {
          // 우리가 만드는 임의의 타입
          return {
            type: "null",
            size: 0,
            message: "No files exist corresponding to the path.",
          } as const;
        }
      }

      throw err;
    }
  }

  /**
   * Github Service.
   *
   * Read the README file in the repository
   *
   * README is one of the initial settings of the project and usually records a description of this repository,
   * so it's useful if you want to see a rough description of the repository.
   */
  async getReadmeFile(
    input: IGithubService.IGetReadmeFileContentInput,
  ): Promise<IGithubService.IGetReadmeFileContentOutput> {
    try {
      const { owner, repo } = input;
      const url = `https://api.github.com/repos/${owner}/${repo}/readme`;
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.props.secret}`,
          "Content-Type": "application/vnd.github.object+json",
        },
      });

      return {
        ...res.data,
        ...(res.data.content && {
          content: Buffer.from(res.data.content, "base64").toString("utf-8"),
        }),
      };
    } catch (err) {
      return null;
    }
  }

  /**
   * Github Service.
   *
   * List events for the authenticated user
   *
   * If you are authenticated as the given user, you will see your private events. Otherwise, you'll only see public events.
   * You can check all events surrounding the repository, such as who inquired and who forked.
   * It is used in conjunction with a connector that inquires the activity details and is suitable for checking how active the repository is.
   */
  async getRepoEvents(
    input: IGithubService.IGetRepoEventInput,
  ): Promise<IGithubService.IGetEventOutput> {
    const { username, repo, ...rest } = input;
    const per_page = input.per_page ?? 30;
    const queryParameters = createQueryParameter({ ...rest, per_page });

    const url = `https://api.github.com/repos/${username}/${repo}/events?${queryParameters}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
      },
    });

    const link = res.headers["link"];
    return { result: res.data, ...this.getCursors(link) };
  }

  /**
   * Github Service.
   *
   * Fetches events across all forks of a specified repository.
   *
   * This API endpoint provides a stream of events that occur in any fork
   * of the specified repository. It includes actions such as commits,
   * pull requests, issues, and other activity happening in the forked
   * repositories.
   *
   * Use this endpoint when you need to monitor the activity not just
   * in the original repository, but also in all of its forks. This can
   * be particularly useful for understanding the broader impact or
   * activity surrounding a popular project that has been forked multiple
   * times.
   */
  async getNetworkRepoEvents(
    input: IGithubService.IGetRepoEventInput,
  ): Promise<IGithubService.IGetEventOutput> {
    const { username, repo, ...rest } = input;
    const per_page = input.per_page ?? 30;
    const queryParameters = createQueryParameter({ ...rest, per_page });

    const url = `https://api.github.com/networks/${username}/${repo}/events?${queryParameters}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
      },
    });

    const link = res.headers["link"];
    return { result: res.data, ...this.getCursors(link) };
  }

  /**
   * Github Service.
   *
   * List events for the authenticated user
   *
   * This API endpoint retrieves a stream of events related to the authenticated user,
   * including activities such as issues, pull requests, commits, and repository actions
   * that the user has participated in or been mentioned in. The events reflect the user's
   * interactions across all repositories they have access to, both public and private (if
   * the user has appropriate permissions).
   *
   * This is useful for tracking a user's activity on GitHub, allowing you to see a
   * personalized feed of their involvement in various projects and interactions with
   * other users.
   *
   * If you are authenticated as the given user, you will see your private events. Otherwise, you'll only see public events.
   * It looks up users' public events. Username should be your own nickname because you can usually only see your own events.
   */
  async getUserEvents(
    input: IGithubService.IGetUserEventInput,
  ): Promise<IGithubService.IGetEventOutput> {
    const { username, ...rest } = input;
    const per_page = input.per_page ?? 30;
    const queryParameters = createQueryParameter({ ...rest, per_page });

    const url = `https://api.github.com/users/${username}/events?${queryParameters}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
      },
    });

    const link = res.headers["link"];
    return { result: res.data, ...this.getCursors(link) };
  }

  /**
   * Github Service.
   *
   * List public events
   *
   * This API is not built to serve real-time use cases. Depending on the time of day, event latency can be anywhere from 30s to 6h.
   * When I look up the events, they may not be of much value to the user because they are events that occurred on github.
   *
   * It's looking up public events, and it's looking at events that occur on github regardless of the specific user.
   * Therefore, it may not be of much use unless it is a special case.
   * If you want to get your information, it would be more advantageous to use the 'user/get-events' connector.
   */
  async getEvents(
    input: IGithubService.IGetEventInput,
  ): Promise<IGithubService.IGetEventOutput> {
    const per_page = input.per_page ?? 30;
    const queryParameters = createQueryParameter({ ...input, per_page });

    const url = `https://api.github.com/events?${queryParameters}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
      },
    });

    const link = res.headers["link"];
    return { result: res.data, ...this.getCursors(link) };
  }

  async debugToken(): Promise<IGithubService.User> {
    const url = `https://api.github.com/user`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
        Accept: "application/vnd.github+json",
      },
    });

    return res.data;
  }

  /**
   * Github Service.
   *
   * Update an issue in the repository
   *
   * Update an issue, where you can enter labels and assignes together.
   * The information you must enter is who will create the issue in the owner's repository and under what title.
   * The information in the text should follow the markdown grammar allowed by github.
   *
   * In some cases, if you are not the owner of this repository, you may not be able to make any marking on issues such as labels, assignees, milestones, etc.
   * It can also be used to close or reopen issues.
   */
  async updateIssue(
    input: IGithubService.IUpdateIssueInput,
  ): Promise<IGithubService.IUpdateIssueOutput> {
    const { owner, repo, issue_number } = input;
    const url = `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}`;
    const res = await axios.patch(
      url,
      {
        title: input.title,
        body: input.body,
        assignees: input.assignees,
        labels: input.labels,
      },
      {
        headers: {
          Authorization: `Bearer ${this.props.secret}`,
        },
      },
    );
    return res.data;
  }

  /**
   * Github Service.
   *
   * Leave an issue in the repository
   *
   * Create an issue, where you can enter labels and assignes together.
   * The information you must enter is who will create the issue in the owner's repository and under what title.
   * The information in the text should follow the markdown grammar allowed by github.
   *
   * In some cases, if you are not the owner of this repository, you may not be able to make any marking on issues such as labels, assignees, milestones, etc.
   *
   * In order to create issue, you may need to refer to the issue template files that you specified in the .github folder in advance, in which case refer to the connector 'POST /connector/github/repos/get-contents'.
   */
  async createIssue(
    input: IGithubService.ICreateIssueInput,
  ): Promise<IGithubService.ICreateIssueOutput> {
    const { owner, repo } = input;
    const url = `https://api.github.com/repos/${owner}/${repo}/issues`;
    const res = await axios.post(
      url,
      {
        title: input.title,
        body: input.body,
        assignees: input.assignees,
        labels: input.labels,
      },
      {
        headers: {
          Authorization: `Bearer ${this.props.secret}`,
        },
      },
    );
    return res.data;
  }

  /**
   * Github Service.
   *
   * Get repository activities
   *
   * You can use it to see how active your contribution is to the repository
   * because it looks up all the activities that have occurred in the repository.
   *
   * The types of activities that can be viewed here are as follows, and you can also find out by which user it was operated.
   * push, force_push, branch_creation, branch_deletion, pr_merge, merge_queue_merge
   */
  async getRepositoryActivities(
    input: IGithubService.IGetRepositoryActivityInput,
  ): Promise<IGithubService.IGetRepositoryActivityOutput> {
    const { owner, repo, ref, ...rest } = input;
    const per_page = input.per_page ?? 30;
    const queryParameters = createQueryParameter({
      ...rest,
      per_page,
      ...(ref ? { ref: `refs/heads/${ref}` } : {}),
    });

    const url = `https://api.github.com/repos/${owner}/${repo}/activity?${queryParameters}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
      },
    });

    const link = res.headers["link"];
    return { result: res.data, ...this.getCursors(link) };
  }

  /**
   * Github Service.
   *
   * Update pull request
   *
   * Use to change the title or body of a PR, or draft status or open-close status.
   * It can also be used for overwriting labels or modifying them.
   * It can also be used to close or reopen pull request.
   */
  async updatePullRequest(
    input: IGithubService.IUpdatePullRequestInput,
  ): Promise<IGithubService.IUpdatePullRequestOutput> {
    const { owner, repo, pull_number, labels, ...rest } = input;

    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}`;
    const res = await axios.patch(
      url,
      {
        ...rest,
      },
      {
        headers: {
          Authorization: `Bearer ${this.props.secret}`,
        },
      },
    );

    if (labels?.length) {
      const issue_number = pull_number;
      await this.updateIssue({ owner, repo, labels, issue_number });
    }

    return {
      id: res.data.id,
      number: res.data.number,
      title: res.data.title,
    };
  }

  /**
   * Github Service.
   *
   * Create pull request
   *
   * Creates a pull request from a branch to a particular branch.
   * If the branch has already generated a pull request to the base branch, an error of 422 may occur.
   * This error indicates a collision because only one pull request from branch to another branch can exist open at the same time.
   *
   * If the user wants to see each PR unit, this connector will be suitable.
   *
   * When creating a PR, be sure to specify the base branch and the head branch, and even if it can be omitted, be sure to include Titles and bodies as much as possible.
   * You can also create a pull request in draft state if necessary.
   *
   * In order to create PR, you may need to refer to the PULL_REQUEST_TEMPLATE.md file that you specified in the .github folder in advance, in which case refer to the connector 'POST /connector/github/repos/get-contents'.
   */
  async createPullRequest(
    input: IGithubService.ICreatePullRequestInput,
  ): Promise<IGithubService.ICreatePullRequestOutput> {
    try {
      const { owner, repo, ...rest } = input;

      const url = `https://api.github.com/repos/${owner}/${repo}/pulls`;

      const res = await axios.post(
        url,
        {
          ...rest,
        },
        {
          headers: {
            Authorization: `Bearer ${this.props.secret}`,
          },
        },
      );

      return {
        id: res.data.id,
        number: res.data.number,
        title: res.data.title,
      };
    } catch (err) {
      console.error(JSON.stringify((err as any).response.data, null, 2));
      throw err;
    }
  }

  /**
   * Github Service.
   *
   * Search for users by keyword in github
   */
  async searchUser(
    input: IGithubService.ISearchUserInput,
  ): Promise<IGithubService.ISearchUserOutput> {
    const per_page = input.per_page ?? 30;
    const queryParameters = createQueryParameter({ ...input, per_page });
    const url = `https://api.github.com/search/users?${queryParameters}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
        Accept: "application/vnd.github+json",
      },
    });

    const link = res.headers["link"];
    return { result: res.data.items, ...this.getCursors(link) };
  }

  /**
   * Github Service.
   *
   * Look up the user's detailed profile
   *
   * The property information you can find at the time of inquiry is as follows.
   *
   * - avatar_url, bio, blog, company, created_at, email,
   * - followers, following, id, location, login, name,
   * - pinned_repositories, profile_repository, public_gists,
   * - public_repos, twitter_username, type, updated_at
   */
  async getUserProfile(
    input: IGithubService.IGetUserProfileInput,
  ): Promise<IGithubService.IGetUserProfileOutput> {
    const url = `https://api.github.com/users/${input.username}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
        Accept: "application/vnd.github+json",
      },
    });

    const pinned_repositories = await this.getUserPinnedRepository(input);
    const profile_repository = await this.getProfileRepository(input);
    return { ...res.data, profile_repository, pinned_repositories };
  }

  /**
   * Github Service.
   *
   * Get Related Issue List.
   */
  async getIssues(
    input: IGithubService.IGetAuthenticatedUserIssueInput,
  ): Promise<IGithubService.IGetAuthenticatedUserIssueOutput> {
    const per_page = input.per_page ?? 30;
    const queryParameter = createQueryParameter({ ...input, per_page });
    const url = `https://api.github.com/issues?${queryParameter}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
        Accept: "application/vnd.github+json",
      },
    });

    const link = res.headers["link"];
    return { result: res.data, ...this.getCursors(link) };
  }

  /**
   * Github Service.
   *
   * Get a deatiled issue info
   *
   * Unlike the body omitted from the issue list inquiry, it is suitable for viewing details as it can inquire all the contents.
   * However, this connector alone cannot see all the comments or timelines inside, and other connectors must be used.
   */
  async getIssueDetail(
    input: IGithubService.IGetIssueDetailInput,
  ): Promise<IGithubService.IGetIssueDetailOutput> {
    const { owner, repo, issue_number } = input;
    const url = `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
        Accept: "application/vnd.github+json",
      },
    });

    return res.data;
  }

  /**
   * Github Service.
   *
   * List pull request comments
   *
   * You can use the REST API to list comments on issues and pull requests. Every pull request is an issue, but not every issue is a pull request.
   * In any case, you can also view comments with the number on pull request.
   * Issue comments are ordered by ascending ID.
   *
   * This is actually the same as connector POST '/connector/github/repositories/issues/get-comments'.
   * Comments and reviews on PR are separate, you can only see comments on this connector.
   */
  async getPullRequestComments(
    input: IGithubService.IGetPullRequestCommentsInput,
  ): Promise<IGithubService.IGetIssueCommentsOutput> {
    const { owner, repo, pull_number, ...rest } = input;
    const queryParameter = createQueryParameter(rest);
    const url = `https://api.github.com/repos/${owner}/${repo}/issues/${pull_number}/comments?${queryParameter}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
      },
    });

    const link = res.headers["link"];
    return { result: res.data, ...this.getCursors(link) };
  }

  /**
   * Github Service.
   *
   * List issue comments
   *
   * You can use the REST API to list comments on issues and pull requests. Every pull request is an issue, but not every issue is a pull request.
   * In any case, you can also view comments with the number on pull request.
   * Issue comments are ordered by ascending ID.
   */
  async getIssueComments(
    input: IGithubService.IGetIssueCommentsInput,
  ): Promise<IGithubService.IGetIssueCommentsOutput> {
    const { owner, repo, issue_number, ...rest } = input;
    const queryParameter = createQueryParameter(rest);
    const url = `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}/comments?${queryParameter}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
      },
    });

    const link = res.headers["link"];
    return { result: res.data, ...this.getCursors(link) };
  }

  /**
   * Github Service.
   *
   * Create an pull request comment
   */
  async createPullRequestComments(
    input: IGithubService.ICreateIssueCommentInput,
  ): Promise<IGithubService.ICreateIssueCommentOutput> {
    return this.createIssueComments(input);
  }

  /**
   * Github Service.
   *
   * Create an issue comment
   *
   * Add a comment. If you put an issue number, you can add a comment to the issue, where the issue number is also the number of PR.
   * In other words, both issue and PR can add a comment through this connector.
   */
  async createIssueComments(
    input: IGithubService.ICreateIssueCommentInput,
  ): Promise<IGithubService.ICreateIssueCommentOutput> {
    try {
      const { owner, repo, issue_number, body } = input;
      const url = `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}/comments`;
      const res = await axios.post(
        url,
        {
          body,
        },
        {
          headers: {
            Authorization: `Bearer ${this.props.secret}`,
          },
        },
      );

      return res.data;
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      throw err;
    }
  }

  /**
   * Github Service.
   *
   * List organization repositories
   *
   * This endpoint allows you to list all repositories that belong to a specified organization on GitHub.
   * It's useful for viewing all the repositories under an organization’s account, including both public and private repositories, depending on your access level.
   */
  async getOrganizationRepositories(
    input: IGithubService.IGetOrganizationRepositoryInput,
  ): Promise<IGithubService.IGetOrganizationRepositoryOutput> {
    const { organization, ...rest } = input;
    const per_page = input.per_page ?? 30;
    const queryParameter = createQueryParameter({ ...rest, per_page });
    const url = `https://api.github.com/orgs/${organization}/repos?${queryParameter}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
        Accept: "application/vnd.github+json",
      },
    });

    const link = res.headers["link"];
    return { result: res.data, ...this.getCursors(link) };
  }

  /**
   * Github Service.
   *
   * Inquire the user's pinned repositories
   *
   * Inquire up to 6 repositories where the user has pinned.
   * Here, only the name of the repository is searched, so if necessary, find detailed information about the repository by pageing the user's repository list.
   * Placing a pin in a repository is most likely a repository that users are most confident in.
   */
  async getUserPinnedRepository(
    input: IGithubService.IGetUserPinnedRepositoryInput,
  ): Promise<IGithubService.IGetUserPinnedRepositoryOutput> {
    const url = `https://api.github.com/graphql`;
    const res = await axios.post(
      url,
      {
        query: `
        {
          user(login: "${input.username}") {
            pinnedItems(first: 6, types: REPOSITORY) {
              nodes {
                ... on Repository {
                  owner {
                    login
                  },
                  name
                }
              }
            }
          }
        }`,
      },
      {
        headers: {
          Authorization: `Bearer ${this.props.secret}`,
        },
      },
    );

    return res.data.data.user.pinnedItems.nodes.map(
      (el: any) => `${el.owner.login}/${el.name}`,
    );
  }

  /**
   * Github Service.
   *
   * Inquire the user's repositories
   *
   * Since it contains only the simplest information of the repository here, there is no way to know the lead me of the repository or detailed information.
   * It is recommended to use additional connectors to explore because other connectors have the ability to read leads or internal files in the repository.
   */
  async getUserRepositories(
    input: IGithubService.IGetUserRepositoryInput,
  ): Promise<IGithubService.IGetUserRepositoryOutput> {
    const { username, ...rest } = input;
    const per_page = input.per_page ?? 30;
    const queryParameter = createQueryParameter({ ...rest, per_page });
    const url = `https://api.github.com/users/${username}/repos?${queryParameter}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
        Accept: "application/vnd.github+json",
      },
    });

    const repsotories: IGithubService.RepositoryWithReadmeFile[] =
      await Promise.all(
        res.data.map(async (repository: IGithubService.Repository) => {
          const readme = await this.getReadmeFile({
            owner: username,
            repo: repository.name,
          });

          return { ...repository, readme };
        }),
      );
    const link = res.headers["link"];
    return { result: repsotories, ...this.getCursors(link) };
  }

  /**
   * Github Service.
   *
   * Inquire the user's branch
   *
   * You can look up a list of branches in a specific repository.
   * Because it says what the last commit is, and when and to whom it was made,
   * you can see which of the branches is the latest and managed.
   *
   * You shouldn't call the main branch arbitrarily because there may be people who use the master branch.
   */
  async getRepositoryBranches(
    input: IGithubService.IGetBranchInput,
  ): Promise<IGithubService.IGetBranchOutput> {
    const { owner, repo, ...rest } = input;
    const per_page = input.per_page ?? 30;
    const queryParameter = createQueryParameter({ ...rest, per_page });
    const url = `https://api.github.com/repos/${owner}/${repo}/branches?${queryParameter}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
        Accept: "application/vnd.github+json",
      },
    });

    const link = res.headers["link"];
    const branches: IGithubService.IGetBranchOutput["result"] = res.data;
    return {
      result: await Promise.all(
        branches.map(async (branch) => {
          const name = branch.name;
          const detail = await this.getDetailedBranchInfo({ ...input, name });
          const lastCommit = detail.commit.commit;
          return { ...branch, commit: lastCommit };
        }),
      ),
      ...this.getCursors(link),
    };
  }

  /**
   * Github Service.
   *
   * Create branch
   *
   * Creates a reference for your repository. You are unable to create new references for empty repositories, even if the commit SHA-1 hash used exists. Empty repositories are repositories without branches.
   * You need to know the sha of the commit, so if you want to create a branch, you should first call another connector that looks up the commit list or header commitments to find out the sha value.
   * If you want to copy the branch, you should also look up the commit history of the branch and then retrieve the sha value from the branch's HEAD commit.
   */
  async createBranches(
    input: IGithubService.ICreateBranchInput,
  ): Promise<IGithubService.ICreateBranchOutput> {
    const { owner, repo, ref, sha } = input;
    const url = `https://api.github.com/repos/${owner}/${repo}/git/refs`;
    const res = await axios.post(
      url,
      {
        ref,
        sha,
      },
      {
        headers: {
          Authorization: `Bearer ${this.props.secret}`,
        },
      },
    );
    return res.data;
  }

  /**
   * Github Service.
   *
   * List pull requests associated with a commit
   *
   * Fetches the pull requests (PRs) associated with a specific commit in a GitHub repository.
   * This API endpoint retrieves a list of pull requests that include the specified commit.
   * This can be useful for tracking where and how a particular change was merged into a branch.
   */
  async getPullRequestAssociatedWithACommit(
    input: IGithubService.IGetPullRequestInput,
  ): Promise<IGithubService.IGetPullRequestOutput> {
    const { owner, repo, commit_sha } = input;
    const url = `https://api.github.com/repos/${owner}/${repo}/commits/${commit_sha}/pulls`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
      },
    });

    return res.data;
  }

  /**
   * Github Service.
   *
   * Inquire the commit details of the user
   * It contains all the history of how the file changed, so you can see the details of a single commit node.
   * If you do not deliver ref, look up based on default_branch.
   */
  async getCommit(
    input: IGithubService.IGetCommitInput,
  ): Promise<IGithubService.IGetCommitOutput> {
    const { owner, repo, ref } = input;

    let branch = ref;
    if (!branch) {
      const { default_branch } = await this.getRepository(input);
      branch = default_branch;
    }

    const url = `https://api.github.com/repos/${owner}/${repo}/commits/${branch}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
        Accept: "application/vnd.github+json",
      },
    });
    return res.data;
  }

  /**
   * Github Service.
   *
   * Inquire the commit diff of the user
   * diff is Github's own content type specification that allows you to identify changes per commit on the Github homepage.
   * If you do not deliver ref, look up based on default_branch.
   */
  async getCommitDiff(input: IGithubService.IGetCommitInput): Promise<string> {
    const { owner, repo, ref } = input;

    let branch = ref;
    if (!branch) {
      const { default_branch } = await this.getRepository(input);
      branch = default_branch;
    }

    const url = `https://api.github.com/repos/${owner}/${repo}/commits/${branch}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
        Accept: "application/vnd.github.diff",
      },
    });
    return res.data;
  }

  /**
   * Github Service.
   *
   * Look up the list of commitments for a specific repo, a specific branch
   *
   * This function can be used in general because it sees the commit list in units of branches, but if the user wants to see it in units of PR, it is better to use another connector.
   * If the user specifies to view in PR units, use other connectors because there are connectors for viewing files, commit lists, and changes in PR units elsewhere.
   */
  async getCommitList(
    input: IGithubService.IGetCommitListInput,
  ): Promise<IGithubService.IGetCommitListOutput> {
    const { owner, repo, ...rest } = input;
    const per_page = input.per_page ?? 30;
    const queryParameter = createQueryParameter({ ...rest, per_page });
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?${queryParameter}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
        Accept: "application/vnd.github.json",
      },
    });

    const link = res.headers["link"];
    return { result: res.data, ...this.getCursors(link) };
  }

  /**
   * Github Service.
   *
   * Inquire the followers of the user
   *
   * This value can be viewed by about 100 people at a time because it is a page-nated result.
   * If you have someone you're looking for, it's important to keep looking for the next page, even if you haven't found the value on the first page.
   */
  async getFollowers(
    input: IGithubService.IGetFollowerInput,
  ): Promise<IGithubService.IGetFollowerOutput> {
    const { username, ...rest } = input;
    const per_page = input.per_page ?? 30;
    const queryParameter = createQueryParameter({ ...rest, per_page });
    const url = `https://api.github.com/users/${username}/followers?${queryParameter}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
        Accept: "application/vnd.github+json",
      },
    });

    const link = res.headers["link"];
    return { result: res.data, ...this.getCursors(link) };
  }

  /**
   * Github Service.
   *
   * Inquire the followees of the user
   *
   * This value can be viewed by about 100 people at a time because it is a page-nated result.
   * If you have someone you're looking for, it's important to keep looking for the next page, even if you haven't found the value on the first page.
   */
  async getFollowees(
    input: IGithubService.IGetFolloweeInput,
  ): Promise<IGithubService.IGetFolloweeOutput> {
    const { username, ...rest } = input;
    const per_page = input.per_page ?? 30;
    const queryParameter = createQueryParameter({ ...rest, per_page });
    const url = `https://api.github.com/users/${username}/following?${queryParameter}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
        Accept: "application/vnd.github+json",
      },
    });

    const link = res.headers["link"];
    return { result: res.data, ...this.getCursors(link) };
  }

  /**
   * Github Service.
   *
   * List labels for a repository
   *
   * View a list of issues created and used in that repository.
   * Each issue will only have labels that are already registered in this repository.
   * Of course, it doesn't necessarily mean that you have to use only the labels here when creating issues,
   * but it would be beneficial to assign them by referring to the labels here.
   */
  async getLabels(
    input: IGithubService.IGetLabelInput,
  ): Promise<IGithubService.IGetLabelOutput> {
    const { owner, repo, ...rest } = input;
    const per_page = input.per_page ?? 30;
    const queryParameter = createQueryParameter({ ...rest, per_page });
    const url = `https://api.github.com/repos/${owner}/${repo}/labels?${queryParameter}`;

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
      },
    });

    const link = res.headers["link"];
    return { result: res.data, ...this.getCursors(link) };
  }

  /**
   * @param link res.headers['link']에 해당하는 문자열
   * @returns
   */
  private getCursors(link?: string): IGithubService.ICommonPaginationOutput {
    if (!link) {
      return { nextPage: false };
    }

    const metadata: Omit<IGithubService.ICommonPaginationOutput, "nextPage"> =
      link
        .split(",")
        .map((relation) => {
          const beforeRegExp = /(?<=\?before=)[^&]+(?=((&.+)|>;) rel="prev")/g;
          const before = relation.match(beforeRegExp)?.[0];

          if (typeof before === "string") {
            return { before };
          }

          const afterRegExp = /(?<=\?after=)[^&]+(?=((&.+)|>;) rel="next")/g;
          const after = relation.match(afterRegExp)?.[0];

          if (typeof after === "string") {
            return { after };
          }

          const prevRegExp = /(?<=\bpage=)\d+(?=((&.+)|>;) rel="prev")/g;
          const prev = relation.match(prevRegExp)?.[0];

          if (typeof prev === "string") {
            return { prev: Number(prev) };
          }

          const nextRegExp = /(?<=\bpage=)\d+(?=((&.+)|>;) rel="next")/g;
          const next = relation.match(nextRegExp)?.[0];

          if (typeof next === "string") {
            return { next: Number(next) };
          }

          const lastRegExp = /(?<=\bpage=)\d+(?=((&.+)|>;) rel="last")/g;
          const last = relation.match(lastRegExp)?.[0];

          if (typeof last === "string") {
            return { last: Number(last) };
          }

          const firstRegExp = /(?<=\bpage=)\d+(?=((&.+)|>;) rel="first")/g;
          const first = relation.match(firstRegExp)?.[0];

          if (typeof first === "string") {
            return { first: Number(first) };
          }

          return {};
        })
        .reduce((acc, cur) => Object.assign(acc, cur), {});

    return {
      ...metadata,
      nextPage: metadata.after || metadata.next ? true : false,
    };
  }

  /**
   * 폴더 내부를 조회한다.
   *
   * @param input
   * @param files
   * @param depth root files 이후의 조회를 시작하기 때문에 2면 최대 children이 2단계 Depth까지, 즉 폴더의 폴더의 파일들까지 조회하게 된다.
   * @returns
   */
  private async getRepositoryFolders(
    input: Pick<IGithubService.IGetFileContentInput, "owner" | "repo">,
    files: IGithubService.IGetFileContentOutput,
    depth: number,
    includeMediaFile: boolean,
  ): Promise<IGithubService.IGetRepositoryFolderStructureOutput> {
    const response: IGithubService.IGetRepositoryFolderStructureOutput = [];
    if (files instanceof Array) {
      const isNotSourceFolders = ["test", "benchmark", "yarn", "pnp"] as const;
      const targets = includeMediaFile
        ? files
        : files
            .filter((file) => {
              return isNotSourceFolders.every((el) => !file.path.includes(el));
            })
            .filter((file) => {
              return !this.isMediaFile(file);
            });

      for await (const file of targets) {
        // 2단계 depth까지의 폴더만 순회하도록 하기
        if (file.type === "dir") {
          if (0 < depth) {
            const path = file.path;
            const next = depth - 1;
            const inners = await this.getFileContents({ ...input, path });
            const scanned = await this.getRepositoryFolders(
              input,
              inners,
              next,
              includeMediaFile,
            );
            const children = scanned.map((el) => typia.misc.assertClone(el));
            response.push({ ...file, children });
          } else {
            // 탐색 범위를 넘어서는 폴더기 때문에 children을 빈배열로 담는다.
            response.push({ ...file, children: [] });
          }
        } else {
          response.push(file);
        }
      }
    }
    return response;
  }

  private async traverseTree(
    input: IGithubService.IAnalyzeInput,
    folder: ElementOf<IGithubService.IGetRepositoryFolderStructureOutput>,
    traverseOption: {
      result: any[][];
      currentIndex: number;
      currentSize: number;
    },
  ): Promise<void> {
    // 더 이상 담을 수 없는 케이스
    if (traverseOption.currentIndex === 5) {
      return;
    }

    if (folder.type !== "dir") {
      throw new Error("파일은 순회할 수 없습니다.");
    }

    await Promise.allSettled(
      folder.children
        .filter(
          (file) =>
            !file.path.includes("test") &&
            !file.path.includes("benchmark") &&
            !file.path.includes("yarn") &&
            !file.path.includes("pnp") &&
            this.isMediaFile(file) === false,
        )
        .map(async (child) => {
          if (traverseOption.currentIndex === 5) {
            return;
          }

          type E =
            ElementOf<IGithubService.IGetRepositoryFolderStructureOutput>;
          const file = child as E;

          const path = file.path;
          if (child.type === "dir") {
            await this.traverseTree(input, child, traverseOption);
          } else {
            const detailed = await this.getFileContents({ ...input, path });
            const { content } =
              typia.assert<IGithubService.RepositoryFile>(detailed);
            child.content = content;

            if (3 * 1024 * 1024 < traverseOption.currentSize + file.size) {
              traverseOption.currentSize = 0;
              traverseOption.currentIndex += 1;
              console.log(`${file.path} 파일을 만나서 파일 인덱스 증가 연산`);
            }

            if (traverseOption.currentIndex === 5) {
              return;
            }

            traverseOption.currentSize += file.size;
            traverseOption.result[traverseOption.currentIndex]?.push(child);
          }
        }),
    );
  }

  private async getProfileRepository(input: {
    username: string;
  }): Promise<IGithubService.ProfileRepository> {
    try {
      let page = 1;
      let repo: IGithubService.Repository | null = null;
      while (true) {
        if (page === 10) {
          break;
        }

        const res = await this.getUserRepositories({
          username: input.username,
          per_page: 100,
          page,
        });

        repo = res.result.find((el) => el.name === input.username) ?? null;
        if (repo) {
          break;
        }

        if (res.nextPage === false) {
          break;
        }

        if (typeof res.next !== "number") {
          break;
        }

        page++;
      }

      if (repo) {
        const readme = await this.getReadmeFile({
          owner: input.username,
          repo: input.username,
        });

        return { ...repo, readme };
      }

      return null;
    } catch (err) {
      return null;
    }
  }

  private isMediaFile(
    file: Pick<
      IGithubService.RepositoryFile | IGithubService.RepositoryFolder,
      "path"
    >,
  ) {
    const splited = file.path.split(".");
    const extension = splited[splited.length - 1];

    if (file.path.endsWith("package.json")) {
      // package.json만 허용한다.
      return false;
    }

    return (
      imageExtensions.some((el) => el === extension) ||
      videoExtensions.some((el) => el === extension) ||
      docsExtensions.some((el) => el === extension)
    );
  }

  private async getDetailedBranchInfo(
    input: IGithubService.IGetBranchInput & { name: string },
  ): Promise<{ commit: { commit: IGithubService.Commit } }> {
    const { owner, repo, name } = input;
    const url = `https://api.github.com/repos/${owner}/${repo}/branches/${name}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
        Accept: "application/vnd.github+json",
      },
    });

    return res.data;
  }
}
