import { Locator, Page } from "@playwright/test";

export class NachwuchsPOM {
  readonly page: Page;

  readonly heading: Locator;
  readonly geburtsdatum: Locator;
  readonly anzahlKinder: Locator;
  readonly anzahlKinderDecrease: Locator;
  readonly anzahlKinderIncrease: Locator;

  readonly erstesGeschwisterkindHinzufuegen: Locator;
  readonly weiteresGeschwisterkindHinzufuegen: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole("heading", { name: "Kinder", exact: true });
    this.geburtsdatum = page.getByLabel(
      "Wann wird oder wurde Ihr Kind voraussichtlich geboren?",
    );
    this.anzahlKinder = page.getByLabel(
      "Wie viele Kinder werden oder wurden geboren?",
    );
    this.anzahlKinderDecrease = page.getByLabel("verringern");
    this.anzahlKinderIncrease = page.getByLabel("erhöhen");

    this.erstesGeschwisterkindHinzufuegen = page.getByLabel(
      "Älteres Geschwisterkind hinzufügen",
    );
    this.weiteresGeschwisterkindHinzufuegen = page.getByLabel(
      "Weiteres Geschwisterkind hinzufügen",
    );
  }

  async setGeburtsdatum(value: string) {
    await this.geburtsdatum.fill(value);
    return this;
  }

  async setAnzahlKinder(value: number) {
    await this.anzahlKinder.fill(value.toString());
    return this;
  }

  async decreaseAnzahlKinder() {
    await this.anzahlKinderDecrease.click();
    return this;
  }

  async increaseAnzahlKinder() {
    await this.anzahlKinderIncrease.click();
    return this;
  }

  getGeschwisterkindGeburtsdatum(index: number) {
    return this.page
      .getByLabel(`${index + 1}. Geschwisterkind`)
      .getByLabel("Wann wurde das Geschwisterkind geboren?");
  }

  getGeschwisterkindHasBehinderung(index: number) {
    return this.page
      .getByLabel(`${index + 1}. Geschwisterkind`)
      .getByText("Das Geschwisterkind hat eine Behinderung");
  }

  getGeschwisterkindEntfernen(index: number) {
    return this.page
      .getByLabel(`${index + 1}. Geschwisterkind`)
      .getByRole("button", { name: "Geschwisterkind entfernen" });
  }

  async addGeschwisterkind(
    index: number,
    geburtsdatum: string,
    hasBehinderung?: boolean,
  ) {
    if (index === 0) {
      await this.erstesGeschwisterkindHinzufuegen.click();
    } else {
      await this.weiteresGeschwisterkindHinzufuegen.click();
    }

    await this.getGeschwisterkindGeburtsdatum(index).fill(geburtsdatum);

    if (hasBehinderung) {
      await this.getGeschwisterkindHasBehinderung(index).click();
    }

    return this;
  }

  async removeGeschwisterkind(index: number) {
    await this.getGeschwisterkindEntfernen(index).click();
    return this;
  }

  async submit() {
    await this.page
      .getByRole("button", { name: "Weiter", exact: true })
      .click();
  }
}
