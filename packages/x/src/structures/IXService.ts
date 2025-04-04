import { tags } from "typia";
import { SnakeToCamel } from "@wrtnlabs/connector-shared";

/**
 * Write the environment variables that are required for the AWS S3 service.
 */
export const ENV_LIST = [
  "X_CLIENT_ID",
  "X_CLIENT_SECRET",
  "X_BEARER_TOKEN",
] as const;

export namespace IXService {
  export type IProps = {
    [key in SnakeToCamel<(typeof ENV_LIST)[number]>]: string;
  };

  /**
   * @title User Search Condition
   */
  export interface IUserInput {
    /**
     * User name for search
     *
     * @title Twitter user name
     */
    userNames: string[];
  }

  /**
   * @title User Information data
   */
  export interface IUserOutput {
    /**
     * The unique id of the user
     *
     * @title User ID
     */
    id: string;

    /**
     * The display name of the user
     *
     * @title name
     */
    name: string;

    /**
     * The user name of user
     *
     * @title user name
     */
    userName: string;
  }

  /**
   * @title User Tweet Time Line Input
   */
  export interface IUserTweetTimeLineInput {
    /**
     * User information for search user tweet time line
     *
     * @title user
     */
    user: {
      /**
       * The unique id of the user for search user tweet time line
       *
       * @title user id
       */
      id: string;

      /**
       * The original user name
       *
       * @title user name
       */
      name: string;

      /**
       * The user name of twitter
       *
       * @title twitter user name
       */
      userName: string;
    }[];
  }

  /**
   * @title User Tweet Time Line data
   */
  export interface ITweetOutput {
    /**
     * The unique id of the tweet
     *
     * @title tweet ID
     */
    id: string;

    /**
     * The user name of the tweet
     *
     * @title user name
     */
    userName: string;

    /**
     * The content text of the tweet
     *
     * @title tweet content
     */
    text: string;

    /**
     * The link of the tweet
     *
     * @title tweet link
     */
    tweet_link: string & tags.Format<"iri">;

    /**
     * The type of the tweet
     *
     * @title tweet type
     */
    type: string;

    /**
     * Username who wrote the original tweet of the referenced tweet
     *
     * @title referred user name
     */
    referredUserName: string | null;

    /**
     * Link to the original tweet of the referenced tweet
     *
     * @title referred tweet link
     */
    referredTweetLink: (string & tags.Format<"iri">) | null;

    /**
     * Content of the referenced tweet
     *
     * @title tweet content
     */
    referredTweetText: string | null;
  }

  /**
   * @title Condition For Get Tweet
   */
  export interface IGetTweetInput {
    /**
     * Please select a tweet to import information
     *
     * @title tweet
     */
    tweetId: string;
  }

  /**
   * @title Created File URL
   */
  export interface IMakeTxtFileAndUploadOutput {
    /**
     * @title Created File URL
     */
    fileUrl: string & tags.Format<"uri"> & tags.ContentMediaType<"text/plain">;
  }

  /**
   * @title Summarize Tweet Input
   */
  export interface IGetChunkDocumentInput {
    /**
     * Chat id required for RAG generation results.
     * Returns the chat id for the analyzed file to generate chat results for the file analyzed by RAG.
     * The same chat id is required to analyze multiple files and generate results for multiple files in the same chat.
     *
     * @title chat id
     */
    chatId: string;

    /**
     * query required to get the chunk document. You must understand the context Inputed by the user and enter the query to get as relevant information as possible.
     *
     * @title query
     */
    query: string;
  }

  export interface IGetChunkDocumentOutput {
    /**
     * Chunk Document List
     *
     * @title Chunk Document List
     */
    documents: {
      /**
       * Chunk document id
       *
       * @title id
       */
      id: string;

      /**
       * Chunk document text
       *
       * @title text
       */
      text: string;

      /**
       * Chunk document score
       *
       * @title score
       */
      score: number | null;

      /**
       * Chunk document image
       *
       * @title image
       */
      image: string | null;

      /**
       * Chunk document metadata
       *
       * @title metadata
       */
      metadata: any;
    }[];
  }

  export interface IPrePareSummarizeTweetInput
    extends IUserTweetTimeLineInput {}

  /**
   * @title Prepare Summarize tweet results
   */
  export interface IPrePareSummarizeTweetOutput {
    /**
     * Chat id required for RAG generation results.
     * Returns the chat id for the analyzed file to generate chat results for the file analyzed by RAG.
     * The same chat id is required to analyze multiple files and generate results for multiple files in the same chat.
     *
     * @title chat id
     */
    chatId: string;
  }

