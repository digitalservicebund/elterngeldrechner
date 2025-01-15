import { AxeBuilder } from "@axe-core/playwright";
import { type Page, type TestInfo, expect, test } from "@playwright/test";
import { AllgemeineAngabenPOM } from "../pom/AllgemeineAngabenPOM";
import { EinkommenPOM } from "../pom/EinkommenPOM";
import { ErwerbstaetigkeitPOM } from "../pom/ErwerbstaetigkeitPOM";
import { NachwuchsPOM } from "../pom/NachwuchsPOM";
import { RechnerPlanerPOM } from "../pom/RechnerPlanerPOM";
import { VariantenPOM } from "../pom/VariantenPOM";

/**
 * This test case intends to exercise the application in a way that it touches
 * as many aspects as possible to test it for accessibility.
 *
 * It is the current intention to keep this in a dedicated test. So only this
 * test case fails if accessibility is not sufficient. It is a first "good
 * enough" solution to integrate better with accessibility testing. In future,
 * solutions will be developed which should help to safely test for
 * accessibility in all parts of the application without missing anything.
 * Because it will be very hard to maintain such a test case. Especially when
 * user decisions are mutually exclusive.
 */
test("basic accessibility run", async ({ page }, testInfo) => {
  test.slow();

  const allgemeineAngabenPage = new AllgemeineAngabenPOM(page);
  await allgemeineAngabenPage.goto();
  await allgemeineAngabenPage.setElternteile(2);
  await allgemeineAngabenPage.setNameElternteil1("Jane");
  await allgemeineAngabenPage.setNameElternteil2("John");
  await allgemeineAngabenPage.setMutterschaftsleistungen(true);
  await allgemeineAngabenPage.setMutterschaftsleistungenWer("Jane");
  await expectPageToBeAccessible(page, testInfo);
  await allgemeineAngabenPage.submit();

  const nachwuchsPage = new NachwuchsPOM(page);
  await nachwuchsPage.setGeburtsdatum("01.01.2024");
  await nachwuchsPage.setAnzahlKinder(2);
  await nachwuchsPage.addGeschwisterkind(0, "01.01.2023", true);
  await nachwuchsPage.addGeschwisterkind(1, "01.01.2022", false);
  await expectPageToBeAccessible(page, testInfo);
  await nachwuchsPage.submit();

  const erwerbstaetigkeitPage = new ErwerbstaetigkeitPOM(page, {
    elternteile: ["Jane", "John"],
  });
  await erwerbstaetigkeitPage.setErwerbstaetig(false, 1);
  await erwerbstaetigkeitPage.setErwerbstaetig(false, 2);
  // TODO: Extend POM to "see" more UI elements.
  await expectPageToBeAccessible(page, testInfo);
  await erwerbstaetigkeitPage.submit();

  const einkommenPage = new EinkommenPOM(page);
  await einkommenPage.setGesamteinkommenUeberschritten(false);
  // TODO: Extend POM to "see" more UI elements.
  await einkommenPage.submit();
  await expectPageToBeAccessible(page, testInfo);

  const variantenPage = new VariantenPOM(page);
  await expectPageToBeAccessible(page, testInfo);
  await variantenPage.submit();

  const rechnerUndPlaner = new RechnerPlanerPOM(page, {
    elternteile: ["Jane", "John"],
  });
  await rechnerUndPlaner.zeigeMehrLebensmonateAn();
  await rechnerUndPlaner.waehleOption(1, "Plus", "John");
  await expectPageToBeAccessible(page, testInfo, ["nested-interactive"]); // FIXME: fix ignored rule
  await rechnerUndPlaner.waehleOption(4, "Bonus", "Jane");
  await rechnerUndPlaner.gebeEinkommenAn(4, 1500, "Jane");
  await rechnerUndPlaner.gebeEinkommenAn(4, 1500, "John");
  await expectPageToBeAccessible(page, testInfo, ["nested-interactive"]); // FIXME: fix ignored rule
  await rechnerUndPlaner.gebeEinkommenAn(5, 1500, "Jane");
  await rechnerUndPlaner.gebeEinkommenAn(5, 1500, "John");
  await rechnerUndPlaner.submit();

  await expectPageToBeAccessible(page, testInfo);
});

async function expectPageToBeAccessible(
  page: Page,
  testInfo: TestInfo,
  ruleNamesToDisable: string[] = [],
): Promise<void> {
  // Disable motion during accessibility tests to ensure consistent results.
  // Without this, axe might capture a button mid-transition, resulting in
  // a temporary low contrast that could fail the contrast checks.
  await page.addStyleTag({
    content: "* { transition: none !important; }",
  });

  const { violations } = await new AxeBuilder({ page })
    .options({ resultTypes: ["violations"] })
    .disableRules(ruleNamesToDisable)
    .include("#egr-root") // Ignore document around application (is not under test).
    .analyze();

  if (violations.length > 0) {
    await testInfo.attach("accessibility violations", {
      contentType: "application/json",
      body: JSON.stringify(violations),
    });
  }

  expect
    .soft(violations, "should have no accessibility violations")
    .toHaveLength(0);
}
