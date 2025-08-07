import { test } from "@playwright/test";
import { AllgemeineAngabenPOM } from "../pom/AllgemeineAngabenPOM";
import { BeispielePOM } from "../pom/BeispielePOM";
import { RechnerPlanerPOM } from "../pom/RechnerPlanerPOM";

test("mehrere Tätigkeiten", async ({ page }) => {
  test.slow();
  const allgemeineAngabenPage = await new AllgemeineAngabenPOM(page).goto();
  await allgemeineAngabenPage.setBundesland("Berlin");
  await allgemeineAngabenPage.setAlleinerziehend(false);
  await allgemeineAngabenPage.setElternteile(1);
  await allgemeineAngabenPage.setMutterschutzFuerEinePerson(true);
  await allgemeineAngabenPage.submit();

  // codegen
  await page.getByPlaceholder("__.__.___").click();
  await page.getByPlaceholder("__.__.___").fill("18.11.2024");
  await page
    .getByLabel("Wie viele Kinder werden oder wurden geboren?")
    .fill("3");
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByText("Ja", { exact: true }).click();
  await page.getByText("Einkünfte aus nichtselbstä").click();
  await page.getByText("Ja").nth(2).click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page
    .getByRole("radiogroup", {
      name: /ein Gesamteinkommen von/,
    })
    .getByRole("radio", { name: "Nein" })
    .click();
  await page.getByLabel("Welche Steuerklasse").selectOption("1");
  await page
    .getByRole("radiogroup", { name: "kirchensteuerpflichtig?" })
    .getByRole("radio", { name: "Ja" })
    .click();
  await page.getByLabel("Durchschnittliches Bruttoeinkommen").fill("1350 Euro");
  await page
    .getByRole("radiogroup", { name: "War diese Tätigkeit ein Mini-Job?" })
    .getByRole("radio", { name: "Nein" })
    .click();
  await page
    .locator(
      '[id="ET1\\.taetigkeitenNichtSelbstaendigUndSelbstaendig\\.0\\.zeitraum\\.0\\.from"]',
    )
    .selectOption("1");
  await page
    .locator(
      '[id="ET1\\.taetigkeitenNichtSelbstaendigUndSelbstaendig\\.0\\.zeitraum\\.0\\.to"]',
    )
    .selectOption("12");
  await page.getByText("rentenversicherungspflichtig").click();
  await page.getByText("krankenversicherungspflichtig").click();
  await page.getByText("arbeitslosenversicherungspflichtig").click();
  await page
    .getByRole("button", { name: "weitere Tätigkeit hinzufügen" })
    .click();
  await page
    .getByLabel("2. Tätigkeit")
    .getByLabel("Durchschnittliches Bruttoeinkommen")
    .fill("538 Euro");
  await page.getByLabel("2. Tätigkeit").getByText("Ja").click();
  await page
    .locator(
      '[id="ET1\\.taetigkeitenNichtSelbstaendigUndSelbstaendig\\.1\\.zeitraum\\.0\\.from"]',
    )
    .selectOption("1");
  await page
    .locator(
      '[id="ET1\\.taetigkeitenNichtSelbstaendigUndSelbstaendig\\.1\\.zeitraum\\.0\\.to"]',
    )
    .selectOption("12");
  await page
    .getByLabel("2. Tätigkeit")
    .getByText("keines der Genannten")
    .click();
  await page
    .getByLabel("2. Tätigkeit")
    .getByText("rentenversicherungspflichtig")
    .click();
  await page
    .getByLabel("2. Tätigkeit")
    .getByText("krankenversicherungspflichtig")
    .click();
  await page
    .getByLabel("2. Tätigkeit")
    .getByText("arbeitslosenversicherungspflichtig")
    .click();
  await page.getByRole("button", { name: "Weiter", exact: true }).click();

  const beispielePage = new BeispielePOM(page);
  await beispielePage.submit();

  const planer = new RechnerPlanerPOM(page);
  await planer.waehleOption(4, "Basis");
  await planer.waehleOption(5, "Basis");
  await planer.waehleOption(6, "Basis");
  await planer.waehleOption(7, "Basis");
  await planer.waehleOption(8, "Basis");
  await planer.waehleOption(9, "Basis");
  await planer.waehleOption(10, "Basis");
  await planer.waehleOption(12, "Basis");

  await planer.ueberpruefen();
  await planer.uebernehmen();
});
