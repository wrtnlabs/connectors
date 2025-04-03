import { tags } from "typia";
import type { ContentMediaType } from "typia/lib/tags";
import { MyPick, SnakeToCamel } from "@wrtnlabs/connector-shared";

export const ENV_LIST = [
  "KAKAO_TALK_CLIENT_ID",
  "KAKAO_TALK_CLIENT_SECRET",
  "KAKAO_TALK_REFRESH_TOKEN",
] as const;

export namespace IKakaoTalkService {
  export type IProps = {
    [key in SnakeToCamel<(typeof ENV_LIST)[number]>]: string;
  };

  /**
   * @title DTO for the code received after Kakao login
   */
  export interface IAuthorizationCode {
    /**
     * @title KakaoTalk OAuth2 authorization code
     */
    code: string;
  }

  /**
   * @title DTO for output of access token
   */
  export interface IGetAccessTokenOutput {
    /**
     * @title Access token
     */
    access_token: string;

    /**
     * @title Token type
     */
    token_type: "bearer";

    /**
     * @title Refresh token
     */
    refresh_token: string;

    /**
     * @title Scope of this access token
     */
    scope: string;

    /**
     * @title Expiry time of the access token
     */
    expires_in: number;

    /**
     * @title Expiry time of the refresh token
     */
    refresh_token_expires_in: number;
  }

  /**
   * @title Conditions for retrieving friends
   */
  export interface IGetFriendsInput {
    /**
     * @title Starting point of the friends list
     */
    offset?: number & tags.Type<"uint64"> & tags.Default<0>;

    /**
     * @title Number of friends per page
     */
    limit?: number & tags.Type<"uint64">;

    /**
     * @title Sort order of the friends list
     */
    order?: (
      | tags.Constant<"asc", { title: "Ascending" }>
      | tags.Constant<"desc", { title: "Descending" }>
    ) &
      tags.Default<"asc">;

    /**
     * It must be one of: 'favorite', 'nickname'.
     * Default value is 'favorite'.
     *
     * @title Sort criteria of the friends list
     */
    friend_order?: (
      | tags.Constant<"favorite", { title: "Sort by favorite" }>
      | tags.Constant<"nickname", { title: "Sort by nickname" }>
    ) &
      tags.Default<"favorite">;
  }

  /**
   * @title KakaoTalk friend
   */
  export interface IFriend {
    /**
     * User ID
     *
     * A member number assigned to a friend in KakaoTalk, equivalent to the ID value.
     * Note that the `uuid` property is used when sending messages.
     *
     * @title Member number
     */
    id: number & tags.Type<"uint64">;

    /**
     * Friend code used when sending KakaoTalk messages. Used for actions such as sending KakaoTalk messages later.
     * Although the property name is `uuid`, it is not in the usual uuid format, so use it with caution.
     *
     * @title Friend code
     */
    uuid: string;

    /**
     * @title Whether the friend is a favorite
     */
    favorite?: boolean;

    /**
     * @title Nickname
     */
    profile_nickname: string;

    /**
     * @title Thumbnail
     */
    profile_thumbnail_image?:
      | (string & tags.Format<"iri">)
      | tags.Constant<"", { title: "NO_PROFILE_IMAGE" }>;
  }

  /**
   * @title Result of retrieving friends
   */
  export interface IGetFriendsOutput {
    /**
     * @title Friends list
     */
    elements: IFriend[];

    /**
     * @title Total number of friends
     */
    total_count: number & tags.Type<"uint64">;

    /**
     * @title Next page URL of the friends list
     */
    after_url?: (string & tags.Format<"iri">) | null;

    /**
     * @title Previous page URL of the friends list
     */
    before_url?: (string & tags.Format<"iri">) | null;

    /**
     * @title Number of favorite friends
     */
    favorite_count?: number & tags.Type<"uint64">;
  }

  /**
   * @title Result of retrieving events
   */
  export interface IGetEventOutput {
    /**
     * @title List of events
     */
    events: IKakaoTalkService.IEventBrief[];

    /**
     * @title Whether there is a next page
     */
    has_next: boolean;

    /**
     * A URL containing parameters and values to retrieve the next page, used as is when requesting the next page.
     *
     * Provided when `has_next` is true.
     *
     * @title URL of the next page
     */
    after_url?: string & tags.Format<"url">;
  }

