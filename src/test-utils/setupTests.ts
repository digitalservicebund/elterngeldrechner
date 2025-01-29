import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import "@/styles/index.css";

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
