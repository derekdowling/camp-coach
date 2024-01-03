import { FC, useState } from "react";
import { PlannedEvent, PlannedEvents } from "../../../utils";
import { compareAsc } from "date-fns";
import { EventManager as EventManager } from "./EventManager";
import { Wizard } from "./Wizard";

export const EventPlanner: FC = () => {
  const [events, setEvents] = useState<PlannedEvents>([]);

  const addEvent = (event: PlannedEvent) => {
    setEvents((existingEvents) => {
      return [...existingEvents, event].sort((a, b) =>
        compareAsc(a.arrive, b.arrive)
      );
    });
  };

  const addEvents = (newEvents: PlannedEvents) => {
    setEvents((existingEvents) => {
      return [...existingEvents, ...newEvents].sort((a, b) =>
        compareAsc(a.arrive, b.arrive)
      );
    });
  };

  const changeEvent = (changedEvent: PlannedEvent) => {
    setEvents((existingEvents) => {
      const existingEventIndex = existingEvents.findIndex(
        (e) => e.id === changedEvent.id
      );
      if (existingEventIndex === -1) {
        return existingEvents;
      }

      const copy = [...existingEvents];
      copy.splice(existingEventIndex, 1, changedEvent);

      return copy;
    });
  };

  const removeEvent = (removedEvent: PlannedEvent) => {
    setEvents((existingEvents) => {
      const removedEventIndex = existingEvents.findIndex(
        (e) => e.id === removedEvent.id
      );

      if (removedEventIndex === -1) {
        return existingEvents;
      }

      const copy = [...existingEvents];
      copy.splice(removedEventIndex, 1);
      return copy;
    });
  };

  if (events.length === 0) {
    return <Wizard addEvents={addEvents} />;
  }

  return (
    <EventManager
      events={events}
      addEvent={addEvent}
      removeEvent={removeEvent}
      changeEvent={changeEvent}
    />
  );
};
