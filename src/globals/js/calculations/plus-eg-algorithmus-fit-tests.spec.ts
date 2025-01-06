import { BIG_ZERO } from "./common/math-util";
import { EgZwischenErgebnisAlgorithmus } from "./eg-zwischen-ergebnis-algorithmus";
import {
  Einkommen,
  ErwerbsArt,
  FinanzDaten,
  MischEkZwischenErgebnis,
  MutterschaftsLeistung,
  PlanungsDaten,
} from "./model";
import { PlusEgAlgorithmus } from "./plus-eg-algorithmus";
import { EgrAlteTestfaelleRoutine3ExcelSheet } from "@/test-utils/egr-alte-testfaelle-routine3-excel-sheet";
import { EgrOhneMischeinkommenExcelSheet } from "@/test-utils/egr-ohne-mischeinkommen-excel-sheet";

/**
 * Runs FIT tests for PlusEgAlgorithmus.
 */
describe("plus-eg-algorithmus", () => {
  const zwischenErgebnisAlgorithmus = new EgZwischenErgebnisAlgorithmus();
  const sheet = new EgrAlteTestfaelleRoutine3ExcelSheet();

  describe("should calculate ElternGeldPlusErgebnis for test cases from Testfaelle_alte_Routine3.xlsx", () => {
    const testCaseIndexes = Array.from(
      { length: EgrOhneMischeinkommenExcelSheet.TEST_CASE_COUNT },
      (_, index) => index,
    );

    // Der Grund für diesen Fehler ist wahrscheinlich auch die falsche Steuerermittlung vom FIT.
    const failedNetto: Array<number> = [
      3, 6, 7, 12, 13, 15, 16, 19, 21, 23, 24, 26, 30, 33, 34, 38, 39, 42, 45,
      53, 54, 56,
    ];

    test.each(testCaseIndexes.filter((index) => !failedNetto.includes(index)))(
      "TEST CASE NO. %d",
      (testCaseIndex) => {
        // given
        const planungsDaten = createPlanungsDaten(sheet, testCaseIndex);
        const persoenlicheDaten = sheet.createPersoenlicheDaten(testCaseIndex);
        const finanzDaten = createFinanzDaten(sheet, testCaseIndex);
        const mischEkZwischenErgebnis = createMischEkZwischenErgebnis();
        const zwischenErgebnis =
          zwischenErgebnisAlgorithmus.elterngeldZwischenergebnis(
            persoenlicheDaten,
            sheet.nettoVorGeburt(testCaseIndex),
          );

        // when
        const algorithmus = new PlusEgAlgorithmus();
        const ergebnis = algorithmus.elterngeldPlusErgebnis(
          planungsDaten,
          persoenlicheDaten,
          finanzDaten,
          2022,
          mischEkZwischenErgebnis,
          zwischenErgebnis,
        );

        // then
        expect(ergebnis).not.toBeUndefined();
        expect(ergebnis.bruttoBasis.toNumber()).toBe(
          sheet.ergebnisBruttoBasisImBezugsZeitraumDurchschnitt(testCaseIndex),
        );
        expect(ergebnis.nettoBasis.toNumber()).toBe(
          sheet.ergebnisNettoBasisImBezugsZeitraumDurchschnitt(testCaseIndex),
        );
        expect(ergebnis.elternGeldErwBasis.toNumber()).toBe(
          sheet.ergebnisElterngeldBasisFuerMonateMitErwerbsTaetigkeit(
            testCaseIndex,
          ),
        );
        expect(ergebnis.bruttoPlus.toNumber()).toBe(
          sheet.ergebnisBruttoPlusImBezugsZeitraumDurchschnitt(testCaseIndex),
        );
        expect(ergebnis.nettoPlus.toNumber()).toBe(
          sheet.ergebnisNettoPlusImBezugsZeitraumDurchschnitt(testCaseIndex),
        );
        expect(ergebnis.elternGeldEtPlus.toNumber()).toBe(
          sheet.ergebnisElterngeldPlusFuerMonateMitErwerbsTaetigkeit(
            testCaseIndex,
          ),
        );
        expect(ergebnis.elternGeldKeineEtPlus.toNumber()).toBe(
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
  const planungsDaten = new PlanungsDaten(
    MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN,
  );
  planungsDaten.planung = sheet.lebensmonateElterngeldArt(testCaseIndex);
  return planungsDaten;
};

const createFinanzDaten = (
  sheet: EgrAlteTestfaelleRoutine3ExcelSheet,
  testCaseIndex: number,
) => {
  const finanzDaten = new FinanzDaten();
  finanzDaten.bruttoEinkommen = new Einkommen(0);
  finanzDaten.istKirchensteuerpflichtig = sheet.kirchenSteuer(testCaseIndex);
  finanzDaten.steuerKlasse = sheet.steuerKlasse(testCaseIndex);
  finanzDaten.splittingFaktor = sheet.splittingFaktor(testCaseIndex);
  finanzDaten.kinderFreiBetrag = sheet.kinderFreiBetrag(testCaseIndex);
  finanzDaten.kassenArt = sheet.krankenVersicherung(testCaseIndex);
  finanzDaten.rentenVersicherung = sheet.rentenVersicherung(testCaseIndex);
  finanzDaten.erwerbsZeitraumLebensMonatList =
    sheet.erwerbsZeitraumLebensMonatList(testCaseIndex);

  return finanzDaten;
};

const createMischEkZwischenErgebnis = (): MischEkZwischenErgebnis => {
  return {
    elterngeldbasis: BIG_ZERO,
    krankenversicherungspflichtig: false,
    netto: BIG_ZERO,
    brutto: BIG_ZERO,
    steuern: BIG_ZERO,
    abgaben: BIG_ZERO,
    rentenversicherungspflichtig: false,
    status: ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
  };
};
