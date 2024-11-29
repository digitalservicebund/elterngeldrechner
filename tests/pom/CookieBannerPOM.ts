import { Page } from "@playwright/test";

export class CookieBannerPOM {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  consent() {
    return this.page
      .getByRole("button")
      .getByText(/^\s*Einwilligen\s*$/)
      .click();
  }
}
