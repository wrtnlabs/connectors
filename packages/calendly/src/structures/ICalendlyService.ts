import { SnakeToCamel } from "@wrtnlabs/connector-shared";
import { tags } from "typia";

export const ENV_LIST = [
  "CALENDLY_CLIENT_ID",
  "CALENDLY_CLIENT_SECRET",
  "CALENDLY_REFRESH_TOKEN",
] as const;

export namespace ICalendlyService {
  export type IProps = {
    [key in SnakeToCamel<(typeof ENV_LIST)[number]>]: string;
  };

  export type IGetUserInfoOutput = {
    /**
     * @title resource
     */
    resource: User;
  };

  export interface ICreateOneOffEventTypeOutput {
    /**
     * @title EventType
     * A configuration for an Event
     */
    resource: EventType;
  }

  export interface ICreateOneOffEventTypeInput {
    /**
     * Event type name
     *
     * @title name
     * @example "My Meeting"
     */
    name: string & tags.MaxLength<55>;

    /**
     * Host user uri
     *
     * @title host
     * @example "https://api.calendly.com/users/AAAAAAAAAAAAAAAA"
     */
    host: string & tags.Format<"uri">;

    /**
     * @title co_hosts
     * Collection of meeting co-host(s) user URIs
     */
    co_host?: (string & tags.Format<"iri">)[] & tags.MaxItems<9>;

    /**
     * @title duration
     * Duration of meeting in minutes
     */
    duration: number &
      tags.Type<"uint32"> &
      tags.Minimum<1> &
      tags.Maximum<720>;

    /**
     * Time zone used for meeting. Defaults to host's time zone.
     *
     * @title timezone
     * @example "America/New_York"
     */
    timezone?: string;

    /**
     * @title date_setting
     * Only allow scheduling within a specified date range
     */
    date_setting: {
      /**
       * @title type
       * @enum ["date_range"]
       */
      type: tags.Constant<"date_range", { title: "date_range" }>;

      /**
       * @title start_date
       * Availability start - Must be before end_date. Format: YYYY-MM-DD
       */
      start_date: string & tags.Format<"date">;

      /**
       * @title end_date
       * Availability end - Must be a date in the future and less than 365 days in the future from start_date. Format: YYYY-MM-DD
       */
      end_date: string & tags.Format<"date">;
    };

    /**
     * @title location
     * Information for a Custom Location
     */
    location: {
      /**
       * @title kind
       * @enum ["custom"]
       */
      kind: tags.Constant<"custom", { title: "custom" }>;

      /**
       * @title location
       */
      location: string;
    };
  }

  export interface IGetOneScheduledEventInviteeOutput {
    /**
     * @title resource
     */
    resource: Invitee;
  }

  export interface IGetScheduledEventInviteeOutput {
    /**
     * @title collection
     */
    collection: Invitee[];

    /**
     * @title pagination
     */
    pagination: Pagination;
  }

  export interface IGetScheduledEventInviteeInput {
    /**
     * @title scheduled_event_uuid
     */
    scheduled_event_uuid: string;

    /**
     * The number of rows to return (1 to 100)
     *
     * @title count
     * @default 20
     * @minimum 1
     * @maximum 100
     */
    count?: number & tags.Minimum<1> & tags.Maximum<100> & tags.Default<20>;

    /**
     * Filter results by email address (optional)
     *
     * @title email
     * @example "bob@example.com"
     */
    email?: string & tags.Format<"email">;

    /**
     * @title page_token
     * The token to pass for pagination to get the next or previous portion of the collection
     */
    page_token?: string;

    /**
     * Order results by the `created_at` field and direction.
     * Allowed values: "asc" for ascending, "desc" for descending.
     *
     * @title sort
     * @default "created_at:asc"
     */
    sort?: (
      | tags.Constant<"created_at:asc", { title: "created_at:asc" }>
      | tags.Constant<'"created_at:desc"', { title: '"created_at:desc"' }>
    ) &
      tags.Default<"created_at:asc">;

    /**
     * Filter by invitee status (either "active" or "canceled").
     *
     * @title status
     * @enum ["active", "canceled"]
     */
    status?:
      | tags.Constant<"active", { title: "active" }>
      | tags.Constant<"canceled", { title: "canceled" }>;
  }

