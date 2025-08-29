import { expect, test } from "@playwright/test";
import { AllgemeineAngabenPOM } from "../pom/AllgemeineAngabenPOM";
import { BeispielePOM } from "../pom/BeispielePOM";
import { DatenuebernahmeAntragPOM } from "../pom/DatenuebernahmeAntragPOM";
import { EinkommenPOM } from "../pom/EinkommenPOM";
import { ErwerbstaetigkeitPOM } from "../pom/ErwerbstaetigkeitPOM";
import { NachwuchsPOM } from "../pom/NachwuchsPOM";
import { RechnerPlanerPOM } from "../pom/RechnerPlanerPOM";

test("alleinerziehend, erwerbslos", async ({ page }) => {
  const allgemeineAngabenPage = await new AllgemeineAngabenPOM(page).goto();
  await allgemeineAngabenPage.setBundesland("Berlin");
  await allgemeineAngabenPage.setAlleinerziehend(true);
  await allgemeineAngabenPage.setMutterschutzFuerEinePerson(true);
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

  const beispielePage = new BeispielePOM(page);
  await beispielePage.waehleOption("Eigene Planung");
  await beispielePage.submit();

  const rechnerUndPlaner = new RechnerPlanerPOM(page);

  await rechnerUndPlaner.waehleOption(5, "Basis");
  await rechnerUndPlaner.waehleOption(6, "Basis");
  await rechnerUndPlaner.waehleOption(7, "Basis");
  await rechnerUndPlaner.waehleOption(8, "Basis");
  await rechnerUndPlaner.waehleOption(9, "Basis");
  await rechnerUndPlaner.waehleOption(10, "Basis");
  await rechnerUndPlaner.waehleOption(11, "Basis");
  await rechnerUndPlaner.waehleOption(12, "Basis");
  await rechnerUndPlaner.waehleOption(13, "Basis");
  await rechnerUndPlaner.waehleOption(14, "Basis");

  await rechnerUndPlaner.ueberpruefen();
  await rechnerUndPlaner.uebernehmen();

  const datenuebernahmeAntragPage = new DatenuebernahmeAntragPOM(page);
  await expect(datenuebernahmeAntragPage.heading).toBeVisible();
});
