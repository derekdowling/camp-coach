import { FC, useState } from "react";
import { humanDateShort } from "../../../../../../../utils";
import { Popover, UnstyledButton } from "@mantine/core";
import { DatePicker, DatesRangeValue } from "@mantine/dates";

type EventDateRangeInputProps = {
  arrive: Date;
  depart: Date;
  onChange: (range: { arrive: Date; depart: Date }) => void;
};

export const EventDateRangePickerButton: FC<EventDateRangeInputProps> = ({
  arrive,
  depart,
  onChange,
}) => {
  const aYearFromNow = useState(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date;
  })[0];

  return (
    <Popover position="bottom" withArrow shadow="md">
      <Popover.Target>
        <UnstyledButton>
          {humanDateShort(arrive) + " -> " + humanDateShort(depart)}
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown>
        <DatePicker
          allowSingleDateInRange={false}
          type="range"
          defaultDate={arrive}
          minDate={new Date()}
          maxDate={aYearFromNow}
          defaultValue={[arrive, depart]}
          onChange={([newArrive, newDepart]: DatesRangeValue) => {
            // This case is hit when only the first value of a range has
            // been picked, in which case we wait for the follow up event
            // that contains both the arrive and depart selection before
            // we update
            if (!newArrive || !newDepart) {
              return;
            }

            onChange({
              arrive: newArrive,
              depart: newDepart,
            });
          }}
        />
      </Popover.Dropdown>
    </Popover>
  );
};