  export interface ICheckNoShowOutput {
    resource: ICalendlyService.NoShow;
  }

  export type ICacnelOutput =
    ICalendlyService.IGetOneScheduledEventInviteeOutput["resource"]["cancel_url"];

  export interface IGetOneScheduledEventOutput {
    /**
     * @title event
     */
    resource: ICalendlyService.Event;
  }

  export interface IGetScheduledEventOutput {
    collection: Event[];
    pagination: Pagination;
  }

  /**
   * @title Conditions for querying scheduled events
   */
  export interface IGetScheduledEventInput {
    /**
     * @title count
     * The number of rows to return.
     */
    count?: number &
      tags.Type<"uint32"> &
      tags.Minimum<1> &
      tags.Maximum<100> &
      tags.Default<20>;

    /**
     * - If you are an administrator/owner of an organization, you can use both and to get a list of events for a specific user within an organization user.
     * - If you are the administrator/owner of an organization, you can use both and to get a list of events for a specific group within an organization group.
     * - User Only available for requesting private events; events within all organizations that are currently or previously affiliated are returned.
     *
     * @title Whose event is it?
     */
    who:
      | {
          /**
           * Return events that are scheduled with the user associated with this URI.
           * There must be either a user or a group.
           *
           * @title user
           * @example "https://api.calendly.com/users/EBHAAFHDCAEQTSEZ"
           */
          user: string & tags.Format<"iri">;

          /**
           * Return events that are scheduled with the group associated with this URI.
           * There must be either a user or a group.
           *
           * @title group
           */
          group: string & tags.Format<"iri">;
        }
      | {
          /**
           * Return events that are scheduled with the user associated with this URI.
           * There must be either a user or a group.
           *
           * @title user
           * @example "https://api.calendly.com/users/EBHAAFHDCAEQTSEZ"
           */
          user: string & tags.Format<"iri">;

          /**
           * Return events that are scheduled with the group associated with this URI.
           * There must be either a user or a group.
           *
           * @title group
           */
          group: string & tags.Format<"iri">;
        }
      | {
          /**
           * Return events that are scheduled with the user associated with this URI.
           * There must be either a user or a group.
           *
           * @title user
           * @example "https://api.calendly.com/users/EBHAAFHDCAEQTSEZ"
           */
          user: string & tags.Format<"iri">;
        };

    /**
     * Return events that are scheduled with the organization associated with this URI.
     *
     * @title organization
     * @example "https://api.calendly.com/organizations/EBHAAFHDCAEQTSEZ"
     */
    organization?: string & tags.Format<"iri">;

    /**
     * Return events that are scheduled with the invitee associated with this email address.
     *
     * @title invitee_email
     * @example alice@example.com
     */
    invitee_email?: string & tags.Format<"email">;

    /**
     * Include events with start times prior to this time. This time should use the UTC timezone.
     *
     * @title max_start_time
     * @example "2020-01-02T12:30:00.000000Z"
     */
    max_start_time?: string & tags.Format<"date-time">;

    /**
     * Include events with start times after this time. This time should use the UTC timezone.
     *
     * @title min_start_time
     * @example "2020-01-02T12:30:00.000000Z"
     */
    min_start_time?: string & tags.Format<"date-time">;

    /**
     * The token to pass to get the next or previous portion of the collection.
     *
     * @title page_token
     */
    page_token?: string;

    /**
     * Order results by the specified field and direction. Accepts comma-separated list of {field}:{direction} values.
     * Supported fields are: start_time. Sort direction is specified as: asc, desc.
     *
     * @title sort
     * @example "start_time:asc"
     */
    sort?:
      | tags.Constant<"start_time:asc", { title: "시작 시간 정순 정렬" }>
      | tags.Constant<"start_time:desc", { title: "시작 시간 역순 정렬" }>;

    /**
     * Whether the scheduled event is active or canceled.
     * Allowed values: active, canceled.
     *
     * @title status
     */
    status?:
      | tags.Constant<"active", { title: "active" }>
      | tags.Constant<"canceled", { title: "canceled" }>;
  }

  export interface IGetEventTypeOutput {
    /**
     * @title collection
     */
    collection: EventType[];

