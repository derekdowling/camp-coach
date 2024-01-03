import {
  isSunday,
  isMonday,
  previousFriday,
  isThursday,
  isFriday,
  isSaturday,
  subDays,
  nextSunday,
  addDays,
} from "date-fns";
import { PlannedEvent } from "./event-utils";
import { sixMonthsOutBookDateTime } from "./date-utils";
import { createUuid } from "./uuid";

export type Holiday = { name: string; dateString: string };

const HOLIDAYS: Array<Holiday> = [
  {
    name: "New Year's Camping Trip",
    dateString: "2024-01-01",
  },
  {
    name: "MLK Day Camping Trip",
    dateString: "2024-01-15",
  },
  {
    name: "Presidents' Day Camping Trip",
    dateString: "2024-02-19",
  },
  {
    name: "Memorial Day Camping Trip",
    dateString: "2024-05-27",
  },
  {
    name: "Independence Day Camping Trip",
    dateString: "2024-07-04",
  },
  {
    name: "Labor Day Camping Trip",
    dateString: "2024-09-02",
  },
  {
    name: "Columbus Day Camping Trip",
    dateString: "2024-10-14",
  },
  {
    name: "Veterans Day Camping Trip",
    dateString: "2024-11-11",
  },
  {
    name: "Thanksgiving Camping Trip",
    dateString: "2024-11-28",
  },
  {
    name: "Christmas Camping Trip",
    dateString: "2024-12-25",
  },
];

export const DEFAULT_HOLIDAY_EVENTS = HOLIDAYS.map((h) =>
  getEventSuggestionForHoliday(h)
);

export function getArriveDepartSuggestionForHoliday(holiday: Date): {
  arrive: Date;
  depart: Date;
} {
  // If close to end of weekend, suggest the event fall on the depart date
  if (isSunday(holiday) || isMonday(holiday)) {
    return {
      arrive: previousFriday(holiday),
      depart: holiday,
    };
  }

  // If close to start of weekend, make it a long weekend
  if (isThursday(holiday) || isFriday(holiday) || isSaturday(holiday)) {
    return {
      arrive: subDays(holiday, 1),
      depart: nextSunday(holiday),
    };
  }

  // If its Tues/Weds, suggest just an overnight trip
  return {
    arrive: holiday,
    depart: addDays(holiday, 1),
  };
}

export function getEventSuggestionForHoliday({
  name,
  dateString: date,
}: Holiday): PlannedEvent {
  const eventDate = new Date(date + "T00:00:00");
  const { arrive, depart } = getArriveDepartSuggestionForHoliday(eventDate);

  return {
    name,
    arrive,
    depart,
    book: sixMonthsOutBookDateTime(arrive),
    id: createUuid(),
  };
}
