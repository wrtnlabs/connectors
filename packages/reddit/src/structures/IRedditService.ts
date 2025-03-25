import { tags } from "typia";
import { Limit, MyPick, StrictOmit } from "@wrtnlabs/connector-shared";

export namespace IRedditService {
  export interface IProps {
    /**
     * Reddit Refresh Token.
     */
    refreshToken: string;

    /**
     * Reddit Client ID.
     */
    clientId: string;

    /**
     * Reddit Client Secret.
     */
    clientSecret: string;
  }

  /**
   * When the value of the 'after' parameter that came in response to the previous request is substituted,
   * it is a parameter for page selection that inquires before and after the value.
   * If omitted, the first page will be viewed unconditionally.
   *
   * The prefix t1_, t2_, t3_, t4_, t5_, t6_ attached to the beginning of the value has the following meaning.
   * - t1_ : Comment
   * - t2_ : Account
   * - t3_ : Link
   * - t4_ : Message
   * - t5_ : Subreddit
   * - t6_ : Award
   *
   * @title FullNames
   */
  export type FullNames = `t${1 | 2 | 3 | 4 | 5 | 6}_${string}`;

  export interface ICommonPaginationInput {
    /**
     * @title The number of posts to fetch
     **/
    limit?: Limit<1, 100, 25>;

    /**
     * When the value of the 'after' parameter that came in response to the previous request is substituted,
     * it is a parameter for page selection that inquires before and after the value.
     * If omitted, the first page will be viewed unconditionally.
     *
     * The prefix t1_, t2_, t3_, t4_, t5_, t6_ attached to the beginning of the value has the following meaning.
     * - t1_ : Comment
     * - t2_ : Account
     * - t3_ : Link
     * - t4_ : Message
     * - t5_ : Subreddit
     * - t6_ : Award
     *
     * @title after
     */
    after?: FullNames;

    /**
     * When the value of the 'after' parameter that came in response to the previous request is substituted,
     * it is a parameter for page selection that inquires before and after the value.
     * If omitted, the first page will be viewed unconditionally.
     *
     * The prefix t1_, t2_, t3_, t4_, t5_, t6_ attached to the beginning of the value has the following meaning.
     * - t1_ : Comment
     * - t2_ : Account
     * - t3_ : Link
     * - t4_ : Message
     * - t5_ : Subreddit
     * - t6_ : Award
     *
     * @title before
     */
    before?: FullNames;
  }

  export interface IGetHotPostsInput
    extends IRedditService.ICommonPaginationInput {
    /**
     * one of (GLOBAL, US, AR, AU, BG, CA, CL, CO, HR, CZ, FI, FR, DE, GR, HU, IS, IN, IE, IT, JP, MY, MX, NZ, PH, PL, PT, PR, RO, RS, SG, ES, SE, TW, TH, TR, GB, US_WA, US_DE, US_DC, US_WI, US_WV, US_HI, US_FL, US_WY, US_NH, US_NJ, US_NM, US_TX, US_LA, US_NC, US_ND, US_NE, US_TN, US_NY, US_PA, US_CA, US_NV, US_VA, US_CO, US_AK, US_AL, US_AR, US_VT, US_IL, US_GA, US_IN, US_IA, US_OK, US_AZ, US_ID, US_CT, US_ME, US_MD, US_MA, US_OH, US_UT, US_MO, US_MN, US_MI, US_RI, US_KS, US_MT, US_MS, US_SC, US_KY, US_OR, US_SD)
     *
     * @title Optional parameter
     **/
    g?: string;

    /**
     * @title The subreddit to fetch posts from
     **/
    subreddit?: `r/${string}`;
  }

  export interface Children {
    /**
     * @title The kind of the child
     **/
    kind: string;

    /**
     * @title The data of the child
     **/
    data: Child;
  }

  export interface Child {
    /**
     * @title Approval time in UTC
     **/
    approved_at_utc?: string | null;

    /**
     * @title The subreddit name
     **/
    subreddit?: string;

    /**
     * @title The text of the post
     **/
    selftext?: string;

    /**
     * @title The full name of the author
     **/
    author_fullname?: Extract<IRedditService.FullNames, `t2_${string}`>;

    /**
     * @title Whether the post is saved
     **/
    saved?: boolean;

    /**
     * @title Moderator reason title
     **/
    mod_reason_title?: string | null;

    /**
     * @title Number of times gilded
     **/
    gilded?: number & tags.Type<"uint64">;

    /**
     * @title Whether the post is clicked
     **/
    clicked?: boolean;

    /**
     * @title The title of the post
     **/
    title: string;

    /**
     * @title Rich text for link flair
     **/
    link_flair_richtext?: LinkFlairRichtext[];

    /**
     * @title Prefixed subreddit name
     **/
    subreddit_name_prefixed?: string;

    /**
     * @title Whether the post is hidden
     **/
    hidden?: boolean;

    /**
     * @title Post whitelist status
     **/
    pwls?: number | null;

    /**
     * @title CSS class for link flair
     **/
    link_flair_css_class?: string | null;

    /**
     * @title Number of downvotes
     **/
    downs?: number & tags.Type<"uint64">;

    /**
     * @title Height of the thumbnail
     **/
    thumbnail_height?: number | null;

    /**
     * @title Type of top award
     **/
    top_awarded_type?: string | null;

    /**
     * @title Whether the score is hidden
     **/
    hide_score?: boolean;

    /**
     * @title The name of the post
     **/
    name: string;

    /**
     * @title Whether the post is quarantined
     **/
    quarantine?: boolean;

    /**
     * @title Text color for link flair
     **/
    link_flair_text_color?: string | null;

    /**
     * @title Ratio of upvotes
     **/
    upvote_ratio?: number;

    /**
     * @title Background color for author flair
     **/
    author_flair_background_color?: string | null;

    /**
     * @title Number of upvotes
     **/
    ups?: (number & tags.Type<"int64">) | null;

    /**
     * @title Total awards received
     **/
    total_awards_received?: number;

    /**
     * @title Media embed information
     **/
    media_embed?: MediaEmbed;

    /**
     * @title Width of the thumbnail
     **/
    thumbnail_width?: number | null;

    /**
     * @title Template ID for author flair
     **/
    author_flair_template_id?: (string & tags.Format<"uuid">) | null;

    /**
     * @title Whether the content is original
     **/
    is_original_content?: boolean;

    /**
     * @title User reports
     **/
    user_reports?: string[];

    /**
     * @title Secure media information
     **/
    secure_media?: SecureMedia | null;

    /**
     * @title Whether it's a Reddit media domain
     **/
    is_reddit_media_domain?: boolean;

