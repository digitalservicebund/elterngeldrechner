import { expect, test } from "@playwright/test";
import expectScreenshot from "../expectScreenshot";
import { AllgemeineAngabenPOM } from "../pom/AllgemeineAngabenPOM";
import { DatenuebernahmeAntragPOM } from "../pom/DatenuebernahmeAntragPOM";
import { EinkommenPOM } from "../pom/EinkommenPOM";
import { ErwerbstaetigkeitPOM } from "../pom/ErwerbstaetigkeitPOM";
import { NachwuchsPOM } from "../pom/NachwuchsPOM";
import { RechnerPlanerPOM } from "../pom/RechnerPlanerPOM";

test("gemeinsam, unterstütztes Bundesland", async ({ page }) => {
  const screenshot = expectScreenshot({ page });

  const allgemeineAngabenPage = await new AllgemeineAngabenPOM(page).goto();
  await allgemeineAngabenPage.setBundesland("Berlin");
  await allgemeineAngabenPage.setAlleinerziehend(false);
  await allgemeineAngabenPage.setElternteile(2);
  await allgemeineAngabenPage.setNameElternteil1("Annika");
  await allgemeineAngabenPage.setNameElternteil2("Anton");
  await allgemeineAngabenPage.setMutterschutz("Annika");
  await allgemeineAngabenPage.submit();

  const nachwuchsPage = new NachwuchsPOM(page);
  await nachwuchsPage.setGeburtsdatum("01.01.2026");
  await nachwuchsPage.submit();

  const erwerbstaetigkeitPage = new ErwerbstaetigkeitPOM(page, {
    elternteile: ["Annika", "Anton"],
  });
  await erwerbstaetigkeitPage.setErwerbstaetig(false, 1);
  await erwerbstaetigkeitPage.setErwerbstaetig(false, 2);
  await erwerbstaetigkeitPage.submit();

  const einkommenPage = new EinkommenPOM(page);
  await einkommenPage.setGesamteinkommenUeberschritten(false);
  await einkommenPage.submit();

  const rechnerUndPlaner = new RechnerPlanerPOM(page);
  await rechnerUndPlaner.waehleOption(3, "Basis", "Annika");
  await rechnerUndPlaner.waehleOption(4, "Basis", "Annika");
  await rechnerUndPlaner.waehleOption(5, "Basis", "Annika");
  await rechnerUndPlaner.waehleOption(11, "Plus", "Annika");
  await rechnerUndPlaner.waehleOption(1, "Basis", "Anton");
  await rechnerUndPlaner.waehleOption(6, "Basis", "Anton");
  await rechnerUndPlaner.waehleOption(7, "Basis", "Anton");
  await rechnerUndPlaner.waehleOption(8, "Basis", "Anton");
  await rechnerUndPlaner.waehleOption(9, "Basis", "Anton");
  await rechnerUndPlaner.waehleOption(10, "Basis", "Anton");
  await rechnerUndPlaner.waehleOption(11, "Plus", "Anton");
  await rechnerUndPlaner.submit();

  const datenuebernahmeAntragPage = new DatenuebernahmeAntragPOM(page);

  const actualCompleteFormPdfTexts =
    await datenuebernahmeAntragPage.downloadCompleteForm();
  const referenceCompleteFormPdfTexts =
    await datenuebernahmeAntragPage.getReferencePdfAntrag(false);
  expect(actualCompleteFormPdfTexts).toEqual(referenceCompleteFormPdfTexts);

  const actualSinglePagePdfTexts =
    await datenuebernahmeAntragPage.downloadSinglePage();
  const referenceSinglePagePdfTexts =
    await datenuebernahmeAntragPage.getReferencePdfSeite(false);
  expect(actualSinglePagePdfTexts).toEqual(referenceSinglePagePdfTexts);

  await screenshot("planungsuebersicht", page.getByLabel("Planungsübersicht"));
  await screenshot(
    "planungsdetails",
    page.getByLabel("Planung der Monate im Detail"),
  );
});

test("gemeinsam, nicht unterstütztes Bundesland", async ({ page }) => {
  const screenshot = expectScreenshot({ page });

  const allgemeineAngabenPage = await new AllgemeineAngabenPOM(page).goto();
  await allgemeineAngabenPage.setBundesland("Bayern");
  await allgemeineAngabenPage.setAlleinerziehend(false);
  await allgemeineAngabenPage.setElternteile(2);
  await allgemeineAngabenPage.setNameElternteil1("Annika");
  await allgemeineAngabenPage.setNameElternteil2("Anton");
  await allgemeineAngabenPage.setMutterschutz("Annika");
  await allgemeineAngabenPage.submit();

  const nachwuchsPage = new NachwuchsPOM(page);
  await nachwuchsPage.setGeburtsdatum("01.01.2026");
  await nachwuchsPage.submit();

  const erwerbstaetigkeitPage = new ErwerbstaetigkeitPOM(page, {
    elternteile: ["Annika", "Anton"],
  });
  await erwerbstaetigkeitPage.setErwerbstaetig(false, 1);
  await erwerbstaetigkeitPage.setErwerbstaetig(false, 2);
  await erwerbstaetigkeitPage.submit();

  const einkommenPage = new EinkommenPOM(page);
  await einkommenPage.setGesamteinkommenUeberschritten(false);
  await einkommenPage.submit();

  const rechnerUndPlaner = new RechnerPlanerPOM(page);
  await rechnerUndPlaner.waehleOption(3, "Basis", "Annika");
  await rechnerUndPlaner.waehleOption(4, "Basis", "Annika");
  await rechnerUndPlaner.waehleOption(5, "Basis", "Anton");
  await rechnerUndPlaner.waehleOption(6, "Basis", "Anton");
  await rechnerUndPlaner.submit();

  const datenuebernahmeAntragPage = new DatenuebernahmeAntragPOM(page);
  await expect(datenuebernahmeAntragPage.heading).toBeVisible();

  await screenshot("planungsuebersicht", page.getByLabel("Planungsübersicht"));
  await screenshot(
    "planungsdetails",
    page.getByLabel("Planung der Monate im Detail"),
  );
});

