import React from "react";
import ReactDOM from "react-dom/client";
import { EventPlanner } from "./routes/EventPlanner";
import {
  MantineColorsTuple,
  MantineProvider,
  createTheme,
} from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AppRoot } from "./routes/AppRoot";
import { LandingPage } from "./routes/LandingPage";

const root = document.getElementById("root")!;
const reactRoot = ReactDOM.createRoot(root);

const camping: MantineColorsTuple = [
  "#edf9ed",
  "#e3ebe1",
  "#cbd3c6",
  "#aebaa8",
  "#97a58f",
  "#88987f",
  "#7f9176",
  "#6d7e63",
  "#5f7156",
  "#506246",
];

const theme = createTheme({
  colors: {
    camping,
  },
  primaryColor: "camping",
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/app",
    element: <AppRoot />,
    children: [
      {
        index: true,
        element: <EventPlanner />,
      },
    ],
  },
]);

reactRoot.render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>
);
