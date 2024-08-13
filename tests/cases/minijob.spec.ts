import { test } from "@playwright/test";
import expectScreenshot from "../expectScreenshot";

test("Minijob", async ({ page }) => {
  const screenshot = expectScreenshot({ page });

  // codegen
  await page.goto("./");
  await page.getByText("Für einen Elternteil").click();
  await page.getByLabel("Alleinerziehendenstatus").getByText("Nein").click();
  await page.getByLabel("Mutterschaftsleistungen").getByText("Ja").click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^TT\.MM\.JJJJ$/ })
    .click();
  await page.getByPlaceholder("__.__.___").fill("05.03.2025");
  await page.getByLabel("erhöhen").click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByText("Ja", { exact: true }).click();
  await page.getByText("Einkünfte aus nichtselbstä").click();
  await page.getByText("Nein").nth(3).click();
  await page.getByText("Ja").nth(4).click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByText("Nein").click();
  await page.getByLabel("Wie viel haben Sie in den 12").click();
  await page.getByLabel("Wie viel haben Sie in den 12").fill("510 Euro");
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByRole("button", { name: "Zum Monatsplaner" }).click();
  await page.getByText("Ich werde während des").click();
  await page.getByRole("button", { name: "Elterngeld berechnen" }).click();
  await screenshot("rechner-result-et1");
  await page
    .getByLabel("Elternteil 1 Basiselterngeld für Lebensmonat 3")
    .click();
  await page
    .getByLabel("Elternteil 1 Basiselterngeld für Lebensmonat 4")
    .click();
  await page
    .getByTestId("Elternteil 1 Basiselterngeld für Lebensmonat 5")
    .click();
  await page
    .getByLabel("Elternteil 1 Basiselterngeld für Lebensmonat 6")
    .click();
  await page
    .getByLabel("Elternteil 1 Basiselterngeld für Lebensmonat 7")
    .click();
  await page
    .getByLabel("Elternteil 1 Basiselterngeld für Lebensmonat 8")
    .click();
  await page
    .getByLabel("Elternteil 1 Basiselterngeld für Lebensmonat 9")
    .click();
  await page
    .getByLabel("Elternteil 1 Basiselterngeld für Lebensmonat 10")
    .click();
  await page
    .getByLabel("Elternteil 1 Basiselterngeld für Lebensmonat 11")
    .click();
  await page
    .getByLabel("Elternteil 1 Basiselterngeld für Lebensmonat 12")
    .click();
  await page.getByRole("button", { name: "Zur Übersicht" }).click();
  await screenshot("planungsuebersicht");
  await screenshot("planungsdetails");
});
