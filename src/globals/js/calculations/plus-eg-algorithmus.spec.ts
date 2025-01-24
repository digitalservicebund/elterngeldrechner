import { describe, expect, it } from "vitest";
import { EgZwischenErgebnisAlgorithmus } from "./eg-zwischen-ergebnis-algorithmus";
import {
  Einkommen,
  ElternGeldArt,
  ErwerbsArt,
  ErwerbsTaetigkeit,
  KassenArt,
  KinderFreiBetrag,
  MischEkZwischenErgebnis,
  MutterschaftsLeistung,
  PLANUNG_ANZAHL_MONATE,
  RentenArt,
  SteuerKlasse,
  ZwischenErgebnis,
} from "./model";
import { PlusEgAlgorithmus } from "./plus-eg-algorithmus";

describe("plus-eg-algorithmus", () => {
  const zwischenErgebnisAlgorithmus = new EgZwischenErgebnisAlgorithmus();

  describe("should calculate ElternGeldPlusErgebnis", () => {
    it("Test with 'Erwerbstaetigkeit nach Geburt'", () => {
      // given
      const planungsDaten = {
        mutterschaftsLeistung:
          MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN,
        planung: new Array<ElternGeldArt>(PLANUNG_ANZAHL_MONATE).fill(
          ElternGeldArt.ELTERNGELD_PLUS,
        ),
      };

      const persoenlicheDaten = {
        wahrscheinlichesGeburtsDatum: new Date("2023-11-24T01:02:03.000Z"),
        anzahlKuenftigerKinder: 1,
        etVorGeburt: ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
        hasEtNachGeburt: true,
      };

      const finanzDaten = {
        ...ANY_FINANZDATEN,
        bruttoEinkommen: new Einkommen(2800),
        steuerKlasse: SteuerKlasse.SKL1,
        kinderFreiBetrag: KinderFreiBetrag.ZKF1,
        erwerbsZeitraumLebensMonatList: [
          {
            vonLebensMonat: 1,
            bisLebensMonat: 2,
            bruttoProMonat: new Einkommen(100),
          },
          {
            vonLebensMonat: 3,
            bisLebensMonat: 4,
            bruttoProMonat: new Einkommen(1000),
          },
          {
            vonLebensMonat: 5,
            bisLebensMonat: 6,
            bruttoProMonat: new Einkommen(5000),
          },
        ],
      };

      // Wird sonst mit dem Brutto-Netto-Rechner ermittelt:
      // await new BruttoNettoRechner().nettoeinkommenZwischenErgebnis(
      //   finanzDaten,
      //   persoenlicheDaten.etVorGeburt,
      //   2022,
      // );
      const nettoEinkommen = new Einkommen(1883);

      const mischEkZwischenErgebnis = createMischEkZwischenErgebnis();
      const zwischenErgebnis =
        zwischenErgebnisAlgorithmus.elterngeldZwischenergebnis(
          persoenlicheDaten,
          nettoEinkommen,
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
      // console.log(
      //   ergebnis.elternGeldAusgabe
      //     .map((value) => `${value.lebensMonat}: ${value.elternGeld}`)
      //     .join("\n"),
      // );

      expect(ergebnis.bruttoBasis.toNumber()).toBe(0);
      expect(ergebnis.nettoBasis.toNumber()).toBe(0);
      expect(ergebnis.elternGeldErwBasis.toNumber()).toBe(0);
      expect(ergebnis.bruttoPlus.toNumber()).toBe(1950);
      expect(ergebnis.nettoPlus.toNumber()).toBe(1356.84);
      expect(ergebnis.elternGeldEtPlus.toNumber()).toBe(287.83);
      expect(ergebnis.elternGeldKeineEtPlus.toNumber()).toBe(584.89);
    });

    it("should throw error, if finanzdaten mischeinkommen are true and MischEkZwischenErgebnis are null", () => {
      // given
      const persoenlicheDaten = {
        wahrscheinlichesGeburtsDatum: new Date("2023-11-24T01:02:03.000Z"),
        anzahlKuenftigerKinder: 1,
        etVorGeburt: ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
        hasEtNachGeburt: true,
      };

      const zwischenErgebnis: ZwischenErgebnis = {
        elternGeld: 0,
        ersatzRate: 0,
        geschwisterBonus: 0,
        mehrlingsZulage: 0,
        nettoVorGeburt: 0,
        zeitraumGeschwisterBonus: null,
      };

      const finanzDaten = {
        ...ANY_FINANZDATEN,
        mischEinkommenTaetigkeiten: [ANY_MISCHEINKOMMEN_TAETIGKEIT],
      };

      const algorithmus = new PlusEgAlgorithmus();

      expect(() =>
        algorithmus.elterngeldPlusErgebnis(
          {
            mutterschaftsLeistung:
              MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN,
            planung: [],
          },
          persoenlicheDaten,
          finanzDaten,
          2022,
          null,
          zwischenErgebnis,
        ),
      ).toThrow("MischEinkommenEnabledButMissingMischEinkommen");
    });
  });
});

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

const ANY_FINANZDATEN = {
  bruttoEinkommen: new Einkommen(0),
  steuerKlasse: SteuerKlasse.SKL1,
  kinderFreiBetrag: KinderFreiBetrag.ZKF0,
  kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
  rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
  splittingFaktor: 1.0,
  mischEinkommenTaetigkeiten: [],
  erwerbsZeitraumLebensMonatList: [],
};

const ANY_MISCHEINKOMMEN_TAETIGKEIT = {
  erwerbsTaetigkeit: ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG,
  bruttoEinkommenDurchschnitt: 1000,
  bruttoEinkommenDurchschnittMidi: 0,
  bemessungsZeitraumMonate: [],
};
