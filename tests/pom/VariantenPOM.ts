import { Locator, Page } from "@playwright/test";

export class VariantenPOM {
  readonly page: Page;

  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole("heading", {
      name: "Elterngeldvarianten",
      exact: true,
    });
  }

  async submit() {
    await this.page
      .getByRole("button", { name: "Zum Monatsplaner", exact: true })
      .click();
  }
}
