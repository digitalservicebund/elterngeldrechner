import { Locator, Page } from "@playwright/test";
import { POMOpts } from "./types";

export class ZusammenfassungPOM {
  readonly page: Page;
  readonly opts?: POMOpts;

  readonly heading: Locator;

  constructor(page: Page, opts?: POMOpts) {
    this.page = page;
    this.opts = opts;

    this.heading = page.getByRole("heading", {
      name: "Zusammenfassung",
      exact: true,
    });
  }

  async submit() {
    await this.page
      .getByRole("button", {
        name: "Daten in Elterngeldantrag übernehmen",
        exact: true,
      })
      .click();
  }

  async back() {
    await this.page
      .getByRole("button", { name: "Zurück", exact: true })
      .click();
  }
}
