import Big from "big.js";
import { callRechnerLib, callRemoteRechner } from "./bmf-steuer-rechner";
import { BmfSteuerRechnerParameter } from "./index";

describe("bmf-steuer-rechner-remote", () => {
  describe.each([
    [{ LZZ: 2, RE4: 533333, STKL: 4, KVZ: 0.9, F: 1.0, ZKF: 1 }, "1059.75"],
    [{ LZZ: 2, RE4: 8333, STKL: 4, KVZ: 0.9, F: 1.0, ZKF: 1 }, "0.00"],
    [{ LZZ: 2, RE4: 208333, STKL: 4, KVZ: 0.9, F: 1.0, ZKF: 1 }, "166.75"],
  ])("when parameter are %j, then expect Lohnsteuer %d", (params, lstlzz) => {
    it("should calculate Lohnsteuer", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve(new Response(createResponseXml(lstlzz))),
      );

      const steuerRechnerResponse = await callRemoteRechner(
        2022,
        Object.assign(new BmfSteuerRechnerParameter(), params),
      );
      expect(steuerRechnerResponse.LSTLZZ.toFixed(2, Big.roundHalfUp)).toBe(
        lstlzz,
      );
    });
  });
});

describe("bmf-steuer-rechner-lib", () => {
  describe.each([
    [2022, { LZZ: 2, RE4: 8333, STKL: 4, KVZ: 0.9, F: 1.0, ZKF: 1 }, "0.00"],
    [2023, { LZZ: 2, RE4: 8333, STKL: 4, KVZ: 0.9, F: 1.0, ZKF: 1 }, "0.00"],
    [
      2022,
      { LZZ: 2, RE4: 533333, STKL: 4, KVZ: 0.9, F: 1.0, ZKF: 1 },
      "1065.50",
    ],
    [
      2023,
      { LZZ: 2, RE4: 533333, STKL: 4, KVZ: 0.9, F: 1.0, ZKF: 1 },
      "989.08",
    ],
    [
      2022,
      { LZZ: 2, RE4: 208333, STKL: 4, KVZ: 0.9, F: 1.0, ZKF: 1 },
      "172.50",
    ],
    [
      2023,
      { LZZ: 2, RE4: 208333, STKL: 4, KVZ: 0.9, F: 1.0, ZKF: 1 },
      "145.33",
    ],
  ])(
    "when year is %d and parameter are %j, then expect Lohnsteuer %d",
    (lohnSteuerJahr, params, lstlzz) => {
      it("should calculate Lohnsteuer", async () => {
        global.fetch = jest.fn(() =>
          Promise.resolve(new Response(createResponseXml(lstlzz))),
        );

        const steuerRechnerResponse = await callRechnerLib(
          lohnSteuerJahr,
          Object.assign(new BmfSteuerRechnerParameter(), params),
        );
        expect(steuerRechnerResponse.LSTLZZ.toFixed(2, Big.roundHalfUp)).toBe(
          lstlzz,
        );
      });
    },
  );
});

function createResponseXml(lstlzz: string) {
  const lstlzzForXml = Big(lstlzz).mul(100).toNumber();
  return `<lohnsteuer jahr="2022">
  <information>Die Berechnung ist nach den PAP 2022 erfolgt. Die Berechnung dient lediglich der Qualitätssicherung. Die Externe Schnittstelle des Lohn- und Einkommensteuerrechner ist also nur für die Überprüfung ihrer Rechnung bestimmt und nicht dazu bestimmt, die Berechnung über ihn abzuwickeln.</information>
  <eingaben>
    <eingabe name="LZZ" value="2" status="ok"/>
    <eingabe name="RE4" value="533333" status="ok"/>
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
    <ausgabe name="LSTLZZ" value="${lstlzzForXml}" type="STANDARD"/>
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
    <ausgabe name="WVFRB" value="4253196" type="DBA"/>
    <ausgabe name="WVFRBO" value="0" type="DBA"/>
    <ausgabe name="WVFRBM" value="0" type="DBA"/>
  </ausgaben>
</lohnsteuer>`;
}
