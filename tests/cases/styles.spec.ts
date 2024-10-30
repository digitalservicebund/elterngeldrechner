import { test, expect, Page } from "@playwright/test";
import { AllgemeineAngabenPOM } from "../pom/AllgemeineAngabenPOM";
import { NachwuchsPOM } from "../pom/NachwuchsPOM";
import { ErwerbstaetigkeitPOM } from "../pom/ErwerbstaetigkeitPOM";
import { EinkommenPOM } from "../pom/EinkommenPOM";
import { VariantenPOM } from "../pom/VariantenPOM";
import expectScreenshot from "../expectScreenshot";

const testStyles = async ({
  page,
  screenSize,
}: {
  page: Page;
  screenSize: string;
}) => {
  const screenshot = expectScreenshot({ page, screenSize });

  const allgemeineAngabenPage = await new AllgemeineAngabenPOM(page).goto();
  await expect(allgemeineAngabenPage.heading).toBeVisible();
  if (screenSize === "mobile") await page.waitForTimeout(1000); // It's just needed, I don't know why
  await screenshot("allgemeine-angaben-heading", allgemeineAngabenPage.heading);
  await screenshot(
    "allgemeine-angaben-elternteile",
    allgemeineAngabenPage.elternteile,
  );
  await allgemeineAngabenPage.submit();

  await expect(allgemeineAngabenPage.elternteileError).toBeVisible();
  await screenshot(
    "allgemeine-angaben-elternteile-fehlermeldung",
    allgemeineAngabenPage.elternteile,
  );
  await allgemeineAngabenPage.setElternteile(1);
  await screenshot(
    "allgemeine-angaben-elternteile-ausgewaehlt",
    allgemeineAngabenPage.elternteile,
  );
  await expect(allgemeineAngabenPage.alleinerziehend).toBeVisible();
  await screenshot(
    "allgemeine-angaben-alleinerziehend",
    allgemeineAngabenPage.alleinerziehend,
  );
  await expect(allgemeineAngabenPage.mutterschaftsleistungen).toBeVisible();
  await screenshot(
    "allgemeine-angaben-mutterschaftsleistung",
    allgemeineAngabenPage.mutterschaftsleistungen,
  );
  await allgemeineAngabenPage.submit();

  await expect(allgemeineAngabenPage.elternteileError).not.toBeVisible();
  await expect(allgemeineAngabenPage.alleinerziehendError).toBeVisible();
  await screenshot(
    "allgemeine-angaben-alleinerziehend-fehlermeldung",
    allgemeineAngabenPage.alleinerziehend,
  );
  await expect(
    allgemeineAngabenPage.mutterschaftsleistungenError,
  ).toBeVisible();
  await screenshot(
    "allgemeine-angaben-mutterschaftsleistung-fehlermeldung",
    allgemeineAngabenPage.mutterschaftsleistungen,
  );
  await allgemeineAngabenPage.setAlleinerziehend(true);
  await expect(allgemeineAngabenPage.alleinerziehendError).not.toBeVisible();
  await screenshot(
    "allgemeine-angaben-alleinerziehend-ausgewaehlt",
    allgemeineAngabenPage.alleinerziehend,
  );
  await expect(
    allgemeineAngabenPage.mutterschaftsleistungenError,
  ).toBeVisible();
  await allgemeineAngabenPage.setMutterschaftsleistungen(true);
  await screenshot(
    "allgemeine-angaben-mutterschaftsleistung-ausgewaehlt",
    allgemeineAngabenPage.mutterschaftsleistungen,
  );
  await expect(
    allgemeineAngabenPage.mutterschaftsleistungenError,
  ).not.toBeVisible();
  await screenshot("allgemeine-angaben-single", page.locator("#egr-root"));

  await allgemeineAngabenPage.setElternteile(2);
  await expect(allgemeineAngabenPage.nameElternteil1).toBeVisible();
  await expect(allgemeineAngabenPage.nameElternteil2).toBeVisible();
  await screenshot(
    "allgemeine-angaben-name-1",
    allgemeineAngabenPage.nameElternteil1,
  );
  await screenshot(
    "allgemeine-angaben-name-2",
    allgemeineAngabenPage.nameElternteil2,
  );
  await allgemeineAngabenPage.submit();

  await expect(
    allgemeineAngabenPage.mutterschaftsleistungenWerError,
  ).toBeVisible();
  await allgemeineAngabenPage.setNameElternteil1("Leia");
  await screenshot(
    "allgemeine-angaben-name-1-ausgefuellt",
    allgemeineAngabenPage.nameElternteil1,
  );
  await allgemeineAngabenPage.setNameElternteil2("Luke");
  await screenshot(
    "allgemeine-angaben-name-2-ausgefuellt",
    allgemeineAngabenPage.nameElternteil2,
  );
  await screenshot(
    "allgemeine-angaben-mutterschaftsleistungen-wer",
    allgemeineAngabenPage.mutterschaftsleistungenWer,
  );
  await allgemeineAngabenPage.setMutterschaftsleistungenWer("Leia");
  await allgemeineAngabenPage.setNameElternteil1("");
  await screenshot("allgemeine-angaben-beide", page.locator("#egr-root"));
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

  const variantenPage = new VariantenPOM(page);
  await expect(variantenPage.heading).toBeVisible();
  await screenshot("varianten-geschlossen", page.locator("#egr-root"));
  await variantenPage.basiselterngeld.click();
  await variantenPage.elterngeldPlus.click();
  await variantenPage.partnerschaftsbonus.click();
  await screenshot("varianten-geoeffnet", page.locator("#egr-root"));
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
