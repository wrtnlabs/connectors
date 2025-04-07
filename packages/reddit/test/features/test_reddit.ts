import { RedditService } from "@wrtnlabs/connector-reddit";
import assert from "assert";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

export const test_reddit_get_hot_posts = async () => {
  const redditService = new RedditService({
    redditClientId: TestGlobal.env.REDDIT_CLIENT_ID,
    redditClientSecret: TestGlobal.env.REDDIT_CLIENT_SECRET,
    redditRefreshToken: TestGlobal.env.REDDIT_TEST_SECRET,
  });

  const firstPage = await redditService.getHotPosts({
    limit: 1,
    subreddit: "r/programming",
  });
  typia.validate(firstPage);

  const secondPage = await redditService.getHotPosts({
    limit: 1,
    subreddit: "r/programming",
    ...(firstPage.after && { after: firstPage.after }), // 다음 페이지가 존재하는지를 확인한다.
  });
  typia.validate(secondPage);
  assert.notDeepStrictEqual(firstPage, secondPage);
};

export const test_reddit_get_new_posts = async () => {
  const redditService = new RedditService({
    redditClientId: TestGlobal.env.REDDIT_CLIENT_ID,
    redditClientSecret: TestGlobal.env.REDDIT_CLIENT_SECRET,
    redditRefreshToken: TestGlobal.env.REDDIT_TEST_SECRET,
  });

  const firstPage = await redditService.getNewPosts({
    limit: 1,
    subreddit: "r/programming",
  });
  typia.validate(firstPage);

  const secondPage = await redditService.getNewPosts({
    limit: 1,
    subreddit: "r/programming",
    ...(firstPage.after && { after: firstPage.after }), // 다음 페이지가 존재하는지를 확인한다.
  });
  typia.validate(secondPage);
  assert.notDeepStrictEqual(firstPage, secondPage);
};

export const test_reddit_get_top_posts = async () => {
  const redditService = new RedditService({
    redditClientId: TestGlobal.env.REDDIT_CLIENT_ID,
    redditClientSecret: TestGlobal.env.REDDIT_CLIENT_SECRET,
    redditRefreshToken: TestGlobal.env.REDDIT_TEST_SECRET,
  });

  const firstPage = await redditService.getTopPosts({
    limit: 1,
    subreddit: "r/programming",
  });
  typia.validate(firstPage);

  const secondPage = await redditService.getTopPosts({
    limit: 1,
    subreddit: "r/programming",
    ...(firstPage.after && { after: firstPage.after }), // 다음 페이지가 존재하는지를 확인한다.
  });
  typia.validate(secondPage);
  assert.notDeepStrictEqual(firstPage, secondPage);
};

export const test_reddit_get_comments_of_top_posts_about_programming =
  async () => {
    const redditService = new RedditService({
      redditClientId: TestGlobal.env.REDDIT_CLIENT_ID,
      redditClientSecret: TestGlobal.env.REDDIT_CLIENT_SECRET,
      redditRefreshToken: TestGlobal.env.REDDIT_TEST_SECRET,
    });

    const topPost = await redditService.getTopPosts({
      limit: 5,
      subreddit: "r/programming",
    });

    for await (const post of topPost.children) {
      const firstPage = await redditService.getComments({
        limit: 100,
        article: post.data.id,
        subreddit: "r/programming",
      });
      typia.validate(firstPage);
    }
  };

export const test_reddit_get_comments_of_top_posts_about_korean = async () => {
  const redditService = new RedditService({
    redditClientId: TestGlobal.env.REDDIT_CLIENT_ID,
    redditClientSecret: TestGlobal.env.REDDIT_CLIENT_SECRET,
    redditRefreshToken: TestGlobal.env.REDDIT_TEST_SECRET,
  });

  const topPost = await redditService.getTopPosts({
    limit: 5,
    subreddit: "r/korean",
  });

  for await (const post of topPost.children) {
    const firstPage = await redditService.getComments({
      limit: 100,
      article: post.data.id,
      subreddit: "r/korean",
    });
    typia.validate(firstPage);
  }
};

export const test_reddit_get_comments_of_top_posts_about_gaming = async () => {
  const redditService = new RedditService({
    redditClientId: TestGlobal.env.REDDIT_CLIENT_ID,
    redditClientSecret: TestGlobal.env.REDDIT_CLIENT_SECRET,
    redditRefreshToken: TestGlobal.env.REDDIT_TEST_SECRET,
  });

  const topPost = await redditService.getTopPosts({
    limit: 5,
    subreddit: "r/gaming",
  });

  for await (const post of topPost.children) {
    const firstPage = await redditService.getComments({
      limit: 100,
      article: post.data.id,
      subreddit: "r/gaming",
    });

    typia.validate(firstPage);
  }
};

export const test_reddit_get_user_about = async () => {
  const redditService = new RedditService({
    redditClientId: TestGlobal.env.REDDIT_CLIENT_ID,
    redditClientSecret: TestGlobal.env.REDDIT_CLIENT_SECRET,
    redditRefreshToken: TestGlobal.env.REDDIT_TEST_SECRET,
  });

  const res = await redditService.getUserAbout({
    username: "Any-Statement-9078",
  });

  typia.assert(res);
};

