import { useState } from "react";
import { PlannedEvents, PlannedEvent, filterEventsToRange } from "../../utils";

type UseEventsProps = {
  events: PlannedEvents;
  minDate: Date;
  maxDate: Date;
};

type UseEvents = {
  selectEvent: (event: PlannedEvent) => void;
  unSelectEvent: (event: PlannedEvent) => void;
  selectedEvents: PlannedEvents;
  allEvents: PlannedEvents;
  removedEventIds: Set<string>;
};

export function useEventsSelector({
  events,
  minDate,
  maxDate,
}: UseEventsProps): UseEvents {
  const [removedEventIds, setRemovedEventIds] = useState<Set<string>>(
    new Set()
  );

  const inRangeEvents = filterEventsToRange({
    events,
    minDate,
    maxDate,
  });

  const selectedEvents = inRangeEvents.filter(
    (event) => !removedEventIds.has(event.id)
  );

  return {
    allEvents: inRangeEvents,
    selectedEvents,
    unSelectEvent: (event) => {
      setRemovedEventIds((existing) => {
        if (existing.has(event.id)) {
          return existing;
        }
        const copy = new Set(existing);
        copy.add(event.id);
        return copy;
      });
    },
    selectEvent: (event) => {
      setRemovedEventIds((existing) => {
        if (!existing.has(event.id)) {
          return existing;
        }
        const copy = new Set(existing);
        copy.delete(event.id);
        return copy;
      });
    },
    removedEventIds,
  };
}
