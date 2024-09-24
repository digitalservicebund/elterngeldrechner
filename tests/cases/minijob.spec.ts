import { test } from "@playwright/test";
import expectScreenshot from "../expectScreenshot";
import { RechnerPlanerPOM } from "../pom/RechnerPlanerPOM";

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

  const planer = new RechnerPlanerPOM(page);
  await planer.waehleOption(3, "Basis");
  await planer.waehleOption(4, "Basis");
  await planer.waehleOption(5, "Basis");
  await planer.waehleOption(6, "Basis");
  await planer.waehleOption(7, "Basis");
  await planer.waehleOption(8, "Basis");
  await planer.waehleOption(9, "Basis");
  await planer.waehleOption(10, "Basis");
  await planer.waehleOption(11, "Basis");
  await planer.waehleOption(12, "Basis");

  await page.getByRole("button", { name: "Zur Übersicht" }).click();
  await screenshot("planungsuebersicht", page.getByLabel("Planungsübersicht"));
  await screenshot(
    "planungsdetails",
    page.getByLabel("Planung der Monate im Detail"),
  );
});
