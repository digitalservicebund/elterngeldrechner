import Big from "big.js";
import { EgrCalculation } from "./egr-calculation";
import {
  Einkommen,
  ElternGeldArt,
  ErwerbsArt,
  ErwerbsZeitraumLebensMonat,
  FinanzDaten,
  KinderFreiBetrag,
  MischEkTaetigkeit,
  MutterschaftsLeistung,
  PLANUNG_ANZAHL_MONATE,
  PersoenlicheDaten,
  PlanungsDaten,
  SteuerKlasse,
  YesNo,
} from "./model";

describe("egr-calculation", () => {
  const egrCalculation = new EgrCalculation();

  describe("should calculate EgrErgebnis", () => {
    it("Test with 'Erwerbstaetigkeit nach Geburt'", () => {
      // given
      const planungsDaten = new PlanungsDaten(
        MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN,
      );
      planungsDaten.planung = new Array<ElternGeldArt>(
        PLANUNG_ANZAHL_MONATE,
      ).fill(ElternGeldArt.ELTERNGELD_PLUS);

      const persoenlicheDaten = {
        wahrscheinlichesGeburtsDatum: new Date("2023-11-25T01:02:03.000Z"),
        anzahlKuenftigerKinder: 1,
        etVorGeburt: ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
        etNachGeburt: YesNo.YES,
        geschwister: [],
      };

      const finanzDaten = new FinanzDaten();
      finanzDaten.bruttoEinkommen = new Einkommen(2800);
      finanzDaten.steuerKlasse = SteuerKlasse.SKL1;
      finanzDaten.kinderFreiBetrag = KinderFreiBetrag.ZKF1;
      finanzDaten.erwerbsZeitraumLebensMonatList = [];
      finanzDaten.erwerbsZeitraumLebensMonatList.push(
        new ErwerbsZeitraumLebensMonat(1, 2, new Einkommen(100)),
      );
      finanzDaten.erwerbsZeitraumLebensMonatList.push(
        new ErwerbsZeitraumLebensMonat(3, 4, new Einkommen(1000)),
      );
      finanzDaten.erwerbsZeitraumLebensMonatList.push(
        new ErwerbsZeitraumLebensMonat(5, 6, new Einkommen(5000)),
      );

      // when
      const ergebnis = egrCalculation.calculateElternGeld(
        { finanzDaten, persoenlicheDaten, planungsDaten },
        2022,
      );

      // then
      expect(ergebnis.bruttoBasis.toNumber()).toBe(0);
      expect(ergebnis.nettoBasis.toNumber()).toBe(0);
      expect(ergebnis.elternGeldErwBasis.toNumber()).toBe(0);
      expect(ergebnis.bruttoPlus.toNumber()).toBe(1950);
      expect(ergebnis.nettoPlus.toNumber()).toBe(1356.84);
      expect(ergebnis.elternGeldEtPlus.toNumber()).toBe(281.01);
      expect(ergebnis.elternGeldKeineEtPlus.toNumber()).toBe(581.48);
    });

    it("Test with 'Erwerbstaetigkeit nach Geburt' 2", () => {
      // given
      const planungsDaten = new PlanungsDaten(
        MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN,
      );
      planungsDaten.planung = new Array<ElternGeldArt>(
        PLANUNG_ANZAHL_MONATE,
      ).fill(ElternGeldArt.BASIS_ELTERNGELD);

      const persoenlicheDaten = {
        wahrscheinlichesGeburtsDatum: new Date("2023-11-25T01:02:03.000Z"),
        anzahlKuenftigerKinder: 1,
        etVorGeburt: ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
        etNachGeburt: YesNo.NO,
        geschwister: [],
      };

      const finanzDaten = new FinanzDaten();
      finanzDaten.bruttoEinkommen = new Einkommen(2100);
      finanzDaten.steuerKlasse = SteuerKlasse.SKL4;
      finanzDaten.kinderFreiBetrag = KinderFreiBetrag.ZKF1;
      finanzDaten.erwerbsZeitraumLebensMonatList = [];

      // when
      const ergebnis = egrCalculation.calculateElternGeld(
        { finanzDaten, persoenlicheDaten, planungsDaten },
        2022,
      );

      // then
      expect(ergebnis.bruttoBasis.toNumber()).toBe(0);
      expect(ergebnis.nettoBasis.toNumber()).toBe(0);
      expect(ergebnis.elternGeldErwBasis.toNumber()).toBe(0);
      expect(ergebnis.bruttoPlus.toNumber()).toBe(0);
      expect(ergebnis.nettoPlus.toNumber()).toBe(0);
      expect(ergebnis.elternGeldEtPlus.toNumber()).toBe(0);
      expect(ergebnis.elternGeldKeineEtPlus.toNumber()).toBe(453.46);
    });
  });

  it("should always calculate the same result for the same inputs with Mischeinkommen", () => {
    const persoenlicheDaten = {
      wahrscheinlichesGeburtsDatum: new Date(),
      anzahlKuenftigerKinder: 1,
      etVorGeburt: ErwerbsArt.JA_MISCHEINKOMMEN,
      etNachGeburt: YesNo.NO,
      geschwister: [],
    };

    const taetigkeit = new MischEkTaetigkeit(true);
    taetigkeit.bruttoEinkommenDurchschnitt = Big(4000);

    const finanzDaten = new FinanzDaten();
    finanzDaten.mischEinkommenTaetigkeiten = [taetigkeit];

    const planungsDaten = new PlanungsDaten(
      MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN,
    );
    planungsDaten.planung = [ElternGeldArt.BASIS_ELTERNGELD];

    const calculate = () =>
      new EgrCalculation().calculateElternGeld(
        { persoenlicheDaten, finanzDaten, planungsDaten },
        2023,
      );

    expect(calculate()).toStrictEqual(calculate());
  });
});
