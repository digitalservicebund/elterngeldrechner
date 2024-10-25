import { test } from "@playwright/test";
import expectScreenshot from "../expectScreenshot";
import { RechnerPlanerPOM } from "../pom/RechnerPlanerPOM";

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

  const planer = new RechnerPlanerPOM(page);
  await planer.gebeEinkommenAn(1, 3000, "Elternteil 2");
  await planer.gebeEinkommenAn(2, 3000, "Elternteil 2");
  await planer.waehleOption(3, "Basis", "Elternteil 1");
  await planer.gebeEinkommenAn(3, 3000, "Elternteil 2");
  await planer.waehleOption(4, "Basis", "Elternteil 1");
  await planer.gebeEinkommenAn(4, 3000, "Elternteil 2");
  await planer.gebeEinkommenAn(5, 3000, "Elternteil 2");
  await planer.waehleOption(6, "Basis", "Elternteil 1");
  await planer.waehleOption(6, "Basis", "Elternteil 2");
  await planer.gebeEinkommenAn(6, 3000, "Elternteil 2");
  await planer.waehleOption(7, "Plus", "Elternteil 1");
  await planer.gebeEinkommenAn(7, 1500, "Elternteil 1");
  await planer.waehleOption(7, "Basis", "Elternteil 2");
  await planer.gebeEinkommenAn(8, 1500, "Elternteil 1");
  await planer.waehleOption(8, "Basis", "Elternteil 2");
  await planer.waehleOption(9, "Plus", "Elternteil 1");
  await planer.gebeEinkommenAn(9, 1500, "Elternteil 1");
  await planer.waehleOption(9, "Basis", "Elternteil 2");
  await planer.waehleOption(10, "Plus", "Elternteil 1");
  await planer.gebeEinkommenAn(10, 1500, "Elternteil 1");
  await planer.waehleOption(10, "Basis", "Elternteil 2");
  await planer.waehleOption(11, "Basis", "Elternteil 2");
  await planer.gebeEinkommenAn(11, 1500, "Elternteil 1");
  await planer.waehleOption(12, "Basis", "Elternteil 2");
  await planer.gebeEinkommenAn(12, 1500, "Elternteil 1");
  await planer.waehleOption(13, "Bonus", "Elternteil 1");
  await planer.gebeEinkommenAn(13, 1500, "Elternteil 1");
  await planer.gebeEinkommenAn(13, 1600, "Elternteil 2");
  await planer.zeigeMehrLebensmonateAn();
  await planer.gebeEinkommenAn(14, 1500, "Elternteil 1");
  await planer.gebeEinkommenAn(14, 1600, "Elternteil 2");
  await planer.waehleOption(15, "Bonus", "Elternteil 1");
  await planer.gebeEinkommenAn(15, 1500, "Elternteil 1");
  await planer.gebeEinkommenAn(15, 1600, "Elternteil 2");
  await planer.waehleOption(16, "Bonus", "Elternteil 1");
  await planer.gebeEinkommenAn(16, 1500, "Elternteil 1");
  await planer.gebeEinkommenAn(16, 1600, "Elternteil 2");
  await planer.gebeEinkommenAn(17, 1500, "Elternteil 1");
  await planer.gebeEinkommenAn(17, 1600, "Elternteil 2");
  await planer.gebeEinkommenAn(18, 1500, "Elternteil 1");
  await planer.gebeEinkommenAn(18, 1600, "Elternteil 2");

  await page.getByRole("button", { name: "Zur Übersicht" }).click();
  await screenshot("planungsuebersicht", page.getByLabel("Planungsübersicht"));
  await screenshot(
    "planungsdetails",
    page.getByLabel("Planung der Monate im Detail"),
  );
});
