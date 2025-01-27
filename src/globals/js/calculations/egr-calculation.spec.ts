import { describe, expect, it } from "vitest";
import { calculateElternGeld } from "./egr-calculation";
import {
  Einkommen,
  ElternGeldArt,
  ErwerbsArt,
  KassenArt,
  KinderFreiBetrag,
  MutterschaftsLeistung,
  PLANUNG_ANZAHL_MONATE,
  RentenArt,
  SteuerKlasse,
} from "./model";
import { ErwerbsTaetigkeit } from "original-rechner";

describe("egr-calculation", () => {
  describe("should calculate EgrErgebnis", () => {
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
        wahrscheinlichesGeburtsDatum: new Date("2023-11-25T01:02:03.000Z"),
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

      // when
      const ergebnis = calculateElternGeld(
        { finanzDaten, persoenlicheDaten, planungsDaten },
        2022,
      );

      // then
      expect(ergebnis.bruttoBasis).toBe(0);
      expect(ergebnis.nettoBasis).toBe(0);
      expect(ergebnis.elternGeldErwBasis).toBe(0);
      expect(ergebnis.bruttoPlus).toBe(1950);
      expect(ergebnis.nettoPlus).toBe(1356.84);
      expect(ergebnis.elternGeldEtPlus).toBe(281.01);
      expect(ergebnis.elternGeldKeineEtPlus).toBe(581.48);
    });

    it("Test with 'Erwerbstaetigkeit nach Geburt' 2", () => {
      // given
      const planungsDaten = {
        mutterschaftsLeistung:
          MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN,
        planung: new Array<ElternGeldArt>(PLANUNG_ANZAHL_MONATE).fill(
          ElternGeldArt.BASIS_ELTERNGELD,
        ),
      };

      const persoenlicheDaten = {
        wahrscheinlichesGeburtsDatum: new Date("2023-11-25T01:02:03.000Z"),
        anzahlKuenftigerKinder: 1,
        etVorGeburt: ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
        hasEtNachGeburt: false,
      };

      const finanzDaten = {
        ...ANY_FINANZDATEN,
        bruttoEinkommen: new Einkommen(2100),
        steuerKlasse: SteuerKlasse.SKL4,
        kinderFreiBetrag: KinderFreiBetrag.ZKF1,
        erwerbsZeitraumLebensMonatList: [],
      };

      // when
      const ergebnis = calculateElternGeld(
        { finanzDaten, persoenlicheDaten, planungsDaten },
        2022,
      );

      // then
      expect(ergebnis.bruttoBasis).toBe(0);
      expect(ergebnis.nettoBasis).toBe(0);
      expect(ergebnis.elternGeldErwBasis).toBe(0);
      expect(ergebnis.bruttoPlus).toBe(0);
      expect(ergebnis.nettoPlus).toBe(0);
      expect(ergebnis.elternGeldEtPlus).toBe(0);
      expect(ergebnis.elternGeldKeineEtPlus).toBe(453.46);
    });
  });

  it("should always calculate the same result for the same inputs with Mischeinkommen", () => {
    const persoenlicheDaten = {
      wahrscheinlichesGeburtsDatum: new Date(),
      anzahlKuenftigerKinder: 1,
      etVorGeburt: ErwerbsArt.JA_MISCHEINKOMMEN,
    };

    const finanzDaten = {
      ...ANY_FINANZDATEN,
      mischEinkommenTaetigkeiten: [ANY_MISCHEINKOMMEN_TAETIGKEIT],
    };

    const planungsDaten = {
      mutterschaftsLeistung: MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN,
      planung: [ElternGeldArt.BASIS_ELTERNGELD],
    };

    const calculate = () =>
      calculateElternGeld(
        { persoenlicheDaten, finanzDaten, planungsDaten },
        2023,
      );

    expect(calculate()).toStrictEqual(calculate());
  });
});

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
