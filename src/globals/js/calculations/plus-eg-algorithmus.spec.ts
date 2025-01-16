import Big from "big.js";
import { BIG_ZERO } from "./common/math-util";
import { EgZwischenErgebnisAlgorithmus } from "./eg-zwischen-ergebnis-algorithmus";
import {
  Einkommen,
  ElternGeldArt,
  ErwerbsArt,
  ErwerbsTaetigkeit,
  ErwerbsZeitraumLebensMonat,
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
          new ErwerbsZeitraumLebensMonat(1, 2, new Einkommen(100)),
          new ErwerbsZeitraumLebensMonat(3, 4, new Einkommen(1000)),
          new ErwerbsZeitraumLebensMonat(5, 6, new Einkommen(5000)),
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
      expect(ergebnis.elternGeldEtPlus.toNumber()).toBe(287.84);
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
        elternGeld: BIG_ZERO,
        ersatzRate: BIG_ZERO,
        geschwisterBonus: BIG_ZERO,
        mehrlingsZulage: BIG_ZERO,
        nettoVorGeburt: BIG_ZERO,
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
  bruttoEinkommenDurchschnitt: Big(1000),
  bruttoEinkommenDurchschnittMidi: Big(0),
  bemessungsZeitraumMonate: [],
};