    /**
     * @title pagination
     */
    pagination: Pagination;
  }

  export interface CreateSchedulingLinkOutput {
    /**
     * @title resource
     */
    resource: {
      /**
       * @title Scheduling link url
       */
      booking_url: string & tags.Format<"iri">;

      /**
       * A link to the resource that owns this Scheduling Link (currently, this is always an Event Type)
       *
       * @title owner
       */
      owner: EventType["uri"];

      /**
       * Resource type (currently, this is always EventType)
       *
       * @title owner_type
       */
      owner_type: "EventType";
    };
  }

  export interface CreateSchedulingLinkInput {
    /**
     * @title owner
     */
    owner: EventType["uri"];
  }

  export interface IGetEventTypeInput {
    /**
     * Return only admin managed event types if true, exclude admin managed event types if false, or include all event types if this parameter is omitted.
     *
     * @title admin_managed
     */
    admin_managed?: boolean;

    /**
     * View available personal, team, and organization event types associated with the organization's URI.
     * user or organization must be filled.
     *
     * @title organization
     */
    organization?: string & tags.Format<"iri">;

    /**
     * View available personal, team, and organization event types associated with the user's URI.
     * user or organization must be filled.
     *
     * @title user
     */
    user?: User["uri"];

    /**
     * @title user_availability_schedule
     */
    user_availability_schedule?: string & tags.Format<"iri">;

    /**
     * Return only active event types if true, only inactive if false, or all event types if this parameter is omitted.
     *
     * @title active
     */
    active?: boolean;

    /**
     * The number of rows to return
     *
     * @title count
     */
    count?: number &
      tags.Type<"uint32"> &
      tags.Minimum<1> &
      tags.Maximum<100> &
      tags.Default<20>;

    /**
     * The token to pass to get the next or previous portion of the collection.
     *
     * @title page_token
     */
    page_token?: string;

    /**
     * Order results by the specified field and direction. Accepts comma-separated list of {field}:{direction} values.
     * Supported fields are: name, position, created_at, updated_at. Sort direction is specified as: asc, desc.
     * It must be one of: 'name:asc', 'name:desc', 'position:asc', 'position:desc', 'created_at:asc', 'created_at:desc', 'updated_at:asc', 'updated_at:desc'.
     *
     * @title sort
     */
    sort?:
      | tags.Constant<"name:asc", { title: "이름 정순 정렬" }>
      | tags.Constant<"name:desc", { title: "이름 역순 정렬" }>
      | tags.Constant<"position:asc", { title: "위치 정순 정렬" }>
      | tags.Constant<"position:desc", { title: "위치 역순 정렬" }>
      | tags.Constant<"created_at:asc", { title: "생성일자 정순 정렬" }>
      | tags.Constant<"created_at:desc", { title: "생성일자 역순 정렬" }>
      | tags.Constant<"updated_at:asc", { title: "수정일자 정순 정렬" }>
      | tags.Constant<"updated_at:desc", { title: "수정일자 역순 정렬" }>;
  }

