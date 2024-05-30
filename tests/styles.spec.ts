import { test, expect } from "@playwright/test";

/* eslint-disable testing-library/prefer-screen-queries */

test("styles", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#egr-root")).toHaveScreenshot();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByLabel("Zugehörige Information zeigen").click();
  await page.getByLabel("Information schließen").click();
  await page.getByLabel("Weiteres Geschwisterkind").click();
  await page
    .getByLabel("2. Geschwisterkind")
    .getByText("Das Geschwisterkind hat eine")
    .click();
  await page
    .getByLabel("2. Geschwisterkind")
    .getByPlaceholder("__.__.___")
    .click();
  await page
    .getByLabel("2. Geschwisterkind")
    .getByPlaceholder("__.__.___")
    .fill("12.05.2019");
  await expect(page.locator("#egr-root")).toHaveScreenshot();
  await page.getByRole("button", { name: "Weiter", exact: true }).click();
  await expect(page.locator("#egr-root")).toHaveScreenshot();
  await page.getByRole("button", { name: "Weiter" }).click();
  await expect(page.locator("#egr-root")).toHaveScreenshot();
  await page.getByRole("button", { name: "Weiter", exact: true }).click();
  await page
    .locator("summary")
    .filter({ hasText: "Basiselterngeld - 100%" })
    .getByTestId("ExpandMoreIcon")
    .click();
  await expect(page.locator("#egr-root")).toHaveScreenshot();
  await page.getByRole("button", { name: "Zum Monatsplaner" }).click();
  await page
    .getByLabel("Jasper Darwin Artus", { exact: true })
    .getByText("Ich werde während des")
    .click();
  await page
    .getByLabel("Salomé Loreley Zoe", { exact: true })
    .getByText("Ich werde während des")
    .click();
  await page
    .getByLabel("Jasper Darwin Artus", { exact: true })
    .getByRole("button", { name: "Elterngeld berechnen" })
    .click();
  await page
    .getByLabel("Salomé Loreley Zoe", { exact: true })
    .getByRole("button", { name: "Elterngeld berechnen" })
    .click();
  await page
    .getByTestId("Jasper Darwin Artus Basiselterngeld für Lebensmonat 1")
    .getByLabel("Jasper Darwin Artus")
    .click();
  await page
    .getByLabel("Jasper Darwin Artus Basiselterngeld für Lebensmonat 2")
    .click();
  await page
    .getByLabel("Jasper Darwin Artus ElterngeldPlus für Lebensmonat 3")
    .click();
  await page
    .getByLabel("Jasper Darwin Artus ElterngeldPlus für Lebensmonat 4")
    .click();
  await page
    .getByLabel("Jasper Darwin Artus Partnerschaftsbonus für Lebensmonat 5")
    .click();
  await page.getByRole("button", { name: "Alle Monate anzeigen" }).click();
  await expect(page.locator("#egr-root")).toHaveScreenshot();
  await page.getByRole("button", { name: "Zur Übersicht" }).click();
  await expect(page.locator("#egr-root")).toHaveScreenshot();
});
