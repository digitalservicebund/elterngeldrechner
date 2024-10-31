import { describe, expect, it } from "vitest";
import { BmfSteuerRechnerResponse } from "./bmf-steuer-rechner-response";
import { parse as parseResponse } from "@/globals/js/calculations/brutto-netto-rechner/bmf-steuer-rechner/bmf-steuer-rechner-response-parser";

describe("bmf-steuer-rechner-response-parser", () => {
  const expectAllValuesToBeZero = (actual: BmfSteuerRechnerResponse) => {
    expect(actual.BK.toNumber()).toBe(0);
    expect(actual.BKS.toNumber()).toBe(0);
    expect(actual.BKV.toNumber()).toBe(0);
    expect(actual.LSTLZZ.toNumber()).toBe(0);
    expect(actual.SOLZLZZ.toNumber()).toBe(0);
    expect(actual.SOLZS.toNumber()).toBe(0);
    expect(actual.SOLZV.toNumber()).toBe(0);
    expect(actual.STS.toNumber()).toBe(0);
    expect(actual.STV.toNumber()).toBe(0);
    expect(actual.VKVLZZ.toNumber()).toBe(0);
    expect(actual.VKVSONST.toNumber()).toBe(0);
  };

  it("should parse empty string", () => {
    const actual = parseResponse("");
    expectAllValuesToBeZero(actual);
  });

  it("should parse empty xml", () => {
    const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
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
        <ausgabe name="WVFRB" value="968996" type="DBA"/>
        <ausgabe name="WVFRBO" value="0" type="DBA"/>
        <ausgabe name="WVFRBM" value="0" type="DBA"/>
    </ausgaben>
</lohnsteuer>`;

    const actual = parseResponse(xml);
    expectAllValuesToBeZero(actual);
  });

  it("should parse example xml", () => {
    const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
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
        <ausgabe name="BK" value="1.23" type="STANDARD"/>
        <ausgabe name="BKS" value="2.23" type="STANDARD"/>
        <ausgabe name="BKV" value="3.23" type="STANDARD"/>
        <ausgabe name="LSTLZZ" value="1.34" type="STANDARD"/>
        <ausgabe name="SOLZLZZ" value="1.45" type="STANDARD"/>
        <ausgabe name="SOLZS" value="2.45" type="STANDARD"/>
        <ausgabe name="SOLZV" value="3.45" type="STANDARD"/>
        <ausgabe name="STS" value="1.56" type="STANDARD"/>
        <ausgabe name="STV" value="2.56" type="STANDARD"/>
        <ausgabe name="VKVLZZ" value="1.67" type="STANDARD"/>
        <ausgabe name="VKVSONST" value="2.67" type="STANDARD"/>
        <ausgabe name="VFRB" value="100000" type="DBA"/>
        <ausgabe name="VFRBS1" value="0" type="DBA"/>
        <ausgabe name="VFRBS2" value="0" type="DBA"/>
        <ausgabe name="WVFRB" value="968996" type="DBA"/>
        <ausgabe name="WVFRBO" value="0" type="DBA"/>
        <ausgabe name="WVFRBM" value="0" type="DBA"/>
    </ausgaben>
</lohnsteuer>`;

    const actual = parseResponse(xml);
    expect(actual.BK.toNumber()).toBe(0.0123);
    expect(actual.BKS.toNumber()).toBe(0.0223);
    expect(actual.BKV.toNumber()).toBe(0.0323);
    expect(actual.LSTLZZ.toNumber()).toBe(0.0134);
    expect(actual.SOLZLZZ.toNumber()).toBe(0.0145);
    expect(actual.SOLZS.toNumber()).toBe(0.0245);
    expect(actual.SOLZV.toNumber()).toBe(0.0345);
    expect(actual.STS.toNumber()).toBe(0.0156);
    expect(actual.STV.toNumber()).toBe(0.0256);
    expect(actual.VKVLZZ.toNumber()).toBe(0.0167);
    expect(actual.VKVSONST.toNumber()).toBe(0.0267);
  });
});
