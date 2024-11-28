import Big from "big.js";
import { useCallback, useRef } from "react";
import {
  Elternteil,
  Lebensmonatszahlen,
  Variante,
  type Elterngeldbezuege,
  type ElterngeldbezugProVariante,
  type LebensmonateMitBeliebigenElternteilen,
} from "@/features/planer/domain";
import { EgrSteuerRechner } from "@/globals/js/calculations/brutto-netto-rechner/egr-steuer-rechner";
import { EgrCalculation } from "@/globals/js/calculations/egr-calculation";
import {
  Einkommen,
  ErwerbsZeitraumLebensMonat,
  type MutterschaftsLeistung,
  type ElternGeldSimulationErgebnis,
  type ElternGeldSimulationErgebnisRow,
  FinanzDaten,
  type PersoenlicheDaten,
  YesNo,
} from "@/globals/js/calculations/model";
import type { ElternteilType } from "@/globals/js/elternteil-type";
import type { RootState } from "@/redux";
import { finanzDatenOfUi } from "@/redux/finanzDatenFactory";
import {
  mutterschaftsLeistungOfUi,
  persoenlicheDatenOfUi,
} from "@/redux/persoenlicheDatenFactory";
import { useAppStore } from "@/redux/hooks";
import type { BerechneElterngeldbezuegeCallback } from "@/features/planer/user-interface/service/callbackTypes";

export function useBerechneElterngeldbezuege(): BerechneElterngeldbezuegeCallback {
  const store = useAppStore();
  const parameter = useRef(createStaticCalculationParameter(store.getState()));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    calculateElterngeldbezuege.bind(null, parameter.current),
    [],
  );
}

function calculateElterngeldbezuege(
  parameter: StaticCalculationParameter,
  lebensmonate: LebensmonateMitBeliebigenElternteilen,
) {
  const ergebnisse = Object.values(Elternteil).map((elternteil) =>
    calculateElterngeldbezuegeForElternteil(
      lebensmonate,
      elternteil,
      parameter[elternteil],
    ),
  );

  return combineErrechneteErgbebnisse(ergebnisse[0], ergebnisse[1]);
}

function calculateElterngeldbezuegeForElternteil(
  lebensmonate: LebensmonateMitBeliebigenElternteilen,
  elternteil: Elternteil,
  parameter: StaticCalculationParameterForElternteil,
): ElternGeldSimulationErgebnis {
  const {
    persoenlicheDaten,
    finanzdaten,
    lohnsteuerjahr,
    mutterschaftsleistung,
  } = parameter;

  const monateMitErwerbstaetigkeit = transformLebensmonateForFinanzdaten(
    lebensmonate,
    elternteil,
  );

  /*
   * Attention:
   * Parameters are not cloned but the same memory is manipulated on every
   * calculation. This is effective as this algorithm runs over and over again.
   * Though, you need to be mindful about this. For example in testing.
   */
  persoenlicheDaten.etNachGeburt =
    monateMitErwerbstaetigkeit.length > 0 ? YesNo.YES : YesNo.NO;
  finanzdaten.erwerbsZeitraumLebensMonatList = monateMitErwerbstaetigkeit;

  return new EgrCalculation().simulate(
    persoenlicheDaten,
    finanzdaten,
    lohnsteuerjahr,
    mutterschaftsleistung,
  );
}

function transformLebensmonateForFinanzdaten(
  lebensmonate: LebensmonateMitBeliebigenElternteilen,
  elternteil: Elternteil,
): ErwerbsZeitraumLebensMonat[] {
  return Object.entries(lebensmonate)
    .map(([lebensmonatszahl, lebensmonat]) => {
      const bruttoeinkommen = lebensmonat[elternteil]?.bruttoeinkommen ?? 0;
      return [Number.parseInt(lebensmonatszahl), bruttoeinkommen || 0];
    })
    .filter(([, bruttoeinkommen]) => bruttoeinkommen > 0)
    .map(([lebensmonatszahl, bruttoeinkommen]) => {
      const monat = new ErwerbsZeitraumLebensMonat();
      monat.vonLebensMonat = lebensmonatszahl;
      monat.bisLebensMonat = lebensmonatszahl;
      monat.bruttoProMonat = new Einkommen(bruttoeinkommen);
      return monat;
    });
}

