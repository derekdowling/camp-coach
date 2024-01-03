import { Stack, TextInput, Button } from "@mantine/core";
import { DatePickerInput, DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { addDays, addYears, differenceInDays } from "date-fns";
import { FC } from "react";
import { PlannedEvent, createUuid } from "../../../../../../utils";

function getDefaultBookDateTime(): Date {
  const date = new Date();
  date.setHours(8);
  date.setMinutes(0);
  return date;
}

type NewEventModalForm = {
  onSubmit: (event: PlannedEvent) => void;
};

type FormFields = {
  name: string;
  stay: Date[];
  depart: Date;
  book: Date;
};

export const NewEventModalForm: FC<NewEventModalForm> = ({ onSubmit }) => {
  const form = useForm<FormFields>({
    initialValues: {
      name: "",
      stay: [addDays(new Date(), 1), addDays(new Date(), 2)],
      depart: new Date(),
      book: getDefaultBookDateTime(),
    },

    validate: {
      name: (value) => (value.length > 0 ? null : "Required"),
      stay: ([arrive, depart]) => {
        if (differenceInDays(arrive, depart) === 0) {
          return "Cannot depart and arrive on same day";
        }

        if (arrive.getTime() >= depart.getTime()) {
          return "Arrival is after departure";
        }

        return null;
      },
      book: (book, values) => {
        if (differenceInDays(book, values.stay[0]) === 0) {
          return "Cannot book and arrive on the same day";
        }

        if (book.getTime() > values.stay[0].getTime()) {
          return "Booking is after arrival";
        }

        return null;
      },
    },
  });

  const submitHandler = (fields: FormFields) => {
    onSubmit({
      arrive: fields.stay[0],
      depart: fields.stay[1],
      book: fields.book,
      name: fields.name,
      id: createUuid(),
    });
  };

  return (
    <Stack>
      <form onSubmit={form.onSubmit(submitHandler)}>
        <TextInput
          label="Event Name"
          placeholder="New Event..."
          {...form.getInputProps("name")}
        />
        <DatePickerInput
          type="range"
          label="Stay Length"
          minDate={addDays(new Date(), 1)}
          maxDate={addYears(new Date(), 1)}
          defaultDate={addDays(new Date(), 1)}
          {...form.getInputProps("trip")}
        />
        <DateTimePicker
          label="Book On"
          minDate={new Date()}
          maxDate={addYears(new Date(), 1)}
          {...form.getInputProps("book")}
        />
        <Button type="submit" mt="sm">
          Create
        </Button>
      </form>
    </Stack>
  );
};
