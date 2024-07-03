import { Locator, Page } from "@playwright/test";
import { POMOpts } from "./types";

export class ErwerbstaetigkeitPOM {
  readonly page: Page;
  readonly opts: POMOpts;

  readonly heading: Locator;
  readonly erwerbstaetig?: Locator;
  readonly erwerbstaetigJa?: Locator;
  readonly erwerbstaetigNein?: Locator;
  readonly elternteil1Erwerbstaetig?: Locator;
  readonly elternteil1ErwerbstaetigJa?: Locator;
  readonly elternteil1ErwerbstaetigNein?: Locator;
  readonly elternteil2Erwerbstaetig?: Locator;
  readonly elternteil2ErwerbstaetigJa?: Locator;
  readonly elternteil2ErwerbstaetigNein?: Locator;

  constructor(page: Page, opts: POMOpts) {
    this.page = page;
    this.opts = opts;

    this.heading = page.getByRole("heading", {
      name: "Erwerbstätigkeit",
    });

    if (opts.elternteile) {
      this.elternteil1Erwerbstaetig = page.getByLabel(opts.elternteile[0]);
      this.elternteil1ErwerbstaetigJa =
        this.elternteil1Erwerbstaetig.getByText("Ja");
      this.elternteil1ErwerbstaetigNein =
        this.elternteil1Erwerbstaetig.getByText("Nein");

      this.elternteil2Erwerbstaetig = page.getByLabel(opts.elternteile[1]);
      this.elternteil2ErwerbstaetigJa =
        this.elternteil2Erwerbstaetig.getByText("Ja");
      this.elternteil2ErwerbstaetigNein =
        this.elternteil2Erwerbstaetig.getByText("Nein");
    } else {
      this.erwerbstaetig = page.locator("section").filter({
        hasText:
          "Waren Sie in den 12 Monaten vor der Geburt Ihres Kindes erwerbstätig?",
      });
      this.erwerbstaetigJa = this.erwerbstaetig.getByText("Ja");
      this.erwerbstaetigNein = this.erwerbstaetig.getByText("Nein");
    }
  }

  async setErwerbstaetig(value: boolean, elternteil?: 1 | 2) {
    if (!elternteil && this.erwerbstaetigJa && this.erwerbstaetigNein) {
      value
        ? await this.erwerbstaetigJa.click()
        : await this.erwerbstaetigNein.click();
    } else if (
      elternteil === 1 &&
      this.elternteil1ErwerbstaetigJa &&
      this.elternteil1ErwerbstaetigNein
    ) {
      value
        ? await this.elternteil1ErwerbstaetigJa.click()
        : await this.elternteil1ErwerbstaetigNein.click();
    } else if (
      elternteil === 2 &&
      this.elternteil2ErwerbstaetigJa &&
      this.elternteil2ErwerbstaetigNein
    ) {
      value
        ? await this.elternteil2ErwerbstaetigJa.click()
        : await this.elternteil2ErwerbstaetigNein.click();
    }
    return this;
  }

  async submit() {
    await this.page
      .getByRole("button", { name: "Weiter", exact: true })
      .click();
  }
}
