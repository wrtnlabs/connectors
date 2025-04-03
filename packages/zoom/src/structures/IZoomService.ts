import { tags } from "typia";
import { MyPartial, SnakeToCamel } from "@wrtnlabs/connector-shared";

/**
 * Write the environment variables that are required for the AWS S3 service.
 */
export const ENV_LIST = ["ZOOM_SECRET_KEY"] as const;

export namespace IZoomService {
  export type IProps = {
    [key in SnakeToCamel<(typeof ENV_LIST)[number]>]: string;
  };

  export interface ICreateMeetingInput {
    userId: string;
  }

  export type ICreateMeetingOutput = MyPartial<Meeting>;

  export interface Meeting {
    /**
     * The meeting's agenda.
     *
     * @title The meeting's agenda
     */
    agenda: string & tags.MaxLength<2000>;

    /**
     * If this value is true and the user has enabled PMI settings with passwords, the user's meetings will use the PMI password.
     *
     * @title Whether to create a default password
     */
    default_password: boolean & tags.Default<false>;

    /**
     * The scheduled time of the meeting, in minutes.
     *
     * Used only when a meeting is scheduled.
     *
     * @title The scheduled time (duration) of the meeting
     */
    duration: number & tags.Type<"int64">;

    /**
     * It means a password consisting of English uppercase and lowercase letters and '@', '-', '_', '*'.
     *
     * @title Meeting password
     */
    password: string & tags.MaxLength<10>;

    /**
     * @title Whether to create a scheduled meeting via the `GSuite` app
     */
    pre_schedule: boolean & tags.Default<false>;

    /**
     * @title The ID of the user who hosted this meeting
     */
    assistant_id: string;

    /**
     * @title The email address of the meeting organizer
     */
    host_email: string & tags.Format<"email">;

    /**
     * @title Meeting ID
     */
    id: number & tags.Type<"int64">;

    /**
     * @title URL where participants can register
     */
    registration_url: string & tags.Format<"url">;

    /**
     * @title The date and time this meeting was created
     */
    created_at: string & tags.Format<"date-time">;

    /**
     * @title Encrypted password for 3rd party endpoints (H323/SIP)
     */
    encrypted_password: string;

    /**
     * @title Password to join the meeting via PSTN
     */
    pstn_password: string;

    /**
     * @title H.323/SIP room system password
     */
    h323_password: string;

    /**
     * @title The URL where participants can join the meeting
     */
    join_url: string & tags.Format<"url">;

    /**
     * @title URL where you can join the chat
     */
    chat_join_url: string & tags.Format<"url">;

    /**
     * @title Information about recurring webinars
     */
    occurrences: IZoomService.Occurrence[];

    /**
     * @title Personal meeting ID (PMI)
     */
    pmi: string;

    /**
     * @title Information about the meeting's recurrence cycle
     */
    recurrence: IZoomService.Recurrence;

    /**
     * @title Zoom settings information
     */
    settings: MyPartial<IZoomService.Settings>;

    /**
     * @title Meeting start time
     */
    start_time: string & tags.Format<"date-time">;

    /**
     * This URL should only be used by the meeting host and should not be shared with other participants.
     *
     * Anyone with this URL can log into the Zoom client with host privileges.
     *
     * @title URL that allows you to join as the meeting host
     */
    start_url: string & tags.Format<"url">;

    /**
     * @title `start_time`의 timezone
     */
    timezone: string;

    /**
     * @title Topic of the meeting
     */
    topic: string;

    /**
     *
     */
    tracking_fields: TrackingField[];

    /**
     * - 1: Instant meeting.
     * - 2: Scheduled meeting.
     * - 3: Recurring meeting without fixed time.
     * - 8: Recurring meeting with fixed time.
     * - 10: Meeting with screen sharing only.
     *
     * @title Type of meeting
     */
    type: (1 | 2 | 3 | 8 | 10) & tags.Default<2>;

    /**
     * @title 미팅의 dynamic_host_key
     */
    dynamic_host_key: string;
  }

