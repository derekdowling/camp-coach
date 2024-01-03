import { FC } from "react";
import { PlannedEvents, createICALContentStr } from "../../../../../utils";
import { IconDownload } from "@tabler/icons-react";
import { Button } from "@mantine/core";

type DownloadCalButtonProps = {
  events: PlannedEvents;
};

export const DownloadCalButton: FC<DownloadCalButtonProps> = ({ events }) => {
  const downloadCalendar = () => {
    const calendarContent = createICALContentStr(
      `Camp Plan ${new Date().getFullYear()}`,
      events
    );

    const blob = new Blob([calendarContent], {
      type: "text/calendar;charset=utf-8;",
    });

    window.open(URL.createObjectURL(blob));
  };

  return (
    <Button
      onClick={downloadCalendar}
      variant="outline"
      leftSection={<IconDownload size={14} />}
    >
      Calender
    </Button>
  );
};
