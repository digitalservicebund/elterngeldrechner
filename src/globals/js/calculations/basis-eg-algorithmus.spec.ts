import Big from "big.js";
import { BasisEgAlgorithmus } from "./basis-eg-algorithmus";
import {
  createMischEkTaetigkeitOf,
  Einkommen,
  ErwerbsArt,
  ErwerbsTaetigkeit,
  FinanzDaten,
  KassenArt,
  KinderFreiBetrag,
  PersoenlicheDaten,
  SteuerKlasse,
  YesNo,
} from "./model";

describe("basis-eg-algorithmus", () => {
  const basisEgAlgorithmus = new BasisEgAlgorithmus();

  describe("should calculate MischNettoUndBasiselterngeld for test cases from Testfaelle_010219.xlsx", () => {
    it("TESTFALL NO. 1", async () => {
      // given
      global.fetch = vi.fn(() =>
        Promise.resolve(new Response(bmfSteuerRechnerResponse)),
      );
      const persoenlicheDaten = new PersoenlicheDaten(
        new Date("2022-01-01T10:37:00.000Z"),
      );
      persoenlicheDaten.anzahlKuenftigerKinder = 1;
      persoenlicheDaten.sindSieAlleinerziehend = YesNo.NO;
      persoenlicheDaten.etVorGeburt = ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI;
      persoenlicheDaten.etNachGeburt = YesNo.NO;
      const finanzDaten = new FinanzDaten();
      finanzDaten.zahlenSieKirchenSteuer = YesNo.NO;
      finanzDaten.bruttoEinkommen = new Einkommen(0);
      finanzDaten.kinderFreiBetrag = KinderFreiBetrag.ZKF1;
      finanzDaten.steuerKlasse = SteuerKlasse.SKL5;
      finanzDaten.kassenArt = KassenArt.GESETZLICH_PFLICHTVERSICHERT;
      finanzDaten.mischEinkommenTaetigkeiten = [
        createMischEkTaetigkeitOf(
          ErwerbsTaetigkeit.SELBSTSTAENDIG,
          Big(2015.0),
          [
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            true,
            false,
          ],
          YesNo.NO,
          YesNo.YES,
          YesNo.NO,
        ),
        createMischEkTaetigkeitOf(
          ErwerbsTaetigkeit.SELBSTSTAENDIG,
          Big(2343.0),
          [
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            true,
            true,
            false,
            false,
            false,
          ],
          YesNo.NO,
          YesNo.NO,
          YesNo.NO,
        ),
        createMischEkTaetigkeitOf(
          ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG,
          Big(553.0),
          [
            false,
            false,
            false,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
            true,
          ],
          YesNo.NO,
          YesNo.NO,
          YesNo.YES,
        ),
      ];

      // when
      const mischEkZwischenErgebnis =
        await basisEgAlgorithmus.berechneMischNettoUndBasiselterngeld(
          persoenlicheDaten,
          finanzDaten,
          2022,
        );

      // then
      expect(mischEkZwischenErgebnis.netto.toNumber()).toBe(910.67);
      expect(mischEkZwischenErgebnis.elterngeldbasis.toNumber()).toBe(650.22);
      expect(mischEkZwischenErgebnis.status).toBe(ErwerbsArt.JA_SELBSTSTAENDIG);
      expect(mischEkZwischenErgebnis.rentenversicherungspflichtig).toBe(false);
      expect(mischEkZwischenErgebnis.krankenversicherungspflichtig).toBe(false);
    });
  });
});

const bmfSteuerRechnerResponse = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<lohnsteuer jahr="2022">
    <information>Die Berechnung ist nach den PAP 2022 erfolgt. Die Berechnung dient lediglich der Qualitätssicherung. Die Externe Schnittstelle des Lohn- und Einkommensteuerrechner ist also nur für die Überprüfung ihrer Rechnung bestimmt und nicht dazu bestimmt, die Berechnung über ihn abzuwickeln.</information>
    <eingaben>
        <eingabe name="ALTER1" value="0" status="ok"/>
        <eingabe name="PKV" value="0" status="ok"/>
        <eingabe name="RE4" value="105650" status="ok"/>
        <eingabe name="ZKF" value="1" status="ok"/>
        <eingabe name="AF" value="0" status="ok"/>
        <eingabe name="R" value="0" status="ok"/>
        <eingabe name="F" value="1.0" status="ok"/>
        <eingabe name="PVZ" value="0" status="ok"/>
        <eingabe name="PVS" value="0" status="ok"/>
        <eingabe name="KRV" value="0" status="ok"/>
        <eingabe name="LZZ" value="2" status="ok"/>
        <eingabe name="KVZ" value="0.9" status="ok"/>
        <eingabe name="STKL" value="4" status="ok"/>
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
        <ausgabe name="VFRB" value="100000" type="DBA"/>
        <ausgabe name="VFRBS1" value="0" type="DBA"/>
        <ausgabe name="VFRBS2" value="0" type="DBA"/>
        <ausgabe name="WVFRB" value="0" type="DBA"/>
        <ausgabe name="WVFRBO" value="0" type="DBA"/>
        <ausgabe name="WVFRBM" value="0" type="DBA"/>
    </ausgaben>
</lohnsteuer>
`;
