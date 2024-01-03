import {
  addWeeks,
  nextFriday,
  isFriday,
  nextSunday,
  isSaturday,
  isBefore,
  subWeeks,
  differenceInCalendarWeeks,
} from "date-fns";
import { PlannedEvent, PlannedEvents } from "../event-utils";
import { createUuid } from "../uuid";
import { sixMonthsOutBookDateTime } from "../date-utils";

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

    const newEvent: PlannedEvent = {
      name: "Camping Trip",
      arrive: upcomingFriday,
      depart: nextSunday(upcomingFriday),
      book: sixMonthsOutBookDateTime(upcomingFriday),
      id: createUuid(),
    };
    events.push(newEvent);
    dateIterator = addWeeks(newEvent.arrive, minFillGapWeeks);
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
