import Big from "big.js";
import { EgrSteuerRechner } from "./egr-steuer-rechner";
import { berechneSteuerUndSozialabgaben } from "@/globals/js/calculations/brutto-netto-rechner/steuer-und-sozialabgaben";
import {
  ErwerbsArt,
  FinanzDaten,
  KinderFreiBetrag,
  SteuerKlasse,
} from "@/globals/js/calculations/model";

vi.mock(
  import(
    "@/globals/js/calculations/brutto-netto-rechner/steuer-und-sozialabgaben"
  ),
);

describe("erg-steuer-rechner", () => {
  beforeEach(() => {
    vi.mocked(berechneSteuerUndSozialabgaben).mockReturnValue({
      BK: 0,
      LSTLZZ: 0,
      SOLZLZZ: 0,
      VKVLZZ: 0,
    });
  });

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

  describe("should set Faktor Verfahren to", () => {
    it("1 if SteuerKlasse is SKL4_FAKTOR", () => {
      // when
      egrSteuerRechner.abgabenSteuern(
        Object.assign(new FinanzDaten(), {
          steuerKlasse: SteuerKlasse.SKL4_FAKTOR,
          splittingFaktor: 1,
        }),
        ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
        new Big(1),
        2022,
      );

      // then
      expect(berechneSteuerUndSozialabgaben).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.objectContaining({ AF: 1, F: 1 }),
      );
    });

    it("0 if SteuerKlasse is not SKL4_FAKTOR", () => {
      // when
      egrSteuerRechner.abgabenSteuern(
        Object.assign(new FinanzDaten(), {
          steuerKlasse: SteuerKlasse.SKL4,
          splittingFaktor: null,
        }),
        ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
        new Big(1),
        2022,
      );

      // then
      expect(berechneSteuerUndSozialabgaben).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.objectContaining({ AF: 0, F: 0 }),
      );
    });
  });

  describe("should set kinderFreiBetrag to", () => {
    it("1 if ErwerbsArt is not JA_NICHT_SELBST_MINI", () => {
      // when
      egrSteuerRechner.abgabenSteuern(
        Object.assign(new FinanzDaten(), {
          steuerKlasse: SteuerKlasse.SKL5,
          kinderFreiBetrag: KinderFreiBetrag.ZKF1,
        }),
        ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI,
        new Big(1),
        2022,
      );

      // then
      expect(berechneSteuerUndSozialabgaben).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.objectContaining({ ZKF: 1 }),
      );
    });
  });

  it("0 if ErwerbsArt is JA_NICHT_SELBST_MINI", () => {
    // when
    egrSteuerRechner.abgabenSteuern(
      Object.assign(new FinanzDaten(), {
        steuerKlasse: SteuerKlasse.SKL5,
        kinderFreiBetrag: KinderFreiBetrag.ZKF1,
      }),
      ErwerbsArt.JA_NICHT_SELBST_MINI,
      new Big(1),
      2022,
    );

    // then
    expect(berechneSteuerUndSozialabgaben).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({ ZKF: 0 }),
    );
  });
});
