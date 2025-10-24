import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { App } from "./App";
import store from "./redux";

import { setupUserTracking } from "./user-tracking";

document.addEventListener("DOMContentLoaded", function () {
  const rootDiv = document.getElementById("egr-root");
  if (!rootDiv) return;

  createRoot(rootDiv).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>,
  );

  void setupUserTracking();
});
