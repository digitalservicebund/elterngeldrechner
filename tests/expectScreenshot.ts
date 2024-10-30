import path from "node:path";
import { expect, Locator, Page } from "@playwright/test";

type Opts = {
  page: Page;
  screenSize?: string;
};

export default function expectScreenshot(opts: Opts) {
  const { page, screenSize } = opts;

  return async function screenshot(name: string, locator?: Locator) {
    if (!locator) locator = page.getByTestId(name);
    await expect(locator).toHaveScreenshot(
      `${name}${screenSize ? `-${screenSize}` : ""}.png`,
      {
        stylePath: path.join(import.meta.dirname, "screenshot.css"),
      },
    );
  };
}
