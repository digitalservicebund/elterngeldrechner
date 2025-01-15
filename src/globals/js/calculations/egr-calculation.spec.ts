import Big from "big.js";
import { EgrCalculation } from "./egr-calculation";
import {
  Einkommen,
  ElternGeldArt,
  ErwerbsArt,
  ErwerbsZeitraumLebensMonat,
  KassenArt,
  KinderFreiBetrag,
  MischEkTaetigkeit,
  MutterschaftsLeistung,
  PLANUNG_ANZAHL_MONATE,
  RentenArt,
  SteuerKlasse,
} from "./model";

describe("egr-calculation", () => {
  const egrCalculation = new EgrCalculation();

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
          new ErwerbsZeitraumLebensMonat(1, 2, new Einkommen(100)),
          new ErwerbsZeitraumLebensMonat(3, 4, new Einkommen(1000)),
          new ErwerbsZeitraumLebensMonat(5, 6, new Einkommen(5000)),
        ],
      };

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
    };

    const taetigkeit = new MischEkTaetigkeit();
    taetigkeit.bruttoEinkommenDurchschnitt = Big(4000);
    taetigkeit.bemessungsZeitraumMonate = Array<boolean>(12).fill(true);

    const finanzDaten = {
      ...ANY_FINANZDATEN,
      mischEinkommenTaetigkeiten: [taetigkeit],
    };

    const planungsDaten = {
      mutterschaftsLeistung: MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN,
      planung: [ElternGeldArt.BASIS_ELTERNGELD],
    };

    const calculate = () =>
      new EgrCalculation().calculateElternGeld(
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
