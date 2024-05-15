import { EgrOhneMischeinkommenExcelSheet } from "./egr-ohne-mischeinkommen-excel-sheet";
import {
  ElternGeldArt,
  ErwerbsArt,
  KassenArt,
  KinderFreiBetrag,
  RentenArt,
  SteuerKlasse,
  YesNo,
} from "@/globals/js/calculations/model";

describe("egr-mischeinkommen-excel-sheet", () => {
  const sheet = new EgrOhneMischeinkommenExcelSheet();

  describe("from Testfaelle_010219.xlsx", () => {
    it("should read geburtsDatum", () => {
      expect(sheet.geburtsDatum(0).toISOString()).toBe(
        new Date("2019-10-21").toISOString(),
      );
      expect(sheet.geburtsDatum(1).toISOString()).toBe(
        new Date("2019-10-30").toISOString(),
      );
    });

    it("should read erwerbsArt", () => {
      expect(sheet.erwerbsArt(0)).toBe(ErwerbsArt.JA_NICHT_SELBST_MINI);
      expect(sheet.erwerbsArt(1)).toBe(ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI);
      expect(sheet.erwerbsArt(4)).toBe(ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI);
      expect(sheet.erwerbsArt(7)).toBe(ErwerbsArt.JA_SELBSTSTAENDIG);
    });

    it("should read kirchenSteuer", () => {
      expect(sheet.kirchenSteuer(0)).toBe(YesNo.NO);
      expect(sheet.kirchenSteuer(3)).toBe(YesNo.YES);
    });

    it("should read steuerKlasse", () => {
      expect(sheet.steuerKlasse(0)).toBe(SteuerKlasse.SKL5);
      expect(sheet.steuerKlasse(1)).toBe(SteuerKlasse.SKL2);
      expect(sheet.steuerKlasse(3)).toBe(SteuerKlasse.SKL3);
    });

    it("should read splittingFaktor", () => {
      expect(sheet.splittingFaktor(0)).toBe(1);
    });

    it("should read kinderFreiBetrag", () => {
      expect(sheet.kinderFreiBetrag(0)).toBe(KinderFreiBetrag.ZKF2);
      expect(sheet.kinderFreiBetrag(1)).toBe(KinderFreiBetrag.ZKF1);
      expect(sheet.kinderFreiBetrag(3)).toBe(KinderFreiBetrag.ZKF3);
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
        RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG,
      );
      expect(sheet.rentenVersicherung(4)).toBe(
        RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
      );
    });

    it("should read lebensmonateElterngeldArt", () => {
      // setup expected
      const expected = [];
      for (let i = 0; i < 14; i++) {
        expected.push(ElternGeldArt.BASIS_ELTERNGELD);
      }
      for (let i = 0; i < 4; i++) {
        expected.push(ElternGeldArt.PARTNERSCHAFTS_BONUS);
      }
      for (let i = 0; i < 14; i++) {
        expected.push(ElternGeldArt.KEIN_BEZUG);
      }

      // expect
      expect(sheet.lebensmonateElterngeldArt(0)).toStrictEqual(expected);
    });

    it("should read nettoVorGeburt", () => {
      expect(sheet.nettoVorGeburt(0).value.toNumber()).toBe(409.5);
      expect(sheet.nettoVorGeburt(1).value.toNumber()).toBe(2534.48);
    });

    it("should read testFallNummer", () => {
      expect(sheet.testFallNummer(0)).toBe(1);
      expect(sheet.testFallNummer(1)).toBe(2);
      expect(
        sheet.testFallNummer(
          EgrOhneMischeinkommenExcelSheet.TEST_CASE_COUNT - 1,
        ),
      ).toBe(EgrOhneMischeinkommenExcelSheet.TEST_CASE_COUNT);
    });
  });

  it(`should read einkommen from last column ${
    EgrOhneMischeinkommenExcelSheet.TEST_CASE_COUNT - 1
  }`, () => {
    expect(
      sheet
        .nettoVorGeburt(EgrOhneMischeinkommenExcelSheet.TEST_CASE_COUNT - 1)
        .value.toNumber(),
    ).toBe(408.59);
  });

  it(`should not read einkommen from column ${EgrOhneMischeinkommenExcelSheet.TEST_CASE_COUNT}`, () => {
    expect(() =>
      sheet
        .nettoVorGeburt(EgrOhneMischeinkommenExcelSheet.TEST_CASE_COUNT)
        .value.toNumber(),
    ).toThrow("testCaseIndex out of bound");
  });
});
