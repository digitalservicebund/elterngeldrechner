import { Locator, Page } from "@playwright/test";

export class VariantenPOM {
  readonly page: Page;

  readonly heading: Locator;
  readonly basiselterngeld: Locator;
  readonly elterngeldPlus: Locator;
  readonly partnerschaftsbonus: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole("heading", {
      name: "Elterngeldvarianten",
      exact: true,
    });

    this.basiselterngeld = page
      .locator("summary")
      .filter({ hasText: "Was ist Basiselterngeld?" });

    this.elterngeldPlus = page
      .locator("summary")
      .filter({ hasText: "Was ist ElterngeldPlus?" });

    this.partnerschaftsbonus = page
      .locator("summary")
      .filter({ hasText: "Was ist Partnerschaftsbonus?" });
  }

  async submit() {
    await this.page
      .getByRole("button", { name: "Zum Monatsplaner", exact: true })
      .click();
  }
}
