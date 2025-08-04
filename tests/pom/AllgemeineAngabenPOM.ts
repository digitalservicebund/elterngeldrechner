import { Locator, Page } from "@playwright/test";

export class AllgemeineAngabenPOM {
  readonly page: Page;
  readonly heading: Locator;

  readonly bundesland: Locator;

  readonly alleinerziehend: Locator;
  readonly alleinerziehendError: Locator;

  readonly elternteile: Locator;
  readonly elternteileError: Locator;

  readonly mutterschutz: Locator;
  readonly mutterschutzError: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole("heading", { name: "Allgemeine Angaben" });

    this.bundesland = page.getByLabel("bundesland");

    this.alleinerziehend = page.getByRole("radiogroup", {
      name: "Sind Sie alleinerziehend?",
    });

    this.alleinerziehendError = this.alleinerziehend.getByText(
      "Dieses Feld ist erforderlich",
    );

    this.elternteile = page.getByRole("radiogroup", {
      name: "Sollen beide Elternteile Elterngeld bekommen? Dann bekommen beide mehr und länger Elterngeld.",
    });

    this.elternteileError = this.elternteile.getByText(
      "Dieses Feld ist erforderlich",
    );

    this.mutterschutz = page.getByRole("radiogroup", {
      name: "Sind Sie im Mutterschutz oder werden Sie im Mutterschutz sein?",
      exact: true,
    });

    this.mutterschutzError = this.mutterschutz.getByText(
      "Dieses Feld ist erforderlich",
    );
  }

  async goto() {
    await this.page.goto("./");
    return this;
  }

  async setBundesland(value: string) {
    await this.bundesland.selectOption(value);
    return this;
  }

  async setAlleinerziehend(value: boolean) {
    const label = value ? "Ja" : "Nein";
    await this.alleinerziehend.getByRole("radio", { name: label }).click();
    return this;
  }

  async setElternteile(anzahl: 1 | 2) {
    let label: string;

    switch (anzahl) {
      case 1:
        label =
          "Nein, ein Elternteil kann oder möchte kein Elterngeld bekommen";
        break;

      case 2:
        label = "Ja, beide Elternteile sollen Elterngeld bekommen";
        break;
    }

    await this.elternteile.getByRole("radio", { name: label }).click();
    return this;
  }

  async setNameElternteil1(value: string) {
    await this.page
      .getByRole("textbox", { name: "Name für Elternteil 1" })
      .fill(value);

    return this;
  }

  async setNameElternteil2(value: string) {
    await this.page
      .getByRole("textbox", { name: "Name für Elternteil 2" })
      .fill(value);

    return this;
  }

  async setMutterschutz(nameOrValue: string | false) {
    const label = nameOrValue
      ? `Ja, ${nameOrValue} ist oder wird im Mutterschutz sein`
      : "Nein, kein Elternteil ist oder wird im Mutterschutz sein";

    await this.mutterschutz.getByRole("radio", { name: label }).click();

    return this;
  }

  async setMutterschutzFuerEinePerson(value: boolean) {
    const label = value
      ? "Ja, ich bin oder werde im Mutterschutz sein"
      : "Nein, ich bin nicht oder werde nicht im Mutterschutz sein";

    await this.mutterschutz.getByRole("radio", { name: label }).click();

    return this;
  }

  async submit() {
    await this.page
      .getByRole("button", { name: "Weiter", exact: true })
      .click();
  }
}
