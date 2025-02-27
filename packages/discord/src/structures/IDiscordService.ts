import { tags } from "typia";

export namespace IDiscordService {
  export interface IProps {
    /**
     * Discord Bot Token.
     */
    secret: string;

    /**
     * Discord Guild ID.
     */
    guildId: string;
  }

  /**
   * @title 서버 정보
   */
  export interface IGuildResponse {
    /**
     * 서버의 고유 id 입니다.
     *
     * @title 서버 고유 id
     */
    id: string;

    /**
     * 서버 이름 입니다.
     *
     * @title 서버 이름
     */
    name: string;

    /**
     * 서버 아이콘 입니다.
     *
     * @title 서버 아이콘
     */
    icon: string | null;

    /**
     * 서버 소유자 여부 입니다.
     *
     * @title 서버 소유자 여부
     */
    owner?: boolean;

    /**
     * 서버 소유자 고유 id 입니다.
     *
     * @title 서버 소유자 고유 id
     */
    owner_id?: string;

    /**
     * @title permissions
     */
    permissions?: string;

    /**
     * @title roles
     */
    roles: IRole[];

    /**
     * @title emojis
     */
    emojis: IEmoji[];

    /**
     * @title features
     */
    features: Array<IGuildFeature>;

    /**
     * @title description
     */
    description: string | null;
  }

  export interface IRole {
    /**
     * @title id
     */
    id: string;

    /**
     * @title name
     */
    name: string;

    /**
     * @title color
     */
    color: number;

    /**
     * @title hoist
     */
    hoist: boolean;

    /**
     * @title icon
     */
    icon?: string | null;

    /**
     * @title unicode_emoji
     */
    unicode_emoji?: string | null;

    /**
     * @title position
     */
    position: number;

    /**
     * @title permissions
     */
    permissions: string;

    /**
     * @title managed
     */
    managed: boolean;

    /**
     * @title mentionable
     */
    mentionable: boolean;

    /**
     * @title tags
     */
    tags?: ITags;

    /**
     * @title flags
     */
    flags: number;
  }

  export interface ITags {
    /**
     * @title bot_id
     */
    bot_id?: string;

    /**
     * @title integration_id
     */
    integration_id?: string;

    /**
     * @title premium_subscriber
     */
    premium_subscriber?: null;

    /**
     * @title subscription_listing_id
     */
    subscription_listing_id?: number;

    /**
     * @title available_for_purchase
     */
    available_for_purchase?: null;

    /**
     * @title guild_connections
     */
    guild_connections?: null;
  }

  export interface IEmoji {
    /**
     * @title id
     */
    id: string | null;

    /**
     * @title name
     */
    name: string | null;

    /**
     * @title roles
     */
    roles?: string[];

    /**
     * @title user
     */
    user?: IUser;

    /**
     * @title require_colons
     */
    require_colons?: boolean;

    /**
     * @title managed
     */
    managed?: boolean;

    /**
     * @title animated
     */
    animated?: boolean;

    /**
     * @title available
     */
    available?: boolean;
  }

  /**
   * @title 유저 정보
   */
  export interface IUser {
    /**
     * 유저마다 발급된 고유 id 입니다.
     *
     * @title 유저 고유 id
     */
    id: string | string;

    /**
     * 유저 이름입니다.
     *
     * @title 유저 이름
     */
    username: string;

    /**
     * 유저의 discord tag 입니다.
     *
     * @tag 유저의 discord tag
     */
    discriminator: string;

    /**
     * 유저가 설정한 이름입니다. 봇 유저는 어플리케이션 이름이 됩니다.
     *
     * @title 유저가 설정한 이름
     */
    global_name: string | null;
    // avatar: string | null;

    /**
     * 봇 유저 여부입니다.
     *
     * @title 봇 유저 여부
     */
    bot?: boolean;

    /**
     * 유저 이메일입니다.
     *
     * @title 이메일
     */
    email?: string | null;
  }

  /**
   * @title 서버에서 가능한 기능
   */
  export type IGuildFeature =
    | "ANIMATED_BANNER"
    | "ANIMATED_ICON"
    | "APPLICATION_COMMAND_PERMISSIONS_V2"
    | "AUTO_MODERATION"
    | "BANNER"
    | "COMMUNITY"
    | "CREATOR_MONETIZABLE_PROVISIONAL"
    | "CREATOR_STORE_PAGE"
    | "DEVELOPER_SUPPORT_SERVER"
    | "DISCOVERABLE"
    | "FEATURABLE"
    | "INVITES_DISABLED"
    | "INVITE_SPLASH"
    | "MEMBER_VERIFICATION_GATE_ENABLED"
    | "MORE_STICKERS"
    | "NEWS"
    | "PARTNERED"
    | "PREVIEW_ENABLED"
    | "RAID_ALERTS_DISABLED"
    | "ROLE_ICONS"
    | "ROLE_SUBSCRIPTIONS_AVAILABLE_FOR_PURCHASE"
    | "ROLE_SUBSCRIPTIONS_ENABLED"
    | "TICKETED_EVENTS_ENABLED"
    | "VANITY_URL"
    | "VERIFIED"
    | "VIP_REGIONS"
    | "WELCOME_SCREEN_ENABLED";

