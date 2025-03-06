import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import "@/application/styles/index.css";

window.scrollTo = vi.fn(() => undefined);
window.HTMLElement.prototype.scrollIntoView = vi.fn();

document.body.id = "egr-root"; // Imported styles are scope to the identifier.

const toastPortalTarget = document.createElement("div");
toastPortalTarget.id = "egr-toast";
document.body.appendChild(toastPortalTarget);

// Explicitly invoke cleanup when vitest globals are disabled to ensure
// the DOM is reset between tests. Without this, state can persist across
// tests, leading to unexpected behavior. Related issues and discussion:
// https://github.com/vitest-dev/vitest/issues/1430
// https://github.com/testing-library/react-testing-library/blob/main/src/index.js
afterEach(cleanup);

/**
 * The jsdom library does not provide an actual `ToggleEvent` implementation
 * (yet). To make the events for certain HTML elements like `<details>` work,
 * this adds a custom class that implements the standardized interface. Though,
 * notice that due to this interface, the state properties are not as strongly
 * typed as they could be (i.e. plain `string`s instead of constant unions).
 */
class ToggleEvent extends Event {
  public readonly newState: string;
  public readonly oldState: string;

  constructor(type: string, eventInitDict: ToggleEventInit = {}) {
    const { newState, oldState, ...plainEventInitDict } = eventInitDict;
    super(type, plainEventInitDict);
    this.newState = newState ?? "";
    this.oldState = oldState ?? "";
  }
}

global.ToggleEvent = ToggleEvent;