function combineErrechneteErgbebnisse(
  ergebnisElternteilEins: ElternGeldSimulationErgebnis,
  ergebnisElternteilZwei: ElternGeldSimulationErgebnis,
): Elterngeldbezuege<Elternteil> {
  const resultPerMonthET1 = flattenSimulationErgebnis(ergebnisElternteilEins);
  const resultPerMonthET2 = flattenSimulationErgebnis(ergebnisElternteilZwei);

  return Object.fromEntries(
    Lebensmonatszahlen.map((lebensmonatszahl) => [
      lebensmonatszahl,
      {
        [Elternteil.Eins]: rowToElterngeldProVariante(
          resultPerMonthET1[lebensmonatszahl - 1],
        ),
        [Elternteil.Zwei]: rowToElterngeldProVariante(
          resultPerMonthET2[lebensmonatszahl - 1],
        ),
      },
    ]),
  ) as Elterngeldbezuege<Elternteil>;
}

function rowToElterngeldProVariante(
  row: ElternGeldSimulationErgebnisRow,
): ElterngeldbezugProVariante {
  return {
    [Variante.Basis]: row.basisElternGeld.toNumber(),
    [Variante.Plus]: row.elternGeldPlus.toNumber(),
    [Variante.Bonus]: row.elternGeldPlus.toNumber(),
  };
}

function flattenSimulationErgebnis({
  rows,
}: ElternGeldSimulationErgebnis): ElternGeldSimulationErgebnisRow[] {
  return Array.from({ length: 32 }, (_, monthIndex) => {
    const row = rows.find(checkRowIncludesMonth.bind({ monthIndex }));
    return row ?? createRowWithNoElterngeld(monthIndex);
  });
}

function checkRowIncludesMonth(
  this: { monthIndex: number },
  row: ElternGeldSimulationErgebnisRow,
): boolean {
  const fromMonthIndex = row.vonLebensMonat - 1;
  const tillMonthIndex = row.bisLebensMonat - 1;
  return fromMonthIndex <= this.monthIndex && this.monthIndex <= tillMonthIndex;
}

function createRowWithNoElterngeld(
  monthIndex: number,
): ElternGeldSimulationErgebnisRow {
  return {
    vonLebensMonat: monthIndex,
    bisLebensMonat: monthIndex,
    basisElternGeld: Big(0),
    elternGeldPlus: Big(0),
    nettoEinkommen: Big(0),
  };
}

function createStaticCalculationParameter(
  state: RootState,
): StaticCalculationParameter {
  return {
    [Elternteil.Eins]: createStaticCalculationParameterForElternteil(
      state,
      "ET1",
    ),
    [Elternteil.Zwei]: createStaticCalculationParameterForElternteil(
      state,
      "ET2",
    ),
  };
}

function createStaticCalculationParameterForElternteil(
  state: RootState,
  elternteil: ElternteilType,
): StaticCalculationParameterForElternteil {
  const persoenlicheDaten = persoenlicheDatenOfUi(state, elternteil);
  const finanzdaten = finanzDatenOfUi(state, elternteil, []);
  const mutterschaftsleistung = mutterschaftsLeistungOfUi(state, elternteil);
  const lohnsteuerjahr = EgrSteuerRechner.bestLohnSteuerJahrOf(
    persoenlicheDaten.wahrscheinlichesGeburtsDatum,
  );
  return {
    persoenlicheDaten,
    finanzdaten,
    mutterschaftsleistung,
    lohnsteuerjahr,
  };
}

type StaticCalculationParameter = Record<
  Elternteil,
  StaticCalculationParameterForElternteil
>;