    /**
     * @title Whether it's meta content
     **/
    is_meta?: boolean;

    /**
     * @title Category of the post
     **/
    category?: string | null;

    /**
     * @title Secure media embed information
     **/
    secure_media_embed?: SecureMediaEmbed;

    /**
     * @title Text for link flair
     **/
    link_flair_text?: string | null;

    /**
     * @title Whether the post can be moderated
     **/
    can_mod_post?: boolean;

    /**
     * @title Score of the post
     **/
    score?: number;

    /**
     * @title Approved by user
     **/
    approved_by?: string | null;

    /**
     * @title Whether created from ads UI
     **/
    is_created_from_ads_ui?: boolean;

    /**
     * @title Whether the author is premium
     **/
    author_premium?: boolean;

    /**
     * @title Thumbnail URL
     **/
    thumbnail?: string;

    /**
     * @title Whether the post is edited
     **/
    edited?: (number & tags.Type<"uint64">) | boolean | null;

    /**
     * @title CSS class for author flair
     **/
    author_flair_css_class?: string | null;

    /**
     * @title Rich text for author flair
     **/
    author_flair_richtext?: AuthorFlairRichtext[];

    /**
     * @title Gildings information
     **/
    gildings?: Gildings;

    /**
     * @title Hint for the post
     **/
    post_hint?: string | null;

    /**
     * @title Content categories
     **/
    content_categories?: string[] | null;

    /**
     * @title Whether it's a self post
     **/
    is_self?: boolean;

    /**
     * @title Type of subreddit
     **/
    subreddit_type?: string;

    /**
     * @title Creation time
     **/
    created?: number;

    /**
     * @title Type of link flair
     **/
    link_flair_type?: string;

    /**
     * @title Whitelist status
     **/
    wls?: number | null;

    /**
     * @title Removed by category
     **/
    removed_by_category?: string | null;

    /**
     * @title Banned by user
     **/
    banned_by?: string | null;

    /**
     * @title Type of author flair
     **/
    author_flair_type?: string;

    /**
     * @title Domain of the post
     **/
    domain?: string;

    /**
     * @title Whether live comments are allowed
     **/
    allow_live_comments?: boolean;

    /**
     * @title HTML of the selftext
     **/
    selftext_html?: string | null;

    /**
     * @title Likes on the post
     **/
    likes?: (number & tags.Type<"uint64">) | null;

    /**
     * @title Suggested sort order
     **/
    suggested_sort?: string | null;

    /**
     * @title Banned time in UTC
     **/
    banned_at_utc?: (number & tags.Type<"uint64">) | null;

    /**
     * @title URL overridden by destination
     **/
    url_overridden_by_dest?: string | null;

    /**
     * @title View count
     **/
    view_count?: string | null;

    /**
     * @title Whether the post is archived
     **/
    archived?: boolean;

    /**
     * @title Whether no-follow is enabled
     **/
    no_follow?: boolean;

    /**
     * @title Whether the post is crosspostable
     **/
    is_crosspostable?: boolean;

    /**
     * @title Whether the post is pinned
     **/
    pinned?: boolean;

    /**
     * @title Whether the post is NSFW
     **/
    over_18?: boolean;

    /**
     * @title Preview information
     **/
    preview?: Preview | null;

    /**
     * @title All awardings
     **/
    all_awardings?: string[];

    /**
     * @title Awarders of the post
     **/
    awarders?: string[];

    /**
     * @title Whether it's media only
     **/
    media_only?: boolean;

    /**
     * @title Template ID for link flair
     **/
    link_flair_template_id?: string | null;

    /**
     * @title Whether the post can be gilded
     **/
    can_gild?: boolean;

    /**
     * @title Whether the post is a spoiler
     **/
    spoiler?: boolean;

    /**
     * @title Whether the post is locked
     **/
    locked?: boolean;

    /**
     * @title Text for author flair
     **/
    author_flair_text?: string | null;

    /**
     * @title Treatment tags
     **/
    treatment_tags?: string[];

    /**
     * @title Whether the post is visited
     **/
    visited?: boolean;

    /**
     * @title Removed by user
     **/
    removed_by?: string | null;

    /**
     * @title Moderator note
     **/
    mod_note?: string | null;

    /**
     * @title Distinguished status
     **/
    distinguished?: string | null;

    /**
     * @title ID of the subreddit
     **/
    subreddit_id?: string;

    /**
     * @title Whether the author is blocked
     **/
    author_is_blocked?: boolean | null;

    /**
     * @title Moderator reason by user
     **/
    mod_reason_by?: string | null;

    /**
     * @title Number of reports
     **/
    num_reports?: (number & tags.Type<"int64">) | string | null;

    /**
     * @title Removal reason
     **/
    removal_reason?: string | null;

    /**
     * @title Background color for link flair
     **/
    link_flair_background_color?: string | null;

    /**
     * @title ID of the post
     **/
    id: string;

    /**
     * @title Whether the post is robot indexable
     **/
    is_robot_indexable?: boolean;

    /**
     * @title Report reasons
     **/
    report_reasons?: string | null;

    /**
     * @title Author of the post
     **/
    author?: string;

    /**
     * @title Type of discussion
     **/
    discussion_type?: string | null;

    /**
     * @title Number of comments
     **/
    num_comments?: number;

    /**
     * @title Whether to send replies
     **/
    send_replies?: boolean;

    /**
     * @title Whether contest mode is enabled
     **/
    contest_mode?: boolean;

    /**
     * @title Moderator reports
     **/
    mod_reports?: string[];

    /**
     * @title Whether the author has Patreon flair
     **/
    author_patreon_flair?: boolean;

    /**
     * @title Text color for author flair
     **/
    author_flair_text_color?: string | null;

    /**
     * @title Permalink to the post
     **/
    permalink?: string;

    /**
     * @title Whether the post is stickied
     **/
    stickied?: boolean;

    /**
     * @title URL of the post
     **/
    url: string;

    /**
     * @title Number of subreddit subscribers
     **/
    subreddit_subscribers?: number;

    /**
     * @title Creation time in UTC
     **/
    created_utc?: number & tags.Type<"uint64">;

    /**
     * @title Number of crossposts
     **/
    num_crossposts?: number;

    /**
     * @title Media information
     **/
    media?: Media | null;

    /**
     * @title Whether the post is a video
     **/
    is_video?: boolean;

    /**
     * @title Whether the post is a gallery
     **/
    is_gallery?: boolean | null;

    /**
     * @title Media metadata
     **/
    media_metadata?: MediaMetadata | null;

    /**
     * @title Gallery data
     **/
    gallery_data?: GalleryData | null;

