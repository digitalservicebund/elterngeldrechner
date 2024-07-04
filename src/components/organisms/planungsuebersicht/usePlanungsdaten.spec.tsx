import { produce } from "immer";
import { usePlanungdaten } from "./usePlanungsdaten";
import { INITIAL_STATE, renderHook } from "@/test-utils/test-utils";
import { ElterngeldRow, ElterngeldRowsResult } from "@/redux/stepRechnerSlice";
import type { ElterngeldType, Month } from "@/monatsplaner";

describe("usePlanungsdaten", () => {
  it("provides two data set entries for each parent if no single parent", () => {
    const preloadedState = produce(INITIAL_STATE, (recipe) => {
      recipe.stepAllgemeineAngaben.antragstellende = "FuerBeide";
    });

    const { result } = renderHook(() => usePlanungdaten(), { preloadedState });

    expect(result.current).toHaveLength(2);
  });

  it("provides one data set entry if single parent", () => {
    const preloadedState = produce(INITIAL_STATE, (recipe) => {
      recipe.stepAllgemeineAngaben.antragstellende = "EinenElternteil";
    });

    const { result } = renderHook(() => usePlanungdaten(), { preloadedState });

    expect(result.current).toHaveLength(1);
  });

  it("provides the pseudonyms of both parents as names", () => {
    const preloadedState = produce(INITIAL_STATE, (recipe) => {
      recipe.stepAllgemeineAngaben.pseudonym = { ET1: "Jane", ET2: "" };
    });

    const { result } = renderHook(() => usePlanungdaten(), { preloadedState });

    expect(result.current[0].name).toEqual("Jane");
    expect(result.current[1].name).toEqual("Elternteil 2");
  });

  it("counts the number of all planned months", () => {
    const preloadedState = produce(INITIAL_STATE, (recipe) => {
      recipe.monatsplaner.elternteile.ET1.months = months(
        "BEG",
        "EG+",
        "None",
        "None",
        "PSB",
        "None",
      );
      recipe.monatsplaner.elternteile.ET2.months = months("BEG");
    });

    const { result } = renderHook(() => usePlanungdaten(), { preloadedState });

    expect(result.current[0].totalNumberOfMonths).toEqual(3);
    expect(result.current[1].totalNumberOfMonths).toEqual(1);
  });

  describe("sums up the total money", () => {
    it("uses the correct Elterngeld result values according to the planned months", () => {
      const preloadedState = produce(INITIAL_STATE, (recipe) => {
        recipe.monatsplaner.elternteile.ET1.months = months(
          "BEG",
          "EG+",
          "PSB",
        );
        recipe.stepRechner.ET1.elterngeldResult = elterngeldResult(
          { basisElternGeld: 100, elternGeldPlus: 50 },
          { basisElternGeld: 110, elternGeldPlus: 60 },
          { basisElternGeld: 120, elternGeldPlus: 70 },
        );

        recipe.monatsplaner.elternteile.ET2.months = months("BEG");
        recipe.stepRechner.ET2.elterngeldResult = elterngeldResult({
          basisElternGeld: 80,
          elternGeldPlus: 40,
        });
      });

      const { result } = renderHook(() => usePlanungdaten(), {
        preloadedState,
      });

      expect(result.current[0].geldInsgesamt).toEqual(230);
      expect(result.current[1].geldInsgesamt).toEqual(80);
    });

    it("includes Netto Einkommen for any month, including those without Elterngeld", () => {
      const preloadedState = produce(INITIAL_STATE, (recipe) => {
        recipe.monatsplaner.elternteile.ET1.months = months("BEG", "None");
        recipe.stepRechner.ET1.elterngeldResult = elterngeldResult(
          { basisElternGeld: 100, nettoEinkommen: 200 },
          { basisElternGeld: 110, nettoEinkommen: 210 },
        );

        recipe.monatsplaner.elternteile.ET2.months = months("EG+");
        recipe.stepRechner.ET2.elterngeldResult = elterngeldResult({
          elternGeldPlus: 40,
          nettoEinkommen: 300,
        });
      });

      const { result } = renderHook(() => usePlanungdaten(), {
        preloadedState,
      });

      expect(result.current[0].geldInsgesamt).toEqual(510);
      expect(result.current[1].geldInsgesamt).toEqual(340);
    });
  });

  describe("assemble Zeiträume", () => {
    it("creates a Zeitraum per group of consequtive planned months", () => {
      const preloadedState = produce(INITIAL_STATE, (recipe) => {
        recipe.monatsplaner.elternteile.ET1.months = months(
          "BEG",
          "EG+",
          "None",
          "None",
          "EG+",
          "None",
        );
        recipe.monatsplaner.elternteile.ET2.months = months(
          "EG+",
          "None",
          "EG+",
          "None",
          "EG+",
        );
      });

      const { result } = renderHook(() => usePlanungdaten(), {
        preloadedState,
      });

      expect(result.current[0].zeitraeueme).toHaveLength(2);
      expect(result.current[1].zeitraeueme).toHaveLength(3);
    });

    it("creates Zeiträume starting based on the birthdate and ending one day before the next", () => {
      const preloadedState = produce(INITIAL_STATE, (recipe) => {
        recipe.stepNachwuchs.wahrscheinlichesGeburtsDatum = "03.04.2024";
        recipe.monatsplaner.elternteile.ET1.months = months(
          "BEG",
          "EG+",
          "None",
          "EG+",
        );
        recipe.monatsplaner.elternteile.ET2.months = months(
          "None",
          "EG+",
          "BEG",
        );
      });

      const { result } = renderHook(() => usePlanungdaten(), {
        preloadedState,
      });

      expect(result.current[0].zeitraeueme).toStrictEqual([
        { from: new Date(2024, 3, 3), to: new Date(2024, 5, 2) },
        { from: new Date(2024, 6, 3), to: new Date(2024, 7, 2) },
      ]);

      expect(result.current[1].zeitraeueme).toStrictEqual([
        { from: new Date(2024, 4, 3), to: new Date(2024, 6, 2) },
      ]);
    });
  });

  describe("combines details of all Varianten", () => {
    it("counts the number of planned months for each Variante respectively", () => {
      const preloadedState = produce(INITIAL_STATE, (recipe) => {
        recipe.monatsplaner.elternteile.ET1.months = months(
          "BEG",
          "EG+",
          "BEG",
          "PSB",
          "PSB",
        );
        recipe.monatsplaner.elternteile.ET2.months = months("EG+", "EG+");
      });

      const { result } = renderHook(() => usePlanungdaten(), {
        preloadedState,
      });

      expect(result.current[0].details.BEG.numberOfMonths).toEqual(2);
      expect(result.current[0].details["EG+"].numberOfMonths).toEqual(1);
      expect(result.current[0].details.PSB.numberOfMonths).toEqual(2);

      expect(result.current[1].details.BEG.numberOfMonths).toEqual(0);
      expect(result.current[1].details["EG+"].numberOfMonths).toEqual(2);
      expect(result.current[1].details.PSB.numberOfMonths).toEqual(0);
    });

    it("sums up the Elterngeld for each Variante based on the plan and result", () => {
      const preloadedState = produce(INITIAL_STATE, (recipe) => {
        recipe.monatsplaner.elternteile.ET1.months = months(
          "BEG",
          "EG+",
          "EG+",
          "None",
          "BEG",
        );
        recipe.stepRechner.ET1.elterngeldResult = elterngeldResult(
          { basisElternGeld: 100, elternGeldPlus: 50 },
          { basisElternGeld: 110, elternGeldPlus: 60 },
          { basisElternGeld: 120, elternGeldPlus: 70 },
          { basisElternGeld: 130, elternGeldPlus: 80 },
          { basisElternGeld: 140, elternGeldPlus: 90 },
        );

        recipe.monatsplaner.elternteile.ET2.months = months("PSB");
        recipe.stepRechner.ET2.elterngeldResult = elterngeldResult({
          basisElternGeld: 40,
          elternGeldPlus: 20,
        });
      });

      const { result } = renderHook(() => usePlanungdaten(), {
        preloadedState,
      });

      expect(result.current[0].details.BEG.elterngeld).toEqual(240);
      expect(result.current[0].details["EG+"].elterngeld).toEqual(130);
      expect(result.current[0].details.PSB.elterngeld).toEqual(0);

      expect(result.current[1].details.BEG.elterngeld).toEqual(0);
      expect(result.current[1].details["EG+"].elterngeld).toEqual(0);
      expect(result.current[1].details.PSB.elterngeld).toEqual(20);
    });

    it("sums up the Netto Einkommen for each Variante based on the plan and result", () => {
      const preloadedState = produce(INITIAL_STATE, (recipe) => {
        recipe.monatsplaner.elternteile.ET1.months = months(
          "BEG",
          "EG+",
          "EG+",
          "None",
          "BEG",
        );
        recipe.stepRechner.ET1.elterngeldResult = elterngeldResult(
          { nettoEinkommen: 0 },
          { nettoEinkommen: 200 },
          { nettoEinkommen: 210 },
          { nettoEinkommen: 230 },
          { nettoEinkommen: 240 },
        );

        recipe.monatsplaner.elternteile.ET2.months = months("PSB");
        recipe.stepRechner.ET2.elterngeldResult = elterngeldResult({
          nettoEinkommen: 150,
        });
      });

      const { result } = renderHook(() => usePlanungdaten(), {
        preloadedState,
      });

      expect(result.current[0].details.BEG.nettoEinkommen).toEqual(240);
      expect(result.current[0].details["EG+"].nettoEinkommen).toEqual(410);
      expect(result.current[0].details.PSB.nettoEinkommen).toEqual(0);

      expect(result.current[1].details.BEG.nettoEinkommen).toEqual(0);
      expect(result.current[1].details["EG+"].nettoEinkommen).toEqual(0);
      expect(result.current[1].details.PSB.nettoEinkommen).toEqual(150);
    });
  });
});

function months(...varianten: ElterngeldType[]): Month[] {
  return varianten.map((variante) => ({
    type: variante,
    isMutterschutzMonth: false,
  }));
}

function elterngeldResult(
  ...rows: Partial<ElterngeldRow>[]
): ElterngeldRowsResult {
  return {
    state: "success",
    data: rows.map((row, index) => ({
      vonLebensMonat: index + 1,
      bisLebensMonat: index + 1,
      basisElternGeld: 0,
      elternGeldPlus: 0,
      nettoEinkommen: 0,
      ...row,
    })),
  };
}
