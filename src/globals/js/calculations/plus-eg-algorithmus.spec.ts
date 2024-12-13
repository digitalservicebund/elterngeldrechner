import { DateTime } from "luxon";
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
  PersoenlicheDaten,
  PLANUNG_ANZAHL_MONATE,
  PlanungsDaten,
  SteuerKlasse,
  YesNo,
  ZwischenErgebnis,
} from "./model";
import { EgZwischenErgebnisAlgorithmus } from "./eg-zwischen-ergebnis-algorithmus";
import { PlusEgAlgorithmus } from "./plus-eg-algorithmus";
import { BIG_ZERO } from "./common/math-util";

describe("plus-eg-algorithmus", () => {
  const zwischenErgebnisAlgorithmus = new EgZwischenErgebnisAlgorithmus();

  describe("should fill LebensMonate list", () => {
    test.each([
      [
        "2023-01-01",
        [
          { lm: 1, anfang: "2023-01-01", ende: "2023-01-31" },
          { lm: 2, anfang: "2023-02-01", ende: "2023-02-28" },
          { lm: 3, anfang: "2023-03-01", ende: "2023-03-31" },
          { lm: 4, anfang: "2023-04-01", ende: "2023-04-30" },
          { lm: 31, anfang: "2025-07-01", ende: "2025-07-31" },
          { lm: 32, anfang: "2025-08-01", ende: "2025-08-31" },
        ],
      ],
      [
        "2023-01-03",
        [
          { lm: 1, anfang: "2023-01-03", ende: "2023-02-02" },
          { lm: 2, anfang: "2023-02-03", ende: "2023-03-02" },
          { lm: 3, anfang: "2023-03-03", ende: "2023-04-02" },
          { lm: 4, anfang: "2023-04-03", ende: "2023-05-02" },
          { lm: 31, anfang: "2025-07-03", ende: "2025-08-02" },
          { lm: 32, anfang: "2025-08-03", ende: "2025-09-02" },
        ],
      ],
      [
        "2023-01-31",
        [
          { lm: 1, anfang: "2023-01-31", ende: "2023-02-27" },
          { lm: 2, anfang: "2023-02-28", ende: "2023-03-30" },
          { lm: 3, anfang: "2023-03-31", ende: "2023-04-29" },
          { lm: 4, anfang: "2023-04-30", ende: "2023-05-30" },
          { lm: 31, anfang: "2025-07-31", ende: "2025-08-30" },
          { lm: 32, anfang: "2025-08-31", ende: "2025-09-29" },
        ],
      ],
    ])("if geburt of child is %p", (geburtIsoDate: string, expectedLmList) => {
      // given
      const geburt = DateTime.fromISO(geburtIsoDate).toJSDate();

      // when
      const plusEgAlgorithmus = new PlusEgAlgorithmus();
      plusEgAlgorithmus.fillLebensMonateList(geburt);

      // then
      expect(plusEgAlgorithmus.anfang_LM[0]).toBeUndefined();
      expect(plusEgAlgorithmus.ende_LM[0]).toBeUndefined();

      expectedLmList.forEach((expectedLm) => {
        const anfangLM = plusEgAlgorithmus.anfang_LM[expectedLm.lm];
        const endeLM = plusEgAlgorithmus.ende_LM[expectedLm.lm];
        expect(anfangLM).not.toBeUndefined();
        expect(DateTime.fromJSDate(anfangLM).toISODate()).toBe(
          expectedLm.anfang,
        );
        expect(DateTime.fromJSDate(endeLM).toISODate()).toBe(expectedLm.ende);
      });
    });
  });

  describe("should calculate ElternGeldPlusErgebnis", () => {
    it("Test with 'Erwerbstaetigkeit nach Geburt'", () => {
      // given
      const planungsDaten = createPlanungsDaten();
      planungsDaten.planung = new Array<ElternGeldArt>(
        PLANUNG_ANZAHL_MONATE,
      ).fill(ElternGeldArt.ELTERNGELD_PLUS);

      const persoenlicheDaten = new PersoenlicheDaten(
        new Date("2023-11-24T01:02:03.000Z"),
      );
      persoenlicheDaten.sindSieAlleinerziehend = YesNo.YES;
      persoenlicheDaten.anzahlKuenftigerKinder = 1;
      persoenlicheDaten.etVorGeburt = ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI;
      persoenlicheDaten.etNachGeburt = YesNo.YES;

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
      const persoenlicheDaten = new PersoenlicheDaten(
        new Date("2023-11-24T01:02:03.000Z"),
      );
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
          createPlanungsDaten(),
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

const createPlanungsDaten = () =>
  new PlanungsDaten(
    true,
    true,
    false,
    MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN,
  );

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