export const test_reddit_get_multiple_user_about = async () => {
  const redditService = new RedditService({
    redditClientId: TestGlobal.env.REDDIT_CLIENT_ID,
    redditClientSecret: TestGlobal.env.REDDIT_CLIENT_SECRET,
    redditRefreshToken: TestGlobal.env.REDDIT_TEST_SECRET,
  });

  const topPost = await redditService.getTopPosts({
    limit: 1,
    subreddit: "r/gaming",
  });

  const comments = await redditService.getComments({
    limit: 5,
    article: topPost.children[0]!.data.id,
    subreddit: "r/gaming",
  });

  const flat = redditService.flatComments(comments.comments);

  for (const child of flat.flatComments) {
    const author = child.kind === "t1" ? (child.data.author ?? "") : "";
    if (author) {
      const res = await redditService.getUserAbout({
        username: author,
      });

      typia.assert(res);
    }
  }
};

export const test_reddit_get_user_submmited = async () => {
  const redditService = new RedditService({
    redditClientId: TestGlobal.env.REDDIT_CLIENT_ID,
    redditClientSecret: TestGlobal.env.REDDIT_CLIENT_SECRET,
    redditRefreshToken: TestGlobal.env.REDDIT_TEST_SECRET,
  });

  const topPost = await redditService.getTopPosts({
    limit: 5,
    subreddit: "r/gaming",
  });

  for (const child of topPost.children) {
    const username = child.data.author;
    const res = await redditService.getUserSubmitted({
      username: username as string,
    });

    typia.assert(res);
  }
};

export const test_reddit_get_user_comments = async () => {
  const redditService = new RedditService({
    redditClientId: TestGlobal.env.REDDIT_CLIENT_ID,
    redditClientSecret: TestGlobal.env.REDDIT_CLIENT_SECRET,
    redditRefreshToken: TestGlobal.env.REDDIT_TEST_SECRET,
  });

  const topPost = await redditService.getTopPosts({
    limit: 5,
    subreddit: "r/gaming",
  });

  for (const child of topPost.children) {
    const username = child.data.author;
    const res = await redditService.getUserComments({
      username: username as string,
    });

    typia.assert(res);
  }
};

export const test_reddit_search_subreddits = async () => {
  const redditService = new RedditService({
    redditClientId: TestGlobal.env.REDDIT_CLIENT_ID,
    redditClientSecret: TestGlobal.env.REDDIT_CLIENT_SECRET,
    redditRefreshToken: TestGlobal.env.REDDIT_TEST_SECRET,
  });

  const res = await redditService.searchSubreddits({
    q: "nestia",
  });

  typia.assert(res);
};

export const test_reddit_get_popular_subreddits = async () => {
  const redditService = new RedditService({
    redditClientId: TestGlobal.env.REDDIT_CLIENT_ID,
    redditClientSecret: TestGlobal.env.REDDIT_CLIENT_SECRET,
    redditRefreshToken: TestGlobal.env.REDDIT_TEST_SECRET,
  });

  const res = await redditService.getPopularSubreddits({
    limit: 1,
  });

  typia.assert(res);
};

export const test_reddit_get_subreddit_about = async () => {
  const redditService = new RedditService({
    redditClientId: TestGlobal.env.REDDIT_CLIENT_ID,
    redditClientSecret: TestGlobal.env.REDDIT_CLIENT_SECRET,
    redditRefreshToken: TestGlobal.env.REDDIT_TEST_SECRET,
  });

  const res = await redditService.getSubredditAbout({
    subreddit: "r/programming",
  });

  typia.assert(res);
};

export const test_reddit_get_best_content = async () => {
  const redditService = new RedditService({
    redditClientId: TestGlobal.env.REDDIT_CLIENT_ID,
    redditClientSecret: TestGlobal.env.REDDIT_CLIENT_SECRET,
    redditRefreshToken: TestGlobal.env.REDDIT_TEST_SECRET,
  });

  const firstPage = await redditService.getBestContent({
    limit: 1,
  });
  typia.validate(firstPage);

  const secondPage = await redditService.getBestContent({
    limit: 1,
    ...(firstPage.after && { after: firstPage.after }), // 다음 페이지가 존재하는지를 확인한다.
  });
  typia.validate(secondPage);
  assert.notDeepStrictEqual(firstPage, secondPage);
};

export const test_reddit_get_comments_are_flatten = async () => {
  const redditService = new RedditService({
    redditClientId: TestGlobal.env.REDDIT_CLIENT_ID,
    redditClientSecret: TestGlobal.env.REDDIT_CLIENT_SECRET,
    redditRefreshToken: TestGlobal.env.REDDIT_TEST_SECRET,
  });

  const topPost = await redditService.getTopPosts({
    limit: 1,
    subreddit: "r/programming",
  });

  const post = topPost.children[0]!;

  const comments = await redditService.getComments({
    limit: 10,
    article: post.data.id,
    subreddit: "r/programming",
  });

  typia.validate(comments);
};
