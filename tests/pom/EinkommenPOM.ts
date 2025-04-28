import { Locator, Page } from "@playwright/test";

export class EinkommenPOM {
  readonly page: Page;

  readonly heading: Locator;
  readonly gesamteinkommenUeberschritten: Locator;
  readonly gesamteinkommenUeberschrittenJa: Locator;
  readonly gesamteinkommenUeberschrittenNein: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole("heading", {
      name: "Ihr Einkommen",
      exact: true,
    });

    this.gesamteinkommenUeberschritten = page.getByRole("radiogroup", {
      name: /ein Gesamteinkommen von/,
    });

    this.gesamteinkommenUeberschrittenJa =
      this.gesamteinkommenUeberschritten.getByRole("radio", { name: "Ja" });
    this.gesamteinkommenUeberschrittenNein =
      this.gesamteinkommenUeberschritten.getByRole("radio", { name: "Nein" });
  }

  async setGesamteinkommenUeberschritten(value: boolean) {
    if (value) {
      await this.gesamteinkommenUeberschrittenJa.click();
    } else {
      await this.gesamteinkommenUeberschrittenNein.click();
    }
    return this;
  }

  async submit() {
    await this.page
      .getByRole("button", { name: "Weiter", exact: true })
      .click();
    return this;
  }
}