  /**
   * @title DM을 보내기 위해 필요한 정보
   */
  export interface ICreateDMRequest {
    /**
     * DM을 보낼 상대방을 선택해주세요.
     *
     * @title 상대방
     */
    recipient_id: string;
  }

  /**
   * @title 채널 정보
   */
  export interface IChannel {
    /**
     * @title id
     */
    id: string;

    /**
     * @title type
     */
    type: number;

    /**
     * @title guild_id
     */
    guild_id?: string;

    /**
     * @title position
     */
    position?: number;

    /**
     * @title permission_overwrites
     */
    permission_overwrites?: IOverwrite[];

    /**
     * @title name
     */
    name?: string | null;

    /**
     * @title topic
     */
    topic?: string | null;

    /**
     * @title recipients
     */
    recipients?: IUser[];

    /**
     * @title icon
     */
    icon?: string | null;

    /**
     * @title owner_id
     */
    owner_id?: string;

    /**
     * @title application_id
     */
    application_id?: string;

    /**
     * @title managed
     */
    managed?: boolean;

    /**
     * @title parent_id
     */
    parent_id?: string | null;

    /**
     * @title last_pin_timestamp
     */
    last_pin_timestamp?: (string & tags.Format<"date-time">) | null;

    /**
     * @title rtc_region
     */
    rtc_region?: string | null;

    /**
     * @title video_quality_mode
     */
    video_quality_mode?: number;

    /**
     * @title message_count
     */
    message_count?: number;

    /**
     * @title member_count
     */
    member_count?: number;

    /**
     * @title thread_metadata
     */
    thread_metadata?: IThreadMetadata;

    /**
     * @title member
     */
    member?: IThreadMember;

    /**
     * @title default_auto_archive_duration
     */
    default_auto_archive_duration?: number;

    /**
     * @title permissions
     */
    permissions?: string;

    /**
     * @title flags
     */
    flags?: number;

    /**
     * @title total_message_sent
     */
    total_message_sent?: number;

    /**
     * @title available_tags
     */
    available_tags?: ITag[];

    /**
     * @title applied_tags
     */
    applied_tags?: string[];

    /**
     * @title default_reaction_emoji
     */
    default_reaction_emoji?: IDefaultReaction | null;

    /**
     * @title default_thread_rate_limit_per_user
     */
    default_thread_rate_limit_per_user?: number;

    /**
     * @title default_sort_order
     */
    default_sort_order?: number | null;

    /**
     * @title default_forum_layout
     */
    default_forum_layout?: number;
  }

  export interface IOverwrite {
    /**
     * @title id
     */
    id: string;

    /**
     * @title type
     */
    type: number;

    /**
     * @title allow
     */
    allow: string;

    /**
     * @title deny
     */
    deny: string;
  }

  export interface IThreadMetadata {
    /**
     * @title archived
     */
    archived: boolean;

    /**
     * @title auto_archive_duration
     */
    auto_archive_duration: number;

    /**
     * @title archive_timestamp
     */
    archive_timestamp: string & tags.Format<"date-time">;

    /**
     * @title locked
     */
    locked: boolean;

    /**
     * @title invitable
     */
    invitable?: boolean;

    /**
     * @title create_timestamp
     */
    create_timestamp?: (string & tags.Format<"date-time">) | null;
  }

  export interface IThreadMember {
    /**
     * @title id
     */
    id?: string;

    /**
     * @title user_id
     */
    user_id?: string;

    /**
     * @title join_timestamp
     */
    join_timestamp: string & tags.Format<"date-time">;

    /**
     * @title flags
     */
    flags: number;

    /**
     * @title member
     */
    member?: IGuildMember;
  }

  export interface ITag extends IDefaultReaction {
    /**
     * @title id
     */
    id: string;

    /**
     * @title name
     */
    name: string;

    /**
     * @title moderated
     */
    moderated: boolean;
  }

  export interface IDefaultReaction {
    /**
     * @title emoji_id
     */
    emoji_id: string | null;

