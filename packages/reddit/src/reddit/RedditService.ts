import axios from "axios";
import typia from "typia";
import { IRedditService } from "../structures/IRedditService";
import { createQueryParameter } from "@wrtnlabs/connector-shared";

export class RedditService {
  constructor(private readonly props: IRedditService.IProps) {}

  /**
   * Reddit Service.
   *
   * Retrieves hot posts from Reddit.
   *
   * This API fetches the most popular posts currently trending on Reddit.
   * The input requires a subreddit name and optional parameters for filtering.
   * The output provides a list of hot posts with details such as title, author, and score.
   */
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

  /**
   * Reddit Service.
   *
   * Retrieves new posts from Reddit.
   *
   * This API fetches the latest posts from a specified subreddit.
   * The input requires a subreddit name and optional parameters for pagination.
   * The output provides a list of new posts with details such as title, author, and timestamp.
   */
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

  /**
   * Reddit Service.
   *
   * Retrieves top posts from Reddit.
   *
   * This API fetches the highest-rated posts from a specified subreddit over a given time period.
   * The input requires a subreddit name and a time filter (e.g., day, week, month).
   * The output provides a list of top posts with details such as title, author, and score.
   */
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

  /**
   * Reddit Service.
   *
   * Retrieves comments from a Reddit post.
   *
   * This API fetches comments for a specific Reddit post.
   * The input requires the post ID and subreddit name.
   * The output provides a list of comments with details such as author, content, and score.
   */
  flatComments(
    input: IRedditService.IGetCommentsOutput["comments"],
  ): IRedditService.IFlattenCommentsOutput {
    const idx = input.children.findIndex((el) => el.kind === "more");
    const more = idx === -1 ? null : input.children.splice(idx, 1)[0];
    typia.assertGuard<IRedditService.IChildMore | null>(more);

    function flat(
      children?: (IRedditService.IChildComment | IRedditService.IChildMore)[],
    ): IRedditService.IChildComment[] {
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

  /**
   * Reddit Service.
   *
   * Retrieves information about a Reddit user.
   *
   * This API fetches profile information for a specified Reddit user.
   * The input requires the username.
   * The output provides user details such as karma, account age, and recent activity.
   */
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

  /**
   * Reddit Service.
   *
   * Retrieves posts submitted by a Reddit user.
   *
   * This API fetches posts submitted by a specified Reddit user.
   * The input requires the username.
   * The output provides a list of submitted posts with details such as title, subreddit, and score.
   */
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

  /**
   * Reddit Service.
   *
   * Retrieves comments made by a Reddit user.
   *
   * This API fetches comments made by a specified Reddit user.
   * The input requires the username.
   * The output provides a list of comments with details such as content, subreddit, and score.
   */
  async getUserComments(
    input: IRedditService.IGetUserCommentsInput,
  ): Promise<IRedditService.IFlattenCommentsOutput> {
    const { username, ...rest } = input;
    const accessToken = await this.getAccessToken();
    const queryParams = createQueryParameter(rest);
    const url = `https://oauth.reddit.com/user/${username}/comments?${queryParams}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return this.flatComments(response.data.data);
  }

  /**
   * Reddit Service.
   *
   * Searches for subreddits on Reddit.
   *
   * This API allows searching for subreddits based on a query string.
   * The input requires a search query.
   * The output provides a list of subreddits matching the query with details such as name and subscriber count.
   */
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

  /**
   * Reddit Service.
   *
   * Retrieves information about a subreddit.
   *
   * This API fetches detailed information about a specified subreddit.
   * The input requires the subreddit name.
   * The output provides details such as description, subscriber count, and rules.
   */
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

  /**
   * Reddit Service.
   *
   * Retrieves popular subreddits.
   *
   * This API fetches a list of currently popular subreddits.
   * The output provides details such as subreddit name and subscriber count.
   */
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

  /**
   * Reddit Service.
   *
   * Retrieves the best content from Reddit.
   *
   * This API fetches the best-rated content from Reddit.
   * The output provides a list of top-rated posts with details such as title, author, and score.
   */
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
      `${this.props.redditClientId}:${this.props.redditClientSecret}`,
      "utf8",
    ).toString("base64");

    const url = `https://www.reddit.com/api/v1/access_token` as const;
    const res = await axios.post(
      url,
      {
        grant_type: "refresh_token",
        refresh_token: this.props.redditRefreshToken,
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
