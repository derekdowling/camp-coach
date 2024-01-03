import { BaseEvent } from ".";
import { getEventSuggestionForDate } from "./suggestions";

const HOLIDAYS: Array<BaseEvent> = [
  {
    name: "New Year",
    date: "2024-01-01",
  },
  {
    name: "Martin Luther King Jr. Day",
    date: "2024-01-15",
  },
  {
    name: "Presidents' Day",
    date: "2024-02-19",
  },
  {
    name: "Memorial Day",
    date: "2024-05-27",
  },
  {
    name: "Independence Day",
    date: "2024-07-04",
  },
  {
    name: "Labor Day",
    date: "2024-09-02",
  },
  {
    name: "Columbus Day",
    date: "2024-10-14",
  },
  {
    name: "Veterans Day",
    date: "2024-11-11",
  },
  {
    name: "Thanksgiving",
    date: "2024-11-28",
  },
  {
    name: "Christmas Day",
    date: "2024-12-25",
  },
];

export const DEFAULT_HOLIDAY_EVENTS = HOLIDAYS.map((h) =>
  getEventSuggestionForDate(h)
);
