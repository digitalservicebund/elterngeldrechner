import { beforeEach, describe, expect, it, vi } from "vitest";
import { abgabenSteuern, bestLohnSteuerJahrOf } from "./egr-steuer-rechner";
import { berechneSteuerUndSozialabgaben } from "@/globals/js/calculations/brutto-netto-rechner/steuer-und-sozialabgaben";
import {
  Einkommen,
  ErwerbsArt,
  KassenArt,
  KinderFreiBetrag,
  RentenArt,
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

  describe.each([
    ["2022-02-24T03:24:00", 2021],
    ["2021-02-24T03:24:00", 2021],
    ["2020-02-24T03:24:00", 2021],
    ["2016-02-24T03:24:00", 2021],
    ["2023-02-24T03:24:00", 2022],
    ["2024-02-24T03:24:00", 2023],
    ["2025-02-24T03:24:00", 2024],
    ["2026-02-24T03:24:00", 2024],
  ])(
    "when wahrscheinlichesGeburtsDatum is %s then expect Lohnsteuerjahr %d",
    (wahrscheinlichesGeburtsDatum, lohnSteuerJahr) => {
      it("should calculate Abgaben", () => {
        expect(
          bestLohnSteuerJahrOf(new Date(wahrscheinlichesGeburtsDatum)),
        ).toBe(lohnSteuerJahr);
      });
    },
  );

  describe("should set Faktor Verfahren to", () => {
    it("1 if SteuerKlasse is SKL4_FAKTOR", () => {
      // when
      abgabenSteuern(
        {
          ...ANY_FINANZDATEN,
          steuerKlasse: SteuerKlasse.SKL4_FAKTOR,
          splittingFaktor: 1,
        },
        ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
        1,
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
      abgabenSteuern(
        {
          ...ANY_FINANZDATEN,
          steuerKlasse: SteuerKlasse.SKL4,
          splittingFaktor: 0,
        },
        ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
        1,
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
      abgabenSteuern(
        {
          ...ANY_FINANZDATEN,
          steuerKlasse: SteuerKlasse.SKL5,
          kinderFreiBetrag: KinderFreiBetrag.ZKF1,
        },
        ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI,
        1,
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
    abgabenSteuern(
      {
        ...ANY_FINANZDATEN,
        steuerKlasse: SteuerKlasse.SKL5,
        kinderFreiBetrag: KinderFreiBetrag.ZKF1,
      },
      ErwerbsArt.JA_NICHT_SELBST_MINI,
      1,
      2022,
    );

    // then
    expect(berechneSteuerUndSozialabgaben).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({ ZKF: 0 }),
    );
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
