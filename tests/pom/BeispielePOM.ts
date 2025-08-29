import { Locator, Page } from "@playwright/test";

export class BeispielePOM {
  readonly page: Page;

  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole("heading", {
      name: "Wie stellen Sie sich Ihre Elternzeit ungefähr vor?",
      exact: true,
    });
  }

  async waehleOption(option: string): Promise<void> {
    await this.page.getByRole("radio", { name: option }).check();
  }

  async submit() {
    await this.page
      .getByRole("button", { name: "Weiter", exact: true })
      .click();
    return this;
  }
}