    /**
     * @title List of crosspost parents
     **/
    crosspost_parent_list?: CrosspostParentList[] | null;

    /**
     * @title Crosspost parent
     **/
    crosspost_parent?: string | null;

    /**
     * @title Whether it's the author's cakeday
     **/
    author_cakeday?: boolean | null;
  }

  export interface LinkFlairRichtext {
    /**
     * @title The type of the element
     **/
    a?: string;

    /**
     * @title The type of the element
     **/
    u?: string;

    /**
     * @title The type of the element
     **/
    e?: string;

    /**
     * @title The text of the element
     **/
    t?: string;
  }

  export interface MediaEmbed {
    /**
     * @title The content of the media
     **/
    content?: string;

    /**
     * @title The width of the media
     **/
    width?: number;

    /**
     * @title Whether scrolling is enabled
     **/
    scrolling?: boolean;

    /**
     * @title The height of the media
     **/
    height?: number;
  }

  export interface SecureMedia {
    /**
     * @title The type of the media
     **/
    type?: string;

    /**
     * @title Oembed information
     **/
    oembed?: Oembed;
  }

  export interface Oembed {
    /**
     * @title The provider URL
     **/
    provider_url?: string | null;

    /**
     * @title The version of the Oembed
     **/
    version?: string | null;

    /**
     * @title The title of the Oembed
     **/
    title?: string | null;

    /**
     * @title The description of the Oembed
     **/
    description?: string | null;

    /**
     * @title The type of the Oembed
     **/
    type?: string | null;

    /**
     * @title The width of the thumbnail
     **/
    thumbnail_width?: number | null;

    /**
     * @title The height of the Oembed
     **/
    height?: number | null;

    /**
     * @title The width of the Oembed
     **/
    width?: number | null;

    /**
     * @title The HTML content
     **/
    html?: string | null;

    /**
     * @title The name of the author
     **/
    author_name?: string | null;

    /**
     * @title The name of the provider
     **/
    provider_name?: string | null;

    /**
     * @title The URL of the thumbnail
     **/
    thumbnail_url?: string | null;

    /**
     * @title The height of the thumbnail
     **/
    thumbnail_height?: number | null;

    /**
     * @title The URL of the author
     **/
    author_url?: string | null;

    /**
     * @title The URL of the Oembed
     */
    url?: string | null;
  }

  export interface SecureMediaEmbed {
    /**
     * @title The content of the media
     **/
    content?: string;

    /**
     * @title The width of the media
     **/
    width?: number;

    /**
     * @title Whether scrolling is enabled
     **/
    scrolling?: boolean;

    /**
     * @title The media domain URL
     **/
    media_domain_url?: string;

    /**
     * @title The height of the media
     **/
    height?: number;
  }

  export interface AuthorFlairRichtext {
    /**
     * @title The type of the element
     **/
    e?: string;

    /**
     * @title The text of the element
     **/
    t?: string;
  }

  export type Gildings = any;

  export interface Preview {
    /**
     * @title The images in the preview
     **/
    images: Image[];

    /**
     * @title Whether the preview is enabled
     **/
    enabled: boolean;
  }

  export interface Image {
    /**
     * @title The source of the image
     **/
    source: Source;

    /**
     * @title The resolutions of the image
     **/
    resolutions: Resolution[];

    /**
     * @title The variants of the image
     **/
    variants: Variants;

    /**
     * @title The ID of the image
     **/
    id: string;
  }

  export interface Source {
    /**
     * @title The URL of the source
     **/
    url: string;

    /**
     * @title The width of the source
     **/
    width: number;

    /**
     * @title The height of the source
     **/
    height: number;
  }

  export interface Resolution {
    /**
     * @title The URL of the resolution
     **/
    url: string;

    /**
     * @title The width of the resolution
     **/
    width: number;

    /**
     * @title The height of the resolution
     **/
    height: number;
  }

  export type Variants = any;

  export interface Media {
    /**
     * @title The type of the media
     **/
    type?: string;

    /**
     * @title Oembed information
     **/
    oembed?: Oembed;
  }

  export type MediaMetadata = Record<string, Metadata>;

  export interface Metadata {
    /**
     * @title The status of the metadata
     **/
    status?: string;

    /**
     * @title The type of the element
     **/
    e?: string;

    /**
     * @title The media type
     **/
    m?: string;

    /**
     * @title The positions
     **/
    p?: Position[];

    /**
     * @title The position
     **/
    s?: Position;

    /**
     * @title The ID of the metadata
     **/
    id?: string;
  }

  export interface GalleryData {
    /**
     * @title The items in the gallery
     **/
    items: Item[];
  }

  export interface Item {
    /**
     * @title The media ID
     **/
    media_id: string;

    /**
     * @title The ID of the item
     **/
    id: number;

    /**
     * @title The caption of the item
     **/
    caption?: string;
  }

  export type CrosspostParentList = MyPick<
    IRedditService.Child,
    | "approved_at_utc"
    | "subreddit"
    | "selftext"
    | "author_fullname"
    | "saved"
    | "mod_reason_title"
    | "gilded"
    | "is_gallery"
    | "title"
    | "link_flair_richtext"
    | "subreddit_name_prefixed"
    | "hidden"
    | "pwls"
    | "link_flair_css_class"
    | "downs"
    | "thumbnail_height"
    | "top_awarded_type"
    | "hide_score"
    | "media_metadata"
    | "name"
    | "quarantine"
    | "link_flair_text_color"
    | "upvote_ratio"
    | "author_flair_background_color"
    | "ups"
    | "total_awards_received"
    | "media_embed"
    | "thumbnail_width"
    | "author_flair_template_id"
    | "is_original_content"
    | "user_reports"
    | "secure_media"
    | "is_reddit_media_domain"
    | "is_meta"
    | "category"
    | "secure_media_embed"
    | "gallery_data"
    | "link_flair_text"
    | "can_mod_post"
    | "score"
    | "approved_by"
    | "is_created_from_ads_ui"
    | "author_premium"
    | "thumbnail"
    | "edited"
    | "author_flair_css_class"
    | "author_flair_richtext"
    | "gildings"
    | "content_categories"
    | "is_self"
    | "subreddit_type"
    | "created"
    | "link_flair_type"
    | "wls"
    | "removed_by_category"
    | "banned_by"
    | "author_flair_type"
    | "domain"
    | "allow_live_comments"
    | "selftext_html"
    | "likes"
    | "suggested_sort"
    | "banned_at_utc"
    | "url_overridden_by_dest"
    | "view_count"
    | "archived"
    | "no_follow"
    | "is_crosspostable"
    | "pinned"
    | "over_18"
    | "all_awardings"
    | "awarders"
    | "media_only"
    | "can_gild"
    | "spoiler"
    | "locked"
    | "author_flair_text"
    | "treatment_tags"
    | "visited"
    | "removed_by"
    | "mod_note"
    | "distinguished"
    | "subreddit_id"
    | "author_is_blocked"
    | "mod_reason_by"
    | "num_reports"
    | "removal_reason"
    | "link_flair_background_color"
    | "id"
    | "is_robot_indexable"
    | "report_reasons"
    | "author"
    | "discussion_type"
    | "num_comments"
    | "send_replies"
    | "contest_mode"
    | "mod_reports"
    | "author_patreon_flair"
    | "author_flair_text_color"
    | "permalink"
    | "stickied"
    | "url"
    | "subreddit_subscribers"
    | "created_utc"
    | "num_crossposts"
    | "media"
    | "is_video"
    | "post_hint"
    | "preview"
    | "link_flair_template_id"
  >;

