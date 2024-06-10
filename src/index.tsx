import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import * as Sentry from "@sentry/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
Sentry.init({
  dsn: "https://504aa801388a744557a8b8d37bc42a87@o4506363546435584.ingest.sentry.io/4506363554299904",
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: [
        "localhost",
        /^https:\/\/hacom.sentry\.io\/api/,
      ],
    }),
    new Sentry.Replay(),
    new Sentry.BrowserProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <MantineProvider>
      <ModalsProvider>
        <Notifications position="top-center" autoClose={3000} />
        <App />
      </ModalsProvider>
    </MantineProvider>
  </React.StrictMode>
);
reportWebVitals();
