import Big from "big.js";
import { BasisEgAlgorithmus } from "./basis-eg-algorithmus";
import {
  createMischEkTaetigkeitOf,
  Einkommen,
  ErwerbsArt,
  ErwerbsTaetigkeit,
  FinanzDaten,
  KassenArt,
  KinderFreiBetrag,
  PersoenlicheDaten,
  SteuerKlasse,
  YesNo,
} from "./model";

describe("basis-eg-algorithmus", () => {
  const basisEgAlgorithmus = new BasisEgAlgorithmus();

  describe("should calculate MischNettoUndBasiselterngeld for test cases from Testfaelle_010219.xlsx", () => {
    it("TESTFALL NO. 1", () => {
      // given
      const persoenlicheDaten = new PersoenlicheDaten(
        new Date("2022-01-01T10:37:00.000Z"),
      );
      persoenlicheDaten.anzahlKuenftigerKinder = 1;
      persoenlicheDaten.etVorGeburt = ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI;
      persoenlicheDaten.etNachGeburt = YesNo.NO;
      const finanzDaten = new FinanzDaten();
      finanzDaten.zahlenSieKirchenSteuer = YesNo.NO;
      finanzDaten.bruttoEinkommen = new Einkommen(0);
      finanzDaten.kinderFreiBetrag = KinderFreiBetrag.ZKF1;
      finanzDaten.steuerKlasse = SteuerKlasse.SKL5;
      finanzDaten.kassenArt = KassenArt.GESETZLICH_PFLICHTVERSICHERT;
      finanzDaten.mischEinkommenTaetigkeiten = [
        createMischEkTaetigkeitOf(
          ErwerbsTaetigkeit.SELBSTSTAENDIG,
          Big(2015.0),
          [
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
          ],
          YesNo.NO,
          YesNo.YES,
          YesNo.NO,
        ),
        createMischEkTaetigkeitOf(
          ErwerbsTaetigkeit.SELBSTSTAENDIG,
          Big(2343.0),
          [
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
          ],
          YesNo.NO,
          YesNo.NO,
          YesNo.NO,
        ),
        createMischEkTaetigkeitOf(
          ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG,
          Big(553.0),
          [
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
          ],
          YesNo.NO,
          YesNo.NO,
          YesNo.YES,
        ),
      ];

      // when
      const mischEkZwischenErgebnis =
        basisEgAlgorithmus.berechneMischNettoUndBasiselterngeld(
          persoenlicheDaten,
          finanzDaten,
          2022,
        );

      // then
      expect(mischEkZwischenErgebnis.netto.toNumber()).toBe(910.67);
      expect(mischEkZwischenErgebnis.elterngeldbasis.toNumber()).toBe(650.22);
      expect(mischEkZwischenErgebnis.status).toBe(ErwerbsArt.JA_SELBSTSTAENDIG);
      expect(mischEkZwischenErgebnis.rentenversicherungspflichtig).toBe(false);
      expect(mischEkZwischenErgebnis.krankenversicherungspflichtig).toBe(false);
    });
  });
});
