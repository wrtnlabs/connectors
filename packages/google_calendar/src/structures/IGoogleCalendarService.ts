import { tags } from "typia";

export namespace IGoogleCalendarService {
  export interface IProps {
    /**
     * Google Client ID.
     */
    clientId: string;

    /**
     * Google Client Secret.
     */
    clientSecret: string;

    /**
     * Google Refresh Token.
     */
    secret: string;
  }

  /**
   * @title Information for creating a calendar
   */
  export interface ICreateCalendarInput {
    /**
     * The title of the calendar to be created.
     *
     * @title The title of the calendar to be created
     */
    title: string;
  }

  /**
   * @title Calendar creation result
   */
  export interface IGoogleCalendarOutput {
    /**
     * The id of the generated calendar.
     *
     * @title Calendar id
     */
    id?: string | null;

    /**
     * The name of the generated calendar.
     *
     * @title Calendar name
     */
    summary?: string | null;
  }

  /**
   * - startTime: Event start time.
   * - updated: Event update date.
   *
   * @title Event sort order
   */
  type OrderBy =
    | tags.Constant<"startTime", { title: "시작 시간" }>
    | tags.Constant<"updated", { title: "업데이트 날짜" }>;

  /**
   * @title Information needed to search for events
   */
  export interface IReadGoogleCalendarEventInput {
    /**
     * Calendar ID.
     */
    id: string;
    /**
     * Events after that date will not be fetched.
     *
     * Note that all date/times are in UTC, so make sure that you have converted the date/time to UTC before using it.
     *
     * @title Information about the last date from which events will be fetched
     */
    time_max: string & tags.Format<"date-time">;

    /**
     * Events prior to that date will not be retrieved.
     *
     * Note that all date/times are in UTC, so make sure that you have converted the date/time to UTC before using it.
     *
     * @title Information on the start date from which events will be retrieved
     */
    time_min: string & tags.Format<"date-time">;

    /**
     * Sets the maximum number of events to retrieve.
     *
     * @title How many results to return
     */
    max_results?: number & tags.Type<"uint32">;

    /**
     * The order in which the calendar events are sorted.
     *
     * - startTime: The start time of the event.
     * - updated: The date the event was updated.
     *
     * Only two possible values are possible: "startTime" and "updated".
     *
     * @title The order in which the events will be received
     */
    orderBy?: OrderBy;

    /**
     * You can search for events that contain your search terms.
     *
     * You can search for events that contain your search terms in the title, description, location, attendees, etc.
     *
     * @title Event search terms
     */
    query?: string;
  }

  /**
   * @title Calendar Event Search Results
   */
  export interface IReadGoogleCalendarEventOutput {
    /**
     * Here is a list of calendar events that were found.
     *
     * @title Event List
     */
    events: IGoogleCalendarEvent[];
  }

  /**
   * @title Google Calendar Event Information
   */
  export interface IGoogleCalendarEvent {
    /**
     * The unique id of the event.
     *
     * @title event id
     */
    id?: string | null;

    /**
     * Here is the event link.
     *
     * @title Event Link
     */
    htmlLink?: (string & tags.Format<"iri">) | null;

    /**
     * Event color.
     *
     * @title Event color
     */
    color?: string | null;

    /**
     * The event creation date.
     *
     * @title The event creation date
     */
    createdDate?: string | null;

    /**
     * Event update date.
     *
     * @title Event update date
     */
    updatedDate?: string | null;

    /**
     * This is the event title.
     *
     * @title Event title
     */
    title?: string | null;

    /**
     * Event description.
     *
     * @title Event description
     */
    description?: string | null;

    /**
     * This is the event location.
     *
     * @title Event Location
     */
    location?: string | null;

    /**
     * Here is the information for the event organizer.
     *
     * @title Event Organizer
     */
    organizer?: IGoogleCalendarEvent.IOrganizer | null;

    /**
     * Information about the event creator.
     *
     * @title Event Creator
     */
    creator?: IGoogleCalendarEvent.ICreator | null;

    /**
     * @title Event Start Date
     *
     * The start date information for the event.
     */
    startDate?: {
      /**
       * Event start date.
       *
       * @title Event start date
       */
      dateTime?: string | null;

      /**
       * Event start date time zone.
       *
       * @title Event start date time zone
       */
      timeZone?: string | null;
    } | null;

    /**
     * This is the event end date information.
     *
     * @title Event end date
     */
    endDate?: {
      /**
       * The event ends on this date.
       *
       * @title The event ends on this date
       */
      dateTime?: string | null;

      /**
       * Event End Date Timezone.
       *
       * @title Event End Date Timezone
       */
      timeZone?: string | null;
    } | null;

    /**
     * Event repeat information.
     *
     * @title Event repeat information
     */
    recurrence?: string[] | null;

