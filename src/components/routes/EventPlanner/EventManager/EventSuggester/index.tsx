import { FC, useState } from "react";
import {
  PlannedEvent,
  PlannedEvents,
  humanDateShort,
} from "../../../../../utils";
import {
  Button,
  Paper,
  Group,
  Stack,
  Text,
  Title,
  ScrollArea,
} from "@mantine/core";
import { DensitySelector } from "../../../../common/DensitySelector";
import { getEventFillAroundEvents } from "../../../../../utils/suggestions";
import { addYears } from "date-fns";

type EventSuggesterProps = {
  events: PlannedEvents;
  onRecommendationClick: (event: PlannedEvent) => void;
};

const DEFAULT_SUGGESTED_EVENT_WEEK_GAP = 2;

export const EventSuggester: FC<EventSuggesterProps> = ({
  events,
  onRecommendationClick,
}) => {
  const [minFillGapWeeks, setMinFillGapInWeeks] = useState(
    DEFAULT_SUGGESTED_EVENT_WEEK_GAP
  );

  // TODO: add UI to set min / max dates
  const eventsWithFill = getEventFillAroundEvents({
    initialEvents: events,
    minFillGapWeeks,
    minDate: new Date(),
    maxDate: addYears(new Date(), 1),
  });

  const onlySuggestionEvents = eventsWithFill.filter(
    (ewf) => !events.find((e) => e.id === ewf.id)
  );

  const suggestions = onlySuggestionEvents.map((suggestion, index) => (
    <Paper withBorder key={index}>
      <Group justify="space-between" p="sm">
        <Stack justify="center" align="start" gap={2}>
          <div>
            <Text>Arrive: {humanDateShort(suggestion.arrive)}</Text>
          </div>
          <div>
            <Text>Depart: {humanDateShort(suggestion.depart)}</Text>
          </div>
        </Stack>
        <Button
          onClick={() => onRecommendationClick(suggestion)}
          variant="default"
        >
          Add
        </Button>
      </Group>
    </Paper>
  ));

  return (
    <Stack h="100%" w="25%" style={{ flexGrow: 0 }}>
      <Title order={2}>Event Suggestions</Title>
      <DensitySelector
        gapInWeeks={minFillGapWeeks}
        onChange={setMinFillGapInWeeks}
      />
      <ScrollArea type="hover" scrollbars="y">
        <Stack gap={6}>
          {suggestions.length > 0 ? suggestions : <p>No suggestions.</p>}
        </Stack>
      </ScrollArea>
    </Stack>
  );
};
