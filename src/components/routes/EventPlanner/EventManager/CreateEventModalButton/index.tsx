import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCalendarPlus } from "@tabler/icons-react";
import { FC } from "react";
import { NewEventModalForm } from "./CreateEventModalForm";
import { PlannedEvent } from "../../../../../utils";

type CreateEventModalButtonProps = {
  onCreated: (event: PlannedEvent) => void;
};

export const CreateEventModalButton: FC<CreateEventModalButtonProps> = ({
  onCreated,
}) => {
  const [opened, { open, close }] = useDisclosure();

  return (
    <>
      <Button
        variant="outline"
        onClick={open}
        leftSection={<IconCalendarPlus size={14} />}
      >
        Add Event
      </Button>
      <Modal
        opened={opened}
        onClose={close}
        title="Create A New Event"
        centered
      >
        <NewEventModalForm
          onSubmit={(event) => {
            close();
            onCreated(event);
          }}
        />
      </Modal>
    </>
  );
};
