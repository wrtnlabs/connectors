import axios from "axios";
import { ICalendlyService } from "../structures/ICalendlyService";
import { createQueryParameter } from "@wrtnlabs/connector-shared";

export class CalendlyService {
  constructor(private readonly props: ICalendlyService.IProps) {}
  /**
   * Calendly Service.
   *
   * Creates a scheduling link for the authenticated user.
   *
   * This link can be shared with others to allow them to schedule meetings with the user based on their availability.
   */
  async createSchedulingLink(
    input: ICalendlyService.CreateSchedulingLinkInput,
  ): Promise<ICalendlyService.CreateSchedulingLinkOutput> {
    const token = await this.refresh();
    const url = `https://api.calendly.com/scheduling_links`;
    const res = await axios.post(
      url,
      {
        max_event_count: 1 as const,
        owner: input.owner,
        owner_type: "EventType" as const,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  }

  /**
   * Calendly Service.
   *
   * Retrieves the event types available for the user or organization.
   *
   * This is useful to show what types of meetings can be scheduled, such as one-on-one meetings, group meetings, etc.
   *
   */
  async getEventTypes(
    input: ICalendlyService.IGetEventTypeInput,
  ): Promise<ICalendlyService.IGetEventTypeOutput> {
    const token = await this.refresh();
    const queryParameter = createQueryParameter(input);
    const url = `https://api.calendly.com/event_types?${queryParameter}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  }

  /**
   * Calendly Service.
   *
   * Fetches the detailed information of a specific scheduled event by its UUID.
   *
   * This includes information such as the event's date, time, participants, and any notes or agenda items.
   */
  async getOneScheduledEvent(input: {
    scheduledEventId: ICalendlyService.Event["uuid"];
  }): Promise<ICalendlyService.IGetOneScheduledEventOutput> {
    const { scheduledEventId } = input;
    const token = await this.refresh();

    const url = `https://api.calendly.com/scheduled_events/${scheduledEventId}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = res.data as ICalendlyService.IGetOneScheduledEventOutput;
    const prefix = "https://api.calendly.com/scheduled_events/";
    data.resource.uuid = data.resource.uri.replace(prefix, "");
    return data;
  }

  /**
   * Calendly Service.
   *
   * Retrieves all scheduled events within a given time period or based on certain criteria.
   *
   * This can help users manage their calendar by viewing all upcoming events.
   */
  async getScheduledEvents(
    input: ICalendlyService.IGetScheduledEventInput,
  ): Promise<ICalendlyService.IGetScheduledEventOutput> {
    try {
      const { who, ...rest } = input;
      const token = await this.refresh();
      const queryParameter = createQueryParameter({ ...rest, ...who });
      const url = `https://api.calendly.com/scheduled_events?${queryParameter}`;
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data as ICalendlyService.IGetScheduledEventOutput;

      const collection = data.collection.map((el) => {
        const prefix = "https://api.calendly.com/scheduled_events/";
        const uuid = el.uri.replace(prefix, "");
        return { ...el, uuid };
      });
      return { collection, pagination: data.pagination };
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Calendly Service.
   *
   * Retrieves the cancel link for a specific invitee in an event.
   *
   * This link allows the invitee to cancel their participation in the event if needed.
   */
  async cancel(input: {
    scheduledEventId: ICalendlyService.Event["uuid"];
    inviteeId: ICalendlyService.Invitee["uuid"];
  }): Promise<
    ICalendlyService.IGetOneScheduledEventInviteeOutput["resource"]["cancel_url"]
  > {
    const { scheduledEventId, inviteeId } = input;

    const invitee = await this.getOneInvitee({
      scheduledEventId,
      inviteeId,
    });
    return invitee.resource.cancel_url;
  }

  /**
   * Calendly Service.
   *
   * Retrieves the details of a specific invitee for a scheduled event.
   *
   * This includes information such as the invitee's name, email, and any notes or preferences they have provided.
   */
  async getOneInvitee(input: {
    scheduledEventId: ICalendlyService.Event["uuid"];
    inviteeId: ICalendlyService.Invitee["uuid"];
  }): Promise<ICalendlyService.IGetOneScheduledEventInviteeOutput> {
    const { scheduledEventId, inviteeId } = input;
    const token = await this.refresh();
    const url = `https://api.calendly.com/scheduled_events/${scheduledEventId}/invitees/${inviteeId}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data =
      res.data as ICalendlyService.IGetOneScheduledEventInviteeOutput;
    const prefix = new RegExp(
      `https:\/\/api\.calendly\.com\/scheduled_events\/.+\/invitees\/`,
    );
    data.resource.uuid = data.resource.uri.replace(prefix, "");
    return data;
  }

  /**
   * Calendly Service.
   *
   * Retrieves the list of invitees for a scheduled event.
   *
   * This can be used to see who is expected to attend and manage communications with them.
   */
  async getInvitees(
    input: ICalendlyService.IGetScheduledEventInviteeInput,
  ): Promise<ICalendlyService.IGetScheduledEventInviteeOutput> {
    const { scheduled_event_uuid, ...rest } = input;
    const token = await this.refresh();
    const queryParameter = createQueryParameter(rest);
    const url = `https://api.calendly.com/scheduled_events/${scheduled_event_uuid}/invitees?${queryParameter}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = res.data as ICalendlyService.IGetScheduledEventInviteeOutput;
    const collection = data.collection.map((el) => {
      const prefix = new RegExp(
        `https:\/\/api\.calendly\.com\/scheduled_events\/.+\/invitees\/`,
      );
      const uuid = el.uri.replace(prefix, "");
      return { ...el, uuid };
    });
    return { collection, pagination: data.pagination };
  }

  /**
   * Calendly Service.
   *
   * Allows users to create a one-off event type for special occasions or single events.
   *
   * This is useful for events that do not fit into regular scheduling patterns.
   *
   * {@link docs https://developer.calendly.com/api-docs/v1yuxil3cpmxq-create-one-off-event-type}
   */
  async createOneOffEventType(
    input: ICalendlyService.ICreateOneOffEventTypeInput,
  ): Promise<ICalendlyService.ICreateOneOffEventTypeOutput> {
    try {
      const { ...rest } = input;
      const token = await this.refresh();
      const url = `https://api.calendly.com/one_off_event_types`;
      const res = await axios.post(
        url,
        {
          ...rest,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return res.data;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Calendly Service.
   *
   * Marks an invitee as a no-show for a specific event.
   *
   * This is useful for tracking attendance and managing follow-ups with participants who did not attend.
   */
  async checkNoShow(input: {
    eventId: ICalendlyService.Event["uuid"];
    inviteeId: ICalendlyService.Invitee["uuid"];
  }): Promise<ICalendlyService.ICheckNoShowOutput> {
    const { eventId, inviteeId } = input;
    const token = await this.refresh();
    const url = `https://api.calendly.com/invitee_no_shows`;
    const invitee = `https://api.calendly.com/scheduled_events/${eventId}/invitees/${inviteeId}`;
    const res = await axios.post(
      url,
      {
        invitee,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  }

  /**
   * Calendly Service.
   *
   * Retrieves the details of the authenticated user.
   *
   * This is useful for confirming user information during event creation and ensuring that the correct user is associated with the events.
   */
  async getUserInfo(): Promise<ICalendlyService.IGetUserInfoOutput> {
    const token = await this.refresh();
    const url = `https://api.calendly.com/users/me`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  }

  private async refresh() {
    try {
      const res = await axios.post(
        "https://auth.calendly.com/oauth/token",
        {
          grant_type: "refresh_token",
          refresh_token: this.props.refreshToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: this.getBasicAuthorization(),
          },
        },
      );

      const { access_token, refresh_token: newRefreshToken } = res.data;

      if (process.env.NODE_ENV === "test") {
        this.props.refreshToken = newRefreshToken;
      }

      return access_token;
    } catch (err) {
      console.error(JSON.stringify(err));
    }
  }

  private getBasicAuthorization() {
    // client_id:client_secret 형식으로 문자열 생성
    const credentials = this.props.clientId + ":" + this.props.clientSecret;

    // Base64 인코딩
    const encodedCredentials = btoa(credentials);
    return "Basic " + encodedCredentials;
  }
}
