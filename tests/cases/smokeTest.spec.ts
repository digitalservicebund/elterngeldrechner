import { test } from "@playwright/test";
import { RechnerPlanerPOM } from "../pom/RechnerPlanerPOM";

/**
 * This test case is intended to verify that the application functions at a basic
 * level. Its purpose is to ensure confidence in the applications functionality
 * after a relase while being flexible enough to tolerate minor changes and
 * environment specific differences.
 *
 * We tried to utilize the screenshot tests for testing production after each new
 * release but found that they are too brittle and require too much maintenance.
 */
test("smoke test", async ({ page }) => {
  test.slow();

  await page.goto("./");

  await page
    .getByLabel("Alleinerziehendenstatus")
    .getByText("Alleinerziehende Person")
    .click();

  await page.getByLabel("Mutterschaftsleistungen").getByText("Ja").click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page
    .locator("div")
    .filter({ hasText: /^TT\.MM\.JJJJ$/ })
    .click();
  await page.getByPlaceholder("__.__.___").fill("08.12.2024");
  await page.getByLabel("Älteres Geschwisterkind").click();
  await page.getByLabel("Wann wurde das").fill("05.03.2022");
  await page.getByRole("button", { name: "Weiter", exact: true }).click();
  await page.getByText("Ja", { exact: true }).click();
  await page.getByText("Einkünfte aus nichtselbstä").click();
  await page.getByText("Ja").nth(3).click();
  await page.getByText("Nein").nth(4).click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page
    .getByRole("radiogroup", {
      name: /^Hatten Sie im Kalenderjahr vor der Geburt ein Gesamteinkommen von mehr als/,
    })
    .getByRole("radio", { name: "Nein" })
    .click();
  await page.getByLabel("Wie viel haben Sie in den 12").click();
  await page.getByLabel("Wie viel haben Sie in den 12").fill("2500 Euro");
  await page.getByLabel("Welche Steuerklasse haben Sie").selectOption("2");
  await page
    .getByRole("radiogroup", { name: "Sind Sie kirchensteuerpflichtig?" })
    .getByRole("radio", { name: "Ja" })
    .click();
  await page.getByText("gesetzlich pflichtversichert", { exact: true }).click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByRole("button", { name: "Zum Monatsplaner" }).click();

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
  await planer.waehleOption(13, "Basis");
  await planer.gebeEinkommenAn(13, 1000);
  await planer.waehleOption(14, "Basis");
  await planer.gebeEinkommenAn(14, 1000);
  await planer.zeigeMehrLebensmonateAn();
  await planer.waehleOption(15, "Bonus");
  await planer.gebeEinkommenAn(15, 1000);
  await planer.waehleOption(16, "Bonus");
  await planer.gebeEinkommenAn(16, 1000);
  await planer.zeigeMehrLebensmonateAn();
  await planer.waehleOption(17, "Bonus");
  await planer.gebeEinkommenAn(17, 1000);
  await planer.waehleOption(18, "Bonus");
  await planer.gebeEinkommenAn(18, 1000);

  await page.getByRole("button", { name: "Zur Zusammenfassung" }).click();

  await page.isVisible("text='Planung der Monate im Detail'");
});
