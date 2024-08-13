import { test } from "@playwright/test";
import expectScreenshot from "../expectScreenshot";

test("mehrere Tätigkeiten", async ({ page }) => {
  test.slow();
  const screenshot = expectScreenshot({ page });

  // codegen
  await page.goto("./");
  await page.getByText("Für einen Elternteil").click();
  await page.getByLabel("Alleinerziehendenstatus").getByText("Nein").click();
  await page.getByLabel("Mutterschaftsleistungen").getByText("Ja").click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByPlaceholder("__.__.___").click();
  await page.getByPlaceholder("__.__.___").fill("18.11.2024");
  await page.getByLabel("erhöhen").dblclick();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByText("Ja", { exact: true }).click();
  await page.getByText("Einkünfte aus nichtselbstä").click();
  await page.getByText("Ja").nth(2).click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByTestId("egr-anspruch").getByText("Nein").click();
  await page.getByLabel("Welche Steuerklasse haben Sie").selectOption("1");
  await page.getByLabel("Elternteil").getByText("Ja").click();
  await page.getByRole("button", { name: "eine Tätigkeit hinzufügen" }).click();
  await page.getByLabel("Durchschnittliches Brutto-").fill("1350 Euro");
  await page.getByLabel("Tätigkeit").getByText("Nein").click();
  await page
    .locator(
      '[id="ET1\\.taetigkeitenNichtSelbstaendigUndSelbstaendig\\.0\\.zeitraum\\.0\\.from"]',
    )
    .selectOption("1");
  await page
    .locator(
      '[id="ET1\\.taetigkeitenNichtSelbstaendigUndSelbstaendig\\.0\\.zeitraum\\.0\\.to"]',
    )
    .selectOption("12");
  await page.getByText("rentenversicherungspflichtig").click();
  await page.getByText("krankenversicherungspflichtig").click();
  await page.getByText("arbeitslosenversicherungspflichtig").click();
  await page
    .getByRole("button", { name: "weitere Tätigkeit hinzufügen" })
    .click();
  await page
    .getByLabel("2. Tätigkeit")
    .getByLabel("Durchschnittliches Brutto-")
    .fill("538 Euro");
  await page.getByLabel("2. Tätigkeit").getByText("Ja").click();
  await page
    .locator(
      '[id="ET1\\.taetigkeitenNichtSelbstaendigUndSelbstaendig\\.1\\.zeitraum\\.0\\.from"]',
    )
    .selectOption("1");
  await page
    .locator(
      '[id="ET1\\.taetigkeitenNichtSelbstaendigUndSelbstaendig\\.1\\.zeitraum\\.0\\.to"]',
    )
    .selectOption("12");
  await page
    .getByLabel("2. Tätigkeit")
    .getByText("keines der Genannten")
    .click();
  await page
    .getByLabel("2. Tätigkeit")
    .getByText("rentenversicherungspflichtig")
    .click();
  await page
    .getByLabel("2. Tätigkeit")
    .getByText("krankenversicherungspflichtig")
    .click();
  await page
    .getByLabel("2. Tätigkeit")
    .getByText("arbeitslosenversicherungspflichtig")
    .click();
  await page.getByRole("button", { name: "Weiter", exact: true }).click();
  await page.getByRole("button", { name: "Zum Monatsplaner" }).click();
  await page.getByText("Ich werde während des").click();
  await page.getByRole("button", { name: "Elterngeld berechnen" }).click();
  await screenshot("rechner-result-et1");
  await page
    .getByLabel("Elternteil 1 Basiselterngeld für Lebensmonat 4")
    .click();
  await page
    .getByLabel("Elternteil 1 Basiselterngeld für Lebensmonat 5")
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
    .getByLabel("Elternteil 1 Basiselterngeld für Lebensmonat 12")
    .click();
  await page.getByRole("button", { name: "Zur Übersicht" }).click();
  await screenshot("planungsuebersicht");
  await screenshot("planungsdetails");
});
