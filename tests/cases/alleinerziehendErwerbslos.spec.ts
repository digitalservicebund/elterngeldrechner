import { test } from "@playwright/test";
import { AllgemeineAngabenPOM } from "../pom/AllgemeineAngabenPOM";
import { NachwuchsPOM } from "../pom/NachwuchsPOM";
import { ErwerbstaetigkeitPOM } from "../pom/ErwerbstaetigkeitPOM";
import { EinkommenPOM } from "../pom/EinkommenPOM";
import { VariantenPOM } from "../pom/VariantenPOM";
import { RechnerPlanerPOM } from "../pom/RechnerPlanerPOM";
import { ZusammenfassungPOM } from "../pom/ZusammenfassungPOM";
import verifyPostRequestToElterngeldDigital from "../verifyPostRequestToElterngeldDigital";

/* eslint-disable testing-library/prefer-screen-queries */

test("alleinerziehend, erwerbslos", async ({ page }) => {
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

  const rechnerPlanerPage = new RechnerPlanerPOM(page);
  await rechnerPlanerPage.setKeinEinkommen();
  await rechnerPlanerPage.berechnen();

  await page
    .getByRole("button", { name: "Basiselterngeld für Lebensmonat 3" })
    .click();
  await page
    .getByRole("button", { name: "Basiselterngeld für Lebensmonat 4" })
    .click();
  await page
    .getByRole("button", { name: "Basiselterngeld für Lebensmonat 5" })
    .click();
  await page
    .getByRole("button", { name: "Basiselterngeld für Lebensmonat 6" })
    .click();
  await page
    .getByRole("button", { name: "Basiselterngeld für Lebensmonat 7" })
    .click();
  await page
    .getByRole("button", { name: "Basiselterngeld für Lebensmonat 8" })
    .click();
  await page
    .getByRole("button", { name: "Basiselterngeld für Lebensmonat 9" })
    .click();
  await page
    .getByRole("button", { name: "Basiselterngeld für Lebensmonat 10" })
    .click();
  await page
    .getByRole("button", { name: "Basiselterngeld für Lebensmonat 11" })
    .click();
  await page
    .getByRole("button", { name: "Basiselterngeld für Lebensmonat 12" })
    .click();
  await page
    .getByRole("button", { name: "Basiselterngeld für Lebensmonat 13" })
    .click();
  await page
    .getByRole("button", { name: "Basiselterngeld für Lebensmonat 14" })
    .click();

  await rechnerPlanerPage.submit();

  const zusammenfassungPage = new ZusammenfassungPOM(page);

  const expectedPostData = {
    alleinerziehend: "1",
    kind_geburtstag: "02.02.2025",
    mehrlinge_anzahl: "1",
    mutterschaftsleistung: "1",
    p1_et_nachgeburt: "0",
    p1_et_vorgeburt: "0",
    p1_vg_kirchensteuer: "0",
    p1_vg_nselbst_steuerklasse: "",
    planungP1:
      "1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0",
  };
  await verifyPostRequestToElterngeldDigital({ page, expectedPostData });

  await zusammenfassungPage.submit();
});
