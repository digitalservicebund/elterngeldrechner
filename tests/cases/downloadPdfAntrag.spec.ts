import { expect, test } from "@playwright/test";
import { AllgemeineAngabenPOM } from "../pom/AllgemeineAngabenPOM";
import { BeispielePOM } from "../pom/BeispielePOM";
import { CookieBannerPOM } from "../pom/CookieBannerPOM";
import { DatenuebernahmeAntragPOM } from "../pom/DatenuebernahmeAntragPOM";
import { EinkommenPOM } from "../pom/EinkommenPOM";
import { ErwerbstaetigkeitPOM } from "../pom/ErwerbstaetigkeitPOM";
import { NachwuchsPOM } from "../pom/NachwuchsPOM";
import { RechnerPlanerPOM } from "../pom/RechnerPlanerPOM";

test("gemeinsam, unterstütztes Bundesland", async ({ page }) => {
  const allgemeineAngabenPage = await new AllgemeineAngabenPOM(page).goto();

  const cookieBanner = new CookieBannerPOM(page);
  await cookieBanner.consent();

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

  const beispielePage = new BeispielePOM(page);
  await beispielePage.waehleOption("Eigene Planung");
  await beispielePage.submit();

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
  await rechnerUndPlaner.ueberpruefen();
  await rechnerUndPlaner.uebernehmen();

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
});

test("gemeinsam, nicht unterstütztes Bundesland", async ({ page }) => {
  const allgemeineAngabenPage = await new AllgemeineAngabenPOM(page).goto();

  const cookieBanner = new CookieBannerPOM(page);
  await cookieBanner.consent();

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

  const beispielePage = new BeispielePOM(page);
  await beispielePage.waehleOption("Eigene Planung");
  await beispielePage.submit();

  const rechnerUndPlaner = new RechnerPlanerPOM(page);
  await rechnerUndPlaner.waehleOption(3, "Basis", "Annika");
  await rechnerUndPlaner.waehleOption(4, "Basis", "Annika");
  await rechnerUndPlaner.waehleOption(5, "Basis", "Anton");
  await rechnerUndPlaner.waehleOption(6, "Basis", "Anton");
  await rechnerUndPlaner.ueberpruefen();
  await rechnerUndPlaner.uebernehmen();

  const datenuebernahmeAntragPage = new DatenuebernahmeAntragPOM(page);
  await expect(datenuebernahmeAntragPage.heading).toBeVisible();
});

test("alleine, unterstütztes Bundesland", async ({ page }) => {
  const allgemeineAngabenPage = await new AllgemeineAngabenPOM(page).goto();

  const cookieBanner = new CookieBannerPOM(page);
  await cookieBanner.consent();

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

  const beispielePage = new BeispielePOM(page);
  await beispielePage.waehleOption("Eigene Planung");
  await beispielePage.submit();

  const rechnerUndPlaner = new RechnerPlanerPOM(page);
  await rechnerUndPlaner.waehleOption(3, "Basis");
  await rechnerUndPlaner.waehleOption(4, "Basis");
  await rechnerUndPlaner.waehleOption(5, "Basis");
  await rechnerUndPlaner.waehleOption(6, "Basis");
  await rechnerUndPlaner.waehleOption(9, "Plus");
  await rechnerUndPlaner.waehleOption(10, "Plus");
  await rechnerUndPlaner.ueberpruefen();
  await rechnerUndPlaner.uebernehmen();

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
});

test("alleine, nicht unterstütztes Bundesland", async ({ page }) => {
  const allgemeineAngabenPage = await new AllgemeineAngabenPOM(page).goto();

  const cookieBanner = new CookieBannerPOM(page);
  await cookieBanner.consent();

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

  const beispielePage = new BeispielePOM(page);
  await beispielePage.waehleOption("Eigene Planung");
  await beispielePage.submit();

  const rechnerUndPlaner = new RechnerPlanerPOM(page);
  await rechnerUndPlaner.waehleOption(3, "Basis");
  await rechnerUndPlaner.waehleOption(4, "Basis");
  await rechnerUndPlaner.waehleOption(5, "Basis");
  await rechnerUndPlaner.waehleOption(6, "Basis");
  await rechnerUndPlaner.ueberpruefen();
  await rechnerUndPlaner.uebernehmen();

  const datenuebernahmeAntragPage = new DatenuebernahmeAntragPOM(page);
  await expect(datenuebernahmeAntragPage.heading).toBeVisible();
});
