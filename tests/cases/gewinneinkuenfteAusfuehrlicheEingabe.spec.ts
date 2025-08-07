import { test } from "@playwright/test";
import { AllgemeineAngabenPOM } from "../pom/AllgemeineAngabenPOM";
import { BeispielePOM } from "../pom/BeispielePOM";
import { RechnerPlanerPOM } from "../pom/RechnerPlanerPOM";

test("Gewinneinkünfte, ausführliche Eingabe", async ({ page }) => {
  test.slow();
  const allgemeineAngabenPage = await new AllgemeineAngabenPOM(page).goto();
  await allgemeineAngabenPage.setBundesland("Berlin");
  await allgemeineAngabenPage.setAlleinerziehend(false);
  await allgemeineAngabenPage.setElternteile(2);
  await allgemeineAngabenPage.setNameElternteil1("Elternteil 1");
  await allgemeineAngabenPage.setNameElternteil2("Elternteil 2");
  await allgemeineAngabenPage.setMutterschutz(false);
  await allgemeineAngabenPage.submit();

  // codegen
  await page.getByPlaceholder("__.__.___").click();
  await page.getByPlaceholder("__.__.___").fill("06.01.2025");
  await page
    .getByLabel("Wie viele Kinder werden oder wurden geboren?")
    .fill("2");
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByLabel("Elternteil 1").getByText("Ja").click();
  await page.getByLabel("Elternteil 2").getByText("Ja").click();
  await page.getByText("Gewinneinkünfte").first().click();
  await page.getByText("Einkünfte aus nichtselbstä").nth(1).click();
  await page.getByText("Ja", { exact: true }).nth(3).click();
  await page.getByText("Nein", { exact: true }).nth(4).click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page
    .getByRole("radiogroup", {
      name: /ein Gesamteinkommen von/,
    })
    .getByRole("radio", { name: "Nein" })
    .click();
  await page.getByLabel("Welche Steuerklasse").selectOption("4");

  await page
    .getByLabel("Elternteil 1")
    .getByRole("radiogroup", { name: "kirchensteuerpflichtig?" })
    .getByRole("radio", { name: "Nein" })
    .click();
  await page
    .getByLabel("Elternteil 2")
    .getByRole("radiogroup", { name: "kirchensteuerpflichtig?" })
    .getByRole("radio", { name: "Ja" })
    .click();
  await page
    .getByLabel("Gewinn im letzten Kalenderjahr in Brutto")
    .fill("3.1200 Euro");
  await page.getByTestId("ET1.kassenArt_option_1").check(); // Nein
  await page.getByText("keine gesetzliche").click();
  await page
    .getByLabel("Elternteil 2")
    .getByRole("radiogroup", { name: "gesetzlich pflichtversichert?" })
    .getByRole("radio", { name: "Ja" })
    .click();
  await page.getByRole("button", { name: "Zur ausführlichen Eingabe" }).click();
  await page.getByLabel("1. Monat", { exact: true }).click();
  await page.getByLabel("1. Monat", { exact: true }).fill("1800 Euro");
  await page.getByLabel("2. Monat", { exact: true }).click();
  await page.getByLabel("2. Monat", { exact: true }).fill("1800 Euro");
  await page.getByLabel("3. Monat").click();
  await page.getByLabel("3. Monat").fill("1800 Euro");
  await page.getByLabel("4. Monat").click();
  await page.getByLabel("4. Monat").fill("1800 Euro");
  await page.getByLabel("5. Monat").click();
  await page.getByLabel("5. Monat").fill("1800 Euro");
  await page.getByLabel("6. Monat").click();
  await page.getByLabel("6. Monat").fill("1800 Euro");
  await page.getByLabel("7. Monat").click();
  await page.getByLabel("7. Monat").fill("1800 Euro");
  await page.getByLabel("8. Monat").click();
  await page.getByLabel("8. Monat").fill("1800 Euro");
  await page.getByLabel("9. Monat").click();
  await page.getByLabel("9. Monat").fill("3000 Euro");
  await page.getByLabel("10. Monat").click();
  await page.getByLabel("10. Monat").fill("3000 Euro");
  await page.getByLabel("11. Monat").click();
  await page.getByLabel("11. Monat").fill("3000 Euro");
  await page.getByLabel("12. Monat").click();
  await page.getByLabel("12. Monat").fill("3000 Euro");
  await page.getByRole("button", { name: "Weiter" }).click();

  const beispielePage = new BeispielePOM(page);
  await beispielePage.submit();

  const planer = new RechnerPlanerPOM(page);
  await planer.waehleOption(1, "Basis", "Elternteil 1");
  await planer.waehleOption(1, "Basis", "Elternteil 2");
  await planer.waehleOption(2, "Basis", "Elternteil 1");
  await planer.waehleOption(2, "Plus", "Elternteil 2");
  await planer.waehleOption(3, "Basis", "Elternteil 1");
  await planer.waehleOption(4, "Plus", "Elternteil 2");
  await planer.waehleOption(5, "Basis", "Elternteil 1");
  await planer.waehleOption(6, "Plus", "Elternteil 2");
  await planer.waehleOption(7, "Basis", "Elternteil 1");
  await planer.waehleOption(9, "Plus", "Elternteil 2");
  await planer.waehleOption(10, "Plus", "Elternteil 2");

  await planer.ueberpruefen();
  await planer.uebernehmen();
});
