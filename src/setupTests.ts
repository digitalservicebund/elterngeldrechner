// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { setupCalculation } from "./globals/js/calculations/setup-calculation";
import { ReactNode } from "react";

// Preferences for calculations.
setupCalculation();
jest.setTimeout(10000);

// mock window.scrollTo
window.scrollTo = jest.fn();

// mock only createPortal function of imported react-dom library
jest.mock("react-dom", () => {
  const actual = jest.requireActual("react-dom");

  return {
    ...actual,
    createPortal: (element: ReactNode) => element,
  };
});
/**
 * Some test should be skipped on ci server.
 *
 * For example: We can't call the BMF Steuerrechner,
 * because external calls are forbidden on CI environment.
 */
export const describeSkipOnCi =
  process.env.CI === "true" ? describe.skip : describe;