  export interface Position {
    /**
     * @title The y-coordinate
     **/
    y: number;

    /**
     * @title The x-coordinate
     **/
    x: number;

    /**
     * @title The URL
     **/
    u: string & tags.Format<"iri">;
  }

  export interface IGetHotPostsOutput {
    /**
     * @title The after cursor for pagination
     **/
    after: FullNames | null;

    /**
     * @title The number of items returned
     **/
    dist: number | null;

    /**
     * @title The modhash for the request
     **/
    modhash: string | null;

    /**
     * @title The geographical filter applied
     **/
    geo_filter: string | null;

    /**
     * @title The list of children posts
     **/
    children: Children[];

    /**
     * @title The before cursor for pagination
     **/
    before: FullNames | null;
  }

  export interface IGetNewPostsInput
    extends IRedditService.ICommonPaginationInput {
    /**
     * @title The subreddit to fetch posts from
     **/
    subreddit?: `r/${string}`;
  }

  export interface IGetNewPostsOutput {
    /**
     * @title The after cursor for pagination
     **/
    after: FullNames | null;

    /**
     * @title The number of items returned
     **/
    dist: number | null;

    /**
     * @title The modhash for the request
     **/
    modhash: string | null;

    /**
     * @title The geographical filter applied
     **/
    geo_filter: string | null;

    /**
     * @title The list of children posts
     **/
    children: Children[];

    /**
     * @title The before cursor for pagination
     **/
    before: FullNames | null;
  }

  export interface IGetTopPostsInput
    extends IRedditService.ICommonPaginationInput {
    /**
     * @title The subreddit to fetch posts from
     **/
    subreddit?: `r/${string}`;

    /**
     * @title The time filter for the posts
     **/
    time_filter?: "all" | "day" | "hour" | "month" | "week" | "year";
  }

  export interface IGetTopPostsOutput {
    /**
     * @title The after cursor for pagination
     **/
    after: FullNames | null;

    /**
     * @title The number of items returned
     **/
    dist: number | null;

    /**
     * @title The modhash for the request
     **/
    modhash: string | null;

    /**
     * @title The geographical filter applied
     **/
    geo_filter: string | null;

    /**
     * @title The list of children posts
     **/
    children: Children[];

    /**
     * @title The before cursor for pagination
     **/
    before: FullNames | null;
  }

  export interface IGetCommentsInput
    extends MyPick<IRedditService.ICommonPaginationInput, "limit"> {
    /**
     * (optional) ID36 of a comment
     *
     * @title Comment ID
     */
    comment?: string;

    /**
     * depth is the maximum depth of subtrees in the thread.
     *
     * @title depth
     */
    depth?: number;

    /**
     * @title The subreddit of the post
     **/
    subreddit?: `r/${string}`;

    /**
     * @title The article ID of the post
     **/
    article: string;
  }

  export interface Comment
    extends MyPick<
      Child,
      | "approved_at_utc"
      | "author_is_blocked"
      | "subreddit_id"
      | "awarders"
      | "mod_reason_by"
      | "banned_by"
      | "awarders"
      | "mod_reason_by"
      | "author_flair_type"
      | "total_awards_received"
      | "subreddit"
      | "author_flair_template_id"
      | "likes"
      | "user_reports"
      | "saved"
      | "id"
      | "banned_at_utc"
      | "mod_reason_title"
      | "gilded"
      | "archived"
      | "no_follow"
      | "author"
      | "can_mod_post"
      | "created_utc"
      | "send_replies"
      | "score"
      | "author_fullname"
      | "approved_by"
      | "mod_note"
      | "all_awardings"
      | "top_awarded_type"
      | "author_flair_css_class"
      | "name"
      | "downs"
      | "author_flair_richtext"
      | "author_patreon_flair"
      | "removal_reason"
      | "distinguished"
      | "stickied"
      | "author_premium"
      | "can_gild"
      | "gildings"
      | "author_flair_text_color"
      | "permalink"
      | "subreddit_type"
      | "locked"
      | "report_reasons"
      | "created"
      | "author_flair_text"
      | "treatment_tags"
      | "subreddit_name_prefixed"
      | "author_flair_background_color"
      | "mod_reports"
      | "num_reports"
      | "ups"
    > {
    /**
     * @title id
     */
    id: string;

    /**
     * @title parent_id
     */
    parent_id: IRedditService.FullNames;

    /**
     * @title link_id
     */
    link_id?: IRedditService.FullNames;

    /**
     * @title comment_type
     */
    comment_type?: null;

    /**
     * @title depth
     */
    depth?: number & tags.Type<"uint64">;

    /**
     * @title replies
     */
    replies?:
      | tags.Constant<"", { title: "NO_REPLIES" }>
      | {
          kind: "Listing";
          data: {
            after: null;
            dist: null;
            modhash: null;
            geo_filter: string;
            children: (
              | {
                  /**
                   * @title kind
                   */
                  kind: "t1";

                  /**
                   * @title data
                   */
                  data: Comment;
                }
              | {
                  /**
                   * @title kind
                   */
                  kind: "more";

                  /**
                   * @title data
                   */
                  data: {
                    /**
                     * @title count
                     */
                    count: number & tags.Type<"uint64">;

                    /**
                     * @title name
                     */
                    name: Extract<IRedditService.FullNames, `t1_${string}`>;

                    /**
                     * @title id
                     */
                    id: string;

                    /**
                     * @title parent_id
                     */
                    parent_id: IRedditService.FullNames;

                    /**
                     * @title depth
                     */
                    depth: number & tags.Type<"uint64">;

                    /**
                     * @title children
                     */
                    children: string[];
                  };
                }
            )[];
            before: null;
          };
        };

    /**
     * @title collapsed_reason_code
     */
    collapsed_reason_code?: string | null;

    /**
     * @title collapsed
     */
    collapsed?: boolean;

    /**
     * @title body
     */
    body?: string;

    /**
     * @title body_html
     */
    body_html?: string;

    /**
     * @title is_submitter
     */
    is_submitter?: boolean;

    /**
     * @title collapsed_reason
     */
    collapsed_reason?: string | null;

    /**
     * @title associated_award
     */
    associated_award?: null;

    /**
     * @title unrepliable_reason
     */
    unrepliable_reason?: string | null;

    /**
     * @title controversiality
     */
    controversiality?: number & tags.Type<"uint64">;

    /**
     * @title score_hidden
     */
    score_hidden?: boolean;

    /**
     * @title collapsed_because_crowd_control
     */
    collapsed_because_crowd_control?: null;
  }

