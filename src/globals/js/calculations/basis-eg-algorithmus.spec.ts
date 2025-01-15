import Big from "big.js";
import { BasisEgAlgorithmus } from "./basis-eg-algorithmus";
import {
  Einkommen,
  ErwerbsArt,
  ErwerbsTaetigkeit,
  KassenArt,
  KinderFreiBetrag,
  RentenArt,
  SteuerKlasse,
  createMischEkTaetigkeitOf,
} from "./model";

describe("basis-eg-algorithmus", () => {
  const basisEgAlgorithmus = new BasisEgAlgorithmus();

  describe("should calculate MischNettoUndBasiselterngeld for test cases from Testfaelle_010219.xlsx", () => {
    it("TESTFALL NO. 1", () => {
      // given
      const persoenlicheDaten = {
        wahrscheinlichesGeburtsDatum: new Date("2022-01-01T10:37:00.000Z"),
        anzahlKuenftigerKinder: 1,
        etVorGeburt: ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
        hasEtNachGeburt: false,
        geschwister: [],
      };

      const finanzDaten = {
        istKirchensteuerpflichtig: false,
        bruttoEinkommen: new Einkommen(0),
        kinderFreiBetrag: KinderFreiBetrag.ZKF1,
        steuerKlasse: SteuerKlasse.SKL5,
        kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
        rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
        splittingFaktor: 1.0,
        erwerbsZeitraumLebensMonatList: [],
        mischEinkommenTaetigkeiten: [
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
            false,
            true,
            false,
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
            false,
            false,
            false,
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
            false,
            false,
            true,
          ),
        ],
      };

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