  /**
   * @title Event
   */
  export interface IEventBrief {
    /**
     * @title Event ID
     */
    id?: string;

    /**
     * @title Event title
     */
    title?: string;

    /**
     * @title Event type
     */
    type?: string;

    /**
     * @title Calendar ID
     * @description Fixed to primary for the default calendar
     */
    calendar_id?: ICalendar["id"];

    /**
     * @title Event time
     */
    time: IKakaoTalkService.ITime;

    /**
     * @title Whether the user is the host of the event
     * @description For public/subscribed or invited events
     */
    is_host?: boolean & tags.Default<false>;

    /**
     * @title Whether the event is recurring
     * @description Required if type is USER.
     */
    is_recur_event?: boolean;

    /**
     * @title Event color
     * @description Not included if not specified during event creation or editing.
     */
    color?: IKakaoTalkService.Color;
  }

  /**
   * @title Time settings for an event
   */
  export interface ITime {
    /**
     * @title Start time of the event
     * @description Can be set in 5-minute intervals
     */
    start_at?: string;

    /**
     * @title End time of the event
     */
    end_at?: string;

    /**
     * @title Timezone setting
     *
     * In TZID format.
     */
    time_zone?: string & tags.Default<"Asia/Seoul">;

    /**
     * @title Whether the event is all-day
     */
    all_day?: boolean & tags.Default<false>;

    /**
     * @title Whether to set the date based on the lunar calendar
     */
    lunar?: boolean & tags.Default<false>;
  }

  /**
   * @title Event created in KakaoTalk calendar
   *
   * @title Event
   */
  export interface IEvent {
    /**
     * @title Event title
     */
    title: string & tags.MaxLength<50>;

    /**
     * @title Event time
     */
    time: IKakaoTalkService.ITime;

    /**
     * @title Recurrence rule for the event
     * @description In RFC5545 RRULE format
     */
    rrule?: string;

    /**
     * @title Event description
     */
    description?: string & tags.MaxLength<5000>;

    /**
     * @title Event location
     */
    location?: IKakaoTalkService.ILocation;

    /**
     * @title Reminder settings
     * @description In minutes, can be set in 5-minute intervals, up to 2 reminders. For all-day events, can start from -1440, for non-all-day events, starts from 0.
     */
    reminders?: (number &
      tags.MultipleOf<5> &
      tags.Minimum<-1440> &
      tags.Maximum<43200>)[] &
      tags.MaxItems<2>;

    /**
     * @title Event color
     */
    color?: IKakaoTalkService.Color;
  }

  /**
   * @title Output of created event
   */
  export interface ICreateEventOutput {
    /**
     * @title ID of the created event
     */
    event_id: string;
  }

  /**
   * @title Conditions for creating an event
   */
  export interface ICreateEventInput {
    /**
     * @title Calendar ID to create the event in
     */
    calendar_id?: ICalendar["id"];

    /**
     * @title Information of the event to be created
     */
    event: IEvent;
  }

  /**
   * @title Location
   */
  export interface ILocation {
    /**
     * @title Place Name
     */
    name?: string & tags.MaxLength<50>;

    /**
     * @title Place ID
     */
    location_id?: number;

    /**
     * @title Address
     */
    address?: string;

    /**
     * @title Latitude
     */
    latitude?: number;

    /**
     * @title Longitude
     */
    longitude?: number;
  }

