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

  const planer = new RechnerPlanerPOM(page);
  await planer.waehleOption(3, "Basis", "Elternteil 1");
  await planer.waehleOption(4, "Basis", "Elternteil 1");
  await planer.waehleOption(6, "Basis", "Elternteil 1");
  await planer.waehleOption(6, "Basis", "Elternteil 2");
  await planer.waehleOption(7, "Plus", "Elternteil 1");
  await planer.waehleOption(7, "Basis", "Elternteil 2");
  await planer.waehleOption(8, "Basis", "Elternteil 2");
  await planer.waehleOption(9, "Plus", "Elternteil 1");
  await planer.waehleOption(9, "Basis", "Elternteil 2");
  await planer.waehleOption(10, "Plus", "Elternteil 1");
  await planer.waehleOption(10, "Basis", "Elternteil 2");
  await planer.waehleOption(11, "Basis", "Elternteil 2");
  await planer.waehleOption(12, "Basis", "Elternteil 2");
  await planer.waehleOption(13, "Bonus", "Elternteil 1");
  await planer.zeigeMehrLebensmonateAn();
  await planer.waehleOption(15, "Bonus", "Elternteil 1");
  await planer.waehleOption(16, "Bonus", "Elternteil 1");

  await page.getByRole("button", { name: "Zur Übersicht" }).click();
  await screenshot("planungsuebersicht", page.getByLabel("Planungsübersicht"));
  await screenshot(
    "planungsdetails",
    page.getByLabel("Planung der Monate im Detail"),
  );
});
