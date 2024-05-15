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
import { MathUtil } from "./common/math-util";

describe("plus-eg-algorithmus", () => {
  const zwischenErgebnisAlgorithmus = new EgZwischenErgebnisAlgorithmus();

  describe("should fill LebensMonate list", () => {
    describe.each([
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
      it("create LebensMonateList", () => {
        // given
        let geburt = DateTime.fromISO(geburtIsoDate).toJSDate();

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
  });

  describe("should calculate ElternGeldPlusErgebnis", () => {
    it("Test with 'Erwerbstaetigkeit nach Geburt'", async () => {
      // given
      global.fetch = jest.fn(() =>
        Promise.resolve(new Response(bmfSteuerRechnerResponse)),
      );

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
      const et1 = new ErwerbsZeitraumLebensMonat();
      et1.vonLebensMonat = 1;
      et1.bisLebensMonat = 2;
      et1.bruttoProMonat = new Einkommen(100);
      finanzDaten.erwerbsZeitraumLebensMonatList.push(et1);
      const et2 = new ErwerbsZeitraumLebensMonat();
      et2.vonLebensMonat = 3;
      et2.bisLebensMonat = 4;
      et2.bruttoProMonat = new Einkommen(1000);
      finanzDaten.erwerbsZeitraumLebensMonatList.push(et2);
      const et3 = new ErwerbsZeitraumLebensMonat();
      et3.vonLebensMonat = 5;
      et3.bisLebensMonat = 6;
      et3.bruttoProMonat = new Einkommen(5000);
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
        await zwischenErgebnisAlgorithmus.elterngeldZwischenergebnis(
          persoenlicheDaten,
          nettoEinkommen,
        );

      // when
      const algorithmus = new PlusEgAlgorithmus();
      const ergebnis = await algorithmus.elterngeldPlusErgebnis(
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
      expect(ergebnis.nettoPlus.toNumber()).toBe(1361.17);
      expect(ergebnis.elternGeldEtPlus.toNumber()).toBe(285.02);
      expect(ergebnis.elternGeldKeineEtPlus.toNumber()).toBe(584.89);
    });

    it("should throw error, if finanzdaten mischeinkommen are true and MischEkZwischenErgebnis are null", async () => {
      // given
      const persoenlicheDaten = new PersoenlicheDaten(
        new Date("2023-11-24T01:02:03.000Z"),
      );
      const zwischenErgebnis: ZwischenErgebnis = {
        elternGeld: MathUtil.BIG_ZERO,
        ersatzRate: MathUtil.BIG_ZERO,
        geschwisterBonus: MathUtil.BIG_ZERO,
        mehrlingsZulage: MathUtil.BIG_ZERO,
        nettoVorGeburt: MathUtil.BIG_ZERO,
        zeitraumGeschwisterBonus: null,
      };
      const finanzDaten = new FinanzDaten();
      finanzDaten.mischEinkommenTaetigkeiten.push(new MischEkTaetigkeit());
      const algorithmus = new PlusEgAlgorithmus();

      await expect(
        async () =>
          await algorithmus.elterngeldPlusErgebnis(
            createPlanungsDaten(),
            persoenlicheDaten,
            finanzDaten,
            2022,
            null,
            zwischenErgebnis,
          ),
      ).rejects.toThrow("MischEinkommenEnabledButMissingMischEinkommen");
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
    elterngeldbasis: MathUtil.BIG_ZERO,
    krankenversicherungspflichtig: false,
    netto: MathUtil.BIG_ZERO,
    brutto: MathUtil.BIG_ZERO,
    steuern: MathUtil.BIG_ZERO,
    abgaben: MathUtil.BIG_ZERO,
    rentenversicherungspflichtig: false,
    status: ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
  };
};

const bmfSteuerRechnerResponse = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<lohnsteuer jahr="2022">
    <information>Die Berechnung ist nach den PAP 2022 erfolgt. Die Berechnung dient lediglich der Qualitätssicherung.
        Die Externe Schnittstelle des Lohn- und Einkommensteuerrechner ist also nur für die Überprüfung ihrer Rechnung
        bestimmt und nicht dazu bestimmt, die Berechnung über ihn abzuwickeln.
    </information>
    <eingaben>
        <eingabe name="LZZ" value="2" status="ok"/>
        <eingabe name="RE4" value="203333" status="ok"/>
        <eingabe name="STKL" value="1" status="ok"/>
        <eingabe name="ZKF" value="1" status="ok"/>
        <eingabe name="R" value="0" status="ok"/>
        <eingabe name="PKV" value="0" status="ok"/>
        <eingabe name="KVZ" value="0.9" status="ok"/>
        <eingabe name="PVS" value="0" status="ok"/>
        <eingabe name="PVZ" value="0" status="ok"/>
        <eingabe name="KRV" value="0" status="ok"/>
        <eingabe name="ALTER1" value="0" status="ok"/>
        <eingabe name="AF" value="0" status="ok"/>
        <eingabe name="F" value="1" status="ok"/>
    </eingaben>
    <ausgaben>
        <ausgabe name="BK" value="0" type="STANDARD"/>
        <ausgabe name="BKS" value="0" type="STANDARD"/>
        <ausgabe name="BKV" value="0" type="STANDARD"/>
        <ausgabe name="LSTLZZ" value="15608" type="STANDARD"/>
        <ausgabe name="SOLZLZZ" value="0" type="STANDARD"/>
        <ausgabe name="SOLZS" value="0" type="STANDARD"/>
        <ausgabe name="SOLZV" value="0" type="STANDARD"/>
        <ausgabe name="STS" value="0" type="STANDARD"/>
        <ausgabe name="STV" value="0" type="STANDARD"/>
        <ausgabe name="VKVLZZ" value="0" type="STANDARD"/>
        <ausgabe name="VKVSONST" value="0" type="STANDARD"/>
        <ausgabe name="VFRB" value="120000" type="DBA"/>
        <ausgabe name="VFRBS1" value="0" type="DBA"/>
        <ausgabe name="VFRBS2" value="0" type="DBA"/>
        <ausgabe name="WVFRB" value="862996" type="DBA"/>
        <ausgabe name="WVFRBO" value="0" type="DBA"/>
        <ausgabe name="WVFRBM" value="0" type="DBA"/>
    </ausgaben>
</lohnsteuer>`;
