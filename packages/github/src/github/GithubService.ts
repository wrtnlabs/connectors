import axios, { AxiosError } from "axios";
import typia from "typia";
import { IGithubService } from "../structures/IGithubService";
import {
  createQueryParameter,
  docsExtensions,
  ElementOf,
  imageExtensions,
  PickPartial,
  StrictOmit,
  videoExtensions,
} from "@wrtnlabs/connector-shared";
import { AwsS3Service } from "@wrtnlabs/connector-aws-s3";

export class GithubService {
  private readonly s3?: AwsS3Service;

  constructor(private readonly props: IGithubService.IProps) {
    if (this.props.aws?.s3) {
      this.s3 = new AwsS3Service({
        ...this.props.aws.s3,
      });
    }
  }

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

  async copyAllFiles(
    input: IGithubService.IAnalyzeInput,
  ): Promise<IGithubService.IAnalyzeOutput> {
    // 이전에 분석했던 기록이 있는지 보기 위해 유니크한 키를 만든다. (owner, repo, commit hash를 이용한다.)
    const { default_branch: commit_sha } = await this.getRepository(input);
    const head = await this.getCommitHeads({ ...input, commit_sha });
    const AWS_KEY = `connector/github/repos/analyzed/${input.owner}/${input.repo}/${head.sha}`;

    // // 이미 분석한 적 있을 경우 AWS S3에서 조회하여 갖고 온다.
    // const fileUrl = this.s3.getFileUrl(AWS_KEY);
    // const isSaved = await this.s3.getGetObjectUrl(fileUrl);
    // console.log(isSaved, "isSaved");
    // if (isSaved) {
    //   const counts = [0, 1, 2, 3, 4] as const;
    //   return counts
    //     .map((file_count) => `${AWS_KEY}/${file_count}.txt`)
    //     .map((key) => this.s3.getFileUrl(key));
    // }

    const MAX_SIZE = 3 * 1024 * 1024;
    const MAX_DEPTH = 100;

    // 전체 폴더 구조 가져오기
    const rootFiles = await this.getRepositoryFolderStructures({
      ...input,
      depth: MAX_DEPTH,
      includeMediaFile: false,
    });

    // 전체 순회하며 파일인 경우 content를 가져오게 하기
    const traverseOption = {
      result: [[], [], [], [], []] as StrictOmit<
        IGithubService.RepositoryFile,
        "encoding"
      >[][],
      currentIndex: 0,
      currentSize: 0,
    };

    if (rootFiles instanceof Array) {
      await Promise.allSettled(
        rootFiles
          .filter(
            (file) =>
              !file.path.includes("test") &&
              !file.path.includes("benchmark") &&
              !file.path.includes("yarn") &&
              !file.path.includes("pnp") &&
              this.isMediaFile(file) === false,
          )
          .map(async (file) => {
            if (traverseOption.currentIndex === 5) {
              return;
            }

            const path = file.path;
            if (file.type === "dir") {
              await this.traverseTree(input, file, traverseOption);
            } else {
              const detailed = await this.getFileContents({ ...input, path });
              const { content } =
                typia.assert<IGithubService.RepositoryFile>(detailed);

              if (MAX_SIZE < traverseOption.currentSize + file.size) {
                traverseOption.currentSize = 0; // 사이즈 초기화
                traverseOption.currentIndex += 1; // 다음 파일 인덱스로 이전
                console.log(`${file.path} 파일을 만나서 파일 인덱스 증가 연산`);
              }

              if (traverseOption.currentIndex === 5) {
                return;
              }

              traverseOption.currentSize += file.size;
              traverseOption.result[traverseOption.currentIndex]?.push({
                ...file,
                content,
              });
            }
          }),
      );
    }

    const analyzedFiles = traverseOption.result.filter((el) => el.length);
    const links: string[] = [];
    if (analyzedFiles) {
      let FILE_NUM = 0;
      for await (const analyzedFile of analyzedFiles) {
        const key = `${AWS_KEY}/${FILE_NUM}.txt`;
        const link = await this.upload({ files: analyzedFile, key });
        links.push(link);
        FILE_NUM++;
      }
    }

    return links;
  }

  async upload(input: {
    files: Pick<IGithubService.RepositoryFile, "path" | "content">[];
    key: string;
  }) {
    const { files, key } = input;
    if (!this.s3) {
      throw new Error("AWS S3 Not Applied.");
    }

    const stringified = files.map(({ path, content }) => ({ path, content }));
    const buffer = Buffer.from(JSON.stringify(stringified), "utf-8");
    const link = await this.s3.uploadObject({
      contentType: "text/plain; charset=utf-8;",
      data: buffer,
      key,
    });

    return link;
  }

  // async analyze(
  //   input: IGithubService.IAnalyzeInput,
  // ): Promise<IRag.IAnalysisOutput> {
  //   const urls = await this.copyAllFiles(input);
  //   return await this.ragProvider.analyze({ url: urls });
  // }

  async getRepository(input: {
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

  async call(input: IGithubService.ICallInput) {
    const res = await axios.get(input.url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
      },
    });

    return res.data;
  }

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

  async getRepositoryIssues(
    input: IGithubService.IGetRepositoryIssueInput,
  ): Promise<IGithubService.IGetRepositoryIssueOutput> {
    const { owner, repo, ...rest } = input;
    const per_page = input.per_page ?? 30;
    const queryParameter = createQueryParameter({ ...rest, per_page });
    const url = `https://api.github.com/repos/${owner}/${repo}/issues?${queryParameter}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.props.secret}`,
        Accept: "application/vnd.github+json",
      },
    });

    const link = res.headers["link"];
    return { result: res.data, ...this.getCursors(link) };
  }

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

  async updateFileContents(
    input: IGithubService.IUpdateFileContentInput,
  ): Promise<IGithubService.IUpsertFileContentOutput> {
    return await this.upsertFileContent(input);
  }

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

  async getRepositoryFolderStructures(
    input: IGithubService.IGetRepositoryFolderStructureInput,
  ): Promise<IGithubService.IGetRepositoryFolderStructureOutput> {
    const { depth = 2, includeMediaFile = true } = input;
    const rootFiles = await this.getFileContents(input);

    return this.getRepositoryFolders(input, rootFiles, depth, includeMediaFile);
  }

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

  async getFileContentsOrNull(
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

  async getDetailedBranchInfo(
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
}
