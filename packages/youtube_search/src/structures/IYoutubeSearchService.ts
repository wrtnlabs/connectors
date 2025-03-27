import { tags } from "typia";

export namespace IYoutubeSearchService {
  export interface IProps {
    /**
     * Serp API Key.
     */
    serpApiKey: string;
  }

  /**
   * @title YouTube search conditions
   */
  export interface ISearchInput {
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
  }

  /**
   * @title YouTube search results
   */
  export interface ISearchOutput {
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
     * Thumbnail image for YouTube videos.
     *
     * @title Thumbnail image for YouTube videos
     */
    thumbnail: string & tags.Format<"iri">;

    /**
     * YouTube video views.
     *
     * @title YouTube video views
     */
    view_count: number & tags.Type<"uint32">;

    /**
     * Channel name of YouTube videos that appear in search results.
     *
     * @title Channel name
     */
    channel_name: string;

    /**
     * Link to the YouTube channel that appears in the search results.
     *
     * @title Channel link
     */
    channel_link: string & tags.Format<"iri">;

    /**
     * Date the YouTube video was published.
     * ex) 1 year ago
     *
     * @title YouTube video published date
     */
    published_date: string;
  }

  /**
   * @title SerpAPI Params Information
   */
  export interface ISerpApiParams {
    /**
     * Set the search engine to use in SerpAPi.
     *
     * @title Search Engine
     */
    engine: string;

    /**
     * API key to use in SerpAPI.
     *
     * @title API Key
     */
    api_key: string;

    /**
     * Search query to use in SerpAPI.
     *
     * @title Search query
     */
    search_query: string & tags.MinLength<1>;
  }

  /**
   * @title Youtube video search results received through serpapi
   */
  export interface ISerpApiVideoResult {
    /**
     * Location within the search results page.
     *
     * @title Location within the page
     */
    position_on_page: number & tags.Type<"uint32">;

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
    channel: ISerpApiYoutubeSearchChannelResult;

    /**
     * Date the YouTube video was published.
     * ex) 1 year ago
     *
     * @title YouTube video published date
     */
    published_date: string;

    /**
     * YouTube video views.
     *
     * @title YouTube video views
     */
    views?: number & tags.Type<"uint32">;

    /**
     * Length of YouTube video.
     * ex) 6:30
     *
     * @title YouTube video length
     */
    length: string;

    /**
     * Description of YouTube video.
     *
     * @title YouTube video description
     */
    description?: string;

    /**
     * Additional information about YouTube videos.
     * ex) 4K, CC
     *
     * @title Additional information about video results
     */
    extensions?: string[];

    /**
     * Thumbnail image information for YouTube videos.
     *
     * @title Thumbnail image information for YouTube videos
     */
    thumbnail: ISerpApiYoutubeSearchThumbnailResult;
  }

  /**
   * @title Channel information from youtube video search results received through serpapi
   */
  export interface ISerpApiYoutubeSearchChannelResult {
    /**
     * The name of the YouTube channel that appears in the search results.
     *
     * @title YouTube Channel Name
     */
    name: string;

    /**
     * Links to YouTube channels that appear in search results.
     *
     * @title YouTube Channel Link
     */
    link: string & tags.Format<"iri">;

    /**
     * Thumbnail images of YouTube channels that appear in search results.
     *
     * @title YouTube Channel Thumbnail Image
     */
    thumbnail: string & tags.Format<"iri">;
  }

  /**
   * @title Thumbnail information from youtube video search results received through serpapi
   */
  export interface ISerpApiYoutubeSearchThumbnailResult {
    /**
     * YouTube video thumbnail static image.
     *
     * @title YouTube video thumbnail image (static)
     */
    static: string & tags.Format<"iri"> & tags.ContentMediaType<"image/*">;

    /**
     * Animated image that changes according to the video playback time.
     *
     * @title YouTube video thumbnail image (dynamic)
     */
    rich: string & tags.Format<"iri">;
  }
}
