import { expect, test } from "@playwright/test";
import expectScreenshot from "../expectScreenshot";
import { AllgemeineAngabenPOM } from "../pom/AllgemeineAngabenPOM";
import { EinkommenPOM } from "../pom/EinkommenPOM";
import { ErwerbstaetigkeitPOM } from "../pom/ErwerbstaetigkeitPOM";
import { NachwuchsPOM } from "../pom/NachwuchsPOM";
import { RechnerPlanerPOM } from "../pom/RechnerPlanerPOM";
import { VariantenPOM } from "../pom/VariantenPOM";
import { ZusammenfassungPOM } from "../pom/ZusammenfassungPOM";

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