type StaticCalculationParameterForElternteil = {
  persoenlicheDaten: PersoenlicheDaten;
  finanzdaten: FinanzDaten;
  mutterschaftsleistung: MutterschaftsLeistung;
  lohnsteuerjahr: number;
};

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("errechnete Elterngeldbezüge selector", async () => {
    const { renderHook } = await import("@/test-utils/test-utils");
    const { PersoenlicheDaten, FinanzDaten, MutterschaftsLeistung } =
      await import("@/globals/js/calculations/model");
    const { KeinElterngeld } = await import("@/features/planer/domain");

    vi.mock(import("@/redux/persoenlicheDatenFactory"));
    vi.mock(import("@/redux/finanzDatenFactory"));

    beforeEach(() => {
      vi.mocked(persoenlicheDatenOfUi).mockReturnValue(
        new PersoenlicheDaten(new Date()),
      );
      vi.mocked(finanzDatenOfUi).mockReturnValue(new FinanzDaten());
      vi.mocked(mutterschaftsLeistungOfUi).mockReturnValue(
        MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_8_WOCHEN,
      );
    });

    it("calls the methods to create the static calculation parameter only once initially", () => {
      const { result } = renderHook(() => useBerechneElterngeldbezuege());

      expect(persoenlicheDatenOfUi).toHaveBeenCalled();
      expect(finanzDatenOfUi).toHaveBeenCalled();
      expect(mutterschaftsLeistungOfUi).toHaveBeenCalled();
      vi.clearAllMocks();

      result.current({});
      result.current({});

      expect(persoenlicheDatenOfUi).not.toHaveBeenCalled();
      expect(finanzDatenOfUi).not.toHaveBeenCalled();
      expect(mutterschaftsLeistungOfUi).not.toHaveBeenCalled();
    });

    it("uses the initially created static calculation parameters for the simulation calls", () => {
      const persoenlicheDaten = new PersoenlicheDaten(new Date());
      vi.mocked(persoenlicheDatenOfUi).mockReturnValue(persoenlicheDaten);

      const finanzdaten = new FinanzDaten();
      vi.mocked(finanzDatenOfUi).mockReturnValue(finanzdaten);

      const mutterschaftsleistung =
        MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_8_WOCHEN;
      vi.mocked(mutterschaftsLeistungOfUi).mockReturnValue(
        mutterschaftsleistung,
      );

      const simulate = vi
        .spyOn(EgrCalculation.prototype, "simulate")
        .mockReturnValue({ rows: [] });

      const { result } = renderHook(() => useBerechneElterngeldbezuege());

      result.current({});

      expect(simulate).toHaveBeenCalledWith(
        persoenlicheDaten,
        finanzdaten,
        expect.any(Number),
        mutterschaftsleistung,
      );
    });

    it("reads the correct values for each Lebensmonat, Elternteil and Variante if calculation was successful", () => {
      const simulate = vi.spyOn(EgrCalculation.prototype, "simulate");

      // Fragile: relies on specific order of the Elternteile the simulation is called for.
      simulate.mockReturnValueOnce({
        rows: [
          {
            vonLebensMonat: 1,
            bisLebensMonat: 1,
            basisElternGeld: Big(111),
            elternGeldPlus: Big(112),
            nettoEinkommen: Big(0),
          },
          {
            vonLebensMonat: 2,
            bisLebensMonat: 2,
            basisElternGeld: Big(211),
            elternGeldPlus: Big(212),
            nettoEinkommen: Big(0),
          },
        ],
      });
      simulate.mockReturnValueOnce({
        rows: [
          {
            vonLebensMonat: 1,
            bisLebensMonat: 4,
            basisElternGeld: Big(21),
            elternGeldPlus: Big(22),
            nettoEinkommen: Big(0),
          },
        ],
      });

      const { result } = renderHook(() => useBerechneElterngeldbezuege());
      const elterngeldbezuege = result.current({});

      expect(elterngeldbezuege[1][Elternteil.Eins][Variante.Basis]).toBe(111);
      expect(elterngeldbezuege[1][Elternteil.Eins][Variante.Plus]).toBe(112);
      expect(elterngeldbezuege[1][Elternteil.Eins][Variante.Bonus]).toBe(112);

      expect(elterngeldbezuege[2][Elternteil.Eins][Variante.Basis]).toBe(211);
      expect(elterngeldbezuege[2][Elternteil.Eins][Variante.Plus]).toBe(212);
      expect(elterngeldbezuege[2][Elternteil.Eins][Variante.Bonus]).toBe(212);

      expect(elterngeldbezuege[1][Elternteil.Zwei][Variante.Basis]).toBe(21);
      expect(elterngeldbezuege[1][Elternteil.Zwei][Variante.Plus]).toBe(22);
      expect(elterngeldbezuege[1][Elternteil.Zwei][Variante.Bonus]).toBe(22);

      expect(elterngeldbezuege[2][Elternteil.Zwei][Variante.Basis]).toBe(21);
      expect(elterngeldbezuege[2][Elternteil.Zwei][Variante.Plus]).toBe(22);
      expect(elterngeldbezuege[2][Elternteil.Zwei][Variante.Bonus]).toBe(22);
    });

    it("transforms the given Lebensmonate to income data attached to the finanzdaten", () => {
      const initialFinanzdaten = new FinanzDaten();
      vi.mocked(finanzDatenOfUi).mockReturnValue(initialFinanzdaten);

      /*
       * Important:
       * The implementation implicitly uses shared object memory. Thereby, it is
       * not possible to observe call (parameters) via the {@link MockInstance}.
       * Therefore, a custom observation implementation is necessary.
       */
      const observeredErwerbsZeitraumLebensMonatListen: ErwerbsZeitraumLebensMonat[][] =
        [];
      vi.spyOn(EgrCalculation.prototype, "simulate").mockImplementation(
        (_, finanzdaten) => {
          observeredErwerbsZeitraumLebensMonatListen.push(
            finanzdaten.erwerbsZeitraumLebensMonatList,
          );
          return { rows: [] };
        },
      );

      const { result } = renderHook(() => useBerechneElterngeldbezuege());

      result.current({
        1: {
          [Elternteil.Eins]: {
            gewaehlteOption: Variante.Basis,
            elterngeldbezug: null,
            bruttoeinkommen: null,
            imMutterschutz: true,
          },
          [Elternteil.Zwei]: {
            gewaehlteOption: Variante.Plus,
            elterngeldbezug: 121,
            bruttoeinkommen: 122,
            imMutterschutz: false,
          },
        },
        2: {
          [Elternteil.Eins]: {
            gewaehlteOption: Variante.Bonus,
            elterngeldbezug: 211,
            bruttoeinkommen: 212,
            imMutterschutz: false,
          },
          [Elternteil.Zwei]: {
            gewaehlteOption: Variante.Bonus,
            elterngeldbezug: 221,
            bruttoeinkommen: 222,
            imMutterschutz: false,
          },
        },
        5: {
          [Elternteil.Eins]: {
            gewaehlteOption: undefined,
            elterngeldbezug: undefined,
            bruttoeinkommen: 312,
            imMutterschutz: false,
          },
          [Elternteil.Zwei]: {
            gewaehlteOption: KeinElterngeld,
            elterngeldbezug: undefined,
            bruttoeinkommen: undefined,
            imMutterschutz: false,
          },
        },
      });

      expect(observeredErwerbsZeitraumLebensMonatListen).toStrictEqual([
        [
          erwerbsZeitraumLebensmonat(2, 2, 212),
          erwerbsZeitraumLebensmonat(5, 5, 312),
        ],
        [
          erwerbsZeitraumLebensmonat(1, 1, 122),
          erwerbsZeitraumLebensmonat(2, 2, 222),
        ],
      ]);
    });

    function erwerbsZeitraumLebensmonat(
      vonLebensMonat: number,
      bisLebensMonat: number,
      bruttoProMonat: number,
    ): ErwerbsZeitraumLebensMonat {
      const instance = new ErwerbsZeitraumLebensMonat();
      instance.vonLebensMonat = vonLebensMonat;
      instance.bisLebensMonat = bisLebensMonat;
      instance.bruttoProMonat = new Einkommen(bruttoProMonat);
      return instance;
    }
  });
}
