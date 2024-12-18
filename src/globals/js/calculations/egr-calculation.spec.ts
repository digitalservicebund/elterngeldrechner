import Big from "big.js";
import {
  Einkommen,
  ElternGeldArt,
  ElternGeldDaten,
  ErwerbsArt,
  ErwerbsZeitraumLebensMonat,
  FinanzDaten,
  KinderFreiBetrag,
  MischEkTaetigkeit,
  MutterschaftsLeistung,
  PersoenlicheDaten,
  PLANUNG_ANZAHL_MONATE,
  PlanungsDaten,
  SteuerKlasse,
  YesNo,
} from "./model";
import { EgrCalculation } from "./egr-calculation";

describe("egr-calculation", () => {
  const egrCalculation = new EgrCalculation();

  describe("should calculate EgrErgebnis", () => {
    it("Test with 'Erwerbstaetigkeit nach Geburt'", () => {
      // given
      const planungsDatenElternTeil1 = new PlanungsDaten(
        MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN,
      );
      planungsDatenElternTeil1.planung = new Array<ElternGeldArt>(
        PLANUNG_ANZAHL_MONATE,
      ).fill(ElternGeldArt.ELTERNGELD_PLUS);

      const planungsDatenElternTeil2 = new PlanungsDaten(
        MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN,
      );
      planungsDatenElternTeil2.planung = new Array<ElternGeldArt>(
        PLANUNG_ANZAHL_MONATE,
      ).fill(ElternGeldArt.BASIS_ELTERNGELD);

      const persoenlicheDatenElternTeil1 = new PersoenlicheDaten(
        new Date("2023-11-25T01:02:03.000Z"),
      );
      persoenlicheDatenElternTeil1.anzahlKuenftigerKinder = 1;
      persoenlicheDatenElternTeil1.etVorGeburt =
        ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI;
      persoenlicheDatenElternTeil1.etNachGeburt = YesNo.YES;

      const persoenlicheDatenElternTeil2 = new PersoenlicheDaten(
        new Date("2023-11-25T01:02:03.000Z"),
      );
      persoenlicheDatenElternTeil2.anzahlKuenftigerKinder = 1;
      persoenlicheDatenElternTeil2.etVorGeburt =
        ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI;
      persoenlicheDatenElternTeil2.etNachGeburt = YesNo.NO;

      const finanzDatenElternTeil1 = new FinanzDaten();
      finanzDatenElternTeil1.bruttoEinkommen = new Einkommen(2800);
      finanzDatenElternTeil1.steuerKlasse = SteuerKlasse.SKL1;
      finanzDatenElternTeil1.kinderFreiBetrag = KinderFreiBetrag.ZKF1;
      finanzDatenElternTeil1.erwerbsZeitraumLebensMonatList = [];
      finanzDatenElternTeil1.erwerbsZeitraumLebensMonatList.push(
        new ErwerbsZeitraumLebensMonat(1, 2, new Einkommen(100)),
      );
      finanzDatenElternTeil1.erwerbsZeitraumLebensMonatList.push(
        new ErwerbsZeitraumLebensMonat(3, 4, new Einkommen(1000)),
      );
      finanzDatenElternTeil1.erwerbsZeitraumLebensMonatList.push(
        new ErwerbsZeitraumLebensMonat(5, 6, new Einkommen(5000)),
      );

      const finanzDatenElternTeil2 = new FinanzDaten();
      finanzDatenElternTeil2.bruttoEinkommen = new Einkommen(2100);
      finanzDatenElternTeil2.steuerKlasse = SteuerKlasse.SKL4;
      finanzDatenElternTeil2.kinderFreiBetrag = KinderFreiBetrag.ZKF1;
      finanzDatenElternTeil2.erwerbsZeitraumLebensMonatList = [];

      const elternGeldDatenElternTeil1: ElternGeldDaten = {
        finanzDaten: finanzDatenElternTeil1,
        persoenlicheDaten: persoenlicheDatenElternTeil1,
        planungsDaten: planungsDatenElternTeil1,
      };
      const elternGeldDatenElternTeil2: ElternGeldDaten = {
        finanzDaten: finanzDatenElternTeil2,
        persoenlicheDaten: persoenlicheDatenElternTeil2,
        planungsDaten: planungsDatenElternTeil2,
      };

      // when
      const ergebnis = egrCalculation.calculate(
        elternGeldDatenElternTeil1,
        elternGeldDatenElternTeil2,
        2022,
      );

      // then
      expect(ergebnis).not.toBeUndefined();
      expect(ergebnis.elternTeil1.bruttoBasis.toNumber()).toBe(0);
      expect(ergebnis.elternTeil1.nettoBasis.toNumber()).toBe(0);
      expect(ergebnis.elternTeil1.elternGeldErwBasis.toNumber()).toBe(0);
      expect(ergebnis.elternTeil1.bruttoPlus.toNumber()).toBe(1950);
      expect(ergebnis.elternTeil1.nettoPlus.toNumber()).toBe(1356.84);
      expect(ergebnis.elternTeil1.elternGeldEtPlus.toNumber()).toBe(281.01);
      expect(ergebnis.elternTeil1.elternGeldKeineEtPlus.toNumber()).toBe(
        581.48,
      );
      expect(ergebnis.elternTeil2.bruttoBasis.toNumber()).toBe(0);
      expect(ergebnis.elternTeil2.nettoBasis.toNumber()).toBe(0);
      expect(ergebnis.elternTeil2.elternGeldErwBasis.toNumber()).toBe(0);
      expect(ergebnis.elternTeil2.bruttoPlus.toNumber()).toBe(0);
      expect(ergebnis.elternTeil2.nettoPlus.toNumber()).toBe(0);
      expect(ergebnis.elternTeil2.elternGeldEtPlus.toNumber()).toBe(0);
      expect(ergebnis.elternTeil2.elternGeldKeineEtPlus.toNumber()).toBe(
        453.46,
      );
    });
  });

  describe("should simulate ElternGeld", () => {
    it("Test with 'Erwerbstaetigkeit nach Geburt'", () => {
      // given
      const persoenlicheDaten = new PersoenlicheDaten(
        new Date("2023-11-25T01:02:03.000Z"),
      );
      persoenlicheDaten.anzahlKuenftigerKinder = 1;
      persoenlicheDaten.etVorGeburt = ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI;
      persoenlicheDaten.etNachGeburt = YesNo.YES;

      const finanzDaten = new FinanzDaten();
      finanzDaten.bruttoEinkommen = new Einkommen(2800);
      finanzDaten.steuerKlasse = SteuerKlasse.SKL1;
      finanzDaten.kinderFreiBetrag = KinderFreiBetrag.ZKF0;
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
      const ergebnis = egrCalculation.simulate(
        persoenlicheDaten,
        finanzDaten,
        2022,
        MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN,
      );

      // then
      expect(ergebnis).not.toBeUndefined();
      expect(ergebnis.rows[0].vonLebensMonat).toBe(1);
      expect(ergebnis.rows[0].bisLebensMonat).toBe(2);
      expect(ergebnis.rows[0].basisElternGeld.toNumber()).toBe(300);
      expect(ergebnis.rows[0].elternGeldPlus.toNumber()).toBe(281.01);
      expect(ergebnis.rows[0].nettoEinkommen.toNumber()).toBe(79);

      expect(ergebnis.rows[1].vonLebensMonat).toBe(3);
      expect(ergebnis.rows[1].bisLebensMonat).toBe(4);
      expect(ergebnis.rows[1].basisElternGeld.toNumber()).toBe(300);
      expect(ergebnis.rows[1].elternGeldPlus.toNumber()).toBe(281.01);
      expect(ergebnis.rows[1].nettoEinkommen.toNumber()).toBe(800.46);

      expect(ergebnis.rows[2].vonLebensMonat).toBe(5);
      expect(ergebnis.rows[2].bisLebensMonat).toBe(6);
      expect(ergebnis.rows[2].basisElternGeld.toNumber()).toBe(300);
      expect(ergebnis.rows[2].elternGeldPlus.toNumber()).toBe(281.01);
      expect(ergebnis.rows[2].nettoEinkommen.toNumber()).toBe(2996.5);

      expect(ergebnis.rows[3].vonLebensMonat).toBe(7);
      expect(ergebnis.rows[3].bisLebensMonat).toBe(14);
      expect(ergebnis.rows[3].basisElternGeld.toNumber()).toBe(1162.96);
      expect(ergebnis.rows[3].elternGeldPlus.toNumber()).toBe(581.48);
      expect(ergebnis.rows[3].nettoEinkommen.toNumber()).toBe(0);

      expect(ergebnis.rows[4].vonLebensMonat).toBe(15);
      expect(ergebnis.rows[4].bisLebensMonat).toBe(PLANUNG_ANZAHL_MONATE);
      expect(ergebnis.rows[4].basisElternGeld.toNumber()).toBe(0);
      expect(ergebnis.rows[4].elternGeldPlus.toNumber()).toBe(581.48);
      expect(ergebnis.rows[4].nettoEinkommen.toNumber()).toBe(0);
    });
  });

  it("should always calculate the same result for the same inputs with Mischeinkommen", () => {
    const persoenlicheDaten = new PersoenlicheDaten(new Date());
    persoenlicheDaten.etVorGeburt = ErwerbsArt.JA_MISCHEINKOMMEN;

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
