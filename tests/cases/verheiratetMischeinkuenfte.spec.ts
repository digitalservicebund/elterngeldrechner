import { test } from "@playwright/test";
import expectScreenshot from "../expectScreenshot";
import { RechnerPlanerPOM } from "../pom/RechnerPlanerPOM";

test("verheiratet, Mischeinkünfte", async ({ page }) => {
  test.slow();
  const screenshot = expectScreenshot({ page });

  // codegen
  await page.goto("./");
  await page.getByText("Gemeinsam Erziehende").click();
  await page.getByText("Für zwei Elternteile").click();
  await page
    .getByText("Ja, ein Elternteil ist oder wird im Mutterschutz sein", {
      exact: true,
    })
    .click();
  await page
    .getByText("Elternteil 2 ist oder wird im Mutterschutz sein", {
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByPlaceholder("__.__.___").click();
  await page.getByPlaceholder("__.__.___").fill("20.11.2024");
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
  await page.getByText("Gewinneinkünfte").click();
  await page.getByText("Einkünfte aus nichtselbstä").click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByLabel("Welche Steuerklasse haben Sie").selectOption("3");
  await page.getByLabel("Kirchensteuer").getByText("Ja").click();
  await page.getByLabel("Durchschnittliches Bruttoeinkommen").click();
  await page.getByLabel("Durchschnittliches Bruttoeinkommen").fill("4500 Euro");
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
  await page
    .getByLabel("Gewinn im letzten Kalenderjahr in Brutto")
    .fill("24000 Euro");
  await page
    .getByLabel("2. Tätigkeit")
    .getByText("keines der Genannten")
    .click();
  await page.getByRole("button", { name: "Weiter", exact: true }).click();
  await page
    .getByRole("radiogroup", {
      name: /^Hatten Sie im Kalenderjahr vor der Geburt ein Gesamteinkommen von mehr als/,
    })
    .getByRole("radio", { name: "Nein" })
    .click();
  await page.getByRole("button", { name: "Weiter", exact: true }).click();
  await page.getByRole("button", { name: "Zum Monatsplaner" }).click();

  const planer = new RechnerPlanerPOM(page);
  await planer.waehleOption(1, "Basis", "Elternteil 1");
  await planer.gebeEinkommenAn(2, 6500, "Elternteil 1");
  await planer.waehleOption(3, "Basis", "Elternteil 2");
  await planer.gebeEinkommenAn(3, 6500, "Elternteil 1");
  await planer.waehleOption(4, "Basis", "Elternteil 2");
  await planer.gebeEinkommenAn(4, 6500, "Elternteil 1");
  await planer.waehleOption(5, "Basis", "Elternteil 2");
  await planer.gebeEinkommenAn(5, 6500, "Elternteil 1");
  await planer.waehleOption(6, "Basis", "Elternteil 2");
  await planer.gebeEinkommenAn(6, 6500, "Elternteil 1");
  await planer.waehleOption(7, "Basis", "Elternteil 2");
  await planer.gebeEinkommenAn(7, 6500, "Elternteil 1");
  await planer.waehleOption(8, "Basis", "Elternteil 2");
  await planer.gebeEinkommenAn(8, 6500, "Elternteil 1");
  await planer.waehleOption(9, "Basis", "Elternteil 2");
  await planer.gebeEinkommenAn(9, 6500, "Elternteil 1");
  await planer.waehleOption(10, "Basis", "Elternteil 2");
  await planer.gebeEinkommenAn(10, 6500, "Elternteil 1");
  await planer.waehleOption(11, "Basis", "Elternteil 2");
  await planer.gebeEinkommenAn(11, 6500, "Elternteil 1");
  await planer.waehleOption(12, "Basis", "Elternteil 2");
  await planer.gebeEinkommenAn(12, 6500, "Elternteil 1");
  await planer.waehleOption(13, "Basis", "Elternteil 1");

  await page.getByRole("button", { name: "Zur Zusammenfassung" }).click();
  await screenshot("planungsuebersicht", page.getByLabel("Planungsübersicht"));
  await screenshot(
    "planungsdetails",
    page.getByLabel("Planung der Monate im Detail"),
  );
});
