import { CalendlyService } from "@wrtnlabs/connector-calendly";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

export const test_calendly = async () => {
  const calendlyService = new CalendlyService({
    clientId: TestGlobal.env.CALENDLY_CLIENT_ID,
    clientSecret: TestGlobal.env.CALENDLY_CLIENT_SECRET,
    refreshToken: TestGlobal.env.CALENDLY_TEST_SECRET,
  });

  // get_me
  const me = await calendlyService.getUserInfo();
  typia.assert(me);

  // create one off event type
  const oneOffEventType = await calendlyService.createOneOffEventType({
    host: me.resource.uri as string,
    date_setting: {
      start_date: "2030-01-01",
      end_date: "2030-01-02",
      type: "date_range",
    },
    duration: 60,
    location: {
      kind: "custom",
      location: "wrtn office",
    },
    name: "2030 WRTN NEXT PLAN",
  });
  typia.assert(oneOffEventType);

  // get_event_types
  const event_types = await calendlyService.getEventTypes({
    user: me.resource.uri as unknown as string,
  });

  typia.assert(event_types);

  // get_scheduled_events
  const scheduledEvents = await calendlyService.getScheduledEvents({
    who: {
      user: me.resource.uri,
    },
  });
  typia.assert(scheduledEvents);

  // get_one_scheduled_event
  const eventUuid = scheduledEvents.collection.at(0)?.uuid;
  const res = await calendlyService.getOneScheduledEvent({
    scheduledEventId: eventUuid!,
  });

  typia.assert(res);

  // get invitees
  const scheduled_event = scheduledEvents.collection.find(
    (event) => event.invitees_counter.active > 0,
  );
  const invitees = await calendlyService.getInvitees({
    scheduled_event_uuid: scheduled_event?.uuid as string,
  });
  typia.assert(invitees);

  // get one invitee
  const invitee = invitees.collection.at(0)!;
  const searchText = "https://api.calendly.com/scheduled_events";
  const eventId = invitee.event.replace(searchText, "");

  const inviteeDetail = await calendlyService.getOneInvitee({
    scheduledEventId: eventId,
    inviteeId: invitee.uuid,
  });
  typia.assert(inviteeDetail);

  // get cancel link
  await new Promise((res) => setTimeout(res, 10000));
  const cancelLink = await calendlyService.cancel({
    scheduledEventId: eventId,
    inviteeId: invitee.uuid,
  });
  typia.assert(cancelLink);

  // create scheduling link
  const eventTypeUri = event_types.collection.at(0)?.uri;
  const scheduling_link = await calendlyService.createSchedulingLink({
    owner: eventTypeUri!,
  });
  typia.assert(scheduling_link);

  // create schduiling link of one off event type
  const scheduling_link_of_one_off_event_type =
    await calendlyService.createSchedulingLink({
      owner: oneOffEventType.resource.uri,
    });
  typia.assert(scheduling_link_of_one_off_event_type);
};
