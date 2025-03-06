import { describe, expect, it } from "vitest";
import { EgrMischeinkommenExcelSheet } from "./egr-mischeinkommen-excel-sheet";
import {
  ErwerbsArt,
  ErwerbsTaetigkeit,
  KinderFreiBetrag,
  SteuerKlasse,
} from "@/elterngeldrechner/model";

describe("egr-mischeinkommen-excel-sheet", () => {
  const sheet = new EgrMischeinkommenExcelSheet();

  describe("from Testfaelle_2022_3.xlsx", () => {
    it("should read einkommen", () => {
      expect(sheet.einkommen(0, 0)).toBe(2015);
      expect(sheet.einkommen(1, 0)).toBe(2343);
      expect(sheet.einkommen(2, 0)).toBe(553);
      expect(sheet.einkommen(0, 1)).toBe(2387);
      expect(sheet.einkommen(1, 1)).toBe(311);
      expect(sheet.einkommen(2, 1)).toBe(327);
    });

    it("should read erwerbsTaetigkeit", () => {
      expect(sheet.erwerbsTaetigkeit(0, 0)).toBe(
        ErwerbsTaetigkeit.SELBSTSTAENDIG,
      );
      expect(sheet.erwerbsTaetigkeit(1, 0)).toBe(
        ErwerbsTaetigkeit.SELBSTSTAENDIG,
      );
      expect(sheet.erwerbsTaetigkeit(2, 0)).toBe(
        ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG,
      );
      expect(sheet.erwerbsTaetigkeit(0, 1)).toBe(
        ErwerbsTaetigkeit.SELBSTSTAENDIG,
      );
      expect(sheet.erwerbsTaetigkeit(1, 1)).toBe(ErwerbsTaetigkeit.MINIJOB);
      expect(sheet.erwerbsTaetigkeit(2, 1)).toBe(ErwerbsTaetigkeit.MINIJOB);
    });

    it("should read bemessungsZeitraumMonate", () => {
      expect(sheet.bemessungsZeitraumMonate(0, 0)).toStrictEqual([
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
      ]);
      expect(sheet.bemessungsZeitraumMonate(1, 0)).toStrictEqual([
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        true,
        false,
        false,
        false,
      ]);
      expect(sheet.bemessungsZeitraumMonate(2, 0)).toStrictEqual([
        false,
        false,
        false,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ]);
    });

    it("should read rentenVersicherungsPflichtig", () => {
      expect(sheet.rentenVersicherungsPflichtig(0, 0)).toBe(false);
      expect(sheet.rentenVersicherungsPflichtig(1, 0)).toBe(false);
      expect(sheet.rentenVersicherungsPflichtig(2, 0)).toBe(false);
      expect(sheet.rentenVersicherungsPflichtig(0, 1)).toBe(false);
      expect(sheet.rentenVersicherungsPflichtig(1, 1)).toBe(false);
      expect(sheet.rentenVersicherungsPflichtig(2, 1)).toBe(false);
      expect(sheet.rentenVersicherungsPflichtig(0, 8)).toBe(true);
      expect(sheet.rentenVersicherungsPflichtig(1, 8)).toBe(true);
      expect(sheet.rentenVersicherungsPflichtig(2, 8)).toBe(true);
    });

    it("should read krankenVersicherungsPflichtig", () => {
      expect(sheet.krankenVersicherungsPflichtig(0, 0)).toBe(true);
      expect(sheet.krankenVersicherungsPflichtig(1, 0)).toBe(false);
      expect(sheet.krankenVersicherungsPflichtig(2, 0)).toBe(false);
      expect(sheet.krankenVersicherungsPflichtig(0, 1)).toBe(false);
      expect(sheet.krankenVersicherungsPflichtig(1, 1)).toBe(false);
      expect(sheet.krankenVersicherungsPflichtig(2, 1)).toBe(true);
    });

    it("should read arbeitslosenVersicherungsPflichtig", () => {
      expect(sheet.arbeitslosenVersicherungsPflichtig(0, 0)).toBe(false);
      expect(sheet.arbeitslosenVersicherungsPflichtig(1, 0)).toBe(false);
      expect(sheet.arbeitslosenVersicherungsPflichtig(2, 0)).toBe(true);
      expect(sheet.arbeitslosenVersicherungsPflichtig(0, 1)).toBe(false);
      expect(sheet.arbeitslosenVersicherungsPflichtig(1, 1)).toBe(true);
      expect(sheet.arbeitslosenVersicherungsPflichtig(2, 1)).toBe(true);
    });

    it("should read steuerKlasse", () => {
      expect(sheet.steuerKlasse(0)).toBe(SteuerKlasse.SKL5);
      expect(sheet.steuerKlasse(1)).toBe(SteuerKlasse.SKL1);
    });

    it("should read splittingFaktor", () => {
      expect(sheet.splittingFaktor(0)).toBe(1);
    });

    it("should read kinderFreiBetrag", () => {
      expect(sheet.kinderFreiBetrag(0)).toBe(KinderFreiBetrag.ZKF1);
      expect(sheet.kinderFreiBetrag(1)).toBe(KinderFreiBetrag.ZKF3);
    });

    it("should read zahlenSieKirchenSteuer", () => {
      expect(sheet.zahlenSieKirchenSteuer(0)).toBe(false);
      expect(sheet.zahlenSieKirchenSteuer(1)).toBe(true);
    });

    it("should read netto", () => {
      expect(sheet.ergebnisNetto(0)).toBe(910.67);
      expect(sheet.ergebnisNetto(1)).toBe(1684.54);
    });

    it("should read basisElternGeld", () => {
      expect(sheet.ergebnisBasisElternGeld(0)).toBe(650.22);
      expect(sheet.ergebnisBasisElternGeld(1)).toBe(1094.95);
    });

    it("should read krankenVersicherung", () => {
      expect(sheet.ergebnisKrankenVersicherung(0)).toBe(false);
      expect(sheet.ergebnisKrankenVersicherung(8)).toBe(true);
    });

    it("should read rentenVersicherung", () => {
      expect(sheet.ergebnisRentenVersicherung(0)).toBe(false);
      expect(sheet.ergebnisRentenVersicherung(8)).toBe(true);
    });

    it("should read erwerbsArt", () => {
      expect(sheet.ergebnisErwerbsArt(0)).toBe(ErwerbsArt.JA_SELBSTSTAENDIG);
      expect(sheet.ergebnisErwerbsArt(3)).toBe(
        ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
      );
      expect(sheet.ergebnisErwerbsArt(13)).toBe(
        ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI,
      );
      expect(sheet.ergebnisErwerbsArt(4)).toBe(
        ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
      );
    });

    it("should read testFallNummer", () => {
      expect(sheet.testFallNummer(0)).toBe(1);
      expect(sheet.testFallNummer(1)).toBe(2);
    });
  });

  it("should read einkommen from last column 99", () => {
    expect(
      sheet.einkommen(0, EgrMischeinkommenExcelSheet.TEST_CASE_COUNT - 1),
    ).toBe(1662);
  });

  it("should not read einkommen from column 100", () => {
    expect(() =>
      sheet.einkommen(0, EgrMischeinkommenExcelSheet.TEST_CASE_COUNT),
    ).toThrow("testCaseIndex out of bound");
  });
});