  /**
   * @title Request Conditions for Retrieving Calendar Events
   * @description Either a `from` and `to` pair or `next_page_token` must be included.
   */
  export type IGetEventInput = {
    /**
     * @title Calendar ID to Retrieve Events
     * @description Defaults to retrieving all calendars if not specified.
     */
    calender_id?: ICalendar["id"];

    /**
     * @title Time Period for Retrieving Events
     * @description Required if `from` and `to` are not included, and ignored if `next_page_token` is included.
     */
    preset?:
      | tags.Constant<"TODAY", { title: "The day of the query" }>
      | tags.Constant<
          "THIS_WEEK",
          { title: "The week containing the query date starting on Sunday" }
        >
      | tags.Constant<
          "THIS_MONTH",
          { title: "The month containing the query date starting on the 1st" }
        >;

    /**
     * @title Time Zone for Deadline Dates
     *
     * In TZID format.
     */
    time_zone?: string;

    /**
     * @title Maximum Number of Events to Receive in Response
     */
    limit?: number &
      tags.Type<"int64"> &
      tags.Minimum<100> &
      tags.Maximum<1000>;
  } & (
    | {
        /**
         * @title Start Time of the Period to Retrieve Events
         * @description Required if `from` and `to` are not included and ignored if `next_page_token` is included.
         */
        from: string & tags.Format<"date-time">;

        /**
         * @title End Time of the Period to Retrieve Events
         * @description Required if `from` and `to` are not included and ignored if `next_page_token` is included. Must be within 31 days from `to`.
         */
        to: string & tags.Format<"date-time">;
      }
    | {
        /**
         * @title Token for Pagination
         * @description Query condition token including `from`, `to`, and `limit` values, available in the `after_url` received in the response.
         */
        next_page_token: string;
      }
  );

  /**
   * @title Refresh Access Token
   */
  export type IRefreshAccessTokenOutput = MyPick<
    IGetAccessTokenOutput,
    "access_token" | "expires_in" | "token_type" | "refresh_token"
  >;

  /**
   * @title Conditions to Refresh Kakao Access Token
   */
  export interface IRefreshAccessTokenInput {
    secretKey: string;
  }

  /**
   * There are two types of calendars in KakaoTalk:
   * 1. Basic Calendar: This is a personal calendar. While it is personal, it is not limited to viewing only your own events; you can view events shared by friends or events you were invited to.
   * 2. Subscription Calendar: This is a shared calendar managed by a group of members in a chat room. You can view the calendars of the chat rooms you are part of.
   *
   * @title Talk Calendar
   */
  export interface IGetCalendarOutput {
    /**
     * Personal calendars.
     * Although these are personal, they are not limited to just your own events; you can view events from friends' schedules if invited or shared.
     *
     * @title Basic Calendar
     */
    calendars?: IKakaoTalkService.ICalendar[];

    /**
     * Subscription calendars.
     * These are managed in chat rooms where multiple members have created a group. You can view the calendars of the chat rooms you belong to.
     *
     * @title List of Subscribed Calendars
     */
    subscribe_calendars?: IKakaoTalkService.ISubscribeCalendars[];
  }

  /**
   * @title List of Subscribed Calendars
   */
  export interface ISubscribeCalendars extends IKakaoTalkService.ICalendar {
    /**
     * @title Description of the subscribed calendar set by the channel
     */
    description?: string;

    /**
     * @title Profile image URL of the subscribed calendar
     *
     * If an empty string appears, it means there is no image.
     */
    profile_image_url?:
      | (string & tags.Format<"url"> & ContentMediaType<"image/*">)
      | tags.Constant<"", { title: "NO_PROFILE_IMAGE" }>;

    /**
     * @title Thumbnail URL of the subscribed calendar's speech bubble
     */
    thumbnail_url?: string & tags.Format<"url"> & ContentMediaType<"image/*">;
  }

  /**
   * @title Basic Calendar
   * @description List of sub-calendars
   */
  export interface ICalendar {
    /**
     * @title Calendar ID
     *
     * For calendars that users typically have by default, it is referred to as `primary`.
     */
    id: string & tags.Default<"primary">;

    /**
     * @title Calendar Name
     */
    name?: string;

    /**
     * @title Event Color
     */
    color?: IKakaoTalkService.Color;

    /**
     * @title Default reminder time for non-all-day events
     */
    reminder?: number & tags.Type<"int64">;

    /**
     * @title Default reminder time for all-day events
     */
    reminder_all_day?: number & tags.Type<"int64">;
  }

  /**
   * @title Button Information
   */
  export interface IButton {
    /**
     * @title Button Name
     */
    title: string;

    /**
     * @title Button Link
     */
    link: IKakaoTalkService.ButtonLink;
  }

  /**
   * @title Link Information
   */
  export type ButtonLink =
    | IWebLink
    | IMobileWebLink
    | IAndroidAppLink
    | IiOSAppLink;

  /**
   * @title Web Link
   */
  export interface IWebLink {
    /**
     * @title Web Link
     */
    web_url: string & tags.Format<"url">;
  }

