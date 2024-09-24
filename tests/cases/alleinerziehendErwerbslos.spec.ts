import { test, expect } from "@playwright/test";
import { AllgemeineAngabenPOM } from "../pom/AllgemeineAngabenPOM";
import { NachwuchsPOM } from "../pom/NachwuchsPOM";
import { ErwerbstaetigkeitPOM } from "../pom/ErwerbstaetigkeitPOM";
import { EinkommenPOM } from "../pom/EinkommenPOM";
import { VariantenPOM } from "../pom/VariantenPOM";
import { RechnerPlanerPOM } from "../pom/RechnerPlanerPOM";
import { ZusammenfassungPOM } from "../pom/ZusammenfassungPOM";
import expectScreenshot from "../expectScreenshot";

test("alleinerziehend, erwerbslos", async ({ page }) => {
  const screenshot = expectScreenshot({ page });

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
  await rechnerUndPlaner.setKeinEinkommen();
  await rechnerUndPlaner.berechnen();

  expect(await rechnerUndPlaner.getErgebnis(1, 1, 14, "Basis")).toHaveText(
    "300 €",
  );
  expect(
    await rechnerUndPlaner.getErgebnis(1, 1, 14, "Basis", true),
  ).toHaveText("300 €");
  expect(await rechnerUndPlaner.getErgebnis(1, 15, 32, "Basis")).toHaveText(
    "0 €1",
  );
  expect(
    await rechnerUndPlaner.getErgebnis(1, 15, 32, "Basis", true),
  ).toHaveText("0 €1");

  expect(await rechnerUndPlaner.getErgebnis(1, 1, 14, "Plus")).toHaveText(
    "150 €",
  );
  expect(await rechnerUndPlaner.getErgebnis(1, 1, 14, "Plus", true)).toHaveText(
    "150 €",
  );
  expect(await rechnerUndPlaner.getErgebnis(1, 15, 32, "Plus")).toHaveText(
    "150 €",
  );
  expect(
    await rechnerUndPlaner.getErgebnis(1, 15, 32, "Plus", true),
  ).toHaveText("150 €");

  expect(await rechnerUndPlaner.getErgebnis(1, 1, 14, "Bonus")).toHaveText(
    "150 €",
  );
  expect(
    await rechnerUndPlaner.getErgebnis(1, 1, 14, "Bonus", true),
  ).toHaveText("150 €");
  expect(await rechnerUndPlaner.getErgebnis(1, 15, 32, "Bonus")).toHaveText(
    "150 €",
  );
  expect(
    await rechnerUndPlaner.getErgebnis(1, 15, 32, "Bonus", true),
  ).toHaveText("150 €");

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
  await rechnerUndPlaner.waehleOption(13, "Basis");
  await rechnerUndPlaner.waehleOption(14, "Basis");
  await rechnerUndPlaner.submit();

  const zusammenfassungPage = new ZusammenfassungPOM(page);
  await expect(zusammenfassungPage.heading).toBeVisible();

  await screenshot("planungsuebersicht", page.getByLabel("Planungsübersicht"));
  await screenshot(
    "planungsdetails",
    page.getByLabel("Planung der Monate im Detail"),
  );
});
