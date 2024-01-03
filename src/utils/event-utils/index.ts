import { humanDateLong } from "../date-utils";
import { compareAsc, isAfter, isBefore } from "date-fns";

export type PlannedEvent = {
  name: string;
  arrive: Date;
  depart: Date;
  book: Date;
  id: string;
};

export type PlannedEvents = Array<PlannedEvent>;

export function filterEventsToRange({
  events,
  minDate,
  maxDate,
}: {
  events: PlannedEvents;
  minDate: Date;
  maxDate: Date;
}): PlannedEvents {
  return events.filter((event) => {
    return isAfter(event.arrive, minDate) && isBefore(event.arrive, maxDate);
  });
}

export function humanReadableEvent({
  name,
  arrive,
  depart,
  book,
}: PlannedEvent): {
  name: string;
  arrive: string;
  depart: string;
  book: string;
} {
  return {
    name,
    book: humanDateLong(book),
    arrive: humanDateLong(arrive),
    depart: humanDateLong(depart),
  };
}

export function sortEventsChronological(events: PlannedEvents): PlannedEvents {
  return events.sort((a, b) => compareAsc(a.arrive, b.arrive));
}