    /**
     * @title emoji_name
     */
    emoji_name: string | null;
  }

  /**
   * @title 서버에 있는 멤버 정보
   */
  export interface IGuildMember {
    /**
     * @title user
     */
    user?: IUser;

    /**
     * @title nick
     */
    nick?: string | null;

    /**
     * @title avatar
     */
    avatar?: string | null;

    /**
     * @title roles
     */
    roles: string[];

    /**
     * @title joined_at
     */
    joined_at: string & tags.Format<"date-time">;

    /**
     * @title premium_since
     */
    premium_since?: (string & tags.Format<"date-time">) | null;

    /**
     * @title deaf
     */
    deaf: boolean;

    /**
     * @title mute
     */
    mute: boolean;

    /**
     * @title flags
     */
    flags: number;

    /**
     * @title pending
     */
    pending?: boolean;

    /**
     * @title permissions
     */
    permissions?: string;

    /**
     * @title communication_disabled_until
     */
    communication_disabled_until?: (string & tags.Format<"date-time">) | null;

    /**
     * @title avatar_decoration_data
     */
    avatar_decoration_data?: IAvatarDecorationData | null;
  }

  export interface IAvatarDecorationData {
    /**
     * @title asset
     */
    asset: string;

    /**
     * @title sku_id
     */
    sku_id: string;
  }

  /**
   * @title 서버를 생성하기 위해 필요한 정보
   */
  export interface ICreateGuildRequest {
    /**
     * 서버 이름을 입력해주세요.
     *
     * @title 서버 이름
     */
    name: string;
  }

  /**
   * @title 서버 정보
   */
  export interface IGuild {
    /**
     * @title id
     */
    id: string;

    /**
     * @title name
     */
    name: string;

    /**
     * @title owner
     */
    owner?: boolean;

    /**
     * @title owner_id
     */
    owner_id?: string;

    /**
     * @title roles
     */
    roles?: IRole[];

    /**
     * @title features
     */
    features: Array<IGuildFeature>;

    /**
     * @title description
     */
    description?: string | null;
  }

  /**
   * @title 서버 정보를 수정하기 위해 필요한 정보
   */
  export interface IModifyGuildRequest {
    /**
     * 수정할 서버 이름을 입력해주세요.
     *
     * @title 수정할 이름
     */
    name: string;
  }

  /**
   * @title 채널을 생성하기 위해 필요한 정보
   */
  export interface ICreateGuildChannelRequest {
    /**
     * 생성할 서버 이름을 입력해주세요.
     *
     * @title 채널 이름
     */
    name: string & tags.MaxLength<100>;

    /**
     * 서버 유형을 선택해주세요.
     *
     * @title 유형
     */
    type: Channel;

    /**
     * 채널 주제를 입력해주세요.
     *
     * @title 주제
     */
    topic?: string & tags.MaxLength<1024>;
  }

  /**
   * @title 채널 유형
   */
  export type Channel =
    | tags.Constant<0, { title: "텍스트 채널" }>
    | tags.Constant<1, { title: "DM 채널" }>;

  /**
   * @title 멤버를 차단 하기 위해 필요한 정보
   */
  export interface IRemoveGuildMember {
    /**
     * 차단할 멤버를 선택해주세요.
     *
     * @title 멤버
     */
    userId: string;
  }

  /**
   * @title 채널을 수정하기 위해 필요한 정보
   */
  export interface IModifyChannelRequest {
    /**
     * 수정할 채널 이름을 입력해주세요.
     *
     * @title 수정할 채널 이름
     */
    name: string;

    /**
     * 수정할 채널을 선택해주세요.
     *
     * @title 채널
     */
    channelId: string;
  }

  /**
   * @title 채널을 삭제하기 위해 필요한 정보
   */
  export interface IDeleteChannelRequest {
    /**
     * 삭제할 채널을 선택해주세요.
     *
     * @title 채널
     */
    channelId: string;
  }

  /**
   * @title 메세지 정보
   */
  export interface IMessage {
    /**
     * @title id
     */
    id: string;

    /**
     * @title channel_id
     */
    channel_id: string;

    /**
     * @title author
     */
    author: IUser;

    /**
     * @title content
     */
    content: string;

    /**
     * @title timestamp
     */
    timestamp: string & tags.Format<"date-time">;

    /**
     * @title edited_timestamp
     */
    edited_timestamp?: (string & tags.Format<"date-time">) | null;

    /**
     * @title tts
     */
    tts: boolean;

    /**
     * @title mention_everyone
     */
    mention_everyone: boolean;

