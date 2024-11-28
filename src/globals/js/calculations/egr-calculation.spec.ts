import {
  Einkommen,
  ElternGeldArt,
  ElternGeldDaten,
  ErwerbsArt,
  ErwerbsZeitraumLebensMonat,
  FinanzDaten,
  KinderFreiBetrag,
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

  beforeEach(() => {
    // Mocks calls to BMF Lohn- und Einkommensteuerrechner. @see: BmfSteuerRechner.queryBmfSteuerRechner()
    global.fetch = vi.fn((url) => {
      // returns saved mock responses for specified URLs
      return Promise.resolve(new Response(bodyForUrl(url)));
    });
  });

  describe("should calculate EgrErgebnis", () => {
    it("Test with 'Erwerbstaetigkeit nach Geburt'", () => {
      // given
      const planungsDatenElternTeil1 = createPlanungsDaten();
      planungsDatenElternTeil1.planung = new Array<ElternGeldArt>(
        PLANUNG_ANZAHL_MONATE,
      ).fill(ElternGeldArt.ELTERNGELD_PLUS);

      const planungsDatenElternTeil2 = createPlanungsDaten();
      planungsDatenElternTeil2.planung = new Array<ElternGeldArt>(
        PLANUNG_ANZAHL_MONATE,
      ).fill(ElternGeldArt.BASIS_ELTERNGELD);

      const persoenlicheDatenElternTeil1 = new PersoenlicheDaten(
        new Date("2023-11-25T01:02:03.000Z"),
      );
      persoenlicheDatenElternTeil1.sindSieAlleinerziehend = YesNo.NO;
      persoenlicheDatenElternTeil1.anzahlKuenftigerKinder = 1;
      persoenlicheDatenElternTeil1.etVorGeburt =
        ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI;
      persoenlicheDatenElternTeil1.etNachGeburt = YesNo.YES;

      const persoenlicheDatenElternTeil2 = new PersoenlicheDaten(
        new Date("2023-11-25T01:02:03.000Z"),
      );
      persoenlicheDatenElternTeil2.sindSieAlleinerziehend = YesNo.NO;
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
      expect(ergebnis.elternTeil1.nettoPlus.toNumber()).toBe(1361.17);
      expect(ergebnis.elternTeil1.elternGeldEtPlus.toNumber()).toBe(281.29);
      expect(ergebnis.elternTeil1.elternGeldKeineEtPlus.toNumber()).toBe(
        583.03,
      );
      expect(ergebnis.elternTeil2.bruttoBasis.toNumber()).toBe(0);
      expect(ergebnis.elternTeil2.nettoBasis.toNumber()).toBe(0);
      expect(ergebnis.elternTeil2.elternGeldErwBasis.toNumber()).toBe(0);
      expect(ergebnis.elternTeil2.bruttoPlus.toNumber()).toBe(0);
      expect(ergebnis.elternTeil2.nettoPlus.toNumber()).toBe(0);
      expect(ergebnis.elternTeil2.elternGeldEtPlus.toNumber()).toBe(0);
      expect(ergebnis.elternTeil2.elternGeldKeineEtPlus.toNumber()).toBe(
        454.87,
      );
    });
  });

  describe("should simulate ElternGeld", () => {
    it("Test with 'Erwerbstaetigkeit nach Geburt'", () => {
      // given
      const persoenlicheDaten = new PersoenlicheDaten(
        new Date("2023-11-25T01:02:03.000Z"),
      );
      persoenlicheDaten.sindSieAlleinerziehend = YesNo.NO;
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
      // console.log(
      //   ergebnis.basisElternGeld
      //     .map((value) => `${value.lebensMonat}: ${value.elternGeld}`)
      //     .join("\n"),
      // );
      // console.log(
      //   ergebnis.elternGeldPlus
      //     .map((value) => `${value.lebensMonat}: ${value.elternGeld}`)
      //     .join("\n"),
      // );

      // then
      expect(ergebnis).not.toBeUndefined();
      expect(ergebnis.rows[0].vonLebensMonat).toBe(1);
      expect(ergebnis.rows[0].bisLebensMonat).toBe(2);
      expect(ergebnis.rows[0].basisElternGeld.toNumber()).toBe(300);
      expect(ergebnis.rows[0].elternGeldPlus.toNumber()).toBe(281.29);
      expect(ergebnis.rows[0].nettoEinkommen.toNumber()).toBe(79);

      expect(ergebnis.rows[1].vonLebensMonat).toBe(3);
      expect(ergebnis.rows[1].bisLebensMonat).toBe(4);
      expect(ergebnis.rows[1].basisElternGeld.toNumber()).toBe(300);
      expect(ergebnis.rows[1].elternGeldPlus.toNumber()).toBe(281.29);
      expect(ergebnis.rows[1].nettoEinkommen.toNumber()).toBe(800.46);

      expect(ergebnis.rows[2].vonLebensMonat).toBe(5);
      expect(ergebnis.rows[2].bisLebensMonat).toBe(6);
      expect(ergebnis.rows[2].basisElternGeld.toNumber()).toBe(300);
      expect(ergebnis.rows[2].elternGeldPlus.toNumber()).toBe(281.29);
      expect(ergebnis.rows[2].nettoEinkommen.toNumber()).toBe(3002.84);

      expect(ergebnis.rows[3].vonLebensMonat).toBe(7);
      expect(ergebnis.rows[3].bisLebensMonat).toBe(14);
      expect(ergebnis.rows[3].basisElternGeld.toNumber()).toBe(1166.05);
      expect(ergebnis.rows[3].elternGeldPlus.toNumber()).toBe(583.03);
      expect(ergebnis.rows[3].nettoEinkommen.toNumber()).toBe(0);

      expect(ergebnis.rows[4].vonLebensMonat).toBe(15);
      expect(ergebnis.rows[4].bisLebensMonat).toBe(PLANUNG_ANZAHL_MONATE);
      expect(ergebnis.rows[4].basisElternGeld.toNumber()).toBe(0);
      expect(ergebnis.rows[4].elternGeldPlus.toNumber()).toBe(583.03);
      expect(ergebnis.rows[4].nettoEinkommen.toNumber()).toBe(0);
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

const bodyForUrl = (url: string | URL | Request) => {
  if (typeof url !== "string") {
    return "";
  }

  // returns saved mock responses for specified URLs tagged by "brutto einkommen" and "Lohnsteuerjahr"
  if (containsAll(url, ["RE4=280000", "2022Version1.xhtml"])) {
    return bmfSteuerRechnerResponseJahr2022RE280000;
  }
  if (containsAll(url, ["RE4=203333", "2022Version1.xhtml"])) {
    return bmfSteuerRechnerResponseJahr2022RE203333;
  }
  if (containsAll(url, ["RE4=210000", "2022Version1.xhtml"])) {
    return bmfSteuerRechnerResponseJahr2022RE210000;
  }
  if (containsAll(url, ["RE4=500000", "2022Version1.xhtml"])) {
    return bmfSteuerRechnerResponseJahr2022RE500000;
  }
  if (containsAll(url, ["RE4=100000", "2022Version1.xhtml"])) {
    return bmfSteuerRechnerResponseJahr2022RE100000;
  }
  if (containsAll(url, ["RE4=10000", "2022Version1.xhtml"])) {
    return bmfSteuerRechnerResponseJahr2022RE10000;
  }

  return "";
};

const containsAll = (s: string, searchStrings: string[]) => {
  return (
    searchStrings.filter((searchString) => s.indexOf(searchString) > 0)
      .length === searchStrings.length
  );
};

const bmfSteuerRechnerResponseJahr2022RE203333 = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
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
</lohnsteuer>
`;

const bmfSteuerRechnerResponseJahr2022RE280000 = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<lohnsteuer jahr="2022">
    <information>Die Berechnung ist nach den PAP 2022 erfolgt. Die Berechnung dient lediglich der Qualitätssicherung.
        Die Externe Schnittstelle des Lohn- und Einkommensteuerrechner ist also nur für die Überprüfung ihrer Rechnung
        bestimmt und nicht dazu bestimmt, die Berechnung über ihn abzuwickeln.
    </information>
    <eingaben>
        <eingabe name="LZZ" value="2" status="ok"/>
        <eingabe name="RE4" value="280000" status="ok"/>
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
        <ausgabe name="LSTLZZ" value="32900" type="STANDARD"/>
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
        <ausgabe name="WVFRB" value="1625100" type="DBA"/>
        <ausgabe name="WVFRBO" value="0" type="DBA"/>
        <ausgabe name="WVFRBM" value="0" type="DBA"/>
    </ausgaben>
</lohnsteuer>
`;

const bmfSteuerRechnerResponseJahr2022RE210000 = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<lohnsteuer jahr="2022">
    <information>Die Berechnung ist nach den PAP 2022 erfolgt. Die Berechnung dient lediglich der Qualitätssicherung.
        Die Externe Schnittstelle des Lohn- und Einkommensteuerrechner ist also nur für die Überprüfung ihrer Rechnung
        bestimmt und nicht dazu bestimmt, die Berechnung über ihn abzuwickeln.
    </information>
    <eingaben>
        <eingabe name="LZZ" value="2" status="ok"/>
        <eingabe name="RE4" value="210000" status="ok"/>
        <eingabe name="STKL" value="4" status="ok"/>
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
        <ausgabe name="LSTLZZ" value="17033" type="STANDARD"/>
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
        <ausgabe name="WVFRB" value="929200" type="DBA"/>
        <ausgabe name="WVFRBO" value="0" type="DBA"/>
        <ausgabe name="WVFRBM" value="0" type="DBA"/>
    </ausgaben>
</lohnsteuer>
`;

const bmfSteuerRechnerResponseJahr2022RE500000 = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<lohnsteuer jahr="2022">
    <information>Die Berechnung ist nach den PAP 2022 erfolgt. Die Berechnung dient lediglich der Qualitätssicherung.
        Die Externe Schnittstelle des Lohn- und Einkommensteuerrechner ist also nur für die Überprüfung ihrer Rechnung
        bestimmt und nicht dazu bestimmt, die Berechnung über ihn abzuwickeln.
    </information>
    <eingaben>
        <eingabe name="LZZ" value="2" status="ok"/>
        <eingabe name="RE4" value="500000" status="ok"/>
        <eingabe name="STKL" value="1" status="ok"/>
        <eingabe name="ZKF" value="0" status="ok"/>
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
        <ausgabe name="LSTLZZ" value="94150" type="STANDARD"/>
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
        <ausgabe name="WVFRB" value="3829600" type="DBA"/>
        <ausgabe name="WVFRBO" value="0" type="DBA"/>
        <ausgabe name="WVFRBM" value="0" type="DBA"/>
    </ausgaben>
</lohnsteuer>
`;

const bmfSteuerRechnerResponseJahr2022RE100000 = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<lohnsteuer jahr="2022">
    <information>Die Berechnung ist nach den PAP 2022 erfolgt. Die Berechnung dient lediglich der Qualitätssicherung.
        Die Externe Schnittstelle des Lohn- und Einkommensteuerrechner ist also nur für die Überprüfung ihrer Rechnung
        bestimmt und nicht dazu bestimmt, die Berechnung über ihn abzuwickeln.
    </information>
    <eingaben>
        <eingabe name="LZZ" value="2" status="ok"/>
        <eingabe name="RE4" value="100000" status="ok"/>
        <eingabe name="STKL" value="1" status="ok"/>
        <eingabe name="ZKF" value="0" status="ok"/>
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
        <ausgabe name="LSTLZZ" value="0" type="STANDARD"/>
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
        <ausgabe name="WVFRB" value="0" type="DBA"/>
        <ausgabe name="WVFRBO" value="0" type="DBA"/>
        <ausgabe name="WVFRBM" value="0" type="DBA"/>
    </ausgaben>
</lohnsteuer>
`;

const bmfSteuerRechnerResponseJahr2022RE10000 = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<lohnsteuer jahr="2022">
    <information>Die Berechnung ist nach den PAP 2022 erfolgt. Die Berechnung dient lediglich der Qualitätssicherung.
        Die Externe Schnittstelle des Lohn- und Einkommensteuerrechner ist also nur für die Überprüfung ihrer Rechnung
        bestimmt und nicht dazu bestimmt, die Berechnung über ihn abzuwickeln.
    </information>
    <eingaben>
        <eingabe name="LZZ" value="2" status="ok"/>
        <eingabe name="RE4" value="10000" status="ok"/>
        <eingabe name="STKL" value="1" status="ok"/>
        <eingabe name="ZKF" value="0" status="ok"/>
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
        <ausgabe name="LSTLZZ" value="0" type="STANDARD"/>
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
        <ausgabe name="WVFRB" value="0" type="DBA"/>
        <ausgabe name="WVFRBO" value="0" type="DBA"/>
        <ausgabe name="WVFRBM" value="0" type="DBA"/>
    </ausgaben>
</lohnsteuer>
`;
