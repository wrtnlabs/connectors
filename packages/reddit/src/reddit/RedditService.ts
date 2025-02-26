import axios from "axios";
import typia from "typia";
import { IRedditService } from "../structures/IRedditService";
import { createQueryParameter } from "@wrtnlabs/connector-shared";

export class RedditService {
  constructor(private readonly props: IRedditService.IProps) {}

  async getHotPosts(
    input: IRedditService.IGetHotPostsInput,
  ): Promise<IRedditService.IGetHotPostsOutput> {
    try {
      const { subreddit, ...rest } = input;
      const accessToken = await this.getAccessToken();
      const queryParams = createQueryParameter(rest);
      const url = `https://oauth.reddit.com${subreddit ? `/${subreddit}` : ""}/hot?${queryParams}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data.data;
    } catch (err) {
      throw err;
    }
  }

  async getNewPosts(
    input: IRedditService.IGetNewPostsInput,
  ): Promise<IRedditService.IGetNewPostsOutput> {
    const { subreddit, ...rest } = input;
    const accessToken = await this.getAccessToken();
    const queryParams = createQueryParameter(rest);
    const url = `https://oauth.reddit.com${subreddit ? `/${subreddit}` : ""}/new?${queryParams}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.data;
  }

  async getTopPosts(
    input: IRedditService.IGetTopPostsInput,
  ): Promise<IRedditService.IGetTopPostsOutput> {
    const { subreddit, ...rest } = input;
    const accessToken = await this.getAccessToken();
    const queryParams = createQueryParameter(rest);
    const url = `https://oauth.reddit.com${subreddit ? `/${subreddit}` : ""}/top?${queryParams}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  }

  flatComments(
    input: IRedditService.IGetCommentsOutput["comments"],
  ): IRedditService.IFlattenCommentsOutput {
    const idx = input.children.findIndex((el) => el.kind === "more");
    const more = idx === -1 ? null : input.children.splice(idx, 1)[0];
    typia.assertGuard<IRedditService.ChildMore | null>(more);

    function flat(
      children?: (IRedditService.ChildComment | IRedditService.ChildMore)[],
    ): IRedditService.ChildComment[] {
      if (!children) {
        return [];
      }

      return children
        .filter((child) => child.kind === "t1")
        .flatMap((child) => {
          if (typeof child.data.replies !== "string") {
            const descendants = flat(child.data.replies?.data.children);
            delete child.data.replies;
            return [child, ...descendants];
          }

          return [child];
        });
    }

    return { more, flatComments: flat(input.children) };
  }

  async getComments(
    input: IRedditService.IGetCommentsInput,
  ): Promise<IRedditService.IGetCommentsOutput> {
    const { subreddit, article, ...rest } = input;
    const accessToken = await this.getAccessToken();
    const queryParams = createQueryParameter(rest);
    const url = `https://oauth.reddit.com/${subreddit}/comments/${article}?${queryParams}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const [{ data: articles }, { data: comments }] = response.data;
    return { articles, comments };
  }

  async getUserAbout(
    input: IRedditService.IGetUserAboutInput,
  ): Promise<IRedditService.IGetUserAboutOutput> {
    const accessToken = await this.getAccessToken();
    const response = await axios.get(
      `https://oauth.reddit.com/user/${input.username}/about`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  }

  async getUserSubmitted(
    input: IRedditService.IGetUserSubmittedInput,
  ): Promise<IRedditService.IGetUserSubmittedOutput> {
    const { username, ...rest } = input;
    const accessToken = await this.getAccessToken();
    const queryParams = createQueryParameter(rest);
    const url = `https://oauth.reddit.com/user/${username}/submitted?${queryParams}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  }

  async getUserComments(
    input: IRedditService.IGetUserCommentsInput,
  ): Promise<IRedditService.IGetUserCommentsOutput> {
    const { username, ...rest } = input;
    const accessToken = await this.getAccessToken();
    const queryParams = createQueryParameter(rest);
    const url = `https://oauth.reddit.com/user/${username}/comments?${queryParams}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  }

  async searchSubreddits(
    input: IRedditService.ISearchSubredditsInput,
  ): Promise<IRedditService.ISearchSubredditsOutput> {
    const { ...rest } = input;
    const accessToken = await this.getAccessToken();
    const queryParams = createQueryParameter(rest);
    const url = `https://oauth.reddit.com/subreddits/search?${queryParams}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  }

  async getSubredditAbout(
    input: IRedditService.IGetSubredditAboutInput,
  ): Promise<IRedditService.IGetSubredditAboutOutput> {
    const accessToken = await this.getAccessToken();
    const url = `https://oauth.reddit.com/${input.subreddit}/about`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.data;
  }

  async getPopularSubreddits(
    input: IRedditService.IGetPopularSubredditsInput,
  ): Promise<IRedditService.IGetPopularSubredditsOutput> {
    const { ...rest } = input;
    const accessToken = await this.getAccessToken();
    const queryParams = createQueryParameter(rest);
    const url = `https://oauth.reddit.com/subreddits/popular?${queryParams}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.data;
  }

  async getBestContent(
    input: IRedditService.IGetBestContentInput,
  ): Promise<IRedditService.IGetBestContentOutput> {
    const { ...rest } = input;
    const accessToken = await this.getAccessToken();
    const queryParameter = createQueryParameter(rest);
    const url = `https://oauth.reddit.com/best?${queryParameter}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.data;
  }

  private async getAccessToken(): Promise<string> {
    const acessToken = await this.refresh();
    return acessToken;
  }

  private async refresh(): Promise<string> {
    const Basic = Buffer.from(
      `${this.props.clientId}:${this.props.clientSecret}`,
      "utf8",
    ).toString("base64");

    const url = `https://www.reddit.com/api/v1/access_token` as const;
    const res = await axios.post(
      url,
      {
        grant_type: "refresh_token",
        refresh_token: this.props.secret,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Basic}`,
        },
      },
    );

    return res.data.access_token;
  }
}
