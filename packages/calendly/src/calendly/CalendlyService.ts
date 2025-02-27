import axios from "axios";
import { ICalendlyService } from "../structures/ICalendlyService";
import { createQueryParameter } from "@wrtnlabs/connector-shared";

export class CalendlyService {
  constructor(private readonly props: ICalendlyService.IProps) {}
  /**
   * Endpoint: /scheduling_links
   * 기능: 미리 정의된 유형의 미팅을 위해 사용 가능한 예약 링크를 생성할 수 있습니다. 이 링크를 통해 사용자는 일정 예약 페이지로 이동할 수 있습니다.
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
   * Endpoint: /event_types
   * 기능: 사용자 또는 조직의 일정 유형을 나열합니다. 이 API는 어떤 유형의 미팅을 제공하는지 사용자에게 보여주기 위해 사용합니다.
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
   * Endpoint: /scheduled_events
   * 기능: 예약된 모든 이벤트(미팅)를 조회하고 세부 정보를 가져오는 데 사용됩니다. 예를 들어, 특정 기간 동안 예약된 미팅을 조회할 때 유용합니다.
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
   * Endpoint: /scheduled_events/{event_uuid}/invitees
   * 기능: 예약된 이벤트에 초대된 사람들의 정보를 가져옵니다. 이 정보를 활용하여 미팅 참석자를 관리할 수 있습니다.
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
   * Endpoint: /scheduled_events/{event_uuid}/invitees/{invitee_uuid}/no_show
   * 기능: 초대받은 사람이 참석하지 않았음을 표시할 수 있는 기능입니다. 참석 여부를 관리할 때 유용합니다.
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
   * Endpoint: /users/me
   * 기능: 현재 인증된 사용자 정보를 가져옵니다. 이벤트 생성 시 사용자 정보를 확인하거나 관련 정보를 표시할 때 사용할 수 있습니다.
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

  async refresh() {
    console.log(process.env.NODE_ENV);
    console.log("refresh");
    console.log(this.props.secret);
    console.log(this.props.clientId);
    console.log(this.props.clientSecret);

    try {
      const res = await axios.post(
        "https://auth.calendly.com/oauth/token",
        {
          grant_type: "refresh_token",
          refresh_token: this.props.secret,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: this.getBasicAuthorization(),
          },
        },
      );

      console.log("bye");

      const { access_token, refresh_token: newRefreshToken } = res.data;

      if (process.env.NODE_ENV === "test") {
        this.props.secret = newRefreshToken;
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
