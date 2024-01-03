import { createUuid, humanDateLong } from "..";
import { PlannedEvents } from "../event-utils";
import ICAL from "ical.js";

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
    const eventComponent = new ICAL.Component("vevent");
    const calEvent = new ICAL.Event(eventComponent);

    eventComponent.addPropertyWithValue("created", ICAL.Time.now());
    eventComponent.addPropertyWithValue("dtstamp", ICAL.Time.now());

    calEvent.uid = event.id;
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

    root.addSubcomponent(eventComponent);
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
