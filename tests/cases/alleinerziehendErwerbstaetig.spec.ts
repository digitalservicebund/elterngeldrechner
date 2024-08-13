import { test } from "@playwright/test";
import expectScreenshot from "../expectScreenshot";

test("alleinerziehend, erwerbstätig", async ({ page }) => {
  const screenshot = expectScreenshot({ page });

  // codegen
  await page.goto("./");
  await page.getByText("Für einen Elternteil").click();
  await page.getByLabel("Alleinerziehendenstatus").getByText("Ja").click();
  await page.getByLabel("Mutterschaftsleistungen").getByText("Ja").click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^TT\.MM\.JJJJ$/ })
    .click();
  await page.getByPlaceholder("__.__.___").fill("08.12.2024");
  await page.getByLabel("erhöhen").click();
  await page.getByLabel("Älteres Geschwisterkind").click();
  await page.getByLabel("Wann wurde das").fill("05.03.2022");
  await page.getByRole("button", { name: "Weiter", exact: true }).click();
  await page.getByText("Ja", { exact: true }).click();
  await page.getByText("Einkünfte aus nichtselbstä").click();
  await page.getByText("Ja").nth(3).click();
  await page.getByText("Nein").nth(4).click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByTestId("egr-anspruch").getByText("Nein").click();
  await page.getByLabel("Wie viel haben Sie in den 12").click();
  await page.getByLabel("Wie viel haben Sie in den 12").fill("2500 Euro");
  await page.getByLabel("Welche Steuerklasse haben Sie").selectOption("2");
  await page.getByLabel("Elternteil").getByText("Nein").click();
  await page.getByText("gesetzlich pflichtversichert", { exact: true }).click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByRole("button", { name: "Zum Monatsplaner" }).click();
  await page.getByRole("button", { name: "Einkommen hinzufügen" }).click();
  await page.getByLabel("Ihr monatliches").fill("1000 Euro");
  await page.getByLabel("von Lebensmonat").selectOption("13");
  await page.getByLabel("bis Lebensmonat").selectOption("18");
  await page.getByRole("button", { name: "Elterngeld berechnen" }).click();
  await screenshot("rechner-result-et1");
  await page.getByLabel("Basiselterngeld für Lebensmonat 3").click();
  await page.getByLabel("Basiselterngeld für Lebensmonat 4").click();
  await page.getByLabel("Basiselterngeld für Lebensmonat 5").click();
  await page.getByLabel("Basiselterngeld für Lebensmonat 6").click();
  await page.getByLabel("Basiselterngeld für Lebensmonat 7").click();
  await page.getByLabel("Basiselterngeld für Lebensmonat 8").click();
  await page.getByLabel("Basiselterngeld für Lebensmonat 9").click();
  await page.getByLabel("Basiselterngeld für Lebensmonat 10").click();
  await page.getByLabel("Basiselterngeld für Lebensmonat 11").click();
  await page.getByLabel("Basiselterngeld für Lebensmonat 12").click();
  await page.getByLabel("Basiselterngeld für Lebensmonat 13").click();
  await page.getByLabel("Basiselterngeld für Lebensmonat 14").click();
  await page.getByLabel("Partnerschaftsbonus für Lebensmonat 15").click();
  await page.getByLabel("Partnerschaftsbonus für Lebensmonat 17").click();
  await page.getByLabel("Partnerschaftsbonus für Lebensmonat 18").click();
  await page.getByRole("button", { name: "Zur Übersicht" }).click();
  await screenshot("planungsuebersicht");
  await screenshot("planungsdetails");
});
