import Big from "big.js";
import {
  BmfSteuerRechner,
  BmfSteuerRechnerResponse,
} from "@/globals/js/calculations/brutto-netto-rechner/bmf-steuer-rechner";
import { EgrSteuerRechner } from "./egr-steuer-rechner";
import {
  ErwerbsArt,
  FinanzDaten,
  KinderFreiBetrag,
  SteuerKlasse,
} from "@/globals/js/calculations/model";
import Mock = jest.Mock;

describe("erg-steuer-rechner", () => {
  const egrSteuerRechner = new EgrSteuerRechner();

  describe.each([
    ["2022-02-24T03:24:00", 2022],
    ["2021-02-24T03:24:00", 2022],
    ["2020-02-24T03:24:00", 2022],
    ["2016-02-24T03:24:00", 2022],
    ["2023-02-24T03:24:00", 2022],
    ["2024-02-24T03:24:00", 2023],
    ["2025-02-24T03:24:00", 2023],
  ])(
    "when wahrscheinlichesGeburtsDatum is %s then expect Lohnsteuerjahr %d",
    (wahrscheinlichesGeburtsDatum, lohnSteuerJahr) => {
      it("should calculate Abgaben", () => {
        expect(
          EgrSteuerRechner.bestLohnSteuerJahrOf(
            new Date(wahrscheinlichesGeburtsDatum),
          ),
        ).toBe(lohnSteuerJahr);
      });
    },
  );

  describe.each([
    [
      {
        steuerKlasse: SteuerKlasse.SKL4,
        splittingFaktor: null,
        kinderFreiBetrag: KinderFreiBetrag.ZKF1,
      },
      ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI,
      "5333.33",
      "1072.08",
    ],
    [
      {
        steuerKlasse: SteuerKlasse.SKL4,
        splittingFaktor: null,
        kinderFreiBetrag: KinderFreiBetrag.ZKF1,
      },
      ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI,
      "83.33",
      "0.00",
    ],
    [
      {
        steuerKlasse: SteuerKlasse.SKL4,
        splittingFaktor: null,
        kinderFreiBetrag: KinderFreiBetrag.ZKF1,
      },
      ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI,
      "2083.33",
      "176.83",
    ],
  ])(
    "when FinanzDaten: %j, ErwerbsArt: %s, Brutto: %d, then expect Lohnsteuer %d",
    (finanzDaten, erwerbsArt, brutto, lstlzz) => {
      it("should calculate Abgaben", async () => {
        // given
        const bmfSteuerRechnerServerCall = mockBmfSteuerRechnerServerCall(
          bmfSteuerRechnerResponseOf(lstlzz),
        );
        const finanzdaten = Object.assign(new FinanzDaten(), finanzDaten);

        // when
        const steuerRechnerResponse = await egrSteuerRechner.abgabenSteuern(
          finanzdaten,
          erwerbsArt,
          new Big(brutto),
          2020,
        );

        // then
        expect(steuerRechnerResponse.lstlzz.toFixed(2, Big.roundHalfUp)).toBe(
          lstlzz,
        );
        expect(bmfSteuerRechnerServerCall.mock.calls.length).toBe(1);
        expect(bmfSteuerRechnerServerCall.mock.calls[0][0]).toBe(2020);
        expect(bmfSteuerRechnerServerCall.mock.calls[0][1]).toEqual({
          AF: 0,
          ALTER1: 0,
          F: 1,
          KRV: 2,
          KVZ: 0.9,
          LZZ: 2,
          R: 0,
          RE4: Big(brutto).mul(100).toNumber(),
          STKL: 4,
          ZKF: 1,
        });
      });
    },
  );

  describe("should set Faktor Verfahren to", () => {
    it("1 if SteuerKlasse is SKL4_FAKTOR", async () => {
      // given
      const bmfSteuerRechnerServerCall = mockBmfSteuerRechnerServerCall(
        bmfSteuerRechnerResponseOf(100),
      );

      // when
      await egrSteuerRechner.abgabenSteuern(
        Object.assign(new FinanzDaten(), {
          steuerKlasse: SteuerKlasse.SKL4_FAKTOR,
          splittingFaktor: null,
        }),
        ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
        new Big(1),
        2020,
      );

      // then
      expect(bmfSteuerRechnerServerCall.mock.calls.length).toBe(1);
      expect(bmfSteuerRechnerServerCall.mock.calls[0][1].AF).toBe(1);
      expect(bmfSteuerRechnerServerCall.mock.calls[0][1].F).toBe(1.0);
    });

    it("0 if SteuerKlasse is not SKL4_FAKTOR", async () => {
      // given
      const bmfSteuerRechnerServerCall = mockBmfSteuerRechnerServerCall(
        bmfSteuerRechnerResponseOf(100),
      );

      // when
      await egrSteuerRechner.abgabenSteuern(
        Object.assign(new FinanzDaten(), {
          steuerKlasse: SteuerKlasse.SKL4,
          splittingFaktor: null,
        }),
        ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
        new Big(1),
        2020,
      );

      // then
      expect(bmfSteuerRechnerServerCall.mock.calls.length).toBe(1);
      expect(bmfSteuerRechnerServerCall.mock.calls[0][1].AF).toBe(0);
      expect(bmfSteuerRechnerServerCall.mock.calls[0][1].F).toBe(1);
    });
  });

  describe("should set kinderFreiBetrag to", () => {
    it("1 if ErwerbsArt is not JA_NICHT_SELBST_MINI", async () => {
      // given
      const bmfSteuerRechnerServerCall = mockBmfSteuerRechnerServerCall(
        bmfSteuerRechnerResponseOf(100),
      );

      // when
      await egrSteuerRechner.abgabenSteuern(
        Object.assign(new FinanzDaten(), {
          steuerKlasse: SteuerKlasse.SKL5,
          kinderFreiBetrag: KinderFreiBetrag.ZKF1,
        }),
        ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI,
        new Big(1),
        2020,
      );

      // then
      expect(bmfSteuerRechnerServerCall.mock.calls.length).toBe(1);
      expect(bmfSteuerRechnerServerCall.mock.calls[0][1].ZKF).toBe(1);
    });
  });

  it("0 if ErwerbsArt is JA_NICHT_SELBST_MINI", async () => {
    // given
    const bmfSteuerRechnerServerCall = mockBmfSteuerRechnerServerCall(
      bmfSteuerRechnerResponseOf(100),
    );

    // when
    await egrSteuerRechner.abgabenSteuern(
      Object.assign(new FinanzDaten(), {
        steuerKlasse: SteuerKlasse.SKL5,
        kinderFreiBetrag: KinderFreiBetrag.ZKF1,
      }),
      ErwerbsArt.JA_NICHT_SELBST_MINI,
      new Big(1),
      2020,
    );

    // then
    expect(bmfSteuerRechnerServerCall.mock.calls.length).toBe(1);
    expect(bmfSteuerRechnerServerCall.mock.calls[0][1].ZKF).toBe(0);
  });
});

// initialize mock
jest.mock("../bmf-steuer-rechner");

const bmfSteuerRechnerResponseOf = (lstlzz: any) => {
  const response = new BmfSteuerRechnerResponse();
  response.LSTLZZ = Big(lstlzz);
  return response;
};

const mockBmfSteuerRechnerServerCall = (
  bmfSteuerRechnerResponse: BmfSteuerRechnerResponse,
): Mock => {
  // @ts-ignore
  const callMock: Mock = BmfSteuerRechner.call;
  callMock.mockResolvedValue(bmfSteuerRechnerResponse);
  return callMock;
};