  /**
   * @title Information about the meeting's recurrence cycle
   */
  export interface Recurrence {
    /**
     * If the meeting is not cancelled, this means the last day of the meeting.
     *
     * Cannot be used with `end_times`.
     *
     * @title This means the last day before the meeting ends
     */
    end_date_time?: string & tags.Format<"date-time">;

    /**
     * Indicates how many times the meeting will repeat before it is canceled.
     *
     * If end_times is set to 0, it means there is no end time.
     *
     * @title The number of repetitions before the meeting is finally terminated
     */
    end_times?: number &
      tags.Type<"int64"> &
      tags.Maximum<60> &
      tags.Default<1>;

    /**
     * 1 is daily, 2 is weekly, 3 is monthly, indicating the repetition type.
     *
     * @title Meeting repetition cycle
     */
    type: 1 | 2 | 3;

    /**
     * It means the days from 1 to 31 of the month, and is the value set when `type` is 3, that is, it repeats every month.
     *
     * @title The days from 1 to 31 of the month
     */
    monthly_day: number &
      tags.Type<"int32"> &
      tags.Minimum<1> &
      tags.Maximum<31>;

    /**
     * Indicates which week of each month.
     *
     * This is the value set when `type` is 3, that is, the meeting is repeated every month.
     *
     * - -1: Last week of the month.
     * - 1: First week of the month.
     * - 2: Second week of the month.
     * - 3: Third week of the month.
     * - 4: Fourth week of the month.
     *
     * @title Indicates which week of each month
     */
    monthly_week: -1 | 1 | 2 | 3 | 4;

    /**
     * This is the value set when `type` is 3, that is, a meeting that repeats every month.
     *
     * If multiple days are selected, the numbers are connected using the `,` symbol in the form of '1,3'.
     *
     * - 1 - Sunday.
     * - 2 - Monday.
     * - 3 - Tuesday.
     * - 4 - Wednesday.
     * - 5 - Thursday.
     * - 6 - Friday.
     * - 7 - Saturday.
     *
     * @title Indicates which day of the week it is each month
     */
    monthly_week_day:
      | (("1" | "2" | "3" | "4" | "5" | "6" | "7") & tags.Default<"1">)
      | string;

    /**
     * When `type` is 1, i.e., for meetings set to daily, up to 90 (days) is possible.
     *
     * When `type` is 2, i.e., for meetings set to weekly, up to 12 (weeks) is possible.
     *
     * When `type` is 3, i.e., for meetings set to monthly, up to 3 (months) is possible.
     *
     * @title Interval between meetings
     */
    repeat_interval: number & tags.Type<"int64">;

    /**
     * This is the value set when `type` is 2, that is, a meeting that repeats every week.
     *
     * If multiple days are selected, the numbers are connected using the `,` symbol in the form of '1,3'.
     *
     * - 1 - Sunday.
     * - 2 - Monday.
     * - 3 - Tuesday.
     * - 4 - Wednesday.
     * - 5 - Thursday.
     * - 6 - Friday.
     * - 7 - Saturday.
     *
     * @title Indicates which day of the week it is
     */
    weekly_days:
      | (("1" | "2" | "3" | "4" | "5" | "6" | "7") & tags.Default<"1">)
      | string;
  }

  /**
   * @title Information about recurring webinars
   */
  export interface Occurrence {
    /**
     * @title An integer representing the duration of the webinar
     */
    duration: number & tags.Type<"int64">;

    /**
     * @title A unique identifier that identifies each webinar occurrence
     */
    occurrence_id: string;

    /**
     * @title Webinar start time
     */
    start_time: string & tags.Format<"date-time">;

    /**
     * Status of webinar occurrence.
     */
    status: "available" | "deleted";
  }

  /**
   * @title Zoom settings information
   */
  export interface Settings {
    /**
     * Sets whether participants can join from multiple devices in a meeting where registration is enabled.
     *
     * @title Whether participants can join from multiple devices
     */
    allow_multiple_devices: boolean;

    /**
     * @title A semicolon-separated list of email addresses or IDs for alternate hosts
     */
    alternative_hosts: string;

    /**
     * @title Whether to send email notifications to alternate hosts
     */
    alternative_hosts_email_notification: boolean & tags.Default<true>;

