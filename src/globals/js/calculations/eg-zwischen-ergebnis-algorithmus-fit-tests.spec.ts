import { EgZwischenErgebnisAlgorithmus } from "./eg-zwischen-ergebnis-algorithmus";
import { EgrAlteTestfaelleRoutine3ExcelSheet } from "@/test-utils/egr-alte-testfaelle-routine3-excel-sheet";
import { EgrOhneMischeinkommenExcelSheet } from "@/test-utils/egr-ohne-mischeinkommen-excel-sheet";

/**
 * Runs FIT tests for EgZwischenErgebnisAlgorithmus.
 */
describe("eg-zwischen-ergebnis-algorithmus", () => {
  const zwischenErgebnisAlgorithmus = new EgZwischenErgebnisAlgorithmus();
  const sheet = new EgrAlteTestfaelleRoutine3ExcelSheet();

  describe("should calculate ZwischenErgebnis for test cases from Testfaelle_alte_Routine3.xlsx", () => {
    for (
      let testCaseIndex = 0;
      testCaseIndex < EgrOhneMischeinkommenExcelSheet.TEST_CASE_COUNT;
      testCaseIndex++
    ) {
      it(`TEST CASE NO. ${sheet.testFallNummer(testCaseIndex)}`, () => {
        // given
        const persoenlicheDaten = sheet.createPersoenlicheDaten(testCaseIndex);

        // when
        const zwischenErgebnis =
          zwischenErgebnisAlgorithmus.elterngeldZwischenergebnis(
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

        expect(
          zwischenErgebnis.zeitraumGeschwisterBonus ??
            persoenlicheDaten.wahrscheinlichesGeburtsDatum,
        ).toEqual(
          sheet.zwischenErgebnisZeitraumGeschwisterBonus(testCaseIndex),
        );
      });
    }
  });
});
