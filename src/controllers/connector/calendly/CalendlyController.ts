import core, { HumanRoute, TypedBody, TypedParam } from "@nestia/core";
import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ICalendly } from "@wrtn/connector-api/lib/structures/connector/calendly/ICalendly";
import { Prerequisite, RouteIcon, SelectBenchmark } from "@wrtnio/decorators";
import { CalendlyProvider } from "../../../providers/connector/calendly/CalendlyProvider";

@Controller("connector/calendly")
export class CalendlyController {
  constructor(private readonly calendlyProvider: CalendlyProvider) {}

  /**
   * Creates a scheduling link for the authenticated user.
   *
   * This link can be shared with others to allow them to schedule meetings with the user based on their availability.
   *
   * @summary Create a new scheduling link
   * @param input The necessary details to create the scheduling link.
   * @returns The created scheduling link details.
   */
  @SelectBenchmark("calendly 미팅 좀 잡아줘")
  @HumanRoute()
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/calendly.svg",
  )
  @ApiTags("Calendly")
  @core.TypedRoute.Post("scheduling_links")
  async createSchedulingLink(
    @TypedBody() input: ICalendly.CreateSchedulingLinkInput,
  ): Promise<ICalendly.CreateSchedulingLinkOutput> {
    const data = await this.calendlyProvider.createSchedulingLink(input);
    return data;
  }

  /**
   * Retrieves the event types available for the user or organization.
   *
   * This is useful to show what types of meetings can be scheduled, such as one-on-one meetings, group meetings, etc.
   *
   * @summary List all event types
   * @param input The input required to retrieve event types.
   * @returns The list of event types.
   */
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/calendly.svg",
  )
  @HumanRoute()
  @ApiTags("Calendly")
  @core.TypedRoute.Patch("get-event-types")
  async getEventTypes(
    @TypedBody() input: ICalendly.IGetEventTypeInput,
  ): Promise<ICalendly.IGetEventTypeOutput> {
    const data = await this.calendlyProvider.getEventTypes(input);
    return data;
  }

  /**
   * Retrieves the cancel link for a specific invitee in an event.
   *
   * This link allows the invitee to cancel their participation in the event if needed.
   *
   * @summary Get cancel link for invitee
   * @param eventId The ID of the event.
   * @param inviteeId The ID of the invitee.
   * @param input Additional input for cancel link retrieval.
   * @returns The cancel link for the invitee.
   */
  @SelectBenchmark("calendly 미팅 좀 취소해줘")
  @HumanRoute()
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/calendly.svg",
  )
  @ApiTags("Calendly")
  @core.TypedRoute.Post("events/:eventId/invitees/:inviteeId/get-cancel-link")
  async cancel(
    @Prerequisite({
      neighbor: () => CalendlyController.prototype.getScheduledEvents,
      jmesPath: "collection[].{value:uuid, label:name}",
    })
    @TypedParam("eventId")
    eventId: ICalendly.Event["uuid"],
    @Prerequisite({
      neighbor: () => CalendlyController.prototype.getScheduledEvents,
      jmesPath: "collection[].{value:uuid, label:name}",
    })
    @TypedParam("inviteeId")
    inviteeId: ICalendly.Invitee["uuid"],
    @TypedBody() input: ICalendly.ICancelInput,
  ): Promise<ICalendly.ICacnelOutput> {
    const invitee = await this.calendlyProvider.getOneInvitee(
      eventId,
      inviteeId,
      input,
    );
    const data = invitee.resource.cancel_url;
    return data;
  }

  /**
   * Fetches the detailed information of a specific scheduled event by its UUID.
   *
   * This includes information such as the event's date, time, participants, and any notes or agenda items.
   *
   * @summary Get details of a scheduled event
   * @param eventId The UUID of the event.
   * @param input Additional input for event retrieval.
   * @returns The detailed information of the scheduled event.
   */
  @SelectBenchmark("calendly 미팅 정보 좀 조회해줘")
  @HumanRoute()
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/calendly.svg",
  )
  @ApiTags("Calendly")
  @core.TypedRoute.Patch("get-events/:eventId")
  async getOneScheduledEvent(
    @TypedParam("eventId") eventId: ICalendly.Event["uuid"],
    @TypedBody() input: ICalendly.IGetOneScheduledEventInput,
  ): Promise<ICalendly.IGetOneScheduledEventOutput> {
    const data = await this.calendlyProvider.getOneScheduledEvent(
      eventId,
      input,
    );
    return data;
  }

  /**
   * Retrieves all scheduled events within a given time period or based on certain criteria.
   *
   * This can help users manage their calendar by viewing all upcoming events.
   *
   * @summary Get all scheduled events
   * @param input The input to filter scheduled events.
   * @returns The list of scheduled events.
   */
  @SelectBenchmark("내 calendly에서 예약된 미팅들 좀 알려줘")
  @HumanRoute()
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/calendly.svg",
  )
  @ApiTags("Calendly")
  @core.TypedRoute.Patch("get-scheduled-events")
  async getScheduledEvents(
    @TypedBody() input: ICalendly.IGetScheduledEventInput,
  ): Promise<ICalendly.IGetScheduledEventOutput> {
    const data = await this.calendlyProvider.getScheduledEvents(input);
    return data;
  }

  /**
   * Marks an invitee as a no-show for a specific event.
   *
   * This is useful for tracking attendance and managing follow-ups with participants who did not attend.
   *
   * @summary Mark an invitee as no-show
   * @param eventId The UUID of the event.
   * @param inviteeId The UUID of the invitee.
   * @param input Additional input for no-show marking.
   * @returns The result of the no-show marking.
   */
  @SelectBenchmark("내 calendly에서 미팅에 노쇼한 사람 체크 좀 해줘")
  @HumanRoute()
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/calendly.svg",
  )
  @ApiTags("Calendly")
  @core.TypedRoute.Post("events/:eventId/invitees/:inviteeId/no-show")
  async checkNoShow(
    @TypedParam("eventId") eventId: ICalendly.Event["uuid"],
    @TypedParam("inviteeId") inviteeId: ICalendly.Invitee["uuid"],
    @TypedBody() input: ICalendly.ICheckNoShowInput,
  ): Promise<ICalendly.ICheckNoShowOutput> {
    const data = await this.calendlyProvider.checkNoShow(
      eventId,
      inviteeId,
      input,
    );
    return data;
  }

  /**
   * Retrieves the details of a specific invitee for a scheduled event.
   *
   * This includes information such as the invitee's name, email, and any notes or preferences they have provided.
   *
   * @summary Get invitee details
   * @param eventId The UUID of the event.
   * @param inviteeId The UUID of the invitee.
   * @param input Additional input for invitee retrieval.
   * @returns The details of the invitee.
   */
  @SelectBenchmark("내 calendly에서 미팅 참석자 정보 좀 찾아줘")
  @HumanRoute()
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/calendly.svg",
  )
  @ApiTags("Calendly")
  @core.TypedRoute.Patch("events/:eventId/invitees/:inviteeId")
  async getOneInvite(
    @TypedParam("eventId") eventId: ICalendly.Event["uuid"],
    @TypedParam("inviteeId") inviteeId: ICalendly.Invitee["uuid"],
    @TypedBody() input: ICalendly.IGetOneInviteInput,
  ): Promise<ICalendly.IGetOneScheduledEventInviteeOutput> {
    const data = await this.calendlyProvider.getOneInvitee(
      eventId,
      inviteeId,
      input,
    );
    return data;
  }

  /**
   * Retrieves the list of invitees for a scheduled event.
   *
   * This can be used to see who is expected to attend and manage communications with them.
   *
   * @summary Get all invitees for a scheduled event
   * @param input The input to filter invitees.
   * @returns The list of invitees for the event.
   */
  @SelectBenchmark("내 calendly에서 미팅 참석자 정보 좀 찾아줘")
  @HumanRoute()
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/calendly.svg",
  )
  @ApiTags("Calendly")
  @core.TypedRoute.Patch("events/get-invitees")
  async getInvitees(
    @TypedBody() input: ICalendly.IGetScheduledEventInviteeInput,
  ): Promise<ICalendly.IGetScheduledEventInviteeOutput> {
    const data = await this.calendlyProvider.getInvitees(input);
    return data;
  }

  /**
   * Allows users to create a one-off event type for special occasions or single events.
   *
   * This is useful for events that do not fit into regular scheduling patterns.
   *
   * @summary Create a one-off event type
   * @param input The details needed to create a one-off event type.
   * @returns The created one-off event type details.
   */
  @SelectBenchmark("내 calendly에서 1회성 미팅 초대 링크 좀 줄래?")
  @HumanRoute()
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/calendly.svg",
  )
  @ApiTags("Calendly")
  @core.TypedRoute.Post("one-off-event-types")
  async createOneOffEventType(
    @TypedBody() input: ICalendly.ICreateOneOffEventTypeInput,
  ): Promise<ICalendly.ICreateOneOffEventTypeOutput> {
    const data = await this.calendlyProvider.createOneOffEventType(input);
    return data;
  }

  /**
   * Retrieves the details of the authenticated user.
   *
   * This is useful for confirming user information during event creation and ensuring that the correct user is associated with the events.
   *
   * @summary Get authenticated user details
   * @param input The input required to get the user details.
   * @returns The authenticated user's details.
   */
  @RouteIcon(
    "https://ecosystem-connector.s3.ap-northeast-2.amazonaws.com/icons/calendly.svg",
  )
  @HumanRoute()
  @ApiTags("Calendly")
  @core.TypedRoute.Patch("users/get-me")
  async getUserInfo(
    @TypedBody() input: ICalendly.IGetUserInfoInput,
  ): Promise<ICalendly.IGetUserInfoOutput> {
    const data = await this.calendlyProvider.getUserInfo(input);
    return data;
  }
}
