import { Button, Text } from "@mantine/core";
import { FC, useEffect, useRef, useState } from "react";
import useOnclickOutside from "react-cool-onclickoutside";

type EventRowNameProps = {
  name: string;
  onNameChange: (newTitle: string) => void;
};

export const EventRowName: FC<EventRowNameProps> = ({ name, onNameChange }) => {
  const [editing, setEditing] = useState(false);
  const onTitleClick = () => {
    setEditing(true);
  };

  if (!editing) {
    return (
      <Button variant="subtle" onClick={onTitleClick} color="dark">
        <Text>{name}</Text>
      </Button>
    );
  }

  return (
    <EventNameEditorInput
      name={name}
      onSubmit={(newName) => {
        onNameChange(newName);
        setEditing(false);
      }}
      onClose={() => setEditing(false)}
    />
  );
};

type EventNameEditorInputProps = {
  name: string;
  onClose: VoidFunction;
  onSubmit: (name: string) => void;
};

const EventNameEditorInput: FC<EventNameEditorInputProps> = ({
  name,
  onClose,
  onSubmit,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useOnclickOutside(onClose, { refs: [inputRef] });

  useEffect(() => {
    // Auto-focus the input so the user can immediately
    // begin typing / editing
    inputRef.current?.focus();
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      defaultValue={name}
      onKeyDown={(e) => {
        if (e.code === "Enter") {
          onSubmit(e.currentTarget.value);
        }

        if (e.code === "Escape") {
          onClose();
        }
      }}
    />
  );
};
