import { BIG_ZERO } from "./common/math-util";
import { EgZwischenErgebnisAlgorithmus } from "./eg-zwischen-ergebnis-algorithmus";
import {
  Einkommen,
  ElternGeldArt,
  ErwerbsArt,
  ErwerbsZeitraumLebensMonat,
  FinanzDaten,
  KinderFreiBetrag,
  MischEkTaetigkeit,
  MischEkZwischenErgebnis,
  MutterschaftsLeistung,
  PLANUNG_ANZAHL_MONATE,
  PlanungsDaten,
  SteuerKlasse,
  ZwischenErgebnis,
} from "./model";
import { PlusEgAlgorithmus } from "./plus-eg-algorithmus";

describe("plus-eg-algorithmus", () => {
  const zwischenErgebnisAlgorithmus = new EgZwischenErgebnisAlgorithmus();

  describe("should calculate ElternGeldPlusErgebnis", () => {
    it("Test with 'Erwerbstaetigkeit nach Geburt'", () => {
      // given
      const planung = new Array<ElternGeldArt>(PLANUNG_ANZAHL_MONATE).fill(
        ElternGeldArt.ELTERNGELD_PLUS,
      );

      const planungsDaten = new PlanungsDaten(
        MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN,
        planung,
      );

      const persoenlicheDaten = {
        wahrscheinlichesGeburtsDatum: new Date("2023-11-24T01:02:03.000Z"),
        anzahlKuenftigerKinder: 1,
        etVorGeburt: ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
        hasEtNachGeburt: true,
      };

      const finanzDaten = new FinanzDaten();
      finanzDaten.bruttoEinkommen = new Einkommen(2800);
      finanzDaten.steuerKlasse = SteuerKlasse.SKL1;
      finanzDaten.kinderFreiBetrag = KinderFreiBetrag.ZKF1;
      finanzDaten.erwerbsZeitraumLebensMonatList = [];

      const et1 = new ErwerbsZeitraumLebensMonat(1, 2, new Einkommen(100));
      finanzDaten.erwerbsZeitraumLebensMonatList.push(et1);

      const et2 = new ErwerbsZeitraumLebensMonat(3, 4, new Einkommen(1000));
      finanzDaten.erwerbsZeitraumLebensMonatList.push(et2);

      const et3 = new ErwerbsZeitraumLebensMonat(5, 6, new Einkommen(5000));
      finanzDaten.erwerbsZeitraumLebensMonatList.push(et3);

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
      const finanzDaten = new FinanzDaten();
      finanzDaten.mischEinkommenTaetigkeiten.push(new MischEkTaetigkeit());
      const algorithmus = new PlusEgAlgorithmus();

      expect(() =>
        algorithmus.elterngeldPlusErgebnis(
          new PlanungsDaten(
            MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN,
            [],
          ),
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
