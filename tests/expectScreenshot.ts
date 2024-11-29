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
    // without timeout it produces blank screenshots
    // https://github.com/microsoft/playwright/issues/21657
    await page.waitForTimeout(2000);
    await expect
      .soft(locator)
      .toHaveScreenshot(`${name}${screenSize ? `-${screenSize}` : ""}.png`, {
        stylePath: path.join(import.meta.dirname, "screenshot.css"),
      });
  };
}
