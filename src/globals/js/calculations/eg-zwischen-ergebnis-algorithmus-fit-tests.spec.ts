import { EgZwischenErgebnisAlgorithmus } from "./eg-zwischen-ergebnis-algorithmus";
import { describeSkipOnCi } from "@/setupTests";
import { EgrOhneMischeinkommenExcelSheet } from "@/test-utils/egr-ohne-mischeinkommen-excel-sheet";
import { EgrAlteTestfaelleRoutine3ExcelSheet } from "@/test-utils/egr-alte-testfaelle-routine3-excel-sheet";

/**
 * Runs FIT tests for EgZwischenErgebnisAlgorithmus.
 *
 * Test should be skipped on ci server. Reason: We can't call the BMF Steuerrechner,
 * because external calls are forbidden on CI environment.
 */
describeSkipOnCi("eg-zwischen-ergebnis-algorithmus", () => {
  const zwischenErgebnisAlgorithmus = new EgZwischenErgebnisAlgorithmus();
  const sheet = new EgrAlteTestfaelleRoutine3ExcelSheet();

  describe("should calculate ZwischenErgebnis for test cases from Testfaelle_alte_Routine3.xlsx", () => {
    for (
      let testCaseIndex = 0;
      testCaseIndex < EgrOhneMischeinkommenExcelSheet.TEST_CASE_COUNT;
      testCaseIndex++
    ) {
      it(`TEST CASE NO. ${sheet.testFallNummer(testCaseIndex)}`, async () => {
        // given
        const persoenlicheDaten = sheet.createPersoenlicheDaten(testCaseIndex);

        // when
        const zwischenErgebnis =
          await zwischenErgebnisAlgorithmus.elterngeldZwischenergebnis(
            persoenlicheDaten,
            sheet.nettoVorGeburt(testCaseIndex),
          );

        // then
        expect(zwischenErgebnis).not.toBeUndefined();
        expect(zwischenErgebnis.nettoVorGeburt.toNumber()).toBe(
          sheet.zwischenErgebnisNettoVorGeburt(testCaseIndex),
        );
        expect(zwischenErgebnis.elternGeld.toNumber()).toBe(
          sheet.zwischenErgebnisElternGeld(testCaseIndex),
        );
        expect(zwischenErgebnis.ersatzRate.toNumber()).toBe(
          sheet.zwischenErgebnisErsatzRate(testCaseIndex),
        );
        expect(zwischenErgebnis.geschwisterBonus.toNumber()).toBe(
          sheet.zwischenErgebnisGeschwisterBonus(testCaseIndex),
        );
        expect(zwischenErgebnis.mehrlingsZulage.toNumber()).toBe(
          sheet.zwischenErgebnisMehrlingsZulage(testCaseIndex),
        );
        expect(zwischenErgebnis.zeitraumGeschwisterBonus?.toISOString()).toBe(
          sheet
            .zwischenErgebnisZeitraumGeschwisterBonus(testCaseIndex)
            .toISOString(),
        );
      });
    }
  });
});