    alternative_host_update_polls: boolean;

    /**
     * - 0 : Automatic approval
     * - 1 : Manual approval
     * - 2 : No registration required (default)
     *
     * @title Meeting registration approval settings
     */
    approval_type: (0 | 1 | 2) & tags.Default<2>;

    /**
     * @title Approved/rejected country or region
     */
    approved_or_denied_countries_or_regions: {
      /**
       * @title List of approved countries or regions
       */
      approved_list?: string[];

      /**
       * @title List of blocked countries or regions
       */
      denied_list?: string[];

      /**
       * @title Whether to enable or disable user authorization or blocking settings for specific countries and regions
       */
      enable: boolean;

      /**
       * @title method
       */
      method?: "deny" | "approve";
    };

    /**
     * - `both` - Both telephony and VoIP.
     * - `telephony` - Telephony only.
     * - `voip` - VoIP only.
     * - `thirdParty` - Third party audio conference.
     *
     * @title How participants join the audio portion of the meeting
     */
    audio: ("both" | "telephony" | "voip" | "thirdParty") &
      tags.Default<"both">;

    /**
     * @title Third party audio conference info
     */
    audio_conference_info?: string & tags.MaxLength<2048>;

    /**
     * The meeting's authenticated domains.
     *
     * Only Zoom users whose email address contains an authenticated domain can join the meeting.
     *
     * Comma-separate multiple domains or use a wildcard for listing domains.
     */
    authentication_domains: string;

    /**
     * A list of participants that can bypass meeting authentication.
     *
     * These participants will receive a unique meeting invite.
     */
    authentication_exception: {
      /**
       * @title The participant's email address
       */
      email: string & tags.Format<"email">;

      /**
       * @title The participant's name
       */
      name: string;

      /**
       * @title URL for participants to join the meeting
       */
      join_url: string & tags.Format<"url">;
    }[];

    /**
     * @title Authentication name set in the authentication profile
     */
    authentication_name: string;

    /**
     * @title Meeting authentication option ID
     */
    authentication_option: string;

    /**
     * - `cloud` - Record on cloud.
     * - `none` - Disabled.
     *
     * @title Automatic recording
     */
    auto_recording: ("none" | "cloud") & tags.Default<"none">;

    /**
     * @title Setting to pre-assign breakout rooms
     */
    breakout_room: {
      /**
       * Set this field's value to true to enable the breakout room pre-assign option.
       */
      enable: boolean;

      /**
       * Create a room or rooms.
       */
      rooms?: {
        /**
         * The breakout room's name.
         */
        name: string;

        /**
         * Email addresses of the participants who are to be assigned to the breakout room.
         */
        participants: (string & tags.Format<"email">)[];
      }[];
    };

    /**
     * The type of calendar integration used to schedule the meeting.
     *
     * - 1 - Zoom Outlook add-in
     * - 2 - Zoom for Google Workspace add-on
     *
     * Works with the private_meeting field to determine whether to share details of meetings or not.
     */
    calendar_type: 1 | 2;

    /**
     * @title Close registration after event date
     */
    close_registration: boolean & tags.Default<false>;

    /**
     * @title Host meeting in China
     *
     * @deprecated
     */
    cn_meeting: boolean & tags.Default<false>;

    /**
     * @title The contact email address for meeting registration
     */
    contact_email: string & tags.Format<"email">;

    /**
     * @title The contact name for meeting registration
     */
    contact_name: string;

    /**
     * @title Custom keys and values assigned to the meeting
     */
    custom_keys: {
      /**
       * @title Custom key associated with the user
       */
      key: string & tags.MaxLength<64>;

      /**
       * @title Value of the custom key associated with the user
       */
      value: string & tags.MaxLength<256>;
    }[] &
      tags.MaxItems<10>;

    /**
     * Whether to send email notifications to alternative hosts and users with scheduling privileges.
     */
    email_notification: boolean & tags.Default<true>;

