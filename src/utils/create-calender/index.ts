import { addDays } from "date-fns";
import { createUuid, humanDateLong } from "..";
import { PlannedEvent, PlannedEvents } from "../event-utils";
import ICAL from "ical.js";

function createBookingReminderComponent(event: PlannedEvent): ICAL.Component {
  const eventComponent = new ICAL.Component("vevent");
  const calEvent = new ICAL.Event(eventComponent);

  eventComponent.addPropertyWithValue("created", ICAL.Time.now());
  eventComponent.addPropertyWithValue("dtstamp", ICAL.Time.now());

  calEvent.uid = `${event.id}-booking`;
  calEvent.summary = `Book campsite(s) for ${event.name}`;
  calEvent.description = `
    Trip Name: ${event.name}
    Trip Start: ${humanDateLong(event.arrive)}
    Trip End: ${humanDateLong(event.depart)}
    `;

  calEvent.startDate = ICAL.Time.fromJSDate(event.book, false);
  calEvent.endDate = ICAL.Time.fromJSDate(event.book, false);

  // 15 minutes prior to start time
  const justBeforeAlarm = createAlarm("-PT15M");
  eventComponent.addSubcomponent(justBeforeAlarm);

  // 1 day prior to start time
  const dayBeforeAlarm = createAlarm("-P1D");
  eventComponent.addSubcomponent(dayBeforeAlarm);

  return eventComponent;
}

function createEventComponent(event: PlannedEvent): ICAL.Component {
  const eventComponent = new ICAL.Component("vevent");
  const calEvent = new ICAL.Event(eventComponent);

  eventComponent.addPropertyWithValue("created", ICAL.Time.now());
  eventComponent.addPropertyWithValue("dtstamp", ICAL.Time.now());

  calEvent.uid = event.id;
  calEvent.summary = event.name;
  calEvent.description = "";

  // We want all day events, date times need to start at 00:00 day of arrival
  // and end at 12:00am the day after departing
  calEvent.startDate = ICAL.Time.fromJSDate(event.arrive, false);
  calEvent.endDate = ICAL.Time.fromJSDate(addDays(event.depart, 1), false);

  // 1 day prior to start time
  const dayBeforeAlarm = createAlarm("-P1D");
  eventComponent.addSubcomponent(dayBeforeAlarm);

  return eventComponent;
}

export function createICALContentStr(
  calendarName: string,
  events: PlannedEvents
): string {
  const root = new ICAL.Component(["vcalendar", [], []]);

  root.addPropertyWithValue("VERSION", "2.0");
  root.addPropertyWithValue("PRODID", "-//Camp Coach//Camp Plan//EN");

  // Both properties are required
  root.addPropertyWithValue("NAME", calendarName);
  root.addPropertyWithValue("X-WR-CALNAME", calendarName);

  events.forEach((event) => {
    root.addSubcomponent(createBookingReminderComponent(event));
    root.addSubcomponent(createEventComponent(event));
  });

  return root.toString();
}

// Refer to:
// RFC: https://datatracker.ietf.org/doc/html/rfc9074
// TRIGGER: https://www.kanzaki.com/docs/ical/trigger.html
function createAlarm(trigger: string): ICAL.Component {
  const alarm = new ICAL.Component("valarm");

  const uid = createUuid();
  alarm.addPropertyWithValue("UID", uid);
  alarm.addPropertyWithValue("TRIGGER", trigger);
  alarm.addPropertyWithValue("ACTION", "DISPLAY");
  alarm.addPropertyWithValue("DESCRIPTION", "Reminder" + uid);

  return alarm;
}
