import { test } from "@playwright/test";
import expectScreenshot from "../expectScreenshot";
import { AllgemeineAngabenPOM } from "../pom/AllgemeineAngabenPOM";
import { RechnerPlanerPOM } from "../pom/RechnerPlanerPOM";

test("Minijob", async ({ page }) => {
  const screenshot = expectScreenshot({ page });

  const allgemeineAngabenPage = await new AllgemeineAngabenPOM(page).goto();
  await allgemeineAngabenPage.setAlleinerziehend(false);
  await allgemeineAngabenPage.setElternteile(1);
  await allgemeineAngabenPage.setMutterschutzFuerEinePerson(true);
  await allgemeineAngabenPage.submit();

  // codegen
  await page
    .locator("div")
    .filter({ hasText: /^TT\.MM\.JJJJ$/ })
    .click();
  await page.getByPlaceholder("__.__.___").fill("05.03.2025");
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByText("Ja", { exact: true }).click();
  await page.getByText("Einkünfte aus nichtselbstä").click();
  await page.getByText("Nein").nth(3).click();
  await page.getByText("Ja").nth(4).click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByText("Nein").click();
  await page.getByLabel("Monatliches Einkommen in Brutto").click();
  await page.getByLabel("Monatliches Einkommen in Brutto").fill("510 Euro");
  await page.getByRole("button", { name: "Weiter" }).click();

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

  await page.getByRole("button", { name: "Zur Zusammenfassung" }).click();
  await screenshot("planungsuebersicht", page.getByLabel("Planungsübersicht"));
  await screenshot(
    "planungsdetails",
    page.getByLabel("Planung der Monate im Detail"),
  );
});
