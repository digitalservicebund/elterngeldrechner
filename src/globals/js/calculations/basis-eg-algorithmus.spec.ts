import { describe, expect, it } from "vitest";
import { berechneMischNettoUndBasiselterngeld } from "./basis-eg-algorithmus";
import {
  Einkommen,
  ErwerbsArt,
  ErwerbsTaetigkeit,
  type FinanzDaten,
  KassenArt,
  KinderFreiBetrag,
  RentenArt,
  SteuerKlasse,
} from "./model";

describe("basis-eg-algorithmus", () => {
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

      const finanzDaten: FinanzDaten = {
        istKirchensteuerpflichtig: false,
        bruttoEinkommen: new Einkommen(0),
        kinderFreiBetrag: KinderFreiBetrag.ZKF1,
        steuerKlasse: SteuerKlasse.SKL5,
        kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
        rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
        splittingFaktor: 1.0,
        erwerbsZeitraumLebensMonatList: [],
        mischEinkommenTaetigkeiten: [
          {
            erwerbsTaetigkeit: ErwerbsTaetigkeit.SELBSTSTAENDIG,
            bruttoEinkommenDurchschnitt: 2015.0,
            bruttoEinkommenDurchschnittMidi: 0,
            bemessungsZeitraumMonate: [
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
            istRentenVersicherungsPflichtig: false,
            istKrankenVersicherungsPflichtig: true,
            istArbeitslosenVersicherungsPflichtig: false,
          },
          {
            erwerbsTaetigkeit: ErwerbsTaetigkeit.SELBSTSTAENDIG,
            bruttoEinkommenDurchschnitt: 2343.0,
            bruttoEinkommenDurchschnittMidi: 0,
            bemessungsZeitraumMonate: [
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
            istRentenVersicherungsPflichtig: false,
            istKrankenVersicherungsPflichtig: false,
            istArbeitslosenVersicherungsPflichtig: false,
          },
          {
            erwerbsTaetigkeit: ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG,
            bruttoEinkommenDurchschnitt: 553.0,
            bruttoEinkommenDurchschnittMidi: 0,
            bemessungsZeitraumMonate: [
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
            istRentenVersicherungsPflichtig: false,
            istKrankenVersicherungsPflichtig: false,
            istArbeitslosenVersicherungsPflichtig: true,
          },
        ],
      };

      // when
      const mischEkZwischenErgebnis = berechneMischNettoUndBasiselterngeld(
        persoenlicheDaten,
        finanzDaten,
        2022,
      );

      // then
      expect(mischEkZwischenErgebnis.netto).toBe(910.67);
      expect(mischEkZwischenErgebnis.elterngeldbasis).toBe(650.22);
      expect(mischEkZwischenErgebnis.status).toBe(ErwerbsArt.JA_SELBSTSTAENDIG);
      expect(mischEkZwischenErgebnis.rentenversicherungspflichtig).toBe(false);
      expect(mischEkZwischenErgebnis.krankenversicherungspflichtig).toBe(false);
    });
  });
});
