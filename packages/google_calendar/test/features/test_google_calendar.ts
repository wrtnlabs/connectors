import {
  GoogleCalendarService,
  IGoogleCalendarService,
} from "@wrtnlabs/connector-google-calendar";
import typia from "typia";
import { TestGlobal } from "../TestGlobal";

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
  repeatFrequency: "DAILY" as IGoogleCalendarService.RepeatFrequency,
  repeatUntil: oneWeekLater.toISOString().replace(/T.*/, "T09:00:00Z"),
  repeatNum: 1,
  isBusy: false,
  visibility: "default" as IGoogleCalendarService.EventVisibility,
  isGuestCanModify: true,
  remindersType: "popup" as IGoogleCalendarService.EventRemindersType,
  minutesBeforeReminders: 2,
};

export const test_google_calendar = async () => {
  const googleCalendarService = new GoogleCalendarService({
    googleClientId: TestGlobal.env.GOOGLE_CLIENT_ID,
    googleClientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
    googleRefreshToken: TestGlobal.env.GOOGLE_TEST_SECRET,
  });

  /**
   * Create Calendar
   */
  const calendar = await googleCalendarService.createCalendar({
    title: "calendar-create-test",
  });
  typia.assert(calendar);

  const calendarId = calendar.id;

  /**
   * Delete Calendar
   */
  await googleCalendarService.deleteCalendar({ calendarId: calendarId! });

  /**
   * Read Calendar List
   */
  const calendarList = await googleCalendarService.getCalendarList();
  typia.assert(calendarList);

  /**
   * Read Event List
   */
  const eventList = await googleCalendarService.eventList({
    id: "primary",
    time_min: today.toISOString().replace(/T.*/, "T06:00:00Z"),
    time_max: oneMonthLater.toISOString().replace(/T.*/, "T06:00:00Z"),
  });
  typia.assert(eventList);

  /**
   * Create Quick Event
   */
  const quickEvent = await googleCalendarService.createQuickEvent({
    id: "primary",
    text: "test",
  });
  typia.assert(quickEvent);

  /**
   * Create Event
   */
  const createdEvent = await googleCalendarService.createEvent({
    calendarId: "primary",
    ...requestBody,
  });
  typia.assert(createdEvent);

  const eventId = createdEvent.id;

  /**
   * Update Event
   */
  const updatedEvent = await googleCalendarService.updateEvent({
    calendarId: "primary",
    eventId: eventId!,
    ...requestBody,
  });
  typia.assert(updatedEvent);

  /**
   * Add Attendees to event
   *  GaxiosError: Service accounts cannot invite attendees without Domain-Wide Delegation of Authority.
   * 현재 서비스 계정으로는 참석자를 초대할 수 없어서 테스트에서 제외
   * 
  await googleCalendarService.event.attendees.addAttendeesToEvent(
    
    "primary",
    eventId!,
    { attendeesEmail: ["seunghwa2475@gmail.com"] },
  );
  */

  /**
   * Delete Event
   */
  await googleCalendarService.deleteEvent({
    calendarId: "primary",
    eventId: eventId!,
  });
};
