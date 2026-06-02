import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { App } from "./App";
import store from "./redux";
import posthog from "posthog-js";

import { setupUserTracking } from "./user-tracking";

import { PostHogErrorBoundary, PostHogProvider } from "@posthog/react";

document.addEventListener("DOMContentLoaded", function () {
  const rootDiv = document.getElementById("egr-root");
  if (!rootDiv) return;

  // Stamp the deployed commit so the post-deployment smoke test can confirm
  // the freshly built bundle is the one actually running (see ADR 0009 on
  // why assets carry no content hash to distinguish versions by URL).
  rootDiv.setAttribute("data-build", import.meta.env.VITE_BUILD_VERSION);

  createRoot(rootDiv).render(
    <StrictMode>
      <PostHogProvider client={posthog}>
        <PostHogErrorBoundary>
          <Provider store={store}>
            <App />
          </Provider>
        </PostHogErrorBoundary>
      </PostHogProvider>
    </StrictMode>,
  );

  void setupUserTracking();
});
