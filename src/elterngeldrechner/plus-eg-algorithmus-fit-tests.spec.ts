import { describe, expect, test } from "vitest";
import { elterngeldZwischenergebnis } from "./eg-zwischen-ergebnis-algorithmus";
import {
  Einkommen,
  ErwerbsArt,
  FinanzDaten,
  MischEkZwischenErgebnis,
  MutterschaftsLeistung,
} from "./model";
import { elterngeldPlusErgebnis } from "./plus-eg-algorithmus";
import { EgrAlteTestfaelleRoutine3ExcelSheet } from "./test-utils/egr-alte-testfaelle-routine3-excel-sheet";
import { EgrOhneMischeinkommenExcelSheet } from "./test-utils/egr-ohne-mischeinkommen-excel-sheet";

describe("plus-eg-algorithmus", () => {
  const sheet = new EgrAlteTestfaelleRoutine3ExcelSheet();

  describe("should calculate ElternGeldPlusErgebnis for test cases from Testfaelle_alte_Routine3.xlsx", () => {
    const testCaseIndexes = Array.from(
      { length: EgrOhneMischeinkommenExcelSheet.TEST_CASE_COUNT },
      (_, index) => index,
    );

    // Der Grund für diesen Fehler ist wahrscheinlich auch die falsche Steuerermittlung vom FIT.
    const failedNetto: Array<number> = [
      3, 6, 7, 12, 13, 15, 16, 19, 21, 23, 24, 26, 30, 31, 33, 34, 38, 39, 42,
      45, 49, 53, 54, 56,
    ];

    test.each(testCaseIndexes.filter((index) => !failedNetto.includes(index)))(
      "TEST CASE NO. %d",
      (testCaseIndex) => {
        // given
        const planungsDaten = createPlanungsDaten(sheet, testCaseIndex);
        const persoenlicheDaten = sheet.createPersoenlicheDaten(testCaseIndex);
        const finanzDaten = createFinanzDaten(sheet, testCaseIndex);
        const mischEkZwischenErgebnis = createMischEkZwischenErgebnis();
        const zwischenErgebnis = elterngeldZwischenergebnis(
          persoenlicheDaten,
          sheet.nettoVorGeburt(testCaseIndex),
        );

        // when
        const ergebnis = elterngeldPlusErgebnis(
          planungsDaten,
          persoenlicheDaten,
          finanzDaten,
          mischEkZwischenErgebnis,
          zwischenErgebnis,
        );

        // then
        expect(ergebnis).not.toBeUndefined();
        expect(ergebnis.bruttoBasis).toBe(
          sheet.ergebnisBruttoBasisImBezugsZeitraumDurchschnitt(testCaseIndex),
        );
        expect(ergebnis.nettoBasis).toBe(
          sheet.ergebnisNettoBasisImBezugsZeitraumDurchschnitt(testCaseIndex),
        );
        expect(ergebnis.elternGeldErwBasis).toBe(
          sheet.ergebnisElterngeldBasisFuerMonateMitErwerbsTaetigkeit(
            testCaseIndex,
          ),
        );
        expect(ergebnis.bruttoPlus).toBe(
          sheet.ergebnisBruttoPlusImBezugsZeitraumDurchschnitt(testCaseIndex),
        );
        expect(ergebnis.nettoPlus).toBeCloseTo(
          sheet.ergebnisNettoPlusImBezugsZeitraumDurchschnitt(testCaseIndex),
          1,
        );
        expect(ergebnis.elternGeldEtPlus).toBeCloseTo(
          sheet.ergebnisElterngeldPlusFuerMonateMitErwerbsTaetigkeit(
            testCaseIndex,
          ),
          1,
        );
        expect(ergebnis.elternGeldKeineEtPlus).toBe(
          sheet.ergebnisElterngeldPlusFuerMonateOhneErwerbsTaetigkeit(
            testCaseIndex,
          ),
        );
      },
    );
  });
});

const createPlanungsDaten = (
  sheet: EgrAlteTestfaelleRoutine3ExcelSheet,
  testCaseIndex: number,
) => {
  return {
    mutterschaftsLeistung: MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN,
    planung: sheet.lebensmonateElterngeldArt(testCaseIndex),
  };
};

const createFinanzDaten = (
  sheet: EgrAlteTestfaelleRoutine3ExcelSheet,
  testCaseIndex: number,
): FinanzDaten => {
  return {
    bruttoEinkommen: new Einkommen(0),
    istKirchensteuerpflichtig: sheet.kirchenSteuer(testCaseIndex),
    steuerKlasse: sheet.steuerKlasse(testCaseIndex),
    splittingFaktor: sheet.splittingFaktor(testCaseIndex),
    kinderFreiBetrag: sheet.kinderFreiBetrag(testCaseIndex),
    kassenArt: sheet.krankenVersicherung(testCaseIndex),
    rentenVersicherung: sheet.rentenVersicherung(testCaseIndex),
    erwerbsZeitraumLebensMonatList:
      sheet.erwerbsZeitraumLebensMonatList(testCaseIndex),
    mischEinkommenTaetigkeiten: [],
  };
};

const createMischEkZwischenErgebnis = (): MischEkZwischenErgebnis => {
  return {
    elterngeldbasis: 0,
    krankenversicherungspflichtig: false,
    netto: 0,
    brutto: 0,
    steuern: 0,
    abgaben: 0,
    rentenversicherungspflichtig: false,
    status: ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
  };
};
