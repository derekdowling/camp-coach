import {
  AppShell,
  Button,
  Center,
  Container,
  Divider,
  Stack,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { FC, useState } from "react";
import { DensitySelector } from "../../../common/DensitySelector";
import { addYears } from "date-fns";
import { EventsStats } from "../../../common/PlanStats";
import { EventsSelector } from "./EventsSelector";
import { useEventsSelector } from "../../../../hooks/useEventsSelector";
import { DEFAULT_HOLIDAY_EVENTS } from "../../../../utils/holiday-events";
import { getEventFillAroundEvents } from "../../../../utils/suggestions";
import { defaultStatsForEvents } from "../../../../utils/stats";
import { PlannedEvents } from "../../../../utils";

function getDefaultMinDate(): Date {
  const date = new Date();

  // May 1
  date.setMonth(4);
  date.setDate(1);

  return date;
}

function getDefaultMaxDate(): Date {
  const date = new Date();

  // Oct 1
  date.setMonth(9);
  date.setDate(1);

  return date;
}

type WizardProps = {
  addEvents: (events: PlannedEvents) => void;
};

export const Wizard: FC<WizardProps> = ({ addEvents }) => {
  const today = useState(() => new Date())[0];
  const todayNextYear = useState(() => addYears(today, 1))[0];
  const [gapInWeeks, setGapInWeeks] = useState(2);
  const [minDate, setMinDate] = useState(getDefaultMinDate);
  const [maxDate, setMaxDate] = useState(getDefaultMaxDate);

  const {
    unSelectEvent,
    selectEvent,
    removedEventIds,
    selectedEvents,
    allEvents,
  } = useEventsSelector({
    events: DEFAULT_HOLIDAY_EVENTS,
    minDate,
    maxDate,
  });

  const allEventsWithFill = getEventFillAroundEvents({
    initialEvents: selectedEvents,
    minDate,
    maxDate,
    minFillGapWeeks: gapInWeeks,
  });

  const stats = defaultStatsForEvents(allEventsWithFill);

  return (
    <AppShell.Main>
      <Container>
        <Stack gap="xl">
          <DateInput
            label="I start camping around:"
            minDate={today}
            maxDate={maxDate}
            defaultDate={minDate}
            defaultValue={minDate}
            onChange={(date) => {
              if (date) {
                setMinDate(date);
              }
            }}
          />
          <DateInput
            label="I stop camping around:"
            minDate={minDate}
            maxDate={todayNextYear}
            defaultDate={maxDate}
            defaultValue={maxDate}
            onChange={(date) => {
              if (date) {
                setMaxDate(date);
              }
            }}
          />
          <DensitySelector gapInWeeks={gapInWeeks} onChange={setGapInWeeks} />
          <Divider label="I Want To Camp On" />
          <EventsSelector
            events={allEvents}
            removedEventIds={removedEventIds}
            onChange={(event, selected) => {
              if (!selected) {
                selectEvent(event);
              } else {
                unSelectEvent(event);
              }
            }}
          />
          <Divider label="Summary" />
          <Center>
            <EventsStats stats={stats} />
          </Center>
          <Button
            onClick={() => {
              addEvents(allEventsWithFill);
            }}
          >
            Create Plan
          </Button>
        </Stack>
      </Container>
    </AppShell.Main>
  );
};