    /**
     * Choose between enhanced encryption and end-to-end encryption when starting or a meeting.
     *
     * When using end-to-end encryption, several features (e.g. cloud recording, phone/SIP/H.323 dial-in) will be automatically disabled.
     *
     * - enhanced_encryption - Enhanced encryption. Encryption is stored in the cloud if you enable this option.
     * - e2ee - End-to-end encryption. The encryption key is stored in your local device and can not be obtained by anyone else. Enabling this setting also disables the join before host, cloud recording, streaming, live transcription, breakout rooms, polling, 1:1 private chat, and meeting reactions features.
     */
    encryption_type: "enhanced_encryption" | "e2ee";

    /**
     * Only signed in users can join this meeting.
     *
     * @deprecated
     */
    enforce_login: boolean;

    /**
     * Only signed in users with specified domains can join meetings.
     *
     * This field is deprecated and will not be supported in the future.
     *
     * @deprecated
     */
    enforce_login_domains: string;

    /**
     * @title Whether the Focus Mode feature is enabled when the meeting starts
     */
    focus_mode: boolean;

    /**
     * @title List of global dial-in countries
     */
    global_dial_in_countries: string[];

    /**
     * @title Global dial-in countries or regions
     */
    global_dial_in_numbers: {
      /**
       * City of the number, such as Chicago.
       *
       * @title city of the number
       */
      city: string;

      /**
       * The country code, such as BR.
       *
       * @title The country code
       */
      country: string;

      /**
       * Full name of country, such as Brazil.
       *
       * @title Full name of country
       */
      country_name: string;

      /**
       * A phone number, such as `+1 2332357613`.
       *
       * @title A phone number
       */
      number: string;

      /**
       * @title Type of number
       */
      type: "toll" | "tollfree";
    }[];

    /**
     * @title Start video when the host joins the meeting
     */
    host_video: boolean;

    /**
     * @deprecated
     *
     * @title Host meeting in India
     */
    in_meeting: boolean & tags.Default<false>;

    /**
     * If the value of join_before_host field is set to true, use this field to indicate time limits when a participant may join a meeting before a host.
     *
     * - 0 - Allow participant to join anytime.
     * - 5- Allow participant to join 5 minutes before meeting start time.
     * - 10 - Allow participant to join 10 minutes before meeting start time.
     */
    jbh_time: 0 | 5 | 10;

    /**
     * Allow participants to join the meeting before the host starts the meeting. Only used for scheduled or recurring meetings.
     */
    join_before_host: boolean & tags.Default<false>;

    language_interpretation: {
      /**
       * Whether to enable language interpretation for the meeting.
       */
      enable: boolean;

      /**
       * Information about the meeting's sign language interpreters.
       */
      interpreters?: {
        /**
         * The interpreter's email address.
         */
        email: string & tags.Format<"email">;

        /**
         * comma-separated list of the interpreter's languages.
         *
         * The string must contain two country IDs.
         *
         * For example, if the interpreter will translate from English to Chinese, then this value will be US,CN.
         */
        languages: string;
      }[];
    };

    /**
     * The meeting's sign language interpretation settings.
     *
     * Make sure to add the language in the web portal in order to use it in the API. See link for details.
     *
     * Note: If this feature is not enabled on the host's account, this setting will not be applied to the meeting.
     */
    sign_language_interpretation: {
      /**
       * Whether to enable sign language interpretation for the meeting.
       */
      enable: boolean;

      /**
       * Information about the meeting's sign language interpreters.
       */
      interpreters?: {
        /**
         * The interpreter's email address.
         */
        email: string & tags.Format<"email">;

        /**
         * The interpreter's sign language.
         *
         * To get this value, use the sign_language_interpretation object's languages and custom_languages values in the Get user settings API response.
         */
        sign_language: string;
      }[];
    };

    /**
     * If true, only authenticated users can join the meeting.
     */
    meeting_authentication: boolean;

    /**
     * Whether to mute participants upon entry.
     */
    mute_upon_entry: boolean & tags.Default<false>;

    /**
     * Whether to start meetings with the participant video on.
     */
    participant_video: boolean;

    /**
     * Whether to set the meeting as private.
     */
    private_meeting: boolean;

    /**
     * Whether to send registrants an email confirmation.
     *
     * - true - Send a confirmation email.
     * - false - Do not send a confirmation email.
     */
    registrants_confirmation_email: boolean;

