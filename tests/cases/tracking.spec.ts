import { expect, Page, test } from "@playwright/test";
import { AllgemeineAngabenPOM } from "../pom/AllgemeineAngabenPOM";
import { NachwuchsPOM } from "../pom/NachwuchsPOM";
import { ErwerbstaetigkeitPOM } from "../pom/ErwerbstaetigkeitPOM";
import { EinkommenPOM } from "../pom/EinkommenPOM";
import { VariantenPOM } from "../pom/VariantenPOM";
import { RechnerPlanerPOM } from "../pom/RechnerPlanerPOM";
import {
  establishDataLayer,
  getTrackingVariableFrom,
} from "@/user-tracking/data-layer";

async function getTrackingVariable(page: Page, name: string) {
  const dataLayer = await page.evaluate(() => window._mtm!);

  return getTrackingVariableFrom(dataLayer, name);
}

test("10 monate basis und 2 monate mutterschaftsleistung", async ({ page }) => {
  test.slow();

  await page.addInitScript(establishDataLayer);

  const allgemeineAngabenPage = await new AllgemeineAngabenPOM(page).goto();
  await allgemeineAngabenPage.setElternteile(1);
  await allgemeineAngabenPage.setAlleinerziehend(true);
  await allgemeineAngabenPage.setMutterschaftsleistungen(true);
  await allgemeineAngabenPage.submit();

  const nachwuchsPage = new NachwuchsPOM(page);
  await nachwuchsPage.setGeburtsdatum("02.02.2025");
  await nachwuchsPage.setAnzahlKinder(1);
  await nachwuchsPage.submit();

  const erwerbstaetigkeitPage = new ErwerbstaetigkeitPOM(page, {});
  await erwerbstaetigkeitPage.setErwerbstaetig(false);
  await erwerbstaetigkeitPage.submit();

  const einkommenPage = new EinkommenPOM(page);
  await einkommenPage.setGesamteinkommenUeberschritten(false);
  await einkommenPage.submit();

  const variantenPage = new VariantenPOM(page);
  await variantenPage.submit();

  const rechnerUndPlaner = new RechnerPlanerPOM(page);

  await rechnerUndPlaner.waehleOption(3, "Basis");
  await rechnerUndPlaner.waehleOption(4, "Basis");
  await rechnerUndPlaner.waehleOption(5, "Basis");
  await rechnerUndPlaner.waehleOption(6, "Basis");
  await rechnerUndPlaner.waehleOption(7, "Basis");
  await rechnerUndPlaner.waehleOption(8, "Basis");
  await rechnerUndPlaner.waehleOption(9, "Basis");
  await rechnerUndPlaner.waehleOption(10, "Basis");
  await rechnerUndPlaner.waehleOption(11, "Basis");
  await rechnerUndPlaner.waehleOption(12, "Basis");
  await rechnerUndPlaner.submit();

  expect(await getTrackingVariable(page, "geplante-monate")).toEqual(12);
  expect(await getTrackingVariable(page, "aenderungen-am-plan")).toEqual(10);
});