  /**
   * @title Mobile Web Link
   */
  export interface IMobileWebLink {
    /**
     * @title Mobile Web Link
     */
    mobile_web_url: string & tags.Format<"url">;
  }

  /**
   * @title Android App Link
   */
  export interface IAndroidAppLink {
    /**
     * @title App Link
     * @description Use `mobile_web_url` if this value is absent
     */
    android_execution_params: string;
  }

  /**
   * @title iOS App Link
   */
  export interface IiOSAppLink {
    /**
     * @title App Link
     * @description Use `mobile_web_url` if this value is absent
     */
    ios_execution_params: string;
  }

  /**
   * @title Message Sending Conditions
   */
  export interface ISendKakaoTalkToFriendsInput {
    /**
     * @title List of friends' UUIDs
     */
    receiver_uuids: IFriend["uuid"][] & tags.MinItems<1> & tags.MaxItems<5>;

    /**
     * @title Message to send
     */
    message: ITextMemoInput["text"];
  }

  /**
   * @title Message Sending Result
   */
  export interface ISendKakaoTalkToFriendsOutput {
    /**
     * @title List of successfully sent friend UUIDs
     */
    successful_receiver_uuids?: string[] & tags.MaxItems<5>;

    /**
     * @title Failure Information
     */
    failure_info?: IFailureInfo;
  }

  /**
   * @title Failure Information
   */
  export interface IFailureInfo {
    /**
     * @title Error Code
     */
    code: number;

    /**
     * @title Error Message
     */
    msg: string;

    /**
     * @title List of friend UUIDs that failed with the given error code
     */
    receiver_uuids: string[] & tags.MaxItems<5>;
  }

  /**
   * @title Message Sending Conditions
   */
  export interface ISendKakaoTalkCommerceInput {
    /**
     * @title Commerce Template
     */
    template_object: ICommerceMemoInput;
  }

  /**
   * @title Message Sending Conditions
   */
  export interface ISendKakaoTalkLocationInput {
    /**
     * @title Location Template
     */
    template_object: ILocationMemoInput;
  }

  /**
   * @title Message Sending Conditions
   */
  export interface ISendKakaoTalkListInput {
    /**
     * @title List Template
     */
    template_object: IListMemoInput;
  }

  /**
   * @title Message Sending Conditions
   */
  export interface ISendKakaoTalkFeedInput {
    /**
     * @title Feed Template
     */
    template_object: IFeedMemoInput;
  }

  /**
   * @title Message Sending Conditions
   */
  export interface ISendKakaoTalkTextInput {
    /**
     * @title Text Template
     */
    template_object: ITextMemoInput;
  }

  /**
   * @title Common Values for All Templates
   */
  export interface IMemoBase {
    /**
     * @title Message Content
     */
    content: IKakaoTalkService.Content;

    /**
     * @title Button Title
     */
    button_title?: string;
  }

  /**
   * @title Commerce Template
   */
  export interface ICommerceMemoInput extends IMemoBase {
    /**
     * @title Commerce Type
     */
    object_type: "commerce";

    /**
     * @title Product Name and Pricing Information
     */
    commerce: IKakaoTalkService.Commerce;

    /**
     * @title List of Buttons
     * @description Used to customize button titles and links. Supports two buttons and takes precedence over `button_title`.
     */
    buttons?: IKakaoTalkService.IButton[] & tags.MaxItems<2>;
  }

  export type Commerce = {
    /**
     * @title Product Name and Title
     */
    product_name?: string;

    /**
     * @title Regular Price
     */
    regular_price: number & tags.Type<"int64">;

    /**
     * @title Discounted Price
     */
    discount_price?: number & tags.Type<"int64">;

    /**
     * @title Currency Unit or Symbol
     */
    currency_unit?: string & tags.Default<"원">;

    /**
     * @title Currency Unit Position
     */
    currency_unit_position?:
      | tags.Constant<0, { title: "Displayed after price" }>
      | tags.Constant<1, { title: "Displayed before price" }>;
  } & (
    | {
        /**
         * @title Discount Rate
         * @description A number between 0 and 100
         */
        discount_rate?: number &
          tags.Type<"int64"> &
          tags.Minimum<0> &
          tags.Maximum<100>;
      }
    | {
        /**
         * @title Fixed Discount Price
         * @description Cannot be used together with discount rate
         */
        fixedDiscountPrice?: number & tags.Type<"int64"> & tags.Minimum<0>;
      }
  );

