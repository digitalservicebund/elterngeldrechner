import { test } from "@playwright/test";
import expectScreenshot from "../expectScreenshot";

test("unverheiratet, nicht selbstständig", async ({ page }) => {
  test.slow();
  const screenshot = expectScreenshot({ page });

  // codegen
  await page.goto("./");
  await page.getByText("Für beide").click();
  await page
    .locator("div")
    .filter({ hasText: /^JaNein$/ })
    .first()
    .click();
  await page.getByText("Ja", { exact: true }).click();
  await page.getByText("Elternteil 1", { exact: true }).click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^TT\.MM\.JJJJ$/ })
    .click();
  await page.getByPlaceholder("__.__.___").fill("10.12.2024");
  await page.getByLabel("erhöhen").click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByLabel("Elternteil 1").getByText("Ja").click();
  await page.getByLabel("Elternteil 2").getByText("Ja").click();
  await page.getByText("Einkünfte aus nichtselbstä").first().click();
  await page.getByText("Einkünfte aus nichtselbstä").nth(1).click();
  await page
    .locator(
      "section:nth-child(4) > .egr-custom-radio > .egr-custom-radio__options > div > .egr-custom-radio__label",
    )
    .first()
    .click();
  await page
    .locator(
      "div:nth-child(2) > section:nth-child(4) > .egr-custom-radio > .egr-custom-radio__options > div > .egr-custom-radio__label",
    )
    .first()
    .click();
  await page
    .locator(
      "section:nth-child(5) > .egr-custom-radio > .egr-custom-radio__options > div:nth-child(2) > .egr-custom-radio__label",
    )
    .first()
    .click();
  await page
    .locator(
      "div:nth-child(2) > section:nth-child(5) > .egr-custom-radio > .egr-custom-radio__options > div:nth-child(2) > .egr-custom-radio__label",
    )
    .click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByTestId("egr-anspruch").getByText("Nein").click();
  await page
    .getByLabel("Elternteil 1")
    .getByLabel("Wie viel haben Sie in den 12")
    .click();
  await page
    .getByLabel("Elternteil 1")
    .getByLabel("Wie viel haben Sie in den 12")
    .fill("2300 Euro");
  await page
    .getByLabel("Elternteil 2")
    .getByLabel("Wie viel haben Sie in den 12")
    .click();
  await page
    .getByLabel("Elternteil 2")
    .getByLabel("Wie viel haben Sie in den 12")
    .fill("3000 Euro");
  await page
    .getByLabel("Elternteil 1")
    .getByLabel("Welche Steuerklasse haben Sie")
    .selectOption("1");
  await page
    .getByLabel("Elternteil 2")
    .getByLabel("Welche Steuerklasse haben Sie")
    .selectOption("1");
  await page.getByLabel("Elternteil 2").getByText("Nein").click();
  await page.getByLabel("Elternteil 1").getByText("Nein").click();
  await page
    .getByLabel("Elternteil 1")
    .getByText("gesetzlich pflichtversichert", { exact: true })
    .click();
  await page
    .getByLabel("Elternteil 2")
    .getByText("gesetzlich pflichtversichert", { exact: true })
    .click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByRole("button", { name: "Zum Monatsplaner" }).click();
  await page
    .getByLabel("Elternteil 1", { exact: true })
    .getByRole("button", { name: "Einkommen hinzufügen" })
    .click();
  await page.getByLabel("Ihr monatliches").fill("1500 Euro");
  await page.getByLabel("von Lebensmonat").selectOption("7");
  await page.getByLabel("bis Lebensmonat").selectOption("18");
  await page
    .getByLabel("Elternteil 1", { exact: true })
    .getByRole("button", { name: "Elterngeld berechnen" })
    .click();
  await page
    .getByLabel("Elternteil 2", { exact: true })
    .getByRole("button", { name: "Einkommen hinzufügen" })
    .click();
  await page
    .getByLabel("Elternteil 2", { exact: true })
    .getByLabel("Ihr monatliches")
    .fill("3000 Euro");
  await page
    .getByLabel("Elternteil 2", { exact: true })
    .getByLabel("von Lebensmonat")
    .selectOption("1");
  await page
    .getByLabel("Elternteil 2", { exact: true })
    .getByLabel("bis Lebensmonat")
    .selectOption("6");
  await page
    .getByLabel("Elternteil 2", { exact: true })
    .getByRole("button", { name: "Einkommen hinzufügen" })
    .click();
  await page
    .getByLabel("2. Einkommen")
    .getByLabel("Ihr monatliches")
    .fill("1600 Euro");
  await page
    .getByLabel("2. Einkommen")
    .getByLabel("von Lebensmonat")
    .selectOption("13");
  await page
    .getByLabel("2. Einkommen")
    .getByLabel("bis Lebensmonat")
    .selectOption("18");
  await page
    .getByLabel("Elternteil 2", { exact: true })
    .getByRole("button", { name: "Elterngeld berechnen" })
    .click();
  await screenshot("rechner-result-et1");
  await screenshot("rechner-result-et2");
  await page
    .getByLabel("Elternteil 1 Basiselterngeld für Lebensmonat 3")
    .click();
  await page
    .getByLabel("Elternteil 1 Basiselterngeld für Lebensmonat 4")
    .click();
  await page
    .getByLabel("Elternteil 1 Basiselterngeld für Lebensmonat 6")
    .click();
  await page
    .getByLabel("Elternteil 1 ElterngeldPlus für Lebensmonat 7")
    .click();
  await page
    .getByLabel("Elternteil 1 ElterngeldPlus für Lebensmonat 9")
    .click();
  await page
    .getByLabel("Elternteil 1 ElterngeldPlus für Lebensmonat 10")
    .click();
  await page
    .getByLabel("Elternteil 1 Partnerschaftsbonus für Lebensmonat 13")
    .click();
  await page
    .getByLabel("Elternteil 1 Partnerschaftsbonus für Lebensmonat 15")
    .click();
  await page
    .getByLabel("Elternteil 1 Partnerschaftsbonus für Lebensmonat 16")
    .click();
  await page
    .getByLabel("Elternteil 2 Basiselterngeld für Lebensmonat 6")
    .click();
  await page
    .getByLabel("Elternteil 2 Basiselterngeld für Lebensmonat 7")
    .click();
  await page
    .getByLabel("Elternteil 2 Basiselterngeld für Lebensmonat 8")
    .click();
  await page
    .getByLabel("Elternteil 2 Basiselterngeld für Lebensmonat 9")
    .click();
  await page
    .getByLabel("Elternteil 2 Basiselterngeld für Lebensmonat 10")
    .click();
  await page
    .getByLabel("Elternteil 2 Basiselterngeld für Lebensmonat 11")
    .click();
  await page
    .locator("table:nth-child(2) > tbody > tr:nth-child(12) > td:nth-child(2)")
    .click();
  await page
    .getByLabel("Elternteil 2 Basiselterngeld für Lebensmonat 6")
    .click();
  await page
    .getByLabel("Elternteil 2 Basiselterngeld für Lebensmonat 12")
    .click();
  await page.getByRole("button", { name: "Zur Übersicht" }).click();
  await screenshot("planungsuebersicht");
  await screenshot("planungsdetails");
});
