import { AppShell, Flex, Group, Stack, Title } from "@mantine/core";
import { FC } from "react";
import { defaultStatsForEvents } from "../../../../utils/stats";
import { EventsStats } from "../../../common/PlanStats";
import { CreateEventModalButton } from "./CreateEventModalButton";
import { DownloadCalButton } from "./DownloadCalButton";
import { EventSuggester } from "./EventSuggester";
import { EventTable } from "./EventTable";
import { PlannedEvent, PlannedEvents } from "../../../../utils";

type EventManagerProps = {
  events: PlannedEvents;
  addEvent: (event: PlannedEvent) => void;
  removeEvent: (event: PlannedEvent) => void;
  changeEvent: (event: PlannedEvent) => void;
};

export const EventManager: FC<EventManagerProps> = ({
  events,
  addEvent,
  removeEvent,
  changeEvent,
}) => {
  return (
    <AppShell.Main>
      <Flex
        h="100%"
        style={{ overflow: "hidden" }}
        gap="xl"
        direction={{ base: "column", sm: "row" }}
      >
        <Stack w="75%">
          <Group justify="space-between">
            <Title order={1}>Your Camping Plan</Title>
            <Group>
              <CreateEventModalButton onCreated={addEvent} />
              <DownloadCalButton events={events} />
            </Group>
          </Group>
          <EventsStats stats={defaultStatsForEvents(events)} />
          <EventTable
            onEventRemove={removeEvent}
            onEventChange={changeEvent}
            events={events}
          />
        </Stack>
        <EventSuggester events={events} onRecommendationClick={addEvent} />
      </Flex>
    </AppShell.Main>
  );
};
