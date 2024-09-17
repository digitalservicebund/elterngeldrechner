import { PlanungsdatenFuerElternteil, Lebensmonat } from "./types";
import {
  ElterngeldType,
  type ElternteilType,
  type Month,
} from "@/monatsplaner";
import { EgrConst } from "@/globals/js/egr-configuration";
import { createAppSelector, useAppSelector } from "@/redux/hooks";
import { ElterngeldRow, ElterngeldRowsResult } from "@/redux/stepRechnerSlice";

export function usePlanungdaten(): PlanungsdatenFuerElternteil[] {
  const isSingleParent = useAppSelector(isSingleParentSelector);
  const planungsdatenET1 = useAppSelector(planungsdatenET1Selector);
  const planungsdatenET2 = useAppSelector(planungsdatenET2Selector);
  return isSingleParent
    ? [planungsdatenET1]
    : [planungsdatenET1, planungsdatenET2];
}

const isSingleParentSelector = createAppSelector(
  [(state) => state.stepAllgemeineAngaben.antragstellende],
  (antragstellende) => antragstellende === "EinenElternteil",
);

const planungsdatenET1Selector = createPlanungsdatenSelector("ET1");
const planungsdatenET2Selector = createPlanungsdatenSelector("ET2");

function createPlanungsdatenSelector(elternteil: ElternteilType) {
  return createAppSelector(
    [
      (state) =>
        state.stepAllgemeineAngaben.pseudonym[elternteil] ||
        elternteil.replace("ET", "Elternteil "),
      (state) => state.monatsplaner.elternteile[elternteil].months as Month[],
      (state) => state.stepRechner[elternteil].elterngeldResult,
    ],
    (pseudonym, months, elterngeldResult) => ({
      name: pseudonym,
      lebensmonate: trimLebensmonate(
        combineLebensmonate(months, elterngeldResult),
      ),
    }),
  );
}

function combineLebensmonate(
  months: Month[],
  elterngeldResult: ElterngeldRowsResult,
): Lebensmonat[] {
  const resultPerMonth = flattenElterngeldResult(elterngeldResult);

  return months.map((month, index) => {
    const { type: variante, isMutterschutzMonth } = month;
    const elterngeld = readElterngeld(resultPerMonth[index], month.type);
    const nettoEinkommen = resultPerMonth[index].nettoEinkommen;
    return {
      variante,
      isMutterschutzMonth,
      elterngeld,
      nettoEinkommen,
      verfuegbaresEinkommen: elterngeld + nettoEinkommen,
    };
  });
}

function trimLebensmonate(lebensmonate: Lebensmonat[]): Lebensmonat[] {
  const lastRelevantIndex = lebensmonate.findLastIndex(
    ({ variante }) => variante !== "None",
  );
  return lebensmonate.slice(0, lastRelevantIndex + 1);
}

function flattenElterngeldResult(
  elterngeldResult: ElterngeldRowsResult,
): ElterngeldRow[] {
  const rows =
    elterngeldResult.state === "success" ? elterngeldResult.data : [];

  return Array.from(
    { length: EgrConst.lebensMonateMaxNumber },
    (_, monthIndex) => {
      const row = rows.find(checkRowIncludesMonth.bind({ monthIndex }));
      return row ?? createRowWithNoElterngeld(monthIndex);
    },
  );
}

function readElterngeld(
  resultForMonth: ElterngeldRow,
  variante: ElterngeldType,
): number {
  switch (variante) {
    case "BEG":
      return resultForMonth.basisElternGeld;
    case "EG+":
    case "PSB":
      return resultForMonth.elternGeldPlus;
    case "None":
      return 0;
  }
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