    /**
     * Event busy/free status.
     *
     * @title Event busy/free status
     */
    transparency?: string | null;

    /**
     * Whether the inviter has permission to edit the event.
     *
     * @title Whether the inviter has permission to edit the event
     */
    guestsCanModify?: boolean | null;

    /**
     * Event notification information.
     *
     * @title Event notification information
     */
    reminders?: IGoogleCalendarEvent.IReminders | null;

    /**
     * Here is the event attendee information.
     *
     * @title Event Attendee
     */
    attendees?: IGoogleCalendarEvent.IAttendees[] | null;

    /**
     * Event attachment information.
     *
     * @title Attachment information
     */
    attachments?: IGoogleCalendarEvent.IAttachments[] | null;

    /**
     * Here is the Google Meet link.
     *
     * @title Google Meet link
     */
    hangoutLink?: string | null;

    /**
     * The event is open.
     *
     * @title The event is open
     */
    visibility?: string | null;
  }

  export namespace IGoogleCalendarEvent {
    /**
     * Event creator information.
     *
     * @title Event creator information
     */
    export interface ICreator {
      /**
       * The event creator profile id.
       *
       * @title Event Creator Profile Id
       */
      id?: string | null;

      /**
       * The event creator name.
       *
       * @title The event creator name
       */
      displayName?: string | null;

      /**
       * The event creator email.
       *
       * @title The event creator email
       */
      email?: string | null;

      /**
       * Whether the event copy corresponds to the calendar on which it is displayed.
       *
       * @title Whether the event copy corresponds to the calendar on which it is displayed
       */
      self?: boolean | null;
    }

    /**
     * @title Host Information
     */
    export interface IOrganizer {
      /**
       * Event organizer profile id.
       *
       * @title Event organizer profile id
       */
      id?: string | null;

      /**
       * The name of the event organizer.
       *
       * @title The name of the event organizer
       */
      displayName?: string | null;

      /**
       * This is the event organizer's email.
       *
       * @title This is the event organizer's email
       */
      email?: string | null;

      /**
       * Whether the event copy corresponds to the calendar on which it is displayed.
       *
       * @title Whether the event copy corresponds to the calendar on which it is displayed
       */
      self?: boolean | null;
    }

    /**
     * @title Attendee Information
     */
    export interface IAttendees {
      /**
       * This is the event attendee email.
       *
       * @title Event attendee email
       */
      email?: string | null;

      /**
       * Whether the event attendee is the host.
       *
       * @title Whether the event attendee is the host
       */
      organizer?: boolean | null;

      /**
       * Whether the calendar that the schedule copy is displayed on is indicated.
       *
       * @title Whether the calendar that the schedule copy is displayed on is indicated
       */
      self?: boolean | null;

      /**
       * Attendee's attendance response status.
       *
       * @title Attendee's attendance response status
       */
      responseStatus?: string | null;
    }

    /**
     * @title Notification information
     */
    export interface IReminders {
      /**
       * Whether to default notification.
       *
       * @title Whether to default notification
       */
      useDefault?: boolean;

      /**
       * Here is the notification settings information.
       *
       * @title Notification settings information
       */
      overrides?: IRemindersOverrides[];
    }

    /**
     * @title Notification settings information
     */
    export interface IRemindersOverrides {
      /**
       * This is the notification method.
       *
       * @title Notification method
       */
      method?: string | null;

      /**
       * It's time to send notifications.
       *
       * @title It's time to send notifications
       */
      minutes?: number | null;
    }

    /**
     * @title Attachment file information
     */
    export interface IAttachments {
      /**
       * This is the event attachment file url.
       *
       * @title file url
       */
      fileUrl?: (string & tags.Format<"iri">) | null;

      /**
       * This is the title of the attached file.
       *
       * @title File title
       */
      title?: string | null;

      /**
       * Internet Media Type.
       *
       * @title Internet Media Type
       */
      mimeType?: string | null;

      /**
       * Attachment file icon link.
       *
       * @title File icon link
       */
      iconLink?: (string & tags.Format<"iri">) | null;

      /**
       * This is the id of the attached file.
       *
       * @title file id
       */
      fileId?: string | null;
    }

    /**
     * @title Date information
     */

    export interface IDate {
      /**
       * It's the year.
       *
       * Note that all date/times are in UTC, so make sure that you have converted the date/time to UTC before using it.
       *
       * @title The year
       */
      year: number;

      /**
       * It's the month.
       *
       * You must enter a two-digit number. For example, if it is March, you should enter 03.
       *
       * @title The Month
       */
      month: number;

      /**
       * It's the date.
       *
       * You must enter a two-digit number. For example, if it is 7th, you should enter 07.
       *
       * @title Date
       */
      date: number;

