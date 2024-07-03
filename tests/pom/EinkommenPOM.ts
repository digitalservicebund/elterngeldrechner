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

    const einkommenLimit = 200000;

    this.gesamteinkommenUeberschritten = page.locator("section").filter({
      hasText: `Hatten Sie im Kalenderjahr vor der Geburt ein Gesamteinkommen von mehr als ${einkommenLimit.toLocaleString()} Euro?`,
    });
    this.gesamteinkommenUeberschrittenJa =
      this.gesamteinkommenUeberschritten.getByText("Ja");
    this.gesamteinkommenUeberschrittenNein =
      this.gesamteinkommenUeberschritten.getByText("Nein");
  }

  async setGesamteinkommenUeberschritten(value: boolean) {
    value
      ? await this.gesamteinkommenUeberschrittenJa.click()
      : await this.gesamteinkommenUeberschrittenNein.click();
    return this;
  }

  async submit() {
    await this.page
      .getByRole("button", { name: "Weiter", exact: true })
      .click();
    return this;
  }
}
