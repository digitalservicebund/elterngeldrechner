import React from "react";
import ReactDOM from "react-dom";
import App from "./applications/App";
import { Provider } from "react-redux";
import store from "./redux";

import nsp from "./globals/js/namespace";
import reportWebVitals from "./reportWebVitals";
import { setupCalculation } from "./globals/js/calculations/setup-calculation";

document.addEventListener("DOMContentLoaded", function () {
  const rootDiv = document.getElementById(nsp("root"));
  const elternGeldDigitalWizardUrl =
    rootDiv?.dataset.elternGeldDigitalWizardUrl;

  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App elternGeldDigitalWizardUrl={elternGeldDigitalWizardUrl} />
      </Provider>
      <div id="egr-toast" />
    </React.StrictMode>,
    rootDiv,
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Preferences for calculations.
setupCalculation();
