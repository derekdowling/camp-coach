import { differenceInDays } from "date-fns";
import { PlannedEvents } from "../event-utils";

export type Stat = { label: string; value: number };

export type EventStats = Array<Stat>;

export function defaultStatsForEvents(events: PlannedEvents): EventStats {
  const totalTrips = events.length;

  let totalNights = 0;
  events.forEach(({ arrive, depart }) => {
    // Put the later (depart) date first to get a positive result
    totalNights += differenceInDays(depart, arrive);
  });

  return [
    { label: "Trips", value: events.length },
    { label: "Total Nights", value: totalNights },
    {
      label: "Nights / Trip",
      value:
        totalTrips > 0 ? parseFloat((totalNights / totalTrips).toFixed(1)) : 0,
    },
  ];
}
