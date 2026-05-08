import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { App } from "./App";
import store from "./redux";
import posthog from "posthog-js";

import { setupUserTracking } from "./user-tracking";

import { PostHogProvider } from "@posthog/react";

document.addEventListener("DOMContentLoaded", function () {
  const rootDiv = document.getElementById("egr-root");
  if (!rootDiv) return;

  createRoot(rootDiv).render(
    <StrictMode>
      <PostHogProvider client={posthog}>
        <Provider store={store}>
          <App />
        </Provider>
      </PostHogProvider>
    </StrictMode>,
  );

  void setupUserTracking();
});
