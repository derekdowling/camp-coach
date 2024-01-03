import {
  addWeeks,
  nextFriday,
  isFriday,
  nextSunday,
  isMonday,
  previousFriday,
  isSaturday,
  addDays,
  isThursday,
  isSunday,
  isBefore,
  subWeeks,
  differenceInCalendarWeeks,
} from "date-fns";
import { BaseEvent, PlannedEvent, PlannedEvents } from "../event-utils";
import { createUuid } from "../uuid";
import { sixMonthsOutBookDateTime } from "../date-utils";

export function getArriveDepartSuggestionForDate(date: Date): {
  arrive: Date;
  depart: Date;
} {
  // If close to end of weekend, suggest the event fall on the depart date
  if (isSunday(date) || isMonday(date)) {
    return {
      arrive: previousFriday(date),
      depart: date,
    };
  }

  // If close to start of weekend, make it a long weekend
  if (isThursday(date) || isFriday(date) || isSaturday(date)) {
    return {
      arrive: date,
      depart: nextSunday(date),
    };
  }

  // If its Tues/Weds, suggest just an overnight trip
  return {
    arrive: date,
    depart: addDays(date, 1),
  };
}

export function getEventSuggestionForDate({
  name,
  date,
}: BaseEvent): PlannedEvent {
  const eventDate =
    typeof date === "string" ? new Date(date + "T00:00:00") : date;
  const { arrive, depart } = getArriveDepartSuggestionForDate(eventDate);

  return {
    name,
    arrive,
    depart,
    book: sixMonthsOutBookDateTime(arrive),
    id: createUuid(),
  };
}

/**
 * For a date range, return a list of events based on desired density.
 */
export function getEventFillForDateRange({
  minFillGapWeeks,
  maxDate: _initialMaxDate,
  minDate,
  requireFillGapFromMinDate = false,
  requireFillGapFromMaxDate = false,
}: {
  minFillGapWeeks: number;
  minDate: Date;
  maxDate: Date;
  requireFillGapFromMinDate?: boolean;
  requireFillGapFromMaxDate?: boolean;
}): PlannedEvents {
  // Find the first standard camping arrival day to start iterating from
  let dateIterator =
    isFriday(minDate) || isSaturday(minDate) ? minDate : nextFriday(minDate);

  if (requireFillGapFromMinDate) {
    dateIterator = addWeeks(dateIterator, minFillGapWeeks);
  }

  let maxDate = _initialMaxDate;
  if (requireFillGapFromMaxDate) {
    maxDate = subWeeks(maxDate, minFillGapWeeks);
  }

  // Don't try filling if there isn't enough of a gap
  if (differenceInCalendarWeeks(maxDate, dateIterator) < minFillGapWeeks) {
    return [];
  }

  const events = [];
  while (isBefore(dateIterator, maxDate)) {
    const upcomingFriday = isFriday(dateIterator)
      ? dateIterator
      : nextFriday(dateIterator);

    const event = getEventSuggestionForDate({
      name: "Camping Trip",
      date: upcomingFriday,
    });
    events.push(event);

    dateIterator = addWeeks(event.arrive, minFillGapWeeks);
  }
  return events;
}

/**
 * For a list of events, fill in additional events based on desired
 * gapping / density.
 */
export function getEventFillAroundEvents({
  initialEvents,
  maxDate,
  minDate,
  minFillGapWeeks,
}: {
  initialEvents: PlannedEvents;
  minDate: Date;
  maxDate: Date;
  minFillGapWeeks: number;
}): PlannedEvents {
  if (!initialEvents.length) {
    return getEventFillForDateRange({
      minDate,
      maxDate,
      minFillGapWeeks,
    });
  }

  let filledEvents: PlannedEvents = [];

  initialEvents.forEach((initialEvent, index) => {
    const latestFilledEvent = filledEvents[filledEvents.length - 1];
    const min = latestFilledEvent?.arrive ?? minDate;

    // Clamp to either the event arrival or max date
    const max = isBefore(initialEvent.arrive, maxDate)
      ? initialEvent.arrive
      : maxDate;

    const fill = getEventFillForDateRange({
      minDate: min,
      maxDate: max,
      minFillGapWeeks,
      // Make sure we leave
      requireFillGapFromMinDate: index > 0,
      requireFillGapFromMaxDate: true,
    });

    filledEvents = filledEvents.concat(fill);
    filledEvents.push(initialEvent);
  });

  const lastEvent = initialEvents[initialEvents.length - 1];

  // If we can possibly fill, do it
  if (isBefore(lastEvent.arrive, maxDate)) {
    const postLastEventFill = getEventFillForDateRange({
      minDate: lastEvent.arrive,
      maxDate: maxDate,
      minFillGapWeeks,
      requireFillGapFromMinDate: true,
    });

    filledEvents = filledEvents.concat(postLastEventFill);
  }

  return filledEvents;
}