    /**
     * Whether to send registrants email notifications about their registration approval, cancellation, or rejection.
     *
     * - true - Send an email notification.
     * - false - Do not send an email notification.
     *
     * Set this value to true to also use the registrants_confirmation_email parameter.
     */
    registrants_email_notification: boolean;

    /**
     * The meeting's registration type.
     *
     * - 1 - Attendees register once and can attend any meeting occurrence.
     * - 2 - Attendees must register for each meeting occurrence.
     * - 3 - Attendees register once and can select one or more meeting occurrences to attend.
     *
     * This field is only for recurring meetings with fixed times (8). This value defaults to 1.
     */
    registration_type: (1 | 2 | 3) & tags.Default<1>;

    /**
     * Whether to include social media sharing buttons on the meeting's registration page.
     *
     * This setting is only applied to meetings with registration enabled.
     */
    show_share_button: boolean;

    /**
     * Whether to use a Personal Meeting ID (PMI) instead of a generated meeting ID.
     *
     * This field is only used for scheduled meetings (2), instant meetings (1), or recurring meetings with no fixed time (3).
     */
    use_pmi: boolean & tags.Default<false>;

    /**
     * Whether to enable the Waiting Room feature. If this value is true, this disables the join_before_host setting.
     */
    waiting_room: boolean;

    /**
     * Whether to add a watermark when viewing a shared screen.
     */
    watermark: boolean & tags.Default<false>;

    /**
     * Whether the Allow host to save video order feature is enabled.
     */
    host_save_video_order: boolean;

    /**
     * Whether to set the meeting as an internal meeting.
     */
    internal_meeting: boolean & tags.Default<false>;

    /**
     * A list of the meeting's invitees.
     */
    meeting_invitees: {
      /**
       * The invitee's email address.
       */
      email: string & tags.Format<"email">;
    }[];

    /**
     * Information about the Enable continuous meeting chat feature.
     */
    continuous_meeting_chat: {
      /**
       * Whether to enable the Enable continuous meeting chat setting.
       */
      enable: boolean;

      /**
       * Whether to enable the Automatically add invited external users setting.
       */
      auto_add_invited_external_users: boolean;

      /**
       * The channel's ID.
       */
      channel_id?: string;
    };

    /**
     * Whether to set the meeting as a participant focused meeting.
     */
    participant_focused_meeting: boolean & tags.Default<false>;

    /**
     * Whether to push meeting changes to the calendar.
     *
     * To enable this feature, configure the Configure Calendar and Contacts Service in the user's profile page of the Zoom web portal and enable the Automatically sync Zoom calendar events information bi-directionally between Zoom and integrated calendars.
     *
     * setting in the Settings page of the Zoom web portal.
     *
     * - true - Push meeting changes to the calendar.
     * - false - Do not push meeting changes to the calendar.
     */
    push_change_to_calendar: boolean & tags.Default<false>;

    /**
     * @title The meeting's resources
     */
    resources: {
      /**
       * The resource type.
       */
      resource_type: "whiteboard";

      /**
       * The resource ID.
       */
      resource_id: string;

      /**
       * The permission levels for users to access the whiteboard.
       *
       * - `editor` - Users with link access can edit the board.
       * - `commenter` - Users with link access can comment on the board.
       * - `viewer` - Users with link access can view the board.
       */
      permission_level: ("editor" | "commenter" | "viewer") &
        tags.Default<"editor">;
    }[];

    /**
     * Whether to automatically start a meeting summary.
     */
    auto_start_meeting_summary: boolean & tags.Default<false>;

    /**
     * Whether to automatically start AI Companion questions.
     */
    auto_start_ai_companion_questions: boolean & tags.Default<false>;
  }

  /**
   * Information about the meeting's tracking fields.
   */
  export interface TrackingField {
    /**
     * @title Label of `TrackingField`
     */
    field: string;

    /**
     * @title The value of `TrackingField`
     */
    value: string;

    /**
     * @title Whether `TrackingField` is exposed
     */
    visible: boolean;
  }
}
