import { Page, expect, test } from "@playwright/test";
import { AllgemeineAngabenPOM } from "../pom/AllgemeineAngabenPOM";
import { EinkommenPOM } from "../pom/EinkommenPOM";
import { ErwerbstaetigkeitPOM } from "../pom/ErwerbstaetigkeitPOM";
import { NachwuchsPOM } from "../pom/NachwuchsPOM";

const testStyles = async ({
  page,
  screenSize,
}: {
  page: Page;
  screenSize: string;
}) => {
  const allgemeineAngabenPage = await new AllgemeineAngabenPOM(page).goto();
  await expect(allgemeineAngabenPage.heading).toBeVisible();
  if (screenSize === "mobile") await page.waitForTimeout(1000); // It's just needed, I don't know why

  await expect(allgemeineAngabenPage.alleinerziehend).toBeVisible();

  await allgemeineAngabenPage.submit();

  await expect(allgemeineAngabenPage.alleinerziehendError).toBeVisible();

  await allgemeineAngabenPage.setBundesland("Berlin");
  await allgemeineAngabenPage.setAlleinerziehend(false);

  await allgemeineAngabenPage.submit();

  await expect(allgemeineAngabenPage.elternteileError).toBeVisible();

  await allgemeineAngabenPage.setAlleinerziehend(true);

  await expect(allgemeineAngabenPage.alleinerziehendError).not.toBeVisible();

  await expect(allgemeineAngabenPage.alleinerziehendError).not.toBeVisible();

  await expect(allgemeineAngabenPage.mutterschutz).toBeVisible();

  await allgemeineAngabenPage.submit();

  await expect(allgemeineAngabenPage.mutterschutzError).toBeVisible();

  await allgemeineAngabenPage.setMutterschutzFuerEinePerson(true);

  await expect(allgemeineAngabenPage.mutterschutzError).not.toBeVisible();

  await allgemeineAngabenPage.setAlleinerziehend(false);

  await allgemeineAngabenPage.setElternteile(2);

  await allgemeineAngabenPage.setNameElternteil1("Leia");
  await allgemeineAngabenPage.setNameElternteil2("Luke");

  await allgemeineAngabenPage.setMutterschutz("Leia");
  await allgemeineAngabenPage.setNameElternteil1("Elternteil 1");

  await allgemeineAngabenPage.submit();

  // TODO
  const nachwuchsPage = new NachwuchsPOM(page);
  await nachwuchsPage.setGeburtsdatum("02.02.2025");
  await nachwuchsPage.setAnzahlKinder(1);
  await nachwuchsPage.submit();

  // TODO
  const erwerbstaetigkeitPage = new ErwerbstaetigkeitPOM(page, {
    elternteile: ["Elternteil 1", "Luke"],
  });
  await erwerbstaetigkeitPage.setErwerbstaetig(false, 1);
  await erwerbstaetigkeitPage.setErwerbstaetig(false, 2);
  await erwerbstaetigkeitPage.submit();

  // TODO
  const einkommenPage = new EinkommenPOM(page);
  await einkommenPage.setGesamteinkommenUeberschritten(false);
  await einkommenPage.submit();
};

test("mobile styles", async ({ page }) => {
  test.slow();
  await page.setViewportSize({
    width: 320,
    height: 900,
  });
  return testStyles({ page, screenSize: "mobile" });
});

test("tablet styles", async ({ page }) => {
  test.slow();
  await page.setViewportSize({
    width: 900,
    height: 700,
  });
  return testStyles({ page, screenSize: "tablet" });
});

test("desktop styles", async ({ page }) => {
  test.slow();
  await page.setViewportSize({
    width: 1500,
    height: 1000,
  });
  return testStyles({ page, screenSize: "desktop" });
});