    /**
     * @title mentions
     */
    mentions: IUser[];

    /**
     * @title mention_channels
     */
    mention_channels?: IChannelMention[];

    /**
     * @title attachments
     */
    attachments: IAttachment[];

    /**
     * @title embeds
     */
    embeds: IEmbed[];

    /**
     * @title reactions
     */
    reactions?: IReaction[];

    /**
     * @title pinned
     */
    pinned: boolean;

    /**
     * @title type
     */
    type: number & tags.Minimum<0> & tags.Maximum<45> & tags.Type<"int32">;

    /**
     * @title thread
     */
    thread?: IChannel;
  }

  export interface IChannelMention {
    /**
     * @title id
     */
    id: string;

    /**
     * @title guild_id
     */
    guild_id: string;

    /**
     * @title type
     */
    type: Channel;

    /**
     * @title name
     */
    name: string;
  }

  export interface IAttachment {
    /**
     * @title id
     */
    id: string;

    /**
     * @title filename
     */
    filename: string;

    /**
     * @title title
     */
    title?: string;

    /**
     * @title description
     */
    description?: string;

    /**
     * @title conetnt_type
     */
    conetnt_type?: string;

    /**
     * @title size
     */
    size: number;

    /**
     * @title url
     */
    url: string;

    /**
     * @title proxy_url
     */
    proxy_url: string;

    /**
     * @title height
     */
    height?: number | null;

    /**
     * @title width
     */
    width?: number | null;

    /**
     * @title ephemeral
     */
    ephemeral?: boolean;

    /**
     * @title duration_secs
     */
    duration_secs?: number & tags.Type<"float">;

    /**
     * @title waveform
     */
    waveform?: string;

    /**
     * @title flags
     */
    flags?: number;
  }

  export interface IEmbed {
    /**
     * @title title
     */
    title?: string;

    /**
     * @title type
     */
    type?: string;

    /**
     * @title description
     */
    description?: string;

    /**
     * @title url
     */
    url?: string;

    /**
     * @title timestamp
     */
    timestamp?: string & tags.Format<"date-time">;

    /**
     * @title color
     */
    color?: number;

    /**
     * @title footer
     */
    footer?: IEmbedFooter;

    /**
     * @title image
     */
    image?: IEmbedImage;

    /**
     * @title thumbnail
     */
    thumbnail?: IEmbedThumbnail;

    /**
     * @title video
     */
    video?: IEmbedVideo;

    /**
     * @title provider
     */
    provider?: IEmbedProvider;

    /**
     * @title author
     */
    author?: IEmbedAuthor;

    /**
     * @title fields
     */
    fields?: IEmbedField[];
  }

  export interface IEmbedFooter {
    /**
     * @title text
     */
    text: string;

    /**
     * @title icon_url
     */
    icon_url?: string;

    /**
     * @title proxy_icon_url
     */
    proxy_icon_url?: string;
  }

  export interface IEmbedImage {
    /**
     * @title url
     */
    url: string;

    /**
     * @title proxy_url
     */
    proxy_url?: string;

    /**
     * @title height
     */
    height?: number;

    /**
     * @title width
     */
    width?: number;
  }

  export interface IEmbedThumbnail {
    /**
     * @title url
     */
    url: string;

    /**
     * @title proxy_url
     */
    proxy_url?: string;

    /**
     * @title height
     */
    height?: number;

    /**
     * @title width
     */
    width?: number;
  }

  export interface IEmbedVideo {
    /**
     * @title url
     */
    url?: string;

    /**
     * @title proxy_url
     */
    proxy_url?: string;

    /**
     * @title height
     */
    height?: number;

    /**
     * @title width
     */
    width?: number;
  }

  export interface IEmbedProvider {
    /**
     * @title name
     */
    name?: string;

    /**
     * @title url
     */
    url?: string;
  }

  export interface IEmbedAuthor {
    /**
     * @title name
     */
    name: string;

    /**
     * @title url
     */
    url?: string;

    /**
     * @title icon_url
     */
    icon_url?: string;

    /**
     * @title proxy_icon_url
     */
    proxy_icon_url?: string;
  }

  export interface IEmbedField {
    /**
     * @title name
     */
    name: string;

    /**
     * @title value
     */
    value: string;

    /**
     * @title inline
     */
    inline?: boolean;
  }

  export interface IReaction {
    /**
     * @title count
     */
    count: number;

    /**
     * @title count_details
     */
    count_details: IReactionCountDetails;

    /**
     * @title me
     */
    me: boolean;

    /**
     * @title me_burst
     */
    me_burst: boolean;