  export type EventType = {
    /**
     * Canonical reference (unique identifier) for the event type.
     * For example, 'https://api.calendly.com/event_types/AAAAAAAAAAAAAAAA'
     *
     * @title uri
     */
    uri: string & tags.Format<"iri">;

    /**
     * The event type name (in human-readable format)
     *
     * @title name
     */
    name: string | null;

    /**
     * Indicates if the event is active or not.
     *
     * @title active
     */
    active: boolean;

    /**
     * The portion of the event type's URL that identifies a specific web page (in a human-readable format)
     *
     * @title slug
     */
    slug: string | null;

    /**
     * The URL of the user’s scheduling site where invitees book this event type
     *
     * @title schduling_url
     */
    scheduling_url: string & tags.Format<"uri">;

    /**
     * The length of sessions booked with this event type
     *
     * @title duration
     */
    duration: number & tags.Type<"uint32">;

    /**
     * Indicates if the event type is "solo" (belongs to an individual user) or "group"
     *
     * @title kind
     */
    kind:
      | tags.Constant<"solo", { title: "solo" }>
      | tags.Constant<"group", { title: "group" }>;

    /**
     * Indicates if the event type is "round robin" (alternates between hosts) or "collective" (invitees pick a time when all participants are available) or “multi-pool” (considers availability delineated by pools of participants) or "null" (the event type doesn’t consider the availability of a group participants)
     *
     * @title pooling_type
     */
    pooling_type:
      | tags.Constant<"round_robin", { title: "round_robin" }>
      | tags.Constant<"collective", { title: "collective" }>
      | tags.Constant<"multi_pool", { title: "multi_pool" }>
      | null;

    /**
     * Indicates if the event type is "AdhocEventType" (ad hoc event) or "StandardEventType" (standard event type)
     *
     * @title type
     */
    type:
      | tags.Constant<"StandardEventType", { title: "StandardEventType" }>
      | tags.Constant<"AdhocEventType", { title: "AdhocEventType" }>;

    /**
     * The hexadecimal color value of the event type's scheduling page
     *
     * @title color
     */
    color: string & tags.Pattern<"^#([0-9A-Fa-f]{6})$">;

    /**
     * The moment the event type was created (e.g. "2020-01-02T03:04:05.678123Z")
     *
     * @title created_at
     */
    created_at: string & tags.Format<"date-time">;

    /**
     * The moment the event type was last updated (e.g. "2020-01-02T03:04:05.678123Z")
     *
     * @title updated_at
     */
    updated_at: string & tags.Format<"date-time">;

    /**
     * Contents of a note that may be associated with the event type
     *
     * @title internal_note
     */
    internal_note: string | null;

    /**
     * The event type's description (in non formatted text)
     *
     * @title description_plain
     */
    description_plain: string | null;

    /**
     * The event type's description (formatted with HTML)
     *
     * @title description_html
     */
    description_html: string | null;

    /**
     * The publicly visible profile of a User or a Team that's associated with the Event Type (note: some Event Types don't have profiles)
     *
     * @title profile
     */
    profile: Profile | null;

    /**
     * Indicates if the event type is for a poll or an instant booking
     *
     * @title booking_method
     */
    booking_method:
      | tags.Constant<"instant", { title: "instant" }>
      | tags.Constant<"poll", { title: "poll" }>;

    /**
     * @title custom_questions
     */
    custom_questions: CustomQuestion[];

    /**
     * The moment the event type was deleted (e.g. "2020-01-02T03:04:05.678123Z"). Since event types can be deleted but their scheduled events remain it's useful to fetch a deleted event type when you still require event type data for a scheduled event.
     *
     * @title deleted_at
     */
    deleted_at: (string & tags.Format<"date-time">) | null;

    /**
     * Indicates if this event type is managed by an organization admin
     *
     * @title admin_managed
     */
    admin_managed: boolean;

    /**
     * Configuration information for each possible location for this Event Type
     *
     * @title locations
     */
    locations: Location[] | null;

    /**
     * Position order of Event Type, starting with 0 (for display purposes)
     *
     * @title position
     */
    position: number;
  };

  export type Profile = {
    /**
     * Indicates if the profile belongs to a "user" (individual) or "team"
     *
     * @title type
     */
    type:
      | tags.Constant<"User", { title: "User" }>
      | tags.Constant<"Team", { title: "Team" }>;

    /**
     * Human-readable name for the profile of the user that's associated with the event type
     *
     * @title name
     */
    name: string;

    /**
     * The unique reference to the user associated with the profile
     *
     * @title owner
     */
    owner: string & tags.Format<"uri">;
  };

  export type Location = {
    /**
     * @title kind
     */
    kind: string;

    /**
     * @title phone_number
     */
    phone_number?: number | string;

    /**
     * @title additional_info
     */
    additional_info?: string;
  };