  /**
   * @title Location Template
   */
  export interface ILocationMemoInput extends IMemoBase {
    /**
     * @title Location Type
     */
    object_type: "location";

    /**
     * @title Address of the Location to Share
     */
    address: string;

    /**
     * @title Title Used in KakaoTalk Map View
     */
    address_title?: string;

    /**
     * @title Additional Social Information
     */
    social?: IKakaoTalkService.ISocial;

    /**
     * @title List of Buttons
     * @description Used to customize button titles and links. Supports two buttons and takes precedence over `button_title`.
     */
    buttons?: IKakaoTalkService.IButton[] & tags.MaxItems<2>;
  }

  /**
   * @title List Template
   */
  export interface IListMemoInput extends MyPick<IMemoBase, "button_title"> {
    /**
     * @title List Type
     */
    object_type: "list";

    /**
     * @title Main Title Displayed at the Top of the List
     */
    header_title: string & tags.MaxLength<200>;

    /**
     * @title Link Information Corresponding to the Header Title
     */
    header_link: IKakaoTalkService.ButtonLink;

    /**
     * @title List of Contents Displayed in the List
     */
    contents: IKakaoTalkService.Content[] & tags.MinItems<2> & tags.MaxItems<3>;

    /**
     * @title List of Buttons
     * @description Used to customize button titles and links. Supports two buttons and takes precedence over `button_title`.
     */
    buttons?: IKakaoTalkService.IButton[] & tags.MaxItems<2>;
  }

  /**
   * @title Calendar Template
   */
  export interface ICalendarMemoInput {
    /**
     * @title Calendar Type
     */
    object_type: "calendar";

    /**
     * @title ID Type
     */
    id_type:
      | tags.Constant<"event", { title: "Public Event" }>
      | tags.Constant<"calendar", { title: "Subscribed Calendar" }>;

    /**
     * @title ID of the Public Event or Subscribed Calendar
     */
    id: string;

    /**
     * @title Event Title and Description
     */
    content: IKakaoTalkService.Content;

    /**
     * @title Custom Button Information
     * @description Calendar messages provide default buttons for adding public events or subscribing to calendars. One custom button can be optionally added.
     */
    buttons?: IKakaoTalkService.IButton[] & tags.MaxItems<1>;
  }

  /**
   * @title Feed Template
   */
  export interface IFeedMemoInput extends IMemoBase {
    /**
     * @title Feed Type
     */
    object_type: "feed";

    /**
     * @title Content to Include in the Item Area
     */
    item_content: IKakaoTalkService.ItemContent;

    /**
     * @title Social Information About the Content
     */
    social?: IKakaoTalkService.ISocial;

    /**
     * @title List of Buttons
     * @description Used to customize button titles and links. Supports two buttons and takes precedence over `button_title`.
     */
    buttons?: IKakaoTalkService.IButton[] & tags.MaxItems<2>;
  }

  /**
   * @title Item Content
   */
  export interface ItemContent {
    /**
     * @title Text to Display in the Header or Profile Area
     * @description If `profile_image_url` is absent, it will be displayed as a bold header containing only the title.
     */
    profile_text?: string & tags.MaxLength<16>;

    /**
     * @title Profile Image
     * @description Displayed as a small circular profile photo.
     */
    profile_image_url?: string & tags.Format<"url">;

    /**
     * @title Item Image
     * @description iOS 108x108, Android 98x98 size. Images not in a 1:1 ratio will be center cropped.
     */
    title_image_url?: string & tags.Format<"url">;

    /**
     * @title Item Title
     * @description Maximum of 2 lines.
     */
    title_image_text?: string & tags.MaxLength<24>;

    /**
     * @title Category
     * @description Maximum of 1 line.
     */
    title_image_category?: string & tags.MaxLength<14>;

    /**
     * @title List of Items
     * @description Information for each text item.
     */
    items?: IKakaoTalkService.ItemInfo[] & tags.MaxItems<5>;

    /**
     * @title Total Amount
     */
    sum?: string & tags.MaxLength<6>;

