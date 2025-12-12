import { Page, expect, test } from "@playwright/test";
import { AllgemeineAngabenPOM } from "../pom/AllgemeineAngabenPOM";
import { BeispielePOM } from "../pom/BeispielePOM";
import { CookieBannerPOM } from "../pom/CookieBannerPOM";
import { DatenuebernahmeAntragPOM } from "../pom/DatenuebernahmeAntragPOM";
import { EinkommenPOM } from "../pom/EinkommenPOM";
import { ErwerbstaetigkeitPOM } from "../pom/ErwerbstaetigkeitPOM";
import { FeedbackPOM } from "../pom/FeedbackPOM";
import { NachwuchsPOM } from "../pom/NachwuchsPOM";
import { RechnerPlanerPOM } from "../pom/RechnerPlanerPOM";

import {
  establishDataLayer,
  getTrackingVariableFrom,
} from "@/application/user-tracking/core/data-layer";

test("feedback in der planung bei schwieriger benutzung", async ({ page }) => {
  test.slow();

  await page.addInitScript(establishDataLayer);

  await new AllgemeineAngabenPOM(page).goto();

  const cookieBanner = new CookieBannerPOM(page);
  await cookieBanner.consent();

  await fastForwardToPlaner(page);

  const feedbackForm = new FeedbackPOM(page);
  await feedbackForm.waehleEase(3);
  await feedbackForm.waehleObstacle("Angaben machen");
  await feedbackForm.submit();

  expect(await getEaseTrackingVariable(page)()).toEqual(3);
  expect(await getObstacleTrackingVariable(page)()).toEqual("Angaben machen");

  expect(await feedbackForm.appreciation.isVisible()).toBeTruthy();
});

test("feedback in der planung bei leichter benutzung", async ({ page }) => {
  test.slow();

  await page.addInitScript(establishDataLayer);

  await new AllgemeineAngabenPOM(page).goto();

  const cookieBanner = new CookieBannerPOM(page);
  await cookieBanner.consent();

  await fastForwardToPlaner(page);

  const feedbackForm = new FeedbackPOM(page);
  await feedbackForm.waehleEase(2);
  await feedbackForm.submit();

  expect(await getEaseTrackingVariable(page)()).toEqual(2);

  expect(await feedbackForm.appreciation.isVisible()).toBeTruthy();
});

test("feedback in der planung wird nur ein mal abgefragt", async ({ page }) => {
  test.slow();

  await page.addInitScript(establishDataLayer);

  await new AllgemeineAngabenPOM(page).goto();

  const cookieBanner = new CookieBannerPOM(page);
  await cookieBanner.consent();

  const rechnerUndPlaner = await fastForwardToPlaner(page);

  const feedbackForm = new FeedbackPOM(page);
  await feedbackForm.waehleEase(3);
  await feedbackForm.waehleObstacle("Angaben machen");
  await feedbackForm.submit();

  expect(await feedbackForm.appreciation.isVisible()).toBeTruthy();

  await rechnerUndPlaner.ueberpruefen();
  await rechnerUndPlaner.uebernehmen();

  expect(await feedbackForm.appreciation.isVisible()).toBeFalsy();

  const datenuebernahmeAntragPage = new DatenuebernahmeAntragPOM(page);
  await datenuebernahmeAntragPage.back();

  await expect(rechnerUndPlaner.heading).toBeVisible();
  await expect(feedbackForm.appreciation).not.toBeVisible();
});

test("feedback wird nicht ohne consent angezeigt", async ({ page }) => {
  test.slow();

  await page.addInitScript(establishDataLayer);

  await new AllgemeineAngabenPOM(page).goto();

  const cookieBanner = new CookieBannerPOM(page);
  await cookieBanner.dissent();

  await fastForwardToPlaner(page);

  const feedbackForm = new FeedbackPOM(page);

  expect(await feedbackForm.easeQuestion.isVisible()).toBeFalsy();
});

const getEaseTrackingVariable = (page: Page) => () => {
  return getTrackingVariable(page, "customer-effort-score-ease");
};

const getObstacleTrackingVariable = (page: Page) => () => {
  return getTrackingVariable(page, "customer-effort-score-obstacle");
};

async function getTrackingVariable(page: Page, name: string) {
  const dataLayer = await page.evaluate(() => window._mtm!);

  return getTrackingVariableFrom(dataLayer, name);
}

async function fastForwardToPlaner(page: Page) {
  await fastForwardAllgemeineAngaben(page);
  await fastForwardNachwuchs(page);
  await fastForwardErwerbstaetigkeit(page);
  await fastForwardEinkommen(page);
  await fastForwardBeispiele(page);

  return await fastForwardPlanung(page);
}

async function fastForwardAllgemeineAngaben(page: Page) {
  const allgemeineAngabenPage = new AllgemeineAngabenPOM(page);
  await allgemeineAngabenPage.setBundesland("Berlin");
  await allgemeineAngabenPage.setAlleinerziehend(false);
  await allgemeineAngabenPage.setElternteile(2);
  await allgemeineAngabenPage.setNameElternteil1("Jane");
  await allgemeineAngabenPage.setNameElternteil2("John");
  await allgemeineAngabenPage.setMutterschutz("Jane");
  await allgemeineAngabenPage.submit();
}

async function fastForwardNachwuchs(page: Page) {
  const nachwuchsPage = new NachwuchsPOM(page);
  await nachwuchsPage.setGeburtsdatum("02.02.2025");
  await nachwuchsPage.setAnzahlKinder(1);
  await nachwuchsPage.submit();
}

async function fastForwardErwerbstaetigkeit(page: Page) {
  const erwerbstaetigkeitPage = new ErwerbstaetigkeitPOM(page, {
    elternteile: ["Jane", "John"],
  });
  await erwerbstaetigkeitPage.setErwerbstaetig(false, 1);
  await erwerbstaetigkeitPage.setErwerbstaetig(false, 2);
  await erwerbstaetigkeitPage.submit();
}

async function fastForwardEinkommen(page: Page) {
  const einkommenPage = new EinkommenPOM(page);
  await einkommenPage.setGesamteinkommenUeberschritten(false);
  await einkommenPage.submit();
}

async function fastForwardBeispiele(page: Page) {
  const beispielePage = new BeispielePOM(page);
  await beispielePage.waehleOption("Eigene Planung");
  await beispielePage.submit();
}

async function fastForwardPlanung(page: Page) {
  const rechnerUndPlaner = new RechnerPlanerPOM(page, {
    elternteile: ["Jane", "John"],
  });

  await rechnerUndPlaner.zeigeMehrLebensmonateAn();
  await rechnerUndPlaner.waehleOption(1, "Plus", "John");
  await rechnerUndPlaner.waehleOption(2, "Plus", "John");
  await rechnerUndPlaner.waehleOption(3, "Basis", "Jane");
  await rechnerUndPlaner.waehleOption(3, "Basis", "John");

  return rechnerUndPlaner;
}