  export type CustomQuestion = {
    /**
     * The custom question that the host created for the event type.
     *
     * @title name
     */
    name: string;

    /**
     * The type of response that the invitee provides to the custom question; can be one or multiple lines of text, a phone number, or single- or multiple-select.
     *
     * @title type
     */
    type:
      | tags.Constant<"text", { title: "text" }>
      | tags.Constant<"phone_number", { title: "phone_number" }>
      | tags.Constant<"single_select", { title: "single_select" }>
      | tags.Constant<"multi_select", { title: "multi_select" }>;

    /**
     * The numerical position of the question on the event booking page after the name and email address fields.
     *
     * @title position
     */
    position: number;

    /**
     * true if the question created by the host is turned ON and visible on the event booking page; false if turned OFF and invisible on the event booking page.
     *
     * @title enabled
     */
    enabled: boolean;

    /**
     * true if a response to the question created by the host is required for invitees to book the event type; false if not required.
     *
     * @title required
     */
    required: boolean;

    /**
     * The invitee’s option(s) for single_select or multi_select type of responses.
     *
     * @title answer_choices
     */
    answer_choices: string[];

    /**
     * true if the custom question lets invitees record a written response in addition to single-select or multiple-select type of responses; false if it doesn’t.
     *
     * @title include_other
     */
    include_other: boolean;
  };

  export interface Event {
    /**
     * uuid from url (ex. "https://api.calendly.com/scheduled_events/:uuid" )
     *
     * @title uuid
     */
    uuid: string;

    /**
     * Canonical reference (unique identifier) for the resource
     *
     * @title uri
     * @example "https://api.calendly.com/scheduled_events/GBGBDCAADAEDCRZ2"
     */
    uri: string & tags.Format<"iri">;

    /**
     * The event name
     *
     * @title name
     * @example "15 Minute Meeting"
     */
    name: string | null;

    /**
     * The internal meeting notes (in non formatted text)
     *
     * @title meeting_notes_plain
     * @example "15 Minute Meeting"
     */
    meeting_notes_plain: string | null;

    /**
     * The internal meeting notes (formatted with HTML)
     *
     * @title meeting_notes_html
     * @example "<p>15 Minute Meeting</p>"
     */
    meeting_notes_html: string | null;

    /**
     * Indicates if the event is "active" or "canceled"
     *
     * @title status
     * @enum ["active", "canceled"]
     */
    status:
      | tags.Constant<"active", { title: "active" }>
      | tags.Constant<"canceled", { title: "canceled" }>;

    /**
     * The moment the event was scheduled to start in UTC time
     *
     * @title start_time
     * @example "2020-01-02T03:04:05.678123Z"
     */
    start_time: string & tags.Format<"date-time">;

    /**
     * The moment the event was scheduled to end in UTC time
     *
     * @title end_time
     * @example "2020-01-02T03:04:05.678123Z"
     */
    end_time: string & tags.Format<"date-time">;

    /**
     * Event Type URI
     *
     * @title event_type
     * @example "https://api.calendly.com/event_types/GBGBDCAADAEDCRZ2"
     */
    event_type: string & tags.Format<"iri">;

    /**
     * The event type associated with this event
     *
     * @title location
     * @enum ["In-Person Meeting"]
     */
    location: {
      /**
       * @title type
       * Indicates that the event will be an in-person meeting.
       */
      type: "physical" | "custom";

      /**
       * The physical location specified by the event host (publisher)
       *
       * @title location
       * @example Calendly Office
       */
      location: string;

      /**
       * 추가 정보
       *
       * @title additional_info
       * @example "Please check in at the main lobby."
       */
      additional_info?: string;
    };

    /**
     * Invitees counter
     *
     * @title invitees_counter
     */
    invitees_counter: {
      /**
       * Total invitees for an event, including invitees that have canceled
       *
       * @title total
       */
      total: number & tags.Type<"uint32">;

      /**
       * Total invitees for an event that have not canceled
       *
       * @title active
       */
      active: number & tags.Type<"uint32">;

      /**
       * Maximum number of active invitees that can book the event
       *
       * @title limit
       */
      limit: number & tags.Type<"uint32">;
    };

    /**
     * The moment when the event was created
     *
     * @title created_at
     * @example "2019-01-02T03:04:05.678123Z"
     */
    created_at: string & tags.Format<"date-time">;

    /**
     * The moment when the event was last updated
     *
     * @title updated_at
     * @example "2019-01-02T03:04:05.678123Z"
     */
    updated_at: string & tags.Format<"date-time">;