    /**
     * @title emoji
     */
    emoji: Partial<IEmoji>;

    // /**
    //  * @title burst_colors
    //  * @todo remove property
    //  */
    // burst_colors: []; //TODO: https://discord.com/developers/docs/resources/message#reaction-count-details-object
  }
  export interface IReactionCountDetails {
    /**
     * @title burst
     */
    burst: number;

    /**
     * @title normal
     */
    normal: number;
  }

  export interface IMessageActivity {
    /**
     * @title type
     */
    type:
      | tags.Constant<1, { title: "JOIN" }>
      | tags.Constant<2, { title: "SPECTATE" }>
      | tags.Constant<3, { title: "LISTEN" }>
      | tags.Constant<5, { title: "JOIN_REQUEST" }>;

    /**
     * @title party_id
     */
    party_id?: string;
  }

  /**
   * @title 고정된 메세지를 가져오기 위해 필요한 정보
   */
  export interface IGetPinnedMessagesRequest {
    /**
     * 고정된 메세지를 가져올 채널을 선택해주세요.
     *
     * @title 채널
     */
    channelId: string;
  }

  /**
   * @title 메세지를 고정 또는 고정 해제하기 위해 필요한 정보
   */
  export interface IPinOrUnpinMessagesRequest {
    /**
     * 메세지를 고정 또는 고정 해제할 채널을 선택해주세요.
     *
     * @title 채널
     */
    channelId: string;

    /**
     * 고정 또는 고정 해제할 메세지를 선택해주세요.
     *
     * @title 메세지
     */
    messageId: string;
  }

  /**
   * @title 스레드에 참여하거나 나가기 위해 필요한 정보
   */
  export interface IJoinOrLeaveThreadRequest {
    /**
     * 스레드에 참여하거나 나가기 위한 채널을 선택해주세요.
     *
     * @title 채널
     */
    channelId: string;
  }

  /**
   * @title 채널의 메세지 목록을 가져오기 위해 필요한 정보
   */
  export interface IGetChannelMessageHistoriesRequest {
    /**
     * 메세지 목록을 가져올 채널을 선택해주세요.
     *
     * @title 채널
     */
    channelId: string;
  }

  /**
   * @title 메세지를 생성하기 위해 필요한 정보
   */
  export interface ICreateMessageRequest {
    /**
     * 메세지를 생성할 채널을 선택해주세요.
     *
     * @title 채널
     */
    channelId: string;

    /**
     * 메세지 내용을 입력해주세요.
     *
     * @title 메세지 내용
     */
    content: string;
  }

  /**
   * @title 공지 채널에서 다음 채널로 메세지를 교차 게시하기 위해 필요한 정보
   */
  export interface ICrossPostMessageRequest {
    /**
     * 메세지를 교차 게시할 채널을 선택해주세요.
     *
     * @title 채널
     */
    channelId: string;

    /**
     * 교차 게시할 메세지를 선택해주세요.
     *
     * @title 교차 게시할 메세지
     */
    messageId: string;
  }

  /**
   * @title 메세지 수정하기 위해 필요한 정보
   */
  export interface IEditMessageRequest {
    /**
     * 메세지를 수정할 채널을 선택해주세요.
     *
     * @title 채널
     */
    channelId: string;

    /**
     * 수정할 메세지를 선택해주세요.
     *
     * @title 수정할 메세지
     */
    messageId: string;

    /**
     * 수정할 내용을 입력해주세요.
     *
     * @title 수정할 내용
     */
    content: string;
  }

  /**
   * @title 메세지 삭제하기 위해 필요한 정보
   */
  export interface IDeleteMessageRequest {
    /**
     * 메세지를 삭제할 채널을 선택해주세요.
     *
     * @title 채널
     */
    channelId: string;

    /**
     * 삭제할 메세지를 선택해주세요
     *
     * @title 삭제할 메세지
     */
    messageId: string;
  }

  /**
   * @title 여러 개의 메세지를 한꺼번에 삭제하기 위해 필요한 정보
   */
  export interface IBulkDeleteMessagesRequest {
    /**
     * 메세지를 삭제할 채널을 선택해주세요.
     *
     * @title 채널
     */
    channelId: string;

    /**
     * 삭제할 메세지들을 선택해주세요
     *
     * @title 삭제할 메세지들
     */
    messages: Array<string>;
  }

  /**
   * @title Get Discord Guild IDs.
   */
  export interface IGetGuildIdsOutput {
    guildIds: Array<{
      id: string;
      name: string;
      icon: string | null;
      owner: boolean;
      permissions: string;
    }>;
  }
}