    /**
     * @title Price Summary Information
     */
    sum_op?: string & tags.MaxLength<11>;
  }

  /**
   * @title Item Information
   */
  export interface ItemInfo {
    /**
     * @title Item Name
     */
    item: string & tags.MaxLength<6>;

    /**
     * @title Item Price
     */
    item_op: string & tags.MaxLength<14>;
  }

  /**
   * @title Content
   *
   * One of title, image_url, or description is required.
   */
  export type Content = (
    | {
        /**
         * @title Title
         */
        title: string;
      }
    | {
        /**
         * @title Image URL
         * @description The image size must not exceed `5MB`.
         */
        image_url: string & tags.Format<"url">;
      }
    | {
        /**
         * @title Detailed Description
         * @description Combined with title, displayed up to 4 lines.
         */
        description: string;
      }
  ) & {
    /**
     * @title Image Width
     * @description In pixels.
     */
    image_width?: number & tags.Type<"uint64"> & tags.Minimum<200>;

    /**
     * @title Image Height
     * @description In pixels.
     */
    image_height?: number & tags.Type<"uint64"> & tags.Minimum<200>;

    /**
     * @title Link Information for Redirection
     */
    link: IKakaoTalkService.ButtonLink;
  };

  /**
   * @title Social Information
   * @description Up to 3 out of 5 attributes will be displayed. Priority is Like > Comment > Shared > View > Subscriber.
   */
  export interface ISocial {
    /**
     * @title Number of Likes on the Content
     */
    like_count?: number & tags.Type<"int64">;

    /**
     * @title Number of Comments on the Content
     */
    comment_count?: number & tags.Type<"int64">;

    /**
     * @title Number of Shares of the Content
     */
    shared_count?: number & tags.Type<"int64">;

    /**
     * @title Number of Views of the Content
     */
    view_count?: number & tags.Type<"int64">;

    /**
     * @title Number of Subscribers to the Content
     */
    subscriber_count?: number & tags.Type<"int64">;
  }

  /**
   * @title Text Template
   */
  export interface ITextMemoInput extends MyPick<IMemoBase, "button_title"> {
    /**
     * @title Text Type
     */
    object_type: "text";

    /**
     * @title Body Text
     */
    text: string & tags.MaxLength<200>;

    /**
     * @title Link
     */
    link: IWebLink & IMobileWebLink;

    /**
     * @title List of Buttons
     * @description Used to customize button titles and links. Supports two buttons and takes precedence over `button_title`.
     */
    buttons?: IKakaoTalkService.IButton[] & tags.MaxItems<2>;
  }

  export interface IMemoOutput {
    /**
     * @title Response Code
     */
    result_code: tags.Constant<
      0,
      {
        title: "Success";
        description: "Indicates successful message sending";
      }
    >;
  }

  /**
   * @title Schedule Color
   */
  export type Color =
    | tags.Constant<"BLUE", { title: "BLUE"; description: "2C88DE" }>
    | tags.Constant<
        "ROYAL_BLUE",
        { title: "ROYAL_BLUE"; description: "2D69E0" }
      >
    | tags.Constant<"NAVY_BLUE", { title: "NAVY_BLUE"; description: "223788" }>
    | tags.Constant<"RED", { title: "RED"; description: "D42726" }>
    | tags.Constant<"PINK", { title: "PINK"; description: "ED5683" }>
    | tags.Constant<"ORANGE", { title: "ORANGE"; description: "FF9429" }>
    | tags.Constant<"GREEN", { title: "GREEN"; description: "149959" }>
    | tags.Constant<"LIME", { title: "LIME"; description: "7CB343" }>
    | tags.Constant<"OLIVE", { title: "OLIVE"; description: "A4AD15" }>
    | tags.Constant<"MINT", { title: "MINT"; description: "5CC5BE" }>
    | tags.Constant<"MAGENTA", { title: "MAGENTA"; description: "AB47BC" }>
    | tags.Constant<"VIOLET", { title: "VIOLET"; description: "8A4B9B" }>
    | tags.Constant<"LAVENDER", { title: "LAVENDER"; description: "7986CB" }>
    | tags.Constant<"BROWN", { title: "BROWN"; description: "945C1F" }>
    | tags.Constant<"GRAY", { title: "GRAY"; description: "666666" }>;
}