    /**
     * Event Membership List
     *
     * @title event_memberships
     */
    event_memberships: {
      /**
       * Canonical reference (unique identifier) for the user
       *
       * @title user
       * @example "https://api.calendly.com/users/GBGBDCAADAEDCRZ2"
       */
      user: string & tags.Format<"iri">;

      /**
       * The user's email
       *
       * @title user_email
       * @example "user@example.com"
       */
      user_email: string & tags.Format<"email">;

      /**
       * The user's name
       *
       * @title user_name
       * @example "John Smith"
       */
      user_name: string;

      /**
       * The moment the membership's time buffer starts for the event in UTC time
       *
       * @title buffered_start_time
       * @example "2020-01-02T03:04:05.678123Z"
       */
      buffered_start_time: string & tags.Format<"date-time">;

      /**
       * The moment the membership's time buffer ends for the event in UTC time
       *
       * @title buffered_end_time
       * @example "2020-01-02T03:04:05.678123Z"
       */
      buffered_end_time: string & tags.Format<"date-time">;
    }[];

    /**
     * Additional people added to an event by an invitee
     *
     * @title event_guests
     */
    event_guests: {
      /**
       * @title email
       */
      email: string & tags.Format<"email">;

      /**
       * @title created_at
       */
      created_at: string & tags.Format<"date-time">;

      /**
       * @title updated_at
       */
      updated_at: string & tags.Format<"date-time">;
    }[];

    /**
     * Information about the calendar event from the calendar provider.
     *
     * @title cancellation
     */
    cancellation?: Cancellation;
  }

  export interface Invitee {
    /**
     * uuid from "https://calendly.com/scheduled_events/AAAAAAAAAAAAAAAA/invitees/:uuid"
     *
     * @title uuid
     */
    uuid: string;

    /**
     * Canonical reference (unique identifier) for the invitee
     *
     * @title uri
     * @example "https://calendly.com/scheduled_events/AAAAAAAAAAAAAAAA/invitees/AAAAAAAAAAAAAAAA"
     */
    uri: string & tags.Format<"iri">;

    /**
     * The invitee’s email address
     *
     * @title email
     * @example "test@example.com"
     */
    email: string & tags.Format<"email">;

    /**
     * The first name of the invitee who booked the event when the event type is configured to use separate fields for first name and last name. Null when event type is configured to use a single field for name.
     *
     * @title first_name
     * @example "John"
     */
    first_name: string | null;

    /**
     * The last name of the invitee who booked the event when the event type is configured to use separate fields for first name and last name. Null when event type is configured to use a single field for name.
     *
     * @title last_name
     * @example "Doe"
     */
    last_name: string | null;

    /**
     * The invitee’s name (in human-readable format)
     *
     * @title name
     * @example "John Doe"
     */
    name: string;

    /**
     * Indicates if the invitee is "active" or "canceled"
     *
     * @title status
     * @example "active"
     */
    status:
      | tags.Constant<"active", { title: "active" }>
      | tags.Constant<"canceled", { title: "canceled" }>;

    /**
     * A collection of the invitee's responses to questions on the event booking confirmation form
     *
     * @title questions_and_answers
     */
    questions_and_answers: Array<{
      /**
       * A question on the invitee's booking form
       *
       * @title question
       */
      question: string;

      /**
       * The invitee's answer to the question
       *
       * @title answer
       */
      answer: string;

      /**
       * The position of the question in relation to others on the booking form
       *
       * @title position
       */
      position: number;
    }>;

    /**
     * @title timezone
     * Time zone to use when displaying time to the invitee
     */
    timezone: string | null;

    /**
     * A reference to the event
     *
     * @title event
     * @example "https://api.calendly.com/scheduled_events/AAAAAAAAAAAAAAAA"
     */
    event: string & tags.Format<"iri">;

    /**
     * The moment when the event was created
     *
     * @title created_at
     * @example "2019-01-02T03:04:05.678123Z"
     */
    created_at: string & tags.Format<"date-time">;

    /**
     * The moment when the event was last updated
     *
     * @title updated_at
     * @example "2019-08-07T06:05:04.321123Z"
     */
    updated_at: string & tags.Format<"date-time">;

