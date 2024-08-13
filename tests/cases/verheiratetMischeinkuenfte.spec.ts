import { test } from "@playwright/test";
import expectScreenshot from "../expectScreenshot";

test("verheiratet, Mischeinkünfte", async ({ page }) => {
  test.slow();
  const screenshot = expectScreenshot({ page });

  // codegen
  await page.goto("./");
  await page.getByText("Für beide").click();
  await page.getByText("Ja", { exact: true }).click();
  await page.getByText("Elternteil 2", { exact: true }).click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByPlaceholder("__.__.___").click();
  await page.getByPlaceholder("__.__.___").fill("20.11.2024");
  await page.getByLabel("erhöhen").click();
  await page.getByLabel("Älteres Geschwisterkind").click();
  await page.getByLabel("Wann wurde das").fill("04.02.2020");
  await page.getByLabel("Weiteres Geschwisterkind").click();
  await page
    .getByLabel("2. Geschwisterkind")
    .getByPlaceholder("__.__.___")
    .fill("30.06.2022");
  await page.getByRole("button", { name: "Weiter", exact: true }).click();
  await page.getByLabel("Elternteil 1").getByText("Ja").click();
  await page.getByLabel("Elternteil 2").getByText("Nein").click();
  await page
    .locator("div")
    .filter({ hasText: /^Einkünfte aus nichtselbständiger Arbeit$/ })
    .nth(1)
    .click();
  await page.getByText("Gewinneinkünfte").click();
  await page.getByText("Einkünfte aus nichtselbstä").click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByLabel("Welche Steuerklasse haben Sie").selectOption("3");
  await page.getByLabel("Kirchensteuer").getByText("Ja").click();
  await page.getByRole("button", { name: "eine Tätigkeit hinzufügen" }).click();
  await page.getByLabel("Durchschnittliches Brutto-").click();
  await page.getByLabel("Durchschnittliches Brutto-").fill("4500 Euro");
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
  await page
    .getByLabel("1. Tätigkeit")
    .getByText("Nein", { exact: true })
    .click();
  await page.getByText("rentenversicherungspflichtig").click();
  await page.getByText("krankenversicherungspflichtig").click();
  await page.getByText("arbeitslosenversicherungspflichtig").click();
  await page
    .getByRole("button", { name: "weitere Tätigkeit hinzufügen" })
    .click();
  await page
    .getByLabel("2. Tätigkeit")
    .getByLabel("Art der Tätigkeit")
    .selectOption("Selbststaendig");
  await page.getByLabel("Durchschnittlicher").click();
  await page.getByLabel("Durchschnittlicher").fill("2000 Euro");
  await page
    .locator(
      '[id="ET1\\.taetigkeitenNichtSelbstaendigUndSelbstaendig\\.1\\.zeitraum\\.0\\.from"]',
    )
    .selectOption("6");
  await page
    .locator(
      '[id="ET1\\.taetigkeitenNichtSelbstaendigUndSelbstaendig\\.1\\.zeitraum\\.0\\.to"]',
    )
    .selectOption("12");
  await page
    .getByLabel("2. Tätigkeit")
    .getByText("keines der Genannten")
    .click();
  await page.getByRole("button", { name: "Weiter", exact: true }).click();
  await page.getByTestId("egr-anspruch").getByText("Nein").click();
  await page.getByRole("button", { name: "Weiter", exact: true }).click();
  await page.getByRole("button", { name: "Zum Monatsplaner" }).click();
  await page
    .getByLabel("Elternteil 1", { exact: true })
    .getByRole("button", { name: "Einkommen hinzufügen" })
    .click();
  await page.getByLabel("Ihr monatliches").fill("6500 Euro");
  await page.getByLabel("von Lebensmonat").selectOption("2");
  await page.getByLabel("bis Lebensmonat").selectOption("12");
  await page
    .getByLabel("Elternteil 1", { exact: true })
    .getByRole("button", { name: "Elterngeld berechnen" })
    .click();
  await page
    .getByLabel("Elternteil 2", { exact: true })
    .getByText("Ich werde während des")
    .click();
  await page
    .getByLabel("Elternteil 2", { exact: true })
    .getByRole("button", { name: "Elterngeld berechnen" })
    .click();
  await screenshot("rechner-result-et1");
  await screenshot("rechner-result-et2");
  await page
    .getByTestId("Elternteil 1 Basiselterngeld für Lebensmonat 1")
    .getByLabel("Elternteil 1 Basiselterngeld")
    .click();
  await page
    .getByLabel("Elternteil 1 Basiselterngeld für Lebensmonat 13")
    .click();
  await page
    .getByLabel("Elternteil 2 Basiselterngeld für Lebensmonat 3")
    .click();
  await page
    .getByLabel("Elternteil 2 Basiselterngeld für Lebensmonat 4")
    .click();
  await page
    .getByLabel("Elternteil 2 Basiselterngeld für Lebensmonat 5")
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
    .getByLabel("Elternteil 2 Basiselterngeld für Lebensmonat 12")
    .click();
  await page.getByRole("button", { name: "Zur Übersicht" }).click();
  await screenshot("planungsuebersicht");
  await screenshot("planungsdetails");
});