  export interface IGetFlattenCommentsOutput
    extends MyPick<IGetCommentsOutput, "articles"> {
    comments: {
      /**
       * @title The after cursor for pagination
       **/
      after: FullNames | null;

      /**
       * @title The number of items returned
       **/
      dist: number | null;

      /**
       * @title The modhash for the request
       **/
      modhash: string | null;

      /**
       * @title The geographical filter applied
       **/
      geo_filter: string | null;

      /**
       * @title The list of children posts
       **/
      children: {
        /**
         * @title kind
         */
        kind: "t1";

        /**
         * @title data
         */
        data: StrictOmit<Comment, "replies">;
      }[];

      /**
       * @title The before cursor for pagination
       **/
      before: FullNames | null;
    };
  }

  export interface IFlattenCommentsOutput {
    more: IRedditService.ChildMore | null;
    flatComments: IRedditService.ChildComment[];
  }

  export interface IGetArticleAndCommentsOutput
    extends MyPick<IGetCommentsOutput, "articles">,
      IFlattenCommentsOutput {}

  export interface IGetCommentsOutput {
    articles: {
      /**
       * @title The after cursor for pagination
       **/
      after: FullNames | null;

      /**
       * @title The number of items returned
       **/
      dist: number | null;

      /**
       * @title The modhash for the request
       **/
      modhash: string | null;

      /**
       * @title The geographical filter applied
       **/
      geo_filter: string | null;

      /**
       * @title The list of children posts
       **/
      children: Children[];

      /**
       * @title The before cursor for pagination
       **/
      before: FullNames | null;
    };

    comments: {
      /**
       * @title The after cursor for pagination
       **/
      after: FullNames | null;

      /**
       * @title The number of items returned
       **/
      dist: number | null;

      /**
       * @title The modhash for the request
       **/
      modhash: string | null;

      /**
       * @title The geographical filter applied
       **/
      geo_filter: string | null;

      /**
       * @title The list of children posts
       **/
      children: (ChildComment | ChildMore)[];

      /**
       * @title The before cursor for pagination
       **/
      before: FullNames | null;
    };
  }

  export interface ChildComment {
    /**
     * @title kind
     */
    kind: "t1";

    /**
     * @title data
     */
    data: Comment;
  }

  export interface ChildMore {
    /**
     * @title kind
     */
    kind: "more";

    /**
     * @title data
     */
    data: {
      /**
       * @title count
       */
      count: number & tags.Type<"uint64">;

      /**
       * @title name
       */
      name: Extract<IRedditService.FullNames, `t1_${string}`>;

      /**
       * @title id
       */
      id: string;

      /**
       * @title parent_id
       */
      parent_id: IRedditService.FullNames;

      /**
       * @title depth
       */
      depth: number & tags.Type<"uint64">;

      /**
       * @title children
       */
      children: string[];
    };
  }

  export interface IGetUserAboutInput {
    /**
     * @title The username to fetch information for
     **/
    username: string;
  }

  export interface IGetUserAboutOutput {
    /**
     * @title kind
     */
    kind: "t2";

