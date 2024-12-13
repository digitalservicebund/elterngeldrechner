import "@testing-library/jest-dom/vitest";
import failOnConsole from "jest-fail-on-console";
import { setupCalculation } from "./globals/js/calculations/setup-calculation";
import "@/styles/index.css";

setupCalculation();

window.scrollTo = vi.fn(() => undefined);
window.HTMLElement.prototype.scrollIntoView = vi.fn();

document.body.id = "egr-root"; // Imported styles are scope to the identifier.

const toastPortalTarget = document.createElement("div");
toastPortalTarget.id = "egr-toast";
document.body.appendChild(toastPortalTarget);

failOnConsole({
  shouldFailOnAssert: true,
  shouldFailOnDebug: true,
  shouldFailOnError: true,
  shouldFailOnInfo: true,
  shouldFailOnLog: true,
  shouldFailOnWarn: true,
});
