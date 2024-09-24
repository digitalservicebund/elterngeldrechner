import { test } from "@playwright/test";
import expectScreenshot from "../expectScreenshot";
import { RechnerPlanerPOM } from "../pom/RechnerPlanerPOM";

test("Gewinneinkünfte, ausführliche Eingabe", async ({ page }) => {
  test.slow();
  const screenshot = expectScreenshot({ page });

  // codegen
  await page.goto("./");
  await page.getByText("Für beide").click();
  await page.getByText("Nein").click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByPlaceholder("__.__.___").click();
  await page.getByPlaceholder("__.__.___").fill("06.01.2025");
  await page.getByLabel("erhöhen").click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByLabel("Elternteil 1").getByText("Ja").click();
  await page.getByLabel("Elternteil 2").getByText("Ja").click();
  await page.getByText("Gewinneinkünfte").first().click();
  await page.getByText("Einkünfte aus nichtselbstä").nth(1).click();
  await page.getByText("Ja", { exact: true }).nth(3).click();
  await page.getByText("Nein", { exact: true }).nth(4).click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByTestId("egr-anspruch").getByText("Nein").click();
  await page.getByLabel("Welche Steuerklasse haben Sie").selectOption("4");
  await page
    .getByLabel("Elternteil 1")
    .getByText("Nein", { exact: true })
    .click();
  await page.getByLabel("Elternteil 2").getByText("Ja").click();
  await page.getByLabel("Wie hoch war Ihr Gewinn im").click();
  await page.getByLabel("Wie hoch war Ihr Gewinn im").fill("3.1200 Euro");
  await page.getByLabel("Elternteil 1").getByText("nicht gesetzlich").click();
  await page.getByText("keine gesetzliche").click();
  await page
    .getByLabel("Elternteil 2")
    .getByText("gesetzlich pflichtversichert", { exact: true })
    .click();
  await page.getByRole("button", { name: "Zur ausführlichen Eingabe" }).click();
  await page.getByLabel("1. Monat", { exact: true }).click();
  await page.getByLabel("1. Monat", { exact: true }).fill("1800 Euro");
  await page.getByLabel("2. Monat", { exact: true }).click();
  await page.getByLabel("2. Monat", { exact: true }).fill("1800 Euro");
  await page.getByLabel("3. Monat").click();
  await page.getByLabel("3. Monat").fill("1800 Euro");
  await page.getByLabel("4. Monat").click();
  await page.getByLabel("4. Monat").fill("1800 Euro");
  await page.getByLabel("5. Monat").click();
  await page.getByLabel("5. Monat").fill("1800 Euro");
  await page.getByLabel("6. Monat").click();
  await page.getByLabel("6. Monat").fill("1800 Euro");
  await page.getByLabel("7. Monat").click();
  await page.getByLabel("7. Monat").fill("1800 Euro");
  await page.getByLabel("8. Monat").click();
  await page.getByLabel("8. Monat").fill("1800 Euro");
  await page.getByLabel("9. Monat").click();
  await page.getByLabel("9. Monat").fill("3000 Euro");
  await page.getByLabel("10. Monat").click();
  await page.getByLabel("10. Monat").fill("3000 Euro");
  await page.getByLabel("11. Monat").click();
  await page.getByLabel("11. Monat").fill("3000 Euro");
  await page.getByLabel("12. Monat").click();
  await page.getByLabel("12. Monat").fill("3000 Euro");
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByRole("button", { name: "Zum Monatsplaner" }).click();
  await page
    .getByLabel("Elternteil 1", { exact: true })
    .getByText("Ich werde während des")
    .click();
  await page
    .getByLabel("Elternteil 1", { exact: true })
    .getByRole("button", { name: "Elterngeld berechnen" })
    .click();
  await page
    .getByLabel("Elternteil 2", { exact: true })
    .getByRole("button", { name: "Einkommen hinzufügen" })
    .click();
  await page.getByLabel("Ihr monatliches").fill("2100 Euro");
  await page.getByLabel("von Lebensmonat").selectOption("1");
  await page.getByLabel("bis Lebensmonat").selectOption("32");
  await page
    .getByLabel("Elternteil 2", { exact: true })
    .getByRole("button", { name: "Elterngeld berechnen" })
    .click();
  await screenshot("rechner-result-et1");
  await screenshot("rechner-result-et2");

  const planer = new RechnerPlanerPOM(page);
  await planer.waehleOption(1, "Basis", "Elternteil 1");
  await planer.waehleOption(1, "Basis", "Elternteil 2");
  await planer.waehleOption(2, "Basis", "Elternteil 1");
  await planer.waehleOption(2, "Plus", "Elternteil 2");
  await planer.waehleOption(3, "Basis", "Elternteil 1");
  await planer.waehleOption(4, "Plus", "Elternteil 2");
  await planer.waehleOption(5, "Basis", "Elternteil 1");
  await planer.waehleOption(6, "Plus", "Elternteil 2");
  await planer.waehleOption(7, "Basis", "Elternteil 1");
  await planer.waehleOption(9, "Plus", "Elternteil 2");
  await planer.waehleOption(10, "Plus", "Elternteil 2");
  await planer.waehleOption(11, "Bonus", "Elternteil 1");
  await planer.waehleOption(12, "Bonus", "Elternteil 1");
  await planer.waehleOption(13, "Bonus", "Elternteil 1");

  await page.getByRole("button", { name: "Zur Übersicht" }).click();
  await screenshot("planungsuebersicht", page.getByLabel("Planungsübersicht"));
  await screenshot(
    "planungsdetails",
    page.getByLabel("Planung der Monate im Detail"),
  );
});