    /**
     * @title data
     */
    data?: {
      /**
       * @title is_employee
       */
      is_employee?: boolean;

      /**
       * @title has_visited_new_profile
       */
      has_visited_new_profile?: boolean;

      /**
       * @title is_friend
       */
      is_friend?: boolean;

      /**
       * @title pref_no_profanity
       */
      pref_no_profanity?: boolean;

      /**
       * @title has_external_account
       */
      has_external_account?: boolean;

      /**
       * @title pref_geopopular
       */
      pref_geopopular?: string;

      /**
       * @title pref_show_trending
       */
      pref_show_trending?: boolean;

      /**
       * @title subreddit
       */
      subreddit?: {
        /**
         * @title default_set
         */
        default_set?: boolean;

        /**
         * @title user_is_contributor
         */
        user_is_contributor?: boolean;

        /**
         * @title banner_img
         */
        banner_img?: string;

        /**
         * @title allowed_media_in_comments
         */
        allowed_media_in_comments?: any[];

        /**
         * @title user_is_banned
         */
        user_is_banned?: boolean;

        /**
         * @title free_form_reports
         */
        free_form_reports?: boolean;

        /**
         * @title community_icon
         */
        community_icon?: (string & tags.Format<"iri">) | null;

        /**
         * @title show_media
         */
        show_media?: boolean;

        /**
         * @title icon_color
         */
        icon_color?: string;

        /**
         * @title user_is_muted
         */
        user_is_muted?: null;

        /**
         * @title display_name
         */
        display_name?: string;

        /**
         * @title header_img
         */
        header_img?: (string & tags.Format<"iri">) | null;

        /**
         * @title title
         */
        title?: string;

        /**
         * @title coins
         */
        coins?: number & tags.Type<"int64">;

        /**
         * @title previous_names
         */
        previous_names?: any[];

        /**
         * @title over_18
         */
        over_18?: boolean;

        /**
         * @title icon_size
         * @todo Change to point
         */
        icon_size?: Array<number & tags.Type<"int64">> &
          tags.MinItems<2> &
          tags.MaxItems<2>;

        /**
         * @title primary_color
         */
        primary_color?: string;

        /**
         * @title icon_img
         */
        icon_img?: string & tags.Format<"iri">;

        /**
         * @title description
         */
        description?: string;

        /**
         * @title submit_link_label
         */
        submit_link_label?: string;

        /**
         * @title header_size
         */
        header_size?: null;

        /**
         * @title restrict_posting
         */
        restrict_posting?: boolean;

        /**
         * @title restrict_commenting
         */
        restrict_commenting?: boolean;

        /**
         * @title subscribers
         */
        subscribers?: number & tags.Type<"int64">;

        /**
         * @title submit_text_label
         */
        submit_text_label?: string;

        /**
         * @title is_default_icon
         */
        is_default_icon?: boolean;

        /**
         * @title link_flair_position
         */
        link_flair_position?: string;

        /**
         * @title display_name_prefixed
         */
        display_name_prefixed?: `u/${string}`;

        /**
         * @title key_color
         */
        key_color?: string;

        /**
         * @title name
         */
        name?: `t5_${string}`;

        /**
         * @title is_default_banner
         */
        is_default_banner?: boolean;

        /**
         * @title url
         */
        url?: `/user/${string}/`;

        /**
         * @title quarantine
         */
        quarantine?: boolean;

        /**
         * @title banner_size
         * @todo change to point
         */
        banner_size?:
          | (Array<number & tags.Type<"int64">> &
              tags.MinItems<2> &
              tags.MaxItems<2>)
          | null;

        /**
         * @title user_is_moderator
         */
        user_is_moderator?: boolean;

        /**
         * @title accept_followers
         */
        accept_followers?: boolean;

        /**
         * @title public_description
         */
        public_description?: string;

        /**
         * @title link_flair_enabled
         */
        link_flair_enabled?: boolean;

        /**
         * @title disable_contributor_requests
         */
        disable_contributor_requests?: boolean;

        /**
         * @title subreddit_type
         */
        subreddit_type?: "user";

        /**
         * @title user_is_subscriber
         */
        user_is_subscriber?: boolean;
      };

      /**
       * @title pref_show_presence
       */
      pref_show_presence?: boolean;

      /**
       * @title snoovatar_img
       */
      snoovatar_img?: string;

      /**
       * @title snoovatar_size
       * @todo change to regular object type
       */

      snoovatar_size?:
        | (Array<number & tags.Type<"int64">> &
            tags.MinItems<2> &
            tags.MaxItems<2>)
        | null;

      /**
       * @title gold_expiration
       */
      gold_expiration?: (number & tags.Type<"int64">) | null;

      /**
       * @title has_gold_subscription
       */
      has_gold_subscription?: boolean;

      /**
       * @title is_sponsor
       */
      is_sponsor?: boolean;

      /**
       * @title num_friends
       */
      num_friends?: number & tags.Type<"int64">;

      /**
       * @title features
       */
      features?: {
        /**
         * @title modmail_harassment_filter
         */
        modmail_harassment_filter?: boolean;

        /**
         * @title mod_service_mute_writes
         */
        mod_service_mute_writes?: boolean;

        /**
         * @title promoted_trend_blanks
         */
        promoted_trend_blanks?: boolean;

        /**
         * @title show_amp_link
         */
        show_amp_link?: boolean;

        /**
         * @title is_email_permission_required
         */
        is_email_permission_required?: boolean;

        /**
         * @title mod_awards
         */
        mod_awards?: boolean;

        /**
         * @title awards_on_streams
         */
        awards_on_streams?: boolean;

        /**
         * @title mweb_xpromo_modal_listing_click_daily_dismissible_ios
         */
        mweb_xpromo_modal_listing_click_daily_dismissible_ios?: boolean;

        /**
         * @title chat_subreddit
         */
        chat_subreddit?: boolean;

        /**
         * @title cookie_consent_banner
         */
        cookie_consent_banner?: boolean;

        /**
         * @title modlog_copyright_removal
         */
        modlog_copyright_removal?: boolean;

        /**
         * @title do_not_track
         */
        do_not_track?: boolean;

        /**
         * @title images_in_comments
         */
        images_in_comments?: boolean;

        /**
         * @title mod_service_mute_reads
         */
        mod_service_mute_reads?: boolean;

        /**
         * @title chat_user_settings
         */
        chat_user_settings?: boolean;

        /**
         * @title use_pref_account_deployment
         */
        use_pref_account_deployment?: boolean;

        /**
         * @title mweb_xpromo_interstitial_comments_ios
         */
        mweb_xpromo_interstitial_comments_ios?: boolean;

        /**
         * @title mweb_xpromo_modal_listing_click_daily_dismissible_android
         */
        mweb_xpromo_modal_listing_click_daily_dismissible_android?: boolean;

        /**
         * @title premium_subscriptions_table
         */
        premium_subscriptions_table?: boolean;

        /**
         * @title mweb_xpromo_interstitial_comments_android
         */
        mweb_xpromo_interstitial_comments_android?: boolean;

        /**
         * @title crowd_control_for_post
         */
        crowd_control_for_post?: boolean;

        /**
         * @title chat_group_rollout
         */
        chat_group_rollout?: boolean;

        /**
         * @title resized_styles_images
         */
        resized_styles_images?: boolean;

        /**
         * @title noreferrer_to_noopener
         */
        noreferrer_to_noopener?: boolean;

        /**
         * @title expensive_coins_package
         */
        expensive_coins_package?: boolean;
      };

      /**
       * @title can_edit_name
       */
      can_edit_name?: boolean;

      /**
       * @title is_blocked
       */
      is_blocked?: boolean;

      /**
       * @title verified
       */
      verified?: boolean;

      /**
       * @title pref_autoplay
       */
      pref_autoplay?: boolean;

      /**
       * @title coins
       */
      coins?: number & tags.Type<"int64">;

      /**
       * @title has_paypal_subscription
       */
      has_paypal_subscription?: boolean;

      /**
       * @title has_subscribed_to_premium
       */
      has_subscribed_to_premium?: boolean;

      /**
       * @title id
       */
      id?: string;

      /**
       * @title can_create_subreddit
       */
      can_create_subreddit?: boolean;

      /**
       * @title over_18
       */
      over_18?: boolean;

      /**
       * @title is_gold
       */
      is_gold?: boolean;

      /**
       * @title is_mod
       */
      is_mod?: boolean;

      /**
       * @title awarder_karma
       */
      awarder_karma?: number & tags.Type<"int64">;

      /**
       * @title suspension_expiration_utc
       */
      suspension_expiration_utc?: (number & tags.Type<"int64">) | null;

      /**
       * @title has_stripe_subscription
       */
      has_stripe_subscription?: boolean;

      /**
       * @title is_suspended
       */
      is_suspended?: boolean;

      /**
       * @title pref_video_autoplay
       */
      pref_video_autoplay?: boolean;

      /**
       * @title has_android_subscription
       */
      has_android_subscription?: boolean;

      /**
       * @title in_redesign_beta
       */
      in_redesign_beta?: boolean;

      /**
       * @title icon_img
       */
      icon_img?: string & tags.Format<"iri">;

      /**
       * @title pref_nightmode
       */
      pref_nightmode?: boolean;

      /**
       * @title awardee_karma
       */
      awardee_karma?: number & tags.Type<"int64">;

      /**
       * @title hide_from_robots
       */
      hide_from_robots?: boolean;

      /**
       * @title password_set
       */
      password_set?: boolean;

      /**
       * @title modhash
       */
      modhash?: null;

      /**
       * @title link_karma
       */
      link_karma?: number & tags.Type<"int64">;

      /**
       * @title force_password_reset
       */
      force_password_reset?: boolean;

      /**
       * @title total_karma
       */
      total_karma?: number & tags.Type<"int64">;

      /**
       * @title inbox_count
       */
      inbox_count?: number & tags.Type<"int64">;

      /**
       * @title pref_top_karma_subreddits
       */
      pref_top_karma_subreddits?: boolean;

      /**
       * @title pref_show_snoovatar
       */
      pref_show_snoovatar?: boolean;

      /**
       * @title name
       */
      name?: string;

      /**
       * @title pref_clickgadget
       */
      pref_clickgadget?: number & tags.Type<"int64">;

      /**
       * @title created
       */
      created?: number & tags.Type<"int64">;

      /**
       * @title has_verified_email
       */
      has_verified_email?: boolean;

      /**
       * @title gold_creddits
       */
      gold_creddits?: number & tags.Type<"int64">;

      /**
       * @title created_utc
       */
      created_utc?: number & tags.Type<"int64">;

      /**
       * @title has_ios_subscription
       */
      has_ios_subscription?: boolean;

      /**
       * @title pref_show_twitter
       */
      pref_show_twitter?: boolean;

      /**
       * @title in_beta
       */
      in_beta?: boolean;

      /**
       * @title comment_karma
       */
      comment_karma?: number & tags.Type<"int64">;

      /**
       * @title accept_followers
       */
      accept_followers?: boolean;

      /**
       * @title has_subscribed
       */
      has_subscribed?: boolean;
    };
  }

