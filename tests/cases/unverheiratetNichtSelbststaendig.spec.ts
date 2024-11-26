import { test } from "@playwright/test";
import expectScreenshot from "../expectScreenshot";
import { RechnerPlanerPOM } from "../pom/RechnerPlanerPOM";
import { AllgemeineAngabenPOM } from "../pom/AllgemeineAngabenPOM";
import { NachwuchsPOM } from "../pom/NachwuchsPOM";
import { ErwerbstaetigkeitPOM } from "../pom/ErwerbstaetigkeitPOM";

test("unverheiratet, nicht selbstständig", async ({ page }) => {
  test.slow();
  const screenshot = expectScreenshot({ page });

  const allgemeineAngabenPage = await new AllgemeineAngabenPOM(page).goto();
  await allgemeineAngabenPage.setElternteile(2);
  await allgemeineAngabenPage.setMutterschaftsleistungen(true);
  await allgemeineAngabenPage.setMutterschaftsleistungenWer("Elternteil 1");
  await allgemeineAngabenPage.submit();

  const nachwuchsPage = new NachwuchsPOM(page);
  await nachwuchsPage.setGeburtsdatum("10.12.2024");
  await nachwuchsPage.submit();

  const erwerbstaetigkeitPage = new ErwerbstaetigkeitPOM(page, {
    elternteile: ["Elternteil 1", "Elternteil 2"],
  });
  await erwerbstaetigkeitPage.setErwerbstaetig(true, 1);
  await erwerbstaetigkeitPage.setErwerbstaetig(true, 2);
  await erwerbstaetigkeitPage.submit();

  // codegen
  await page.getByText("Einkünfte aus nichtselbstä").first().click();
  await page.getByText("Einkünfte aus nichtselbstä").nth(1).click();
  await page.getByTestId("ET1.sozialVersicherungsPflichtig_option_0").click();
  await page.getByTestId("ET2.sozialVersicherungsPflichtig_option_0").click();
  await page.getByTestId("ET1.monatlichesBrutto_option_1").click();
  await page.getByTestId("ET2.monatlichesBrutto_option_1").click();
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
