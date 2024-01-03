import { FC } from "react";
import { Group, Paper, Stack, Text } from "@mantine/core";
import { EventStats } from "../../../utils/stats";

type EventsStatsProps = {
  stats: EventStats;
};

export const EventsStats: FC<EventsStatsProps> = ({ stats }) => {
  return (
    <Group>
      {stats.map((stat) => (
        <Paper withBorder radius="lg" p="lg" key={stat.label}>
          <Stack gap="xs" align="center">
            <Text size="lg" fw="700">
              {stat.label}
            </Text>
            <Text fw="500">{stat.value}</Text>
          </Stack>
        </Paper>
      ))}
    </Group>
  );
};