  export interface IGetUserSubmittedInput
    extends IRedditService.ICommonPaginationInput {
    /**
     * @title The username to fetch posts for
     **/
    username: string;

    /**
     * @title The number of posts to fetch
     **/
    limit?: Limit<1, 100, 25>;
  }

  export interface IGetUserSubmittedOutput {
    /**
     * @title The after cursor for pagination
     **/
    after: FullNames | null;

    /**
     * @title The number of items returned
     **/
    dist: number | null;

    /**
     * @title The modhash for the request
     **/
    modhash: string | null;

    /**
     * @title The geographical filter applied
     **/
    geo_filter: string | null;

    /**
     * @title The list of children posts
     **/
    children: Children[];

    /**
     * @title The before cursor for pagination
     **/
    before: FullNames | null;
  }

  export interface IGetUserCommentsInput
    extends IRedditService.ICommonPaginationInput {
    /**
     * @title The username to fetch comments for
     **/
    username: string;

    /**
     * @title The number of comments to fetch
     **/
    limit?: number & tags.Type<"int32"> & tags.Minimum<1>;
  }

  export interface IGetUserCommentsOutput {
    /**
     * @title The after cursor for pagination
     **/
    after: FullNames | null;

    /**
     * @title The number of items returned
     **/
    dist: number | null;

    /**
     * @title The modhash for the request
     **/
    modhash: string | null;

    /**
     * @title The geographical filter applied
     **/
    geo_filter: string | null;

    /**
     * @title The list of children posts
     **/
    children: {
      /**
       * @title kind
       */
      kind: "t1";

      /**
       * @title data
       */
      data: Comment;
    }[];

    /**
     * @title The before cursor for pagination
     **/
    before: FullNames | null;
  }

  export interface ISearchSubredditsInput
    extends IRedditService.ICommonPaginationInput {
    /**
     * @title The search query
     **/
    q: string;

    /**
     * @title The count of items
     **/
    count?: number & tags.Type<"int32"> & tags.Minimum<0>;

    /**
     * @title The number of subreddits to fetch
     **/
    limit?: number & tags.Type<"int32"> & tags.Minimum<1>;

    /**
     * @title sort
     */
    sort?:
      | tags.Constant<"relevance", { title: "relevance" }>
      | tags.Constant<"activity", { title: "activity" }>;
  }

  export interface ISearchSubredditsOutput {
    /**
     * @title The after cursor for pagination
     **/
    after: FullNames | null;

    /**
     * @title The number of items returned
     **/
    dist: number | null;

    /**
     * @title The modhash for the request
     **/
    modhash: string | null;

    /**
     * @title The geographical filter applied
     **/
    geo_filter: string | null;

    /**
     * @title The list of children sub-reddits
     **/
    children: {
      /**
       * @title kind
       */
      kind: "t5";

      /**
       * @title data
       */

      /**
       * @title data
       */
      data: IRedditService.SubReddit;
    }[];

    /**
     * @title The before cursor for pagination
     **/
    before: FullNames | null;
  }

  export interface SubReddit {
    /**
     * @title restrict_posting
     */
    restrict_posting?: boolean;

    /**
     * @title user_is_banned
     */
    user_is_banned?: boolean;

    /**
     * @title free_form_reports
     */
    free_form_reports?: boolean;

    /**
     * @title user_is_muted
     */
    user_is_muted?: boolean;

    /**
     * @title display_name
     */
    display_name?: string;

    /**
     * @title title
     */
    title?: string;

    /**
     * @title allow_galleries
     */
    allow_galleries?: boolean;

    /**
     * @title primary_color
     */
    primary_color?: string;

    /**
     * @title icon_img
     */
    icon_img?: string;

    /**
     * @title display_name_prefixed
     */
    display_name_prefixed?: string;

    /**
     * @title public_traffic
     */
    public_traffic?: boolean;

    /**
     * @title subscribers
     */
    subscribers?: number;

    /**
     * @title user_flair_richtext
     */
    user_flair_richtext?: any[];

    /**
     * @title videostream_links_count
     */
    videostream_links_count?: number;

    /**
     * @title name
     */
    name?: string;

    /**
     * @title quarantine
     */
    quarantine?: boolean;

    /**
     * @title hide_ads
     */
    hide_ads?: boolean;

    /**
     * @title prediction_leaderboard_entry_type
     */
    prediction_leaderboard_entry_type?: number;

    /**
     * @title emojis_enabled
     */
    emojis_enabled?: boolean;

    /**
     * @title advertiser_category
     */
    advertiser_category?: string;

    /**
     * @title public_description
     */
    public_description?: string;

    /**
     * @title comment_score_hide_mins
     */
    comment_score_hide_mins?: number;

    /**
     * @title allow_predictions
     */
    allow_predictions?: boolean;

    /**
     * @title user_has_favorited
     */
    user_has_favorited?: boolean;

    /**
     * @title community_icon
     */
    community_icon?: string;

