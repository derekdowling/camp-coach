import { Group, Text } from "@mantine/core";
import { FC } from "react";
import { humanDateLong, sixMonthsFromNow } from "../../../utils";
import { IconMountain } from "@tabler/icons-react";

export const TopNav: FC = () => {
  return (
    <Group
      h="100%"
      px="md"
      justify="space-between"
      styles={{ root: { backgroundColor: "rgb(252 211 77)" } }}
    >
      <Group gap={4}>
        <IconMountain size={30} />
        <Text size="lg" fw={700}>
          Camp Coach
        </Text>
      </Group>
      <Group align="start" gap={4}>
        <Text fw={700}>Book today for:</Text>
        <Text>{humanDateLong(sixMonthsFromNow())}!</Text>
      </Group>
    </Group>
  );
};