    /**
     * The UTM and Salesforce tracking parameters associated with an invitee
     *
     * @title tracking
     */
    tracking: {
      /**
       * The UTM parameter used to track a campaign
       *
       * @title utm_campaign
       */
      utm_campaign: string | null;

      /**
       * The UTM parameter that identifies the source (platform where the traffic originates)
       *
       * @title utm_source
       */
      utm_source: string | null;

      /**
       * The UTM parameter that identifies the type of input (e.g. CPC, social media, etc.)
       *
       * @title utm_medium
       */
      utm_medium: string | null;

      /**
       * UTM content tracking parameter
       *
       * @title utm_content
       */
      utm_content: string | null;

      /**
       * The UTM parameter used to track keywords
       *
       * @title utm_term
       */
      utm_term: string | null;

      /**
       * @title salesforce_uuid
       * The Salesforce record unique identifier
       */
      salesforce_uuid: string | null;
    };

    /**
     * The phone number to use when sending text (SMS) reminders
     *
     * @title text_reminder_number
     * @example "+1 404-555-1234"
     */
    text_reminder_number: string | null;

    /**
     * Indicates if this invitee has rescheduled
     *
     * @title rescheduled
     */
    rescheduled: boolean;

    /**
     * Reference to old Invitee instance that got rescheduled
     *
     * @title old_invitee
     */
    old_invitee: (string & tags.Format<"iri">) | null;

    /**
     * Link to new invitee after reschedule
     *
     * @title new_invitee
     */
    new_invitee: (string & tags.Format<"iri">) | null;

    /**
     * Link to cancelling the event for the invitee
     *
     * @title cancel_url
     */
    cancel_url: string & tags.Format<"iri">;

    /**
     * Link to rescheduling the event for the invitee
     *
     * @title reschedule_url
     */
    reschedule_url: string & tags.Format<"iri">;

    /**
     * Reference to a routing form submission that redirected the invitee to a booking page.
     *
     * @title routing_form_submission
     * @example https://api.calendly.com/routing_form_submissions/AAAAAAAAAAAAAAAA
     */
    routing_form_submission: (string & tags.Format<"iri">) | null;

    /**
     * Provides data pertaining to the cancellation of the Event or the Invitee
     *
     * @title cancellation
     */
    cancellation?: Cancellation;

    /**
     * @title Invitee payment
     */
    payment: Payment | null;

    /**
     * Provides data pertaining to the associated no show for the Invitee
     *
     * @title no_show
     */
    no_show: NoShow | null;

    /**
     * Assuming reconfirmation is enabled for the event type, when reconfirmation is requested this object is present with a created_at that reflects when the reconfirmation notification was sent. Once the invitee has reconfirmed
     *
     * @title reconfirmation
     */
    reconfirmation: Reconfirmation | null;

    /**
     * The method used to schedule the event
     *
     * @enum ["instant_book"]
     *
     * @title scheduling_method
     */
    scheduling_method: tags.Constant<
      "instant_book",
      { title: "instant_book" }
    > | null;

    /**
     * Reference to user URI who scheduled the event
     *
     * @title invitee_scheduled_by
     */
    invitee_scheduled_by: (string & tags.Format<"iri">) | null;
  }

  export type Reconfirmation = {
    /**
     * When the reconfirmation was created.
     *
     * @title created_at
     * @example 2020-11-23T17:51:18.341657Z
     */
    created_at: string & tags.Format<"date-time">;

    /**
     * When the Invitee confirmed their attendance.
     *
     * @title confirmed_at
     * @example 2020-11-23T17:51:18.341657Z
     */
    confirmed_at: (string & tags.Format<"date-time">) | null;
  };

  export type NoShow = {
    /**
     * @title url
     * Canonical reference (unique identifier) for the no show
     */
    url: string & tags.Format<"iri">;

    /**
     * The moment when the no show was created
     *
     * @title created_at
     * @example 2019-01-02T03:04:05.678123Z
     */
    created_at: string & tags.Format<"date-time">;
  };