  /**
   * @title Information needed for tweet summary
   */
  export interface ISummarizeTweetInput {
    /**
     * "chatId" to get tweets. Pass the "chatId" obtained from the "prepare-summarize-tweet" API as-is.
     *
     * @title chatId
     */
    chatId: string;

    /**
     * A query that describes what tweets you want to get. For example, it can be a keyword or a name of a person.
     *
     * Avoid using a query that is too broad, it may lead to irrelevant results.
     *
     * Put a single subject at a time. If you need multiple subjects, must make multiple requests for each subject no exceptions.
     *
     * @example "Elon Musk"
     * @example IT
     * @example AI
     * @example LLM
     *
     * @title query
     */
    query: string;
  }

  /**
   * @title Tweet Search Condition
   */
  export interface IGeneralSearchRequest {
    /**
     * Get tweets by query.
     *
     * The query should be entered in natural language.
     *
     * For example, if the user asks "Search for what books are trending on Twitter these days," the query should be "trending books."
     *
     * @title search query
     */
    query: string;

    /**
     * Matches posts categorized by X in a specific language.
     *
     * You can only pass a single BCP 47 language identifier.
     *
     * ex) You want to setting korean language, you can pass "ko".
     *
     * @title Tweet Settings Language
     */
    lang: string;

    /**
     * Sets the maximum number of results to be searched.
     *
     * @title Maximum number of search results.
     */
    maxResults: number & tags.Type<"int32"> & tags.Default<10>;

    /**
     * Determines the sort order.
     * - recency: newest
     * - relevancy: relevance
     *
     * @title Sort order
     */
    sort_order:
      | tags.Constant<"recency", { title: "recency" }>
      | tags.Constant<"relevancy", { title: "relevancy" }>;

    /**
     * The oldest UTC timestamp from which the Tweets will be provided.
     *
     * By default, a request will return Tweets from up to 30 days ago if you do not include this parameter.
     *
     * @title Start time for search tweet
     */
    start_time?: string & tags.Format<"date-time">;

    /**
     * Used with start_time. The newest, most recent UTC timestamp to which the Tweets will be provided.
     *
     * If used without start_time, Tweets from 30 days before end_time will be returned by default. If not specified, end_time will default to [now - 30 seconds].
     *
     * @title End time for search tweet
     */
    end_time?: string & tags.Format<"date-time">;

    /**
     * Sets whether to remove retweeted tweets from search results.
     *
     * @title Whether to remove retweets
     */
    isExcludeRetweet?: boolean;

    /**
     * Sets whether to remove replied tweets from search results.
     *
     * @title Whether to remove replies
     */
    isExcludeReply?: boolean;

    /**
     * Sets whether to remove quoted tweets from search results.
     *
     * @title Whether to remove quotes
     */
    isExcludeQuote?: boolean;
  }

  /**
   * @title Tweet Search Result
   */
  export interface IGeneralSearchResponse {
    /**
     * The unique id of the tweet
     *
     * @title tweet ID
     */
    id: string;

    /**
     * The user name of the tweet
     *
     * @title user name
     */
    userName: string;

    /**
     * The content text of the tweet
     *
     * @title tweet content
     */
    text: string;

    /**
     * The link of the tweet
     *
     * @title tweet link
     */
    tweet_link: string & tags.Format<"iri">;

    /**
     * Metric data for the tweet
     *
     * @title metric
     */
    metric: IMetric;

    /**
     * Thumbnail Image URL of the tweet
     *
     * @title thumbnail
     */
    thumbnail: (string & tags.Format<"iri">) | null;
  }

  /**
   * @title Metric for tweet
   */
  interface IMetric {
    /**
     *
     *
     * @title Retweet Count
     */
    retweet_count: number & tags.Type<"int32">;

    /**
     * Indicates how many replies a tweet has.
     *
     * @title Reply Count
     */
    reply_count: number & tags.Type<"int32">;

    /**
     * Indicates how many likes a tweet has received.
     *
     * @title Like Count
     */
    like_count: number & tags.Type<"int32">;

    /**
     * Indicates how many times a tweet has been quoted.
     *
     * @title Quote Count
     */
    quote_count: number & tags.Type<"int32">;

    /**
     * Indicates how many times a tweet has been bookmarked.
     *
     * @title Bookmark Count
     */
    bookmark_count: number & tags.Type<"int32">;

    /**
     * Indicates how many times a tweet has been viewed.
     *
     * @title Impression Count
     */
    impression_count: number & tags.Type<"int32">;
  }
}
