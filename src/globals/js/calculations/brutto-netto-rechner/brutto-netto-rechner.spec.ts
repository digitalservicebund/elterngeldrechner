import { BruttoNettoRechner } from "./brutto-netto-rechner";
import Big from "big.js";
import {
  ErwerbsArt,
  FinanzDaten,
  KinderFreiBetrag,
  SteuerKlasse,
} from "@/globals/js/calculations/model";

describe("brutto-netto-rechner", () => {
  const bruttoNettoRechner = new BruttoNettoRechner();

  it("should calculate test from TestErweiterterAlgorithmus.java", async () => {
    // given
    global.fetch = jest.fn(() =>
      Promise.resolve(new Response(bmfSteuerRechnerResponse)),
    );
    const finanzDaten = new FinanzDaten();
    finanzDaten.steuerKlasse = SteuerKlasse.SKL4;
    finanzDaten.kinderFreiBetrag = KinderFreiBetrag.ZKF1;

    // when
    const actual = await bruttoNettoRechner.abzuege(
      Big(2000),
      2022,
      finanzDaten,
      ErwerbsArt.JA_SELBSTSTAENDIG,
    );

    // then
    expect(actual.toNumber()).toBe(552.5);
  });
});

const bmfSteuerRechnerResponse = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<lohnsteuer jahr="2022">
    <information>Die Berechnung ist nach den PAP 2022 erfolgt. Die Berechnung dient lediglich der Qualitätssicherung. Die Externe Schnittstelle des Lohn- und Einkommensteuerrechner ist also nur für die Überprüfung ihrer Rechnung bestimmt und nicht dazu bestimmt, die Berechnung über ihn abzuwickeln.</information>
    <eingaben>
        <eingabe name="ALTER1" value="0" status="ok"/>
        <eingabe name="PKV" value="0" status="ok"/>
        <eingabe name="RE4" value="208333" status="ok"/>
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
        <ausgabe name="LSTLZZ" value="16675" type="STANDARD"/>
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
        <ausgabe name="WVFRB" value="912696" type="DBA"/>
        <ausgabe name="WVFRBO" value="0" type="DBA"/>
        <ausgabe name="WVFRBM" value="0" type="DBA"/>
    </ausgaben>
</lohnsteuer>`;