test("paar das mutterschaftsleistung und bonus nimmt", async ({ page }) => {
  test.slow();

  await page.addInitScript(establishDataLayer);

  const allgemeineAngabenPage = new AllgemeineAngabenPOM(page);
  await allgemeineAngabenPage.goto();
  await allgemeineAngabenPage.setElternteile(2);
  await allgemeineAngabenPage.setNameElternteil1("Jane");
  await allgemeineAngabenPage.setNameElternteil2("John");
  await allgemeineAngabenPage.setMutterschaftsleistungen(true);
  await allgemeineAngabenPage.setMutterschaftsleistungenWer("Jane");
  await allgemeineAngabenPage.submit();

  const nachwuchsPage = new NachwuchsPOM(page);
  await nachwuchsPage.setGeburtsdatum("02.02.2025");
  await nachwuchsPage.setAnzahlKinder(1);
  await nachwuchsPage.submit();

  const erwerbstaetigkeitPage = new ErwerbstaetigkeitPOM(page, {
    elternteile: ["Jane", "John"],
  });
  await erwerbstaetigkeitPage.setErwerbstaetig(false, 1);
  await erwerbstaetigkeitPage.setErwerbstaetig(false, 2);
  await erwerbstaetigkeitPage.submit();

  const einkommenPage = new EinkommenPOM(page);
  await einkommenPage.setGesamteinkommenUeberschritten(false);
  await einkommenPage.submit();

  const variantenPage = new VariantenPOM(page);
  await variantenPage.submit();

  const rechnerUndPlaner = new RechnerPlanerPOM(page, {
    elternteile: ["Jane", "John"],
  });
  await rechnerUndPlaner.zeigeMehrLebensmonateAn();
  await rechnerUndPlaner.waehleOption(1, "Plus", "John");
  await rechnerUndPlaner.waehleOption(2, "Plus", "John");
  await rechnerUndPlaner.waehleOption(4, "Bonus", "Jane");
  await rechnerUndPlaner.gebeEinkommenAn(4, 1500, "Jane");
  await rechnerUndPlaner.gebeEinkommenAn(4, 1500, "John");
  await rechnerUndPlaner.gebeEinkommenAn(5, 1500, "Jane");
  await rechnerUndPlaner.gebeEinkommenAn(5, 1500, "John");
  await rechnerUndPlaner.submit();

  expect(await getTrackingVariable(page, "geplante-monate")).toEqual(8);
  expect(await getTrackingVariable(page, "aenderungen-am-plan")).toEqual(3);
});

test("feedback in der planung", async ({ page }) => {
  test.slow();

  await page.addInitScript(establishDataLayer);

  const allgemeineAngabenPage = new AllgemeineAngabenPOM(page);
  await allgemeineAngabenPage.goto();
  await allgemeineAngabenPage.setElternteile(2);
  await allgemeineAngabenPage.setNameElternteil1("Jane");
  await allgemeineAngabenPage.setNameElternteil2("John");
  await allgemeineAngabenPage.setMutterschaftsleistungen(true);
  await allgemeineAngabenPage.setMutterschaftsleistungenWer("Jane");
  await allgemeineAngabenPage.submit();

  const nachwuchsPage = new NachwuchsPOM(page);
  await nachwuchsPage.setGeburtsdatum("02.02.2025");
  await nachwuchsPage.setAnzahlKinder(1);
  await nachwuchsPage.submit();

  const erwerbstaetigkeitPage = new ErwerbstaetigkeitPOM(page, {
    elternteile: ["Jane", "John"],
  });
  await erwerbstaetigkeitPage.setErwerbstaetig(false, 1);
  await erwerbstaetigkeitPage.setErwerbstaetig(false, 2);
  await erwerbstaetigkeitPage.submit();

  const einkommenPage = new EinkommenPOM(page);
  await einkommenPage.setGesamteinkommenUeberschritten(false);
  await einkommenPage.submit();

  const variantenPage = new VariantenPOM(page);
  await variantenPage.submit();

  const rechnerUndPlaner = new RechnerPlanerPOM(page, {
    elternteile: ["Jane", "John"],
  });

  await rechnerUndPlaner.zeigeMehrLebensmonateAn();
  await rechnerUndPlaner.waehleOption(1, "Plus", "John");
  await rechnerUndPlaner.waehleOption(2, "Plus", "John");
  await rechnerUndPlaner.waehleOption(3, "Basis", "Jane");
  await rechnerUndPlaner.waehleOption(3, "Basis", "John");

  await page.locator(`input[name="ease"][value="2"]`).check();
  await page.locator(`input[name="obstacle"][value="Angaben machen"]`).check();
  await page.locator("#feedback-submit-button").click();

  expect(await getTrackingVariable(page, "customer-effort-score-ease")).toEqual(
    2,
  );

  expect(
    await getTrackingVariable(page, "customer-effort-score-obstacle"),
  ).toEqual("Angaben machen");
});
