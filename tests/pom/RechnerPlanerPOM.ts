import { Locator, Page } from "@playwright/test";
import { POMOpts } from "./types";

export class RechnerPlanerPOM {
  readonly page: Page;
  readonly opts?: POMOpts;

  readonly heading: Locator;

  constructor(page: Page, opts?: POMOpts) {
    this.page = page;
    this.opts = opts;

    this.heading = page.getByRole("heading", {
      name: "Monatsplaner",
      exact: true,
    });
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

  async gebeEinkommenAn(
    lebensmonatszahl: number,
    bruttoeinkommen: number,
    elternteil?: string,
  ): Promise<void> {
    await this.openLebensmonat(lebensmonatszahl);
    await this.expandAbschnittMitEinkommen();

    const label = elternteil
      ? `Bruttoeinkommen von ${elternteil} im ${lebensmonatszahl}. Lebensmonat`
      : `Bruttoeinkommen im ${lebensmonatszahl}. Lebensmonat`;
    const input = this.page.getByRole("combobox", { name: label });
    await input.fill(bruttoeinkommen.toString());
  }

  private async openLebensmonat(lebensmonatszahl: number): Promise<void> {
    const label = `${lebensmonatszahl}. Lebensmonat`;
    const details = this.page.getByRole("group", { name: label, exact: true });
    const isClosed = (await details.getAttribute("open")) === null;

    if (isClosed) {
      await details.click();
    }
  }

  private async expandAbschnittMitEinkommen(): Promise<void> {
    const button = this.page.getByRole("button", {
      name: "Bruttoeinkommen hinzufügen",
    });

    const isExpanded = JSON.parse(
      (await button.getAttribute("aria-expanded")) ?? "false",
    ) as boolean;

    if (!isExpanded) await button.click();
  }

  async zeigeMehrLebensmonateAn(): Promise<void> {
    await this.page
      .getByRole("button", { name: "mehr Monate anzeigen" })
      .click();
  }

  async submit() {
    await this.page
      .getByRole("button", { name: "Zur Zusammenfassung", exact: true })
      .click();
  }
}
