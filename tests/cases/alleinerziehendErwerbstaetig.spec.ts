import { test } from "@playwright/test";
import expectScreenshot from "../expectScreenshot";
import { RechnerPlanerPOM } from "../pom/RechnerPlanerPOM";

test("alleinerziehend, erwerbstätig", async ({ page }) => {
  const screenshot = expectScreenshot({ page });

  // codegen
  await page.goto("./");

  await page.getByLabel("Alleinerziehendenstatus").getByText("Ja").click();

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
  await page.getByLabel("Monatliches Einkommen in Brutto").click();
  await page.getByLabel("Monatliches Einkommen in Brutto").fill("2500 Euro");
  await page.getByLabel("Welche Steuerklasse hatten Sie").selectOption("2");
  await page
    .getByRole("radiogroup", { name: "Sind Sie kirchensteuerpflichtig?" })
    .getByRole("radio", { name: "Ja" })
    .click();
  await page
    .getByRole("radiogroup", { name: "Sind Sie gesetzlich pflichtversichert?" })
    .getByRole("radio", { name: "Ja" })
    .click();
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
  await screenshot("planungsuebersicht", page.getByLabel("Planungsübersicht"));
  await screenshot(
    "planungsdetails",
    page.getByLabel("Planung der Monate im Detail"),
  );
});
