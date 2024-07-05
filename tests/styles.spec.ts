import path from "node:path";
import { test, expect, Page, Locator } from "@playwright/test";
import { AllgemeineAngabenPOM } from "./pom/AllgemeineAngabenPOM";

const testStyles = async ({
  page,
  screenSize,
}: {
  page: Page;
  screenSize: string;
}) => {
  async function screenshot(locator: Locator, name: string) {
    // without timeout it produces blank screenshots
    // https://github.com/microsoft/playwright/issues/21657
    await page.waitForTimeout(2000);
    await expect(locator).toHaveScreenshot(`${name}-${screenSize}.png`, {
      stylePath: path.join(import.meta.dirname, "screenshot.css"),
    });
  }

  const allgemeineAngabenPage = await new AllgemeineAngabenPOM(page).goto();
  await expect(allgemeineAngabenPage.heading).toBeVisible();
  await screenshot(allgemeineAngabenPage.heading, "allgemeine-angaben-heading");
  await screenshot(
    allgemeineAngabenPage.elternteile,
    "allgemeine-angaben-elternteile",
  );
  await allgemeineAngabenPage.submit();

  await expect(allgemeineAngabenPage.elternteileError).toBeVisible();
  await screenshot(
    allgemeineAngabenPage.elternteile,
    "allgemeine-angaben-elternteile-fehlermeldung",
  );
  await allgemeineAngabenPage.setElternteile(1);
  await screenshot(
    allgemeineAngabenPage.elternteile,
    "allgemeine-angaben-elternteile-ausgewaehlt",
  );
  await expect(allgemeineAngabenPage.alleinerziehend).toBeVisible();
  await screenshot(
    allgemeineAngabenPage.alleinerziehend,
    "allgemeine-angaben-alleinerziehend",
  );
  await expect(allgemeineAngabenPage.mutterschaftsleistungen).toBeVisible();
  await screenshot(
    allgemeineAngabenPage.mutterschaftsleistungen,
    "allgemeine-angaben-mutterschaftsleistung",
  );
  await allgemeineAngabenPage.submit();

  await expect(allgemeineAngabenPage.elternteileError).not.toBeVisible();
  await expect(allgemeineAngabenPage.alleinerziehendError).toBeVisible();
  await screenshot(
    allgemeineAngabenPage.alleinerziehend,
    "allgemeine-angaben-alleinerziehend-fehlermeldung",
  );
  await expect(
    allgemeineAngabenPage.mutterschaftsleistungenError,
  ).toBeVisible();
  await screenshot(
    allgemeineAngabenPage.mutterschaftsleistungen,
    "allgemeine-angaben-mutterschaftsleistung-fehlermeldung",
  );
  await allgemeineAngabenPage.setAlleinerziehend(true);
  await expect(allgemeineAngabenPage.alleinerziehendError).not.toBeVisible();
  await screenshot(
    allgemeineAngabenPage.alleinerziehend,
    "allgemeine-angaben-alleinerziehend-ausgewaehlt",
  );
  await expect(
    allgemeineAngabenPage.mutterschaftsleistungenError,
  ).toBeVisible();
  await allgemeineAngabenPage.setMutterschaftsleistungen(true);
  await screenshot(
    allgemeineAngabenPage.mutterschaftsleistungen,
    "allgemeine-angaben-mutterschaftsleistung-ausgewaehlt",
  );
  await expect(
    allgemeineAngabenPage.mutterschaftsleistungenError,
  ).not.toBeVisible();
  await screenshot(page.locator("#egr-root"), "allgemeine-angaben-single");

  await allgemeineAngabenPage.setElternteile(2);
  await expect(allgemeineAngabenPage.nameElternteil1).toBeVisible();
  await expect(allgemeineAngabenPage.nameElternteil2).toBeVisible();
  await screenshot(
    allgemeineAngabenPage.nameElternteil1,
    "allgemeine-angaben-name-1",
  );
  await screenshot(
    allgemeineAngabenPage.nameElternteil2,
    "allgemeine-angaben-name-2",
  );
  await allgemeineAngabenPage.submit();

  await expect(
    allgemeineAngabenPage.mutterschaftsleistungenWerError,
  ).toBeVisible();
  await allgemeineAngabenPage.setNameElternteil1("Leia");
  await screenshot(
    allgemeineAngabenPage.nameElternteil1,
    "allgemeine-angaben-name-1-ausgefuellt",
  );
  await allgemeineAngabenPage.setNameElternteil2("Luke");
  await screenshot(
    allgemeineAngabenPage.nameElternteil2,
    "allgemeine-angaben-name-2-ausgefuellt",
  );
  await screenshot(
    allgemeineAngabenPage.mutterschaftsleistungenWer,
    "allgemeine-angaben-mutterschaftsleistungen-wer",
  );
  await allgemeineAngabenPage.setMutterschaftsleistungenWer("Leia");
  await allgemeineAngabenPage.setNameElternteil1("");
  await screenshot(page.locator("#egr-root"), "allgemeine-angaben-beide");
  await allgemeineAngabenPage.submit();

  // TODO
};

test("mobile styles", async ({ page }) => {
  await page.setViewportSize({
    width: 320,
    height: 900,
  });
  return testStyles({ page, screenSize: "mobile" });
});

test("tablet styles", async ({ page }) => {
  await page.setViewportSize({
    width: 900,
    height: 700,
  });
  return testStyles({ page, screenSize: "tablet" });
});

test("desktop styles", async ({ page }) => {
  await page.setViewportSize({
    width: 1500,
    height: 1000,
  });
  return testStyles({ page, screenSize: "desktop" });
});