    /**
     * @title banner_background_image
     */
    banner_background_image?: string;

    /**
     * @title original_content_tag_enabled
     */
    original_content_tag_enabled?: boolean;

    /**
     * @title community_reviewed
     */
    community_reviewed?: boolean;

    /**
     * @title submit_text
     */
    submit_text?: string;

    /**
     * @title description_html
     */
    description_html?: string;

    /**
     * @title spoilers_enabled
     */
    spoilers_enabled?: boolean;

    /**
     * @title comment_contribution_settings
     */
    comment_contribution_settings?: any;

    /**
     * @title allow_talks
     */
    allow_talks?: boolean;

    /**
     * @title user_flair_position
     */
    user_flair_position?: string;

    /**
     * @title all_original_content
     */
    all_original_content?: boolean;

    /**
     * @title has_menu_widget
     */
    has_menu_widget?: boolean;

    /**
     * @title key_color
     */
    key_color?: string;

    /**
     * @title can_assign_user_flair
     */
    can_assign_user_flair?: boolean;

    /**
     * @title created
     */
    created?: number;

    /**
     * @title wls
     */
    wls?: number;

    /**
     * @title show_media_preview
     */
    show_media_preview?: boolean;

    /**
     * @title submission_type
     */
    submission_type?: string;

    /**
     * @title user_is_subscriber
     */
    user_is_subscriber?: boolean;

    /**
     * @title allowed_media_in_comments
     */
    allowed_media_in_comments?: any[];

    /**
     * @title allow_videogifs
     */
    allow_videogifs?: boolean;

    /**
     * @title should_archive_posts
     */
    should_archive_posts?: boolean;

    /**
     * @title user_flair_type
     */
    user_flair_type?: string;

    /**
     * @title allow_polls
     */
    allow_polls?: boolean;

    /**
     * @title collapse_deleted_comments
     */
    collapse_deleted_comments?: boolean;

    /**
     * @title public_description_html
     */
    public_description_html?: string | null;

    /**
     * @title allow_videos
     */
    allow_videos?: boolean;

    /**
     * @title is_crosspostable_subreddit
     */
    is_crosspostable_subreddit?: boolean | null;

    /**
     * @title should_show_media_in_comments_setting
     */
    should_show_media_in_comments_setting?: boolean;

    /**
     * @title can_assign_link_flair
     */
    can_assign_link_flair?: boolean;

    /**
     * @title accounts_active_is_fuzzed
     */
    accounts_active_is_fuzzed?: boolean;

    /**
     * @title allow_prediction_contributors
     */
    allow_prediction_contributors?: boolean;

    /**
     * @title submit_text_label
     */
    submit_text_label?: string;

    /**
     * @title link_flair_position
     */
    link_flair_position?: string;

    /**
     * @title user_flair_enabled_in_sr
     */
    user_flair_enabled_in_sr?: boolean;

    /**
     * @title allow_discovery
     */
    allow_discovery?: boolean;

    /**
     * @title accept_followers
     */
    accept_followers?: boolean;

    /**
     * @title user_sr_theme_enabled
     */
    user_sr_theme_enabled?: boolean;

    /**
     * @title link_flair_enabled
     */
    link_flair_enabled?: boolean;

    /**
     * @title disable_contributor_requests
     */
    disable_contributor_requests?: boolean;

    /**
     * @title subreddit_type
     */
    subreddit_type?: string;

    /**
     * @title banner_img
     */
    banner_img?: string;

    /**
     * @title banner_background_color
     */
    banner_background_color?: string;

    /**
     * @title show_media
     */
    show_media?: boolean;

    /**
     * @title id
     */
    id?: string;

    /**
     * @title user_is_contributor
     */
    user_is_contributor?: boolean;

    /**
     * @title over18
     */
    over18?: boolean;

    /**
     * @title header_title
     */
    header_title?: string;

    /**
     * @title description
     */
    description?: string;

    /**
     * @title submit_link_label
     */
    submit_link_label?: string;

    /**
     * @title restrict_commenting
     */
    restrict_commenting?: boolean;

    /**
     * @title allow_images
     */
    allow_images?: boolean;

    /**
     * @title lang
     */
    lang?: string;

    /**
     * @title url
     */
    url?: string;

    /**
     * @title created_utc
     */
    created_utc?: number;

    /**
     * @title mobile_banner_image
     */
    mobile_banner_image?: string;

    /**
     * @title user_is_moderator
     */
    user_is_moderator?: boolean;

    /**
     * @title allow_predictions_tournament
     */
    allow_predictions_tournament?: boolean;
  }

  export interface IGetSubredditAboutInput {
    /**
     * @title The subreddit to fetch information for
     **/
    subreddit: `r/${string}`;
  }

  export interface IGetSubredditAboutOutput extends SubReddit {
    /**
     * @title header_img
     */
    header_img?: (string & tags.Format<"iri">) | null;

    /**
     * @title The name of the subreddit
     **/
    name: string;

    /**
     * @title The description of the subreddit
     **/
    description: string;

    /**
     * @title The number of subscribers
     **/
    subscribers: number;
  }

  export interface IGetPopularSubredditsInput
    extends IRedditService.ICommonPaginationInput {
    /**
     * @title The number of posts to fetch
     **/
    limit?: Limit<1, 100, 25>;
  }

  export interface IGetPopularSubredditsOutput {
    /**
     * @title The after cursor for pagination
     **/
    after: FullNames | null;

    /**
     * @title The number of items returned
     **/
    dist: number | null;

    /**
     * @title The modhash for the request
     **/
    modhash: string | null;

    /**
     * @title The geographical filter applied
     **/
    geo_filter: string | null;

    /**
     * @title The list of children sub-reddits
     **/
    children: {
      /**
       * @title kind
       */
      kind: "t5";

      /**
       * @title data
       */

      /**
       * @title data
       */
      data: IRedditService.SubReddit;
    }[];

    /**
     * @title The before cursor for pagination
     **/
    before: FullNames | null;
  }

  export interface IGetBestContentInput
    extends IRedditService.ICommonPaginationInput {
    /**
     * @title The max number of items
     **/
    limit?: Limit<1, 100, 25>;
  }

  export interface IGetBestContentOutput {
    /**
     * @title The after cursor for pagination
     **/
    after: FullNames | null;

    /**
     * @title The number of items returned
     **/
    dist: number | null;

    /**
     * @title The modhash for the request
     **/
    modhash: string | null;

    /**
     * @title The geographical filter applied
     **/
    geo_filter: string | null;

    /**
     * @title The list of children posts
     **/
    children: Children[];

    /**
     * @title The before cursor for pagination
     **/
    before: FullNames | null;
  }
}