test("alleine, unterstütztes Bundesland", async ({ page }) => {
  const screenshot = expectScreenshot({ page });

  const allgemeineAngabenPage = await new AllgemeineAngabenPOM(page).goto();
  await allgemeineAngabenPage.setBundesland("Berlin");
  await allgemeineAngabenPage.setAlleinerziehend(true);
  await allgemeineAngabenPage.setMutterschutzFuerEinePerson(true);
  await allgemeineAngabenPage.submit();

  const nachwuchsPage = new NachwuchsPOM(page);
  await nachwuchsPage.setGeburtsdatum("01.01.2026");
  await nachwuchsPage.submit();

  const erwerbstaetigkeitPage = new ErwerbstaetigkeitPOM(page, {});
  await erwerbstaetigkeitPage.setErwerbstaetig(false);
  await erwerbstaetigkeitPage.submit();

  const einkommenPage = new EinkommenPOM(page);
  await einkommenPage.setGesamteinkommenUeberschritten(false);
  await einkommenPage.submit();

  const rechnerUndPlaner = new RechnerPlanerPOM(page);
  await rechnerUndPlaner.waehleOption(3, "Basis");
  await rechnerUndPlaner.waehleOption(4, "Basis");
  await rechnerUndPlaner.waehleOption(5, "Basis");
  await rechnerUndPlaner.waehleOption(6, "Basis");
  await rechnerUndPlaner.waehleOption(9, "Plus");
  await rechnerUndPlaner.waehleOption(10, "Plus");
  await rechnerUndPlaner.submit();

  const datenuebernahmeAntragPage = new DatenuebernahmeAntragPOM(page);
  const actualCompleteFormPdfValues =
    await datenuebernahmeAntragPage.downloadCompleteForm();
  const referenceCompleteFormPdfValues =
    await datenuebernahmeAntragPage.getReferencePdfAntrag(true);
  expect(actualCompleteFormPdfValues).toEqual(referenceCompleteFormPdfValues);

  const actualSinglePagePdfValues =
    await datenuebernahmeAntragPage.downloadSinglePage();
  const referenceSinglePagePdfValues =
    await datenuebernahmeAntragPage.getReferencePdfSeite(true);
  expect(actualSinglePagePdfValues).toEqual(referenceSinglePagePdfValues);

  await screenshot("planungsuebersicht", page.getByLabel("Planungsübersicht"));
  await screenshot(
    "planungsdetails",
    page.getByLabel("Planung der Monate im Detail"),
  );
});

test("alleine, nicht unterstütztes Bundesland", async ({ page }) => {
  const screenshot = expectScreenshot({ page });

  const allgemeineAngabenPage = await new AllgemeineAngabenPOM(page).goto();
  await allgemeineAngabenPage.setBundesland("Bayern");
  await allgemeineAngabenPage.setAlleinerziehend(true);
  await allgemeineAngabenPage.setMutterschutzFuerEinePerson(true);
  await allgemeineAngabenPage.submit();

  const nachwuchsPage = new NachwuchsPOM(page);
  await nachwuchsPage.setGeburtsdatum("01.01.2026");
  await nachwuchsPage.submit();

  const erwerbstaetigkeitPage = new ErwerbstaetigkeitPOM(page, {});
  await erwerbstaetigkeitPage.setErwerbstaetig(false);
  await erwerbstaetigkeitPage.submit();

  const einkommenPage = new EinkommenPOM(page);
  await einkommenPage.setGesamteinkommenUeberschritten(false);
  await einkommenPage.submit();

  const rechnerUndPlaner = new RechnerPlanerPOM(page);
  await rechnerUndPlaner.waehleOption(3, "Basis");
  await rechnerUndPlaner.waehleOption(4, "Basis");
  await rechnerUndPlaner.waehleOption(5, "Basis");
  await rechnerUndPlaner.waehleOption(6, "Basis");
  await rechnerUndPlaner.submit();

  const datenuebernahmeAntragPage = new DatenuebernahmeAntragPOM(page);
  await expect(datenuebernahmeAntragPage.heading).toBeVisible();

  await screenshot("planungsuebersicht", page.getByLabel("Planungsübersicht"));
  await screenshot(
    "planungsdetails",
    page.getByLabel("Planung der Monate im Detail"),
  );
});
