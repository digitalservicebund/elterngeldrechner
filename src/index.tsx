import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { App } from "./applications/App";
import store from "./redux";

import nsp from "./globals/js/namespace";
import reportWebVitals from "./reportWebVitals";
import { setupCalculation } from "./globals/js/calculations/setup-calculation";
import { setupUserTracking } from "./user-tracking";

document.addEventListener("DOMContentLoaded", function () {
  const rootDiv = document.getElementById(nsp("root"));
  if (!rootDiv) return;

  const elternGeldDigitalWizardUrl = rootDiv.dataset.elternGeldDigitalWizardUrl;

  createRoot(rootDiv).render(
    <StrictMode>
      <Provider store={store}>
        <App elternGeldDigitalWizardUrl={elternGeldDigitalWizardUrl} />
      </Provider>
      <div id={nsp("toast")} />
    </StrictMode>,
  );

  setupUserTracking();
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Preferences for calculations.
setupCalculation();
