import { Locator, Page } from "@playwright/test";
import { POMOpts } from "./types";

const keinEinkommenText =
  "Ich werde während des gesamten Elterngeldbezugs kein Einkommen beziehen";

export class RechnerPlanerPOM {
  readonly page: Page;
  readonly opts?: POMOpts;

  readonly heading: Locator;

  readonly elternteil1Rechner?: Locator;
  readonly elternteil1KeinEinkommen?: Locator;
  readonly elternteil1BerechnenButton?: Locator;

  readonly elternteil2Rechner?: Locator;
  readonly elternteil2KeinEinkommen?: Locator;
  readonly elternteil2BerechnenButton?: Locator;

  readonly keinEinkommen?: Locator;
  readonly berechnenButton?: Locator;

  constructor(page: Page, opts?: POMOpts) {
    this.page = page;
    this.opts = opts;

    this.heading = page.getByRole("heading", {
      name: "Rechner und Planer",
      exact: true,
    });

    if (opts?.elternteile) {
      this.elternteil1Rechner = page.getByLabel(opts.elternteile[0], {
        exact: true,
      });
      this.elternteil1KeinEinkommen =
        this.elternteil1Rechner.getByText(keinEinkommenText);
      this.elternteil1BerechnenButton = this.elternteil1Rechner.getByRole(
        "button",
        {
          name: "Elterngeld berechnen",
          exact: true,
        },
      );

      this.elternteil2Rechner = page.getByLabel(opts.elternteile[1], {
        exact: true,
      });
      this.elternteil2KeinEinkommen =
        this.elternteil2Rechner.getByText(keinEinkommenText);
      this.elternteil2BerechnenButton = this.elternteil2Rechner.getByRole(
        "button",
        {
          name: "Elterngeld berechnen",
          exact: true,
        },
      );
    } else {
      this.keinEinkommen = page.getByText(keinEinkommenText);
      this.berechnenButton = page.getByRole("button", {
        name: "Elterngeld berechnen",
        exact: true,
      });
    }
  }

  async setKeinEinkommen(elternteil?: 1 | 2) {
    if (!elternteil && this.keinEinkommen) {
      await this.keinEinkommen.click();
    } else if (elternteil === 1 && this.elternteil1KeinEinkommen) {
      await this.elternteil1KeinEinkommen.click();
    } else if (elternteil === 2 && this.elternteil2KeinEinkommen) {
      await this.elternteil2KeinEinkommen.click();
    }
    return this;
  }

  async waehleOption(
    lebensmonatszahl: number,
    option: "Basis" | "Plus" | "Bonus" | "kein Elterngeld",
    elternteil?: string,
  ): Promise<void> {
    await this.openLebensmonat(lebensmonatszahl);
    const fieldsetLabel = elternteil
      ? `Auswahl von ${elternteil} für den ${lebensmonatszahl}. Lebensmonat`
      : `Auswahl für den ${lebensmonatszahl}. Lebensmonat`;

    const fieldset = this.page.getByRole("radiogroup", {
      name: fieldsetLabel,
      exact: true,
    });

    // The radio button itself is hidden and can't be clicked. Though the radio
    // button would much easier/better to address with a locator. Notice there
    // are also the disabled hints.
    const label = fieldset.locator("label").filter({ hasText: option }).first();
    await label.click();
  }

  private async openLebensmonat(lebensmonatszahl: number): Promise<void> {
    const label = `${lebensmonatszahl}. Lebensmonat`;
    const details = this.page.getByRole("group", { name: label, exact: true });
    const isClosed = (await details.getAttribute("open")) === null;

    if (isClosed) {
      await details.click();
    }
  }

  async zeigeMehrLebensmonateAn(): Promise<void> {
    await this.page
      .getByRole("button", { name: "mehr Monate anzeigen" })
      .click();
  }

  async berechnen(elternteil?: 1 | 2) {
    if (!elternteil && this.berechnenButton) {
      await this.berechnenButton.click();
    } else if (elternteil === 1 && this.elternteil1BerechnenButton) {
      await this.elternteil1BerechnenButton.click();
    } else if (elternteil === 2 && this.elternteil2BerechnenButton) {
      await this.elternteil2BerechnenButton.click();
    }
    return this;
  }

  async getErgebnis(
    elternteil: 1 | 2,
    vonLebensMonat: number,
    bisLebensMonat: number,
    elterngeldType: "Basis" | "Plus" | "Bonus",
    total?: boolean,
  ) {
    return this.page.getByTestId(
      `result-${total ? "total-" : ""}ET${elternteil}-${vonLebensMonat}-${bisLebensMonat}-${elterngeldType}`,
    );
  }

  async submit() {
    await this.page
      .getByRole("button", { name: "Zur Übersicht", exact: true })
      .click();
  }
}
