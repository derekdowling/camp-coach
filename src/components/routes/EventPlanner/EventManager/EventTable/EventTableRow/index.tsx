import { FC } from "react";
import { PlannedEvent } from "../../../../../../utils";
import { EventRowName } from "./EventRowName";
import { IconTrash } from "@tabler/icons-react";
import { ActionIcon, Table, Text } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { EventDateRangePickerButton } from "./EventDateRangeInput";
import { differenceInDays } from "date-fns";

type TableEventRowProps = {
  event: PlannedEvent;
  onChange: (event: PlannedEvent) => void;
  onRemove: () => void;
};

export const EventTableRow: FC<TableEventRowProps> = ({
  event,
  onChange,
  onRemove,
}) => {
  const onEventNameChange = (name: string) => {
    onChange({
      ...event,
      name,
    });
  };

  const removeClickHandler = () => {
    const remove = window.confirm(
      `Remove event "${event.name}" from your camping plan?`
    );

    if (remove) {
      onRemove();
    }
  };

  return (
    <>
      <Table.Td>
        <EventRowName name={event.name} onNameChange={onEventNameChange} />
      </Table.Td>
      <Table.Td>
        <DateTimePicker
          variant="unstyled"
          value={event.book}
          size="md"
          withSeconds={false}
          minDate={new Date()}
          onChange={(newDate) => {
            if (!newDate) {
              return;
            }
            onChange({ ...event, book: newDate });
          }}
        />
      </Table.Td>
      <Table.Td>
        <EventDateRangePickerButton
          arrive={event.arrive}
          depart={event.depart}
          onChange={({ arrive, depart }) => {
            onChange({ ...event, arrive, depart });
          }}
        />
      </Table.Td>
      <Table.Td>
        <Text>{differenceInDays(event.depart, event.arrive)}</Text>
      </Table.Td>
      <Table.Td>
        <ActionIcon
          onClick={removeClickHandler}
          variant="subtle"
          aria-label="Remove"
          color="gray"
        >
          <IconTrash />
        </ActionIcon>
      </Table.Td>
    </>
  );
};
