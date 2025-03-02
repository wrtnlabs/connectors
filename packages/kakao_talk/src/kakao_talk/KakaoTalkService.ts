import axios, { AxiosError } from "axios";
import { IKakaoTalkService } from "../structures/IKakaoTalkService";

export class KakaoTalkService {
  constructor(private readonly props: IKakaoTalkService.IProps) {}

  /**
   * Retrieves the list of friends on KakaoTalk(카카오톡)
   *
   * KakaoTalk(카카오톡) is a mobile messenger application in South Korea, which also provides various additional services.
   * When looking up your friends, only those who linked Kakao Talk in studio-pro will be searched, so you may not be able to check the target.
   * In this case, it might be better to send a message by email or other means.
   *
   */
  async getFriends(
    input: IKakaoTalkService.IGetFriendsInput,
  ): Promise<IKakaoTalkService.IGetFriendsOutput> {
    try {
      const { ...getEventQueryParam } = input;
      const queryParams = Object.entries(getEventQueryParam)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      const accessToken = await this.refresh();

      const url = `https://kapi.kakao.com/v1/api/talk/friends?${queryParams}`;
      const res = await axios.get(url, {
        headers: {
          Authorization: `bearer ${accessToken.access_token}`,
        },
      });

      return { ...res.data, elements: res.data.elements ?? [] }; // elements는 비어 있을 때 빈 Array로 나오지 않고 undefined로 나온다.
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Adds an event to the KakaoTalk(카카오톡) calendar
   *
   * KakaoTalk(카카오톡) is a mobile messenger application in South Korea, which also provides various additional services.
   *
   */
  async createEvent(
    input: IKakaoTalkService.ICreateEventInput,
  ): Promise<IKakaoTalkService.ICreateEventOutput> {
    try {
      const { ...createEventDto } = input;

      const accessToken = await this.refresh();

      const res = await axios.post(
        "https://kapi.kakao.com/v2/api/calendar/create/event",
        {
          caelndar_id: createEventDto.calendar_id,
          event: JSON.stringify(createEventDto.event),
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `bearer ${accessToken.access_token}`,
          },
        },
      );

      return res.data;
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Retrieves KakaoTalk(카카오톡) calendar events.
   *
   * The user needs to provide the calendar ID as an input parameter.
   * If no calendar is provided, it defaults to retrieving the user's own calendar.
   * Therefore, this feature can be used even if no calendar ID is specified.
   *
   * The conditions for retrieving events include specifying the period for which events are to be fetched.
   * This connector is designed to view data for either a week or a month.
   *
   * KakaoTalk(카카오톡) is a mobile messaging application in South Korea, and it also provides additional services.
   *
   */
  async getEvents(
    input: IKakaoTalkService.IGetEventInput,
  ): Promise<IKakaoTalkService.IGetEventOutput> {
    try {
      const { ...getEventQueryParam } = input;
      const queryParams = Object.entries(getEventQueryParam)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      const accessToken = await this.refresh();

      const res = await axios.get(
        `https://kapi.kakao.com/v2/api/calendar/events?${queryParams}`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `bearer ${accessToken.access_token}`,
          },
        },
      );

      return res.data;
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Retrieves all KakaoTalk(카카오톡) calendar lists
   *
   * There are two types of calendars: your primary calendars and calendars you are subscribed to.
   * All Kakao users have their own personal calendars, so there will be at least one calendar.
   * The primary calendar has an ID of `primary`, which is the user's own calendar.
   *
   * KakaoTalk(카카오톡) is a mobile messenger application from South Korea that also provides additional services.
   *
   */
  async getCalendars(): Promise<IKakaoTalkService.IGetCalendarOutput> {
    try {
      const accessToken = await this.refresh();

      const res = await axios.get(
        "https://kapi.kakao.com/v2/api/calendar/calendars",
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `bearer ${accessToken.access_token}`,
          },
        },
      );

      return res.data;
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  private async refresh(): Promise<IKakaoTalkService.IRefreshAccessTokenOutput> {
    try {
      const url = `https://kauth.kakao.com/oauth/token` as const;
      const res = await axios.post(
        url,
        {
          grant_type: "refresh_token",
          client_id: this.props.clientId,
          refresh_token: this.props.secret,
          client_secret: this.props.clientSecret,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      this.props.secret = res.data.refresh_token;

      const data: IKakaoTalkService.IRefreshAccessTokenOutput = res.data;

      return data;
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Sends a text type KakaoTalk(카카오톡) message to a friend
   *
   * KakaoTalk(카카오톡) is a mobile messenger application in South Korea, which also provides various additional services.
   * If it is not specified who the user wants to send the message, it should not be sent at will.
   *
   */
  async send(
    input: IKakaoTalkService.ISendKakaoTalkToFriendsInput,
  ): Promise<IKakaoTalkService.ISendKakaoTalkToFriendsOutput> {
    try {
      const accessToken = await this.refresh();

      const template: IKakaoTalkService.ITextMemoInput = {
        object_type: "text",
        text: input.message,
        link: {
          mobile_web_url: "https://studio-pro.wrtn.ai",
          web_url: "https://studio-pro.wrtn.ai",
        },
        button_title: "이동하기",
      };

      const res = await axios.post(
        "https://kapi.kakao.com/v1/api/talk/friends/message/default/send",
        {
          receiver_uuids: JSON.stringify(input.receiver_uuids),
          template_object: JSON.stringify(template),
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `bearer ${accessToken.access_token}`,
          },
        },
      );

      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(JSON.stringify(error.response?.data));
      } else {
        console.error(JSON.stringify(error));
      }
      throw error;
    }
  }

  /**
   * Sends a commerce type message to myself on KakaoTalk(카카오톡)
   *
   * When sending a KakaoTalk(카카오톡) message, there are buttons. If you want to add a link to the button, you should use a URL starting with `https://studio-pro.wrtn.ai/` or a redirect link. If the link starts with `https://studio-pro.wrtn.ai/`, the page will be viewed, otherwise, it will redirect to the new link. This is because only links registered in our domain are allowed according to the KakaoTalk(카카오톡) API specifications.
   *
   * KakaoTalk(카카오톡) is a mobile messenger application in South Korea, which also provides various additional services.
   */
  async memo(
    input:
      | IKakaoTalkService.ISendKakaoTalkCommerceInput
      | IKakaoTalkService.ISendKakaoTalkLocationInput
      | IKakaoTalkService.ISendKakaoTalkListInput
      | IKakaoTalkService.ISendKakaoTalkFeedInput
      | IKakaoTalkService.ISendKakaoTalkTextInput,
  ): Promise<IKakaoTalkService.IMemoOutput> {
    try {
      const accessToken = await this.refresh();

      const defaultUrl = "https://studio-pro.wrtn.ai" as const;
      input.template_object.buttons?.forEach((button) => {
        button.title = "이동하기";
        if ("web_url" in button.link) {
          if (!button.link.web_url.startsWith(defaultUrl)) {
            const redirectUrl = button.link.web_url;
            button.link.web_url = `${defaultUrl}/redirect/custom?redirect_url=${redirectUrl}`;
          }
        } else if ("mobile_web_url" in button.link) {
          if (!button.link.mobile_web_url.startsWith(defaultUrl)) {
            const redirectUrl = button.link.mobile_web_url;
            button.link.mobile_web_url = `${defaultUrl}/redirect/custom?redirect_url=${redirectUrl}`;
          }
        } else if ("android_execution_params" in button.link) {
          if (!button.link.android_execution_params.startsWith(defaultUrl)) {
            const redirectUrl = button.link.android_execution_params;
            button.link.android_execution_params = `${defaultUrl}/redirect/custom?redirect_url=${redirectUrl}`;
          }
        } else if ("ios_execution_params" in button.link) {
          if (!button.link.ios_execution_params.startsWith(defaultUrl)) {
            const redirectUrl = button.link.ios_execution_params;
            button.link.ios_execution_params = `${defaultUrl}/redirect/custom?redirect_url=${redirectUrl}`;
          }
        }
      });

      const res = await axios.post(
        "https://kapi.kakao.com/v2/api/talk/memo/default/send",
        {
          template_object: JSON.stringify(input.template_object),
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `bearer ${accessToken.access_token}`,
          },
        },
      );

      return res.data;
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }
}
