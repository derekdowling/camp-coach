import { AppShell } from "@mantine/core";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import { TopNav } from "../../common/TopNav";

export const AppRoot: FC = () => {
  return (
    <AppShell withBorder={false} header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <TopNav />
      </AppShell.Header>
      <Outlet />
    </AppShell>
  );
};
