import { Locator, Page } from "@playwright/test";

export class AllgemeineAngabenPOM {
  readonly page: Page;

  readonly heading: Locator;

  readonly elternteile: Locator;
  readonly elternteileFuerBeide: Locator;
  readonly elternteileFuerEinen: Locator;
  readonly elternteileError: Locator;

  readonly alleinerziehend: Locator;
  readonly alleinerziehendJa: Locator;
  readonly alleinerziehendNein: Locator;
  readonly alleinerziehendError: Locator;

  readonly mutterschaftsleistungen: Locator;
  readonly mutterschaftsleistungenJa: Locator;
  readonly mutterschaftsleistungenNein: Locator;
  readonly mutterschaftsleistungenError: Locator;

  readonly mutterschaftsleistungenWer: Locator;
  readonly mutterschaftsleistungenWerError: Locator;

  readonly nameElternteil1: Locator;
  readonly nameElternteil2: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole("heading", { name: "Allgemeine Angaben" });

    this.elternteile = page.getByLabel("Eltern", { exact: true });
    this.elternteileFuerBeide = this.elternteile.getByText("Für beide");
    this.elternteileFuerEinen = this.elternteile.getByText(
      "Für einen Elternteil",
    );
    this.elternteileError = this.elternteile.getByText(
      "Dieses Feld ist erforderlich",
    );

    this.alleinerziehend = page.getByLabel("Alleinerziehendenstatus");
    this.alleinerziehendJa = this.alleinerziehend.getByText("Ja");
    this.alleinerziehendNein = this.alleinerziehend.getByText("Nein");
    this.alleinerziehendError = this.alleinerziehend.getByText(
      "Dieses Feld ist erforderlich",
    );

    this.mutterschaftsleistungen = page.getByLabel("Mutterschaftsleistungen");
    this.mutterschaftsleistungenJa =
      this.mutterschaftsleistungen.getByText("Ja");
    this.mutterschaftsleistungenNein =
      this.mutterschaftsleistungen.getByText("Nein");
    this.mutterschaftsleistungenError = this.mutterschaftsleistungen.getByText(
      "Dieses Feld ist erforderlich",
    );

    this.mutterschaftsleistungenWer = page.locator("section").filter({
      hasText: "Welcher Elternteil bezieht Mutterschaftsleistungen?",
    });
    this.mutterschaftsleistungenWerError =
      this.mutterschaftsleistungenWer.getByText("Dieses Feld ist erforderlich");

    this.nameElternteil1 = page.getByLabel("Name für Elternteil 1");
    this.nameElternteil2 = page.getByLabel("Name für Elternteil 2");
  }

  async goto() {
    await this.page.goto("./");
    return this;
  }

  async setElternteile(value: 1 | 2) {
    value === 1
      ? await this.elternteileFuerEinen.click()
      : await this.elternteileFuerBeide.click();
    return this;
  }

  async setNameElternteil1(value: string) {
    await this.nameElternteil1.fill(value);
    return this;
  }

  async setNameElternteil2(value: string) {
    await this.nameElternteil2.fill(value);
    return this;
  }

  async setAlleinerziehend(value: boolean) {
    value
      ? await this.alleinerziehendJa.click()
      : await this.alleinerziehendNein.click();
    return this;
  }

  async setMutterschaftsleistungen(value: boolean) {
    value
      ? await this.mutterschaftsleistungenJa.click()
      : await this.mutterschaftsleistungenNein.click();
    return this;
  }

  async setMutterschaftsleistungenWer(value: string) {
    await this.mutterschaftsleistungenWer
      .getByText(value, { exact: true })
      .click();
    return this;
  }

  async submit() {
    await this.page
      .getByRole("button", { name: "Weiter", exact: true })
      .click();
  }
}
