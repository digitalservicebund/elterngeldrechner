import { test } from "@playwright/test";
import { AllgemeineAngabenPOM } from "../pom/AllgemeineAngabenPOM";
import { BeispielePOM } from "../pom/BeispielePOM";
import { EinkommenPOM } from "../pom/EinkommenPOM";
import { ErwerbstaetigkeitPOM } from "../pom/ErwerbstaetigkeitPOM";
import { NachwuchsPOM } from "../pom/NachwuchsPOM";
import { RechnerPlanerPOM } from "../pom/RechnerPlanerPOM";

test("beispiel partnerschaftlich aufgeteilt ", async ({ page }) => {
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

  const beispielePage = new BeispielePOM(page);
  await beispielePage.waehleOption("Partnerschaftlich aufgeteilt");
  await beispielePage.submit();

  const rechnerUndPlaner = new RechnerPlanerPOM(page);
  await rechnerUndPlaner.ueberpruefen();
  await rechnerUndPlaner.uebernehmen();
});

test("beispiel ein jahr elterngeld", async ({ page }) => {
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

  const beispielePage = new BeispielePOM(page);
  await beispielePage.waehleOption("Ein Jahr Elterngeld");
  await beispielePage.submit();

  const rechnerUndPlaner = new RechnerPlanerPOM(page);
  await rechnerUndPlaner.ueberpruefen();
  await rechnerUndPlaner.uebernehmen();
});
