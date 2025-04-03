import { tags } from "typia";
import { SnakeToCamel } from "@wrtnlabs/connector-shared";

/**
 * Write the environment variables that are required for the AWS S3 service.
 */
const ENV_LIST = ["YOUTUBE_OFFICIAL_SEARCH_GOOGLE_API_KEY"] as const;

export namespace IYoutubeOfficialSearchService {
  export type IProps = {
    [key in SnakeToCamel<(typeof ENV_LIST)[number]>]: string;
  };

  export interface IYoutubeSearchVideoRequest {
    /**
     * Keywords that must be included in search results.
     *
     * @title Must be included keywords
     */
    and_keywords: Array<string & tags.MinLength<1>> & tags.MinItems<1>;

    /**
     * Keywords that you would like to see included in your search results.
     *
     * @title Keywords that you would like to see included
     */
    or_keywords?: Array<string & tags.MinLength<1>>;

    /**
     * Keywords that should not be included in search results.
     *
     * @title Keywords that should not be included
     */
    not_keywords?: Array<string & tags.MinLength<1>>;

    /**
     * Indicates that video search results should only include resources created on or after the specified time.
     * This value must follow RFC3339 format, for example: 1970-01-01T00:00:00Z.
     *
     * @title Published after
     */
    publishedAfter?: string & tags.Format<"date-time">;

    /**
     * Indicates that video search results should only include resources created before the specified time.
     * This value must follow RFC3339 format, for example: 1970-01-01T00:00:00Z.
     *
     * @title Published before
     */
    publishedBefore?: string & tags.Format<"date-time">;
  }

  export interface IYoutubeSearchVideoResponse {
    /**
     * The Unique ID of the YouTube video.
     *
     * @title videoId
     */
    videoId: string;

    /**
     * Title of the YouTube video that appears in the search results.
     *
     * @title YouTube video title
     */
    title: string;

    /**
     * Links to YouTube videos that appear in search results.
     *
     * @title YouTube video link
     */
    link: string & tags.Format<"iri">;

    /**
     * Channel information of YouTube videos that appear in search results.
     *
     * @title YouTube video channel information
     */
    channel_name: string;

    /**
     * Links to YouTube channels that appear in search results.
     *
     * @title YouTube Channel Link
     */
    channel_link: string & tags.Format<"iri">;

    /**
     * Date the YouTube video was published.
     * ex) 1 year ago
     *
     * @title YouTube video published date
     */
    published_date: string;

    /**
     * Description of YouTube video.
     *
     * @title YouTube video description
     */
    description?: string;

    /**
     * Thumbnail image information for YouTube videos.
     *
     * @title Thumbnail image information for YouTube videos
     */
    thumbnail: string & tags.Format<"iri">;
  }
}
