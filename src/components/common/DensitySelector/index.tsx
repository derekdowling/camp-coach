import { Stack, Slider, Text } from "@mantine/core";
import { FC } from "react";

type DensitySelectorProps = {
  gapInWeeks: number;
  onChange: (weeks: number) => void;
};

export const DensitySelector: FC<DensitySelectorProps> = ({
  gapInWeeks,
  onChange,
}) => {
  const text =
    gapInWeeks === 1
      ? "I want to camp every week"
      : `I want to camp every ${gapInWeeks} weeks`;

  return (
    <Stack pb={10}>
      <Text size="sm">{text}</Text>
      <Slider
        value={gapInWeeks}
        min={1}
        max={6}
        step={1}
        label={gapInWeeks}
        marks={[
          { label: "1", value: 1 },
          { label: "2", value: 2 },
          { label: "3", value: 3 },
          { label: "4", value: 4 },
          { label: "5", value: 5 },
          { label: "6", value: 6 },
        ]}
        onChange={onChange}
      />
    </Stack>
  );
};
