import { type PlannedEvents } from "../event-utils";
import {
  addMonths,
  compareAsc as isBefore,
  isFriday,
  isMonday,
  subMonths,
} from "date-fns";

export function upcomingBookings(
  bookings: PlannedEvents,
  minDate: Date
): PlannedEvents {
  return bookings.filter(({ book }) => {
    return isBefore(book, minDate);
  });
}

/**
 * @returns a date string like "Sunday, June 30, 2024"
 */
export function humanDateLong(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * @returns a date string like "Wed, Jul 3"
 */
export function humanDateShort(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function sixMonthsOutBookDateTime(firstDay: Date): Date {
  const bookDate = subMonths(firstDay, 6);
  // Assume booking is at 8:00am
  bookDate.setHours(8);
  return bookDate;
}

export function sixMonthsFromNow(): Date {
  return addMonths(new Date(), 6);
}

export function isLongWeekend(holiday: Date): boolean {
  return isFriday(holiday) || isMonday(holiday);
}