  export type Payment = {
    /**
     * @title external_id
     * Unique identifier for the payment
     */
    external_id: string;

    /**
     * Payment provider
     *
     * @title provider
     * @enum ["stripe", "paypal"]
     * @example "stripe"
     */
    provider: string;

    /**
     * @title amount
     * The amount of the payment
     */
    amount: number & tags.Type<"float">;

    /**
     * @title currency
     * The currency format that the payment is in.
     */
    currency:
      | tags.Constant<"AUD", { title: "AUD" }>
      | tags.Constant<"CAD", { title: "CAD" }>
      | tags.Constant<"EUR", { title: "EUR" }>
      | tags.Constant<"GBP", { title: "GBP" }>
      | tags.Constant<"USD", { title: "USD" }>;

    /**
     * Terms of the payment
     *
     * @title terms
     * @example sample terms of payment (up to 1,024 characters)
     */
    terms: string | null;

    /**
     * @title successful
     * Indicates whether the payment was successfully processed
     */
    successful: boolean;
  };

  export type Cancellation = {
    /**
     * @title canceled_by
     * Name of the person whom canceled
     */
    canceled_by: string;

    /**
     * @title reason
     * Reason that the cancellation occurred
     */
    reason: string | null;

    /**
     * @title canceler_type
     * @enum ["host", "invitee"]
     */
    canceler_type:
      | tags.Constant<"host", { title: "host" }>
      | tags.Constant<"invitee", { title: "invitee" }>;

    /**
     * The moment when the cancellation was created
     *
     * @title created_at
     * @example "2019-01-02T03:04:05.678123Z"
     */
    created_at: string & tags.Format<"date-time">;
  };

  export type Pagination = {
    /**
     * @title count
     * The number of rows to return
     */
    count: number & tags.Minimum<0> & tags.Maximum<100> & tags.Type<"uint32">;

    /**
     * @title next_page
     * URI to return the next page of an ordered list ("null" indicates no additional results are available)
     */
    next_page: (string & tags.Format<"iri">) | null;

    /**
     * @title previous_page
     * URI to return the previous page of an ordered list ("null" indicates no additional results are available)
     */
    previous_page: (string & tags.Format<"iri">) | null;

    /**
     * @title next_page_token
     * Token to return the next page of an ordered list ("null" indicates no additional results are available)
     */
    next_page_token: (string & tags.Format<"iri">) | null;

    /**
     * @title previous_page_token
     * Token to return the previous page of an ordered list ("null" indicates no additional results are available)
     */
    previous_page_token: (string & tags.Format<"iri">) | null;
  };

  /**
   * @title user
   * Information about the user.
   */
  export type User = {
    /**
     * Canonical reference (unique identifier) for the user
     *
     * @title uri
     * @example "https://api.calendly.com/users/AAAAAAAAAAAAAAAA"
     */
    uri: string & tags.Format<"iri">;

    /**
     * The user's name (human-readable format)
     *
     * @title name
     * @example "John Doe"
     */
    name: string;

    /**
     * The portion of URL for the user's scheduling page (where invitees book sessions)
     *
     * @title slug
     * @example "acmesales"
     */
    slug: string;

    /**
     * The user's email address
     *
     * @title email
     * @example "test@example.com"
     */
    email: string & tags.Format<"email">;

    /**
     * The URL of the user's Calendly landing page (that lists all the user's event types)
     *
     * @title scheduling_url
     * @example "https://calendly.com/acmesales"
     */
    scheduling_url: string & tags.Format<"iri">;

    /**
     * The time zone to use when presenting time to the user
     *
     * @title timezone
     * @example "America/New_York"
     */
    timezone: string;

    /**
     * The URL of the user's avatar (image). Can be null.
     *
     * @title avatar_url
     * @example "https://01234567890.cloudfront.net/uploads/user/avatar/0123456/a1b2c3d4.png"
     */
    avatar_url: (string & tags.Format<"iri">) | null;

    /**
     * The moment when the user's record was created
     *
     * @title created_at
     * @example "2019-01-02T03:04:05.678123Z"
     */
    created_at: string & tags.Format<"date-time">;

    /**
     * The moment when the user's record was last updated
     *
     * @title updated_at
     * @example "2019-08-07T06:05:04.321123Z"
     */
    updated_at: string & tags.Format<"date-time">;

    /**
     * A unique reference to the user's current organization
     *
     * @title current_organization
     * @example "https://api.calendly.com/organizations/AAAAAAAAAAAAAAAA"
     */
    current_organization: string & tags.Format<"iri">;

    /**
     * Resource type to support polymorphic associations
     *
     * @title resource_type
     * @example "User"
     */
    resource_type: string;
  };
}
