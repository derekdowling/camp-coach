import { FC } from "react";
import { PlannedEvent, PlannedEvents } from "../../../../../utils";
import { EventTableRow } from "./EventTableRow";
import { Table } from "@mantine/core";

type EventTableProps = {
  events: PlannedEvents;
  onEventChange: (event: PlannedEvent) => void;
  onEventRemove: (event: PlannedEvent) => void;
};

export const EventTable: FC<EventTableProps> = ({
  events,
  onEventChange,
  onEventRemove,
}) => {
  return (
    <Table highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Event</Table.Th>
          <Table.Th>Book</Table.Th>
          <Table.Th>Stay</Table.Th>
          <Table.Th>Nights</Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {events.map((event, index) => (
          <Table.Tr key={event.id}>
            <EventTableRow
              key={index}
              event={event}
              onChange={onEventChange}
              onRemove={() => onEventRemove(event)}
            />
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};
