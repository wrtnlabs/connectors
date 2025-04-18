import typia from "typia";

import CApi from "@wrtn/connector-api/lib/index";
import { IGoogleCalendar } from "@wrtn/connector-api/lib/structures/connector/google_calendar/IGoogleCalendar";

import { ConnectorGlobal } from "../../../../../src/ConnectorGlobal";

const today = new Date();
const oneWeekLater = new Date(today);
oneWeekLater.setDate(today.getDate() + 7);
const oneMonthLater = new Date(today);
oneMonthLater.setMonth(today.getMonth() + 1);

const requestBody = {
  title: "이벤트 생성",
  start: today.toISOString().replace(/T.*/, "T09:00:00Z"),
  end: today.toISOString().replace(/T.*/, "T10:00:00Z"),
  /** 여기부터 Optional 값 */
  description: "이벤트 생성 테스트",
  location: "강남역",
  /**
   * GaxiosError: Service accounts cannot invite attendees without Domain-Wide Delegation of Authority.
   * 현재 서비스 계정으로는 참석자를 초대할 수 없음.
   */
  // attendees: ["seunghwa2475@gmail.com"],
  repeatFrequency: "DAILY" as IGoogleCalendar.RepeatFrequency,
  repeatUntil: oneWeekLater.toISOString().replace(/T.*/, "T09:00:00Z"),
  repeatNum: 1,
  isBusy: false,
  visibility: "default" as IGoogleCalendar.EventVisibility,
  isGuestCanModify: true,
  remindersType: "popup" as IGoogleCalendar.EventRemindersType,
  minutesBeforeReminders: 2,
};

export const test_api_connector_google_calendar = async (
  connection: CApi.IConnection,
) => {
  const secretKey = ConnectorGlobal.env.GOOGLE_TEST_SECRET;
  /**
   * Create Calendar
   */
  const calendar =
    await CApi.functional.connector.google_calendar.createCalendar(connection, {
      title: "calendar-create-test",
      secretKey,
    });
  typia.assert(calendar);

  const calendarId = calendar.id;

  /**
   * Delete Calendar
   */
  await CApi.functional.connector.google_calendar.deleteCalendar(
    connection,
    calendarId!,
    {
      secretKey,
    },
  );

  /**
   * Read Calendar List
   */
  const calendarList =
    await CApi.functional.connector.google_calendar.get_list.readCalenders(
      connection,
      {
        secretKey,
      },
    );
  typia.assert(calendarList);

  /**
   * Read Event List
   */
  const eventList =
    await CApi.functional.connector.google_calendar.get_events.readEvents(
      connection,
      "primary",
      {
        secretKey,
        time_min: today.toISOString().replace(/T.*/, "T06:00:00Z"),
        time_max: oneMonthLater.toISOString().replace(/T.*/, "T06:00:00Z"),
      },
    );
  typia.assert(eventList);

  /**
   * Create Quick Event
   */
  const quickEvent =
    await CApi.functional.connector.google_calendar.quick_event.createQuickEvent(
      connection,
      "primary",
      {
        secretKey,
        text: "test",
      },
    );
  typia.assert(quickEvent);

  /**
   * Create Event
   */
  const createdEvent =
    await CApi.functional.connector.google_calendar.event.createEvent(
      connection,
      "primary",
      { ...requestBody, secretKey },
    );
  typia.assert(createdEvent);

  const eventId = createdEvent.id;

  /**
   * Update Event
   */
  const updatedEvent =
    await CApi.functional.connector.google_calendar.event.updateEvent(
      connection,
      "primary",
      eventId!,
      {
        secretKey,
        title: "이벤트 업데이트",
        start: requestBody.start,
        end: requestBody.end,
      },
    );
  typia.assert(updatedEvent);

  /**
   * Add Attendees to event
   *  GaxiosError: Service accounts cannot invite attendees without Domain-Wide Delegation of Authority.
   * 현재 서비스 계정으로는 참석자를 초대할 수 없어서 테스트에서 제외
   * 
  await CApi.functional.connector.google_calendar.event.attendees.addAttendeesToEvent(
    connection,
    "primary",
    eventId!,
    { attendeesEmail: ["seunghwa2475@gmail.com"] },
  );
  */

  /**
   * Delete Event
   */
  await CApi.functional.connector.google_calendar.event.deleteEvent(
    connection,
    "primary",
    eventId!,
    {
      secretKey,
    },
  );
};
