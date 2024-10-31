import { afterEach, describe, vi } from "vitest";

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { setupCalculation } from "./globals/js/calculations/setup-calculation";

setupCalculation();

window.scrollTo = vi.fn(() => undefined);
window.HTMLElement.prototype.scrollIntoView = vi.fn();

const toastPortalTarget = document.createElement("div");
toastPortalTarget.id = "egr-toast";
document.body.appendChild(toastPortalTarget);

// Explicitly invoke cleanup when vitest globals are disabled to ensure
// the DOM is reset between tests. Without this, state can persist across
// tests, leading to unexpected behavior.
// Related issues and discussion:
// https://github.com/vitest-dev/vitest/issues/1430
// https://github.com/testing-library/react-testing-library/blob/main/src/index.js
afterEach(cleanup);

/**
 * Some test should be skipped on ci server.
 *
 * For example: We can't call the BMF Steuerrechner,
 * because external calls are forbidden on CI environment.
 */
export const describeSkipOnCi =
  import.meta.env.CI === "true" ? describe.skip : describe;
