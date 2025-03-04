import { Locator, Page } from "@playwright/test";

export class AllgemeineAngabenPOM {
  readonly page: Page;
  readonly heading: Locator;

  readonly alleinerziehend: Locator;
  readonly alleinerziehendError: Locator;

  readonly elternteile: Locator;
  readonly elternteileError: Locator;

  readonly pseudonyme: Locator;

  readonly mutterschaftsleistungen: Locator;
  readonly mutterschaftsleistungenError: Locator;

  readonly mutterschaftsleistungenWer: Locator;
  readonly mutterschaftsleistungenWerError: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole("heading", { name: "Allgemeine Angaben" });

    this.alleinerziehend = page.getByRole("radiogroup", {
      name: "Sind Sie alleinerziehend oder erziehen Sie das Kind mit jemandem zusammen?",
    });

    this.alleinerziehendError = this.alleinerziehend.getByText(
      "Dieses Feld ist erforderlich",
    );

    this.elternteile = page.getByRole("radiogroup", {
      name: "Möchten Sie das Elterngeld für einen Elternteil oder zwei Elternteile berechnen?",
    });

    this.elternteileError = this.elternteile.getByText(
      "Dieses Feld ist erforderlich",
    );

    this.pseudonyme = page.getByLabel("Ihre Namen (optional)");

    this.mutterschaftsleistungen = page.getByRole("radiogroup", {
      name: "Sind Sie im Mutterschutz oder werden Sie im Mutterschutz sein?",
    });

    this.mutterschaftsleistungenError = this.mutterschaftsleistungen.getByText(
      "Dieses Feld ist erforderlich",
    );

    this.mutterschaftsleistungenWer = page.getByRole("radiogroup", {
      name: "Welcher Elternteil ist oder wird im Mutterschutz sein?",
    });

    this.mutterschaftsleistungenWerError =
      this.mutterschaftsleistungenWer.getByText("Dieses Feld ist erforderlich");
  }

  async goto() {
    await this.page.goto("./");
    return this;
  }

  async setAlleinerziehend(value: boolean) {
    const label = value ? "Alleinerziehende Person" : "Gemeinsam Erziehende";
    await this.alleinerziehend.getByRole("radio", { name: label }).click();
    return this;
  }

  async setElternteile(anzahl: 1 | 2) {
    let label: string;

    switch (anzahl) {
      case 1:
        label = "Für einen Elternteil";
        break;

      case 2:
        label = "Für zwei Elternteile";
        break;
    }

    await this.elternteile.getByRole("radio", { name: label }).click();
    return this;
  }

  async setNameElternteil1(value: string) {
    await this.pseudonyme
      .getByRole("textbox", { name: "Name für Elternteil 1" })
      .fill(value);

    return this;
  }

  async setNameElternteil2(value: string) {
    await this.pseudonyme
      .getByRole("textbox", { name: "Name für Elternteil 2" })
      .fill(value);

    return this;
  }

  async setMutterschaftsleistungen(value: boolean) {
    const label = value
      ? "Ja, ein Elternteil ist oder wird im Mutterschutz sein"
      : "Nein, kein Elternteil ist oder wird im Mutterschutz sein";

    await this.mutterschaftsleistungen
      .getByRole("radio", { name: label })
      .click();

    return this;
  }

  async setMutterschaftsleistungenWer(name: string) {
    const label = `${name} ist oder wird im Mutterschutz sein`;

    await this.mutterschaftsleistungenWer
      .getByRole("radio", { name: label })
      .click();

    return this;
  }

  async submit() {
    await this.page
      .getByRole("button", { name: "Weiter", exact: true })
      .click();
  }
}
