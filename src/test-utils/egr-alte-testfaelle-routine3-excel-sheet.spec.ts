import { describe, expect, it } from "vitest";
import { EgrAlteTestfaelleRoutine3ExcelSheet } from "./egr-alte-testfaelle-routine3-excel-sheet";
import {
  ElternGeldArt,
  ErwerbsArt,
  KassenArt,
  KinderFreiBetrag,
  PLANUNG_ANZAHL_MONATE,
  RentenArt,
  SteuerKlasse,
} from "@/globals/js/calculations/model";

describe("egr-alte-testfaelle-routine3-excel-sheet", () => {
  const sheet = new EgrAlteTestfaelleRoutine3ExcelSheet();

  describe("from Testfaelle_alte_Routine3.xlsx", () => {
    it("should read geburtsDatum", () => {
      expect(sheet.geburtsDatum(0).toISOString()).toBe(
        new Date("2017-09-06").toISOString(),
      );
      expect(sheet.geburtsDatum(1).toISOString()).toBe(
        new Date("2017-12-05").toISOString(),
      );
    });

    it("should read erwerbsArt", () => {
      expect(sheet.erwerbsArt(0)).toBe(ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI);
      expect(sheet.erwerbsArt(1)).toBe(ErwerbsArt.JA_NICHT_SELBST_MINI);
      expect(sheet.erwerbsArt(2)).toBe(ErwerbsArt.JA_SELBSTSTAENDIG);
      expect(sheet.erwerbsArt(3)).toBe(ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI);
    });

    it("should read kirchenSteuer", () => {
      expect(sheet.kirchenSteuer(0)).toBe(false);
      expect(sheet.kirchenSteuer(1)).toBe(true);
    });

    it("should read steuerKlasse", () => {
      expect(sheet.steuerKlasse(0)).toBe(SteuerKlasse.SKL2);
      expect(sheet.steuerKlasse(1)).toBe(SteuerKlasse.SKL3);
      expect(sheet.steuerKlasse(3)).toBe(SteuerKlasse.SKL5);
    });

    it("should read splittingFaktor", () => {
      expect(sheet.splittingFaktor(0)).toBe(1);
    });

    it("should read kinderFreiBetrag", () => {
      expect(sheet.kinderFreiBetrag(0)).toBe(KinderFreiBetrag.ZKF3);
      expect(sheet.kinderFreiBetrag(1)).toBe(KinderFreiBetrag.ZKF1);
      expect(sheet.kinderFreiBetrag(7)).toBe(KinderFreiBetrag.ZKF2);
    });

    it("should read krankenVersicherung", () => {
      expect(sheet.krankenVersicherung(0)).toBe(
        KassenArt.GESETZLICH_PFLICHTVERSICHERT,
      );
      expect(sheet.krankenVersicherung(2)).toBe(
        KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT,
      );
    });

    it("should read rentenVersicherung", () => {
      expect(sheet.rentenVersicherung(0)).toBe(
        RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
      );
      expect(sheet.rentenVersicherung(2)).toBe(
        RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG,
      );
    });

    it("should read lebensmonateElterngeldArt", () => {
      // setup expected
      const expected = [];
      for (let i = 0; i < 2; i++) {
        expected.push(ElternGeldArt.BASIS_ELTERNGELD);
      }
      for (let i = 0; i < 3; i++) {
        expected.push(ElternGeldArt.ELTERNGELD_PLUS);
      }
      for (let i = 0; i < 6; i++) {
        expected.push(ElternGeldArt.BASIS_ELTERNGELD);
      }
      for (let i = 0; i < 9; i++) {
        expected.push(ElternGeldArt.ELTERNGELD_PLUS);
      }
      for (let i = 0; i < 12; i++) {
        expected.push(ElternGeldArt.KEIN_BEZUG);
      }

      // expect
      expect(sheet.lebensmonateElterngeldArt(0)).toStrictEqual(expected);
    });

    it("should read nettoVorGeburt", () => {
      expect(sheet.nettoVorGeburt(0).value.toNumber()).toBe(1456.69);
      expect(sheet.nettoVorGeburt(1).value.toNumber()).toBe(239);
    });

    it("should read lebensmonatBrutto", () => {
      expect(sheet.lebensmonatBrutto(0, 1).toNumber()).toBe(1353);
      expect(sheet.lebensmonatBrutto(0, 3).toNumber()).toBe(728);
      expect(sheet.lebensmonatBrutto(0, PLANUNG_ANZAHL_MONATE).toNumber()).toBe(
        0,
      );
      expect(sheet.lebensmonatBrutto(1, 1).toNumber()).toBe(0);
      expect(sheet.lebensmonatBrutto(1, 3).toNumber()).toBe(1317);
      expect(sheet.lebensmonatBrutto(1, PLANUNG_ANZAHL_MONATE).toNumber()).toBe(
        0,
      );
    });

    it("should read erwerbsZeitraumLebensMonatList", () => {
      const actual = sheet.erwerbsZeitraumLebensMonatList(0);
      expect(actual.length).toBe(PLANUNG_ANZAHL_MONATE);
      for (let i = 0; i < PLANUNG_ANZAHL_MONATE; i++) {
        expect(actual[i]?.vonLebensMonat).toBe(i + 1);
        expect(actual[i]?.bisLebensMonat).toBe(i + 1);
      }
      expect(actual[0]?.bruttoProMonat.value.toNumber()).toBe(1353);
      expect(actual[2]?.bruttoProMonat.value.toNumber()).toBe(728);
      expect(actual[31]?.bruttoProMonat.value.toNumber()).toBe(0);
    });

    it("should read testFallNummer", () => {
      expect(sheet.testFallNummer(0)).toBe(1);
      expect(sheet.testFallNummer(1)).toBe(2);
      expect(
        sheet.testFallNummer(
          EgrAlteTestfaelleRoutine3ExcelSheet.TEST_CASE_COUNT - 1,
        ),
      ).toBe(EgrAlteTestfaelleRoutine3ExcelSheet.TEST_CASE_COUNT);
    });

    it("should read zwischenErgebnisNettoVorGeburt", () => {
      expect(sheet.zwischenErgebnisNettoVorGeburt(0)).toBe(1456.69);
      expect(sheet.zwischenErgebnisNettoVorGeburt(1)).toBe(239);
    });

    it("should read ergebnisBruttoImBezugsZeitraumDurchschnitt", () => {
      expect(sheet.ergebnisBruttoBasisImBezugsZeitraumDurchschnitt(0)).toBe(
        1068.17,
      );
      expect(sheet.ergebnisBruttoBasisImBezugsZeitraumDurchschnitt(1)).toBe(0);
    });

    it("should read ergebnisNettoImBezugsZeitraumDurchschnitt", () => {
      expect(sheet.ergebnisNettoBasisImBezugsZeitraumDurchschnitt(0)).toBe(
        831.53,
      );
      expect(sheet.ergebnisNettoBasisImBezugsZeitraumDurchschnitt(1)).toBe(0);
    });

    it("should read ergebnisElterngeldFuerMonateMitErwerbsTaetigkeit", () => {
      expect(
        sheet.ergebnisElterngeldBasisFuerMonateMitErwerbsTaetigkeit(0),
      ).toBe(352.19);
      expect(
        sheet.ergebnisElterngeldBasisFuerMonateMitErwerbsTaetigkeit(1),
      ).toBe(0);
    });

    it("should read ergebnisBruttoPlusImBezugsZeitraumDurchschnitt", () => {
      expect(sheet.ergebnisBruttoPlusImBezugsZeitraumDurchschnitt(0)).toBe(
        621.81,
      );
      expect(sheet.ergebnisBruttoPlusImBezugsZeitraumDurchschnitt(1)).toBe(
        1227.55,
      );
    });

    it("should read ergebnisNettoPlusImBezugsZeitraumDurchschnitt", () => {
      expect(sheet.ergebnisNettoPlusImBezugsZeitraumDurchschnitt(0)).toBe(
        494.48,
      );
      expect(sheet.ergebnisNettoPlusImBezugsZeitraumDurchschnitt(1)).toBe(
        1227.55,
      );
    });

    it("should read ergebnisElterngeldPlusFuerMonateMitErwerbsTaetigkeit", () => {
      expect(
        sheet.ergebnisElterngeldPlusFuerMonateMitErwerbsTaetigkeit(0),
      ).toBe(446.34);
      expect(
        sheet.ergebnisElterngeldPlusFuerMonateMitErwerbsTaetigkeit(2),
      ).toBe(200.53);
    });

    it("should read ergebnisElterngeldPlusFuerMonateOhneErwerbsTaetigkeit", () => {
      expect(
        sheet.ergebnisElterngeldPlusFuerMonateOhneErwerbsTaetigkeit(0),
      ).toBe(446.34);
      expect(
        sheet.ergebnisElterngeldPlusFuerMonateOhneErwerbsTaetigkeit(2),
      ).toBe(298.37);
    });

    it("should read zwischenErgebnisElternGeld", () => {
      expect(sheet.zwischenErgebnisElternGeld(0)).toBe(892.68);
      expect(sheet.zwischenErgebnisElternGeld(1)).toBe(300);
    });

    it("should read zwischenErgebnisErsatzRate", () => {
      expect(sheet.zwischenErgebnisErsatzRate(0)).toBe(0.65);
      expect(sheet.zwischenErgebnisErsatzRate(1)).toBe(1);
    });

    it("should read zwischenErgebnisErsatzRateProzent", () => {
      expect(sheet.zwischenErgebnisErsatzRateProzent(0)).toBe(65);
      expect(sheet.zwischenErgebnisErsatzRateProzent(1)).toBe(100);
    });

    it("should read zwischenErgebnisGeschwisterBonus", () => {
      expect(sheet.zwischenErgebnisGeschwisterBonus(0)).toBe(0);
      expect(sheet.zwischenErgebnisGeschwisterBonus(1)).toBe(0);
    });

    it("should read zwischenErgebnisMehrlingsZulage", () => {
      expect(sheet.zwischenErgebnisMehrlingsZulage(0)).toBe(0);
      expect(sheet.zwischenErgebnisMehrlingsZulage(1)).toBe(0);
    });

    it("should read zwischenErgebnisZeitraumGeschwisterBonus", () => {
      expect(
        sheet.zwischenErgebnisZeitraumGeschwisterBonus(0).toISOString(),
      ).toBe(new Date("2017-09-06").toISOString());
      expect(
        sheet.zwischenErgebnisZeitraumGeschwisterBonus(1).toISOString(),
      ).toBe(new Date("2017-12-05").toISOString());
    });
  });

  it(`should read nettoVorGeburt from last column ${
    EgrAlteTestfaelleRoutine3ExcelSheet.TEST_CASE_COUNT - 1
  }`, () => {
    expect(
      sheet
        .nettoVorGeburt(EgrAlteTestfaelleRoutine3ExcelSheet.TEST_CASE_COUNT - 1)
        .value.toNumber(),
    ).toBe(450);
  });

  it(`should not read nettoVorGeburt from column ${EgrAlteTestfaelleRoutine3ExcelSheet.TEST_CASE_COUNT}`, () => {
    expect(() =>
      sheet
        .nettoVorGeburt(EgrAlteTestfaelleRoutine3ExcelSheet.TEST_CASE_COUNT)
        .value.toNumber(),
    ).toThrow("testCaseIndex out of bound");
  });
});
