import { FC } from "react";
import { PlannedEvent, PlannedEvents } from "../../../../../utils";
import { Chip, Group } from "@mantine/core";

type EventSelectorProps = {
  events: PlannedEvents;
  removedEventIds: Set<string>;
  onChange: (event: PlannedEvent, selected: boolean) => void;
};

export const EventsSelector: FC<EventSelectorProps> = ({
  onChange,
  removedEventIds,
  events,
}) => {
  const chips = events.map((event, index) => {
    const removed = removedEventIds.has(event.id);
    return (
      <Chip
        key={index}
        checked={removed === false}
        onChange={() => {
          onChange(event, !removed);
        }}
      >
        {event.name.split('Camping Trip')[0]}
      </Chip>
    );
  });

  return (
    <Chip.Group multiple>
      <Group justify="center">{chips}</Group>
    </Chip.Group>
  );
};
