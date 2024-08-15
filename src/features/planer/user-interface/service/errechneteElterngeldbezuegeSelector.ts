import {
  Elternteil,
  Variante,
  Lebensmonatszahlen,
  ElterngeldbezugProVariante,
  Elterngeldbezuege,
} from "@/features/planer/user-interface/service";
import type { RootState } from "@/redux";
import { createAppSelector } from "@/redux/hooks";
import type {
  ElterngeldRow,
  ElterngeldRowsResult,
} from "@/redux/stepRechnerSlice";

export const errechneteElterngeldbezuegeSelector = createAppSelector(
  [
    (state) => state.stepRechner.ET1.elterngeldResult,
    (state) => state.stepRechner.ET2.elterngeldResult,
  ],
  combineErrechneteElterngeldbezuege,
);

function combineErrechneteElterngeldbezuege(
  elterngeldResultET1: ElterngeldRowsResult,
  elterngeldResultET2: ElterngeldRowsResult,
): Elterngeldbezuege<Elternteil> {
  const resultPerMonthET1 = flattenElterngeldResult(elterngeldResultET1);
  const resultPerMonthET2 = flattenElterngeldResult(elterngeldResultET2);

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
  row: ElterngeldRow,
): ElterngeldbezugProVariante {
  return {
    [Variante.Basis]: row.basisElternGeld,
    [Variante.Plus]: row.elternGeldPlus,
    [Variante.Bonus]: row.elternGeldPlus,
  };
}

function flattenElterngeldResult(
  elterngeldResult: ElterngeldRowsResult,
): ElterngeldRow[] {
  const rows =
    elterngeldResult.state === "success" ? elterngeldResult.data : [];

  return Array.from({ length: 32 }, (_, monthIndex) => {
    const row = rows.find(checkRowIncludesMonth.bind({ monthIndex }));
    return row ?? createRowWithNoElterngeld(monthIndex);
  });
}

function checkRowIncludesMonth(
  this: { monthIndex: number },
  row: ElterngeldRow,
): boolean {
  const fromMonthIndex = row.vonLebensMonat - 1;
  const tillMonthIndex = row.bisLebensMonat - 1;
  return fromMonthIndex <= this.monthIndex && this.monthIndex <= tillMonthIndex;
}

function createRowWithNoElterngeld(monthIndex: number): ElterngeldRow {
  return {
    vonLebensMonat: monthIndex,
    bisLebensMonat: monthIndex,
    basisElternGeld: 0,
    elternGeldPlus: 0,
    nettoEinkommen: 0,
  };
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("errechnete Elterngeldbezüge selector", async () => {
    const { produce } = await import("immer");
    const { useAppSelector } = await import("@/redux/hooks");
    const { INITIAL_STATE, renderHook } = await import(
      "@/test-utils/test-utils"
    );

    it.each(["init", "pending", "error"] as const)(
      "has all Elterngeldbezuege set to zero if calculation state is %s",
      (state) => {
        const preloadedState = produce(INITIAL_STATE, (draft) => {
          draft.stepRechner.ET1.elterngeldResult = { state };
        });

        const elterngeldbezuege =
          executeErrechneteElterngeldbezuegeSelector(preloadedState);

        expect(
          Object.values(elterngeldbezuege)
            .flatMap(Object.values)
            .flatMap(Object.values)
            .every((elterngeldbezug) => elterngeldbezug === 0),
        ).toBe(true);
      },
    );

    it("reads the correct values for each Lebensmonat, Elternteil and Variante if calculation was successful", () => {
      const preloadedState = produce(INITIAL_STATE, (draft) => {
        draft.stepRechner.ET1.elterngeldResult = {
          state: "success",
          data: [
            {
              vonLebensMonat: 1,
              bisLebensMonat: 1,
              basisElternGeld: 111,
              elternGeldPlus: 112,
              nettoEinkommen: 0,
            },
            {
              vonLebensMonat: 2,
              bisLebensMonat: 2,
              basisElternGeld: 211,
              elternGeldPlus: 212,
              nettoEinkommen: 0,
            },
          ],
        };
        draft.stepRechner.ET2.elterngeldResult = {
          state: "success",
          data: [
            {
              vonLebensMonat: 1,
              bisLebensMonat: 4,
              basisElternGeld: 21,
              elternGeldPlus: 22,
              nettoEinkommen: 0,
            },
          ],
        };
      });

      const elterngeldbezuege =
        executeErrechneteElterngeldbezuegeSelector(preloadedState);

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

    function executeErrechneteElterngeldbezuegeSelector(
      preloadedState: RootState,
    ): Elterngeldbezuege<Elternteil> {
      const { result } = renderHook(() => useErrechneteElterngeldbezuege(), {
        preloadedState,
      });
      return result.current;
    }

    function useErrechneteElterngeldbezuege() {
      return useAppSelector(errechneteElterngeldbezuegeSelector);
    }
  });
}