      /**
       * It's the hour.
       *
       * You must enter a two-digit number. For example, if it is 2am, you should enter 02. If it is 2pm, you should enter 14.
       *
       * @title hour
       */
      hour: number;
    }
  }

  /**
   * @title Information needed to create a quick event
   */
  export interface ICreateQuickEventInput {
    /**
     * Calendar ID.
     */
    id: string;

    /**
     * This is the text for creating a quick calendar event.
     *
     * @title This is the text for creating a quick calendar event
     */
    text: string;
  }

  /**
   * @title Information required to create an event
   */
  export interface IEventRequestBodyInput {
    /**
     * The title of the event to be generated.
     *
     * @title Event title
     */
    title?: string;

    /**
     * Description of the event to be generated.
     *
     * @title Event description
     */
    description?: string;

    /**
     * This is the event location to be created.
     *
     * @title Event Location
     */
    location?: string;

    /**
     * The start date of the event to be created.
     *
     * Note that all date/times are in UTC, so make sure that you have converted the date/time to UTC before using it.
     *
     * @title Event start date
     */
    start: string & tags.Format<"date-time">;

    /**
     * The end date of the event to be created.
     *
     * Note that all date/times are in UTC, so make sure that you have converted the date/time to UTC before using it.
     *
     * @title Event end date
     */
    end: string & tags.Format<"date-time">;

    /**
     * This is the event attendee email.
     *
     * @title Attendee Email
     */
    attendeesEmail?: string[];

    /**
     * The event repeat cycle.
     *
     * - DAILY: Daily
     * - WEEKLY: Weekly
     * - MONTHLY: Monthly
     * - YEARLY: Yearly
     *
     * Only 4 possible values are possible: "DAILY", "WEEKLY", "MONTHLY", "YEARLY".
     *
     * @title The event repeat cycle
     */
    repeatFrequency?: RepeatFrequency;

    /**
     * The number of times the event is repeated.
     *
     * @title The number of times the event is repeated
     */
    repeatNum?: number;

    /**
     * Event repeat deadline.
     *
     * Note that all date/times are in UTC, so make sure that you have converted the date/time to UTC before using it.
     *
     * @title Event repeat deadline
     */
    repeatUntil?: string & tags.Format<"date-time">;

    /**
     * Whether the event is busy or not.
     *
     * @title Whether the event is busy or not
     */
    isBusy?: boolean;

    /**
     * Whether to use the default calendar notifications.
     *
     * @title Whether to use the default calendar notifications
     */
    isUseDefaultReminder?: boolean;

    /**
     * Event notification type.
     *
     * - popup: Popup notification
     * - email: Email notification
     *
     * Only two possible values are possible: "popup" and "email".
     *
     * @title Event notification type
     */
    remindersType?: EventRemindersType;

    /**
     * It's time to set a notification before the schedule starts.
     *
     * @title It's time to set a notification before the schedule starts
     */
    minutesBeforeReminders?: number;

    /**
     * Whether to create a Google Meet.
     *
     * @title Whether to create a Google Meet
     */
    isConferencing?: boolean;

    /**
     * The event's public status.
     *
     * default - The default public status
     * public - The event is public and the event details are visible to all readers of the calendar
     * private - The event is private and only the event attendees can see the event details
     *
     * There are only three possible values: "default", "public", "private".
     *
     * @title The event's public status
     */
    visibility?: EventVisibility;

    /**
     * Event Color.
     *
     * @title Event Color
     */
    colorId?: string;

    /**
     * Whether guest events can be modified.
     *
     * @title Whether guest events can be modified
     */
    isGuestCanModify?: boolean;
  }

  /**
   * - DAILY: Daily
   * - WEEKLY: Weekly
   * - MONTHLY: Monthly
   * - YEARLY: Yearly
   *
   * @title Event repeat cycle
   */
  export type RepeatFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

  /**
   * - popup: Popup notification
   * - email: Email notification
   *
   * @title Event notification type
   */
  export type EventRemindersType = "popup" | "email";

  /**
   * default - The default public status
   * public - The event is public and the event details are visible to all readers of the calendar
   * private - The event is private and only event attendees can see the event details
   *
   * @title The public status of the event
   */
  export type EventVisibility = "default" | "public" | "private";

  /**
   * @title Event creation result
   */
  export interface ICreateEventOutput {
    /**
     * The id of the generated event.
     *
     * @title Generated event id
     */
    id?: string | null;
  }

  /**
   * @title Information required to add attendees
   */
  export interface IAddAttendeesToEventInput {
    /**
     * Calendar ID.
     */
    calendarId: string;

    /**
     * Event ID.
     */
    eventId: string;
    /**
     * The email address of the attendee you wish to add.
     *
     * @title The email address of the attendee you wish to add
     */
    attendeesEmail: string[];
  }
}
