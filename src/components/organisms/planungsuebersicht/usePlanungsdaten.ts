import {
  PlanungsdatenFuerElternteil,
  Zeitraum,
  VariantenDetails,
  DetailsOfVariante,
  Variante,
  Lebensmonat,
} from "./types";
import {
  ElterngeldType,
  type ElternteilType,
  type Month,
} from "@/monatsplaner";
import { EgrConst } from "@/globals/js/egr-configuration";
import { createAppSelector, useAppSelector } from "@/redux/hooks";
import { stepNachwuchsSelectors } from "@/redux/stepNachwuchsSlice";
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
      stepNachwuchsSelectors.getWahrscheinlichesGeburtsDatum,
    ],
    (pseudonym, months, elterngeldResult, birthdate) => ({
      name: pseudonym,
      totalNumberOfMonths: countPlannedMonths(months),
      geldInsgesamt:
        sumUpElterngeld(months, elterngeldResult) +
        sumUpNettoEinkommen(months, elterngeldResult),
      zeitraeueme: assembleZeitraeume(months, birthdate),
      details: combineDetails(months, elterngeldResult),
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

function combineDetails(
  months: Month[],
  elterngeldResult: ElterngeldRowsResult,
): VariantenDetails {
  return {
    BEG: combineDetailsOfVariante("BEG", months, elterngeldResult),
    "EG+": combineDetailsOfVariante("EG+", months, elterngeldResult),
    PSB: combineDetailsOfVariante("PSB", months, elterngeldResult),
  };
}

function combineDetailsOfVariante(
  variante: Variante,
  months: Month[],
  elterngeldResult: ElterngeldRowsResult,
): DetailsOfVariante {
  return {
    numberOfMonths: countPlannedMonths(months, [variante]),
    elterngeld: sumUpElterngeld(months, elterngeldResult, [variante]),
    nettoEinkommen: sumUpNettoEinkommen(months, elterngeldResult, [variante]),
  };
}

function countPlannedMonths(
  months: Month[],
  filter: Variante[] = ["BEG", "EG+", "PSB"],
): number {
  return months.filter(
    (month) => month.type !== "None" && filter.includes(month.type),
  ).length;
}

function sumUpElterngeld(
  months: Month[],
  elterngeldResult: ElterngeldRowsResult,
  filter: Variante[] = ["BEG", "EG+", "PSB"],
): number {
  const resultPerMonth = flattenElterngeldResult(elterngeldResult);

  const elterngeldPerMonth = months.map((month, monthIndex) => {
    const isOfInterest = month.type !== "None" && filter.includes(month.type);
    const resultForMonth = resultPerMonth[monthIndex];
    return isOfInterest ? readElterngeld(resultForMonth, month.type) : 0;
  });

  return elterngeldPerMonth.reduce((sum, elterngeld) => sum + elterngeld, 0);
}

function sumUpNettoEinkommen(
  months: Month[],
  elterngeldResult: ElterngeldRowsResult,
  filter: Variante[] = ["BEG", "EG+", "PSB", "None"],
): number {
  const resultPerMonth = flattenElterngeldResult(elterngeldResult);

  const nettoEinkommenPerMonth = months.map((month, monthIndex) => {
    const isOfInterest = filter.includes(month.type);
    const resultForMonth = resultPerMonth[monthIndex];
    return isOfInterest ? resultForMonth.nettoEinkommen : 0;
  });

  return nettoEinkommenPerMonth.reduce((sum, einkommen) => sum + einkommen, 0);
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

function assembleZeitraeume(months: Month[], birthdate: Date): Zeitraum[] {
  // ["BEG", "EG+", "None", "PSB"] -> [[0, 1], [3]]
  const groupsOfFollowingMonthIndexesWithElterngeld = months
    .reduce(
      (groups, month, index) => {
        if (month.type === "None") {
          groups.push([]);
        } else {
          const lastGroup = groups[groups.length - 1];
          lastGroup.push(index);
        }

        return groups;
      },
      [[]] as Array<Array<number>>,
    )
    .filter((group) => group.length > 0);

  const zeitraeumeByLebensmonate =
    groupsOfFollowingMonthIndexesWithElterngeld.map((group) => ({
      fromLebensmonat: group[0] + 1,
      toLebensmonat: group[group.length - 1] + 1,
    }));

  return zeitraeumeByLebensmonate.map((zeitraum) => ({
    from: copyAndShiftDate(birthdate, { months: zeitraum.fromLebensmonat - 1 }),
    to: copyAndShiftDate(birthdate, {
      months: zeitraum.toLebensmonat,
      days: -1, // Zeitraum ends one day before next Lebensmonat begins.
    }),
  }));
}

function copyAndShiftDate(
  date: Date,
  shiftBy: { months?: number; days?: number },
): Date {
  const copiedDate = new Date(date);
  copiedDate.setMonth(copiedDate.getMonth() + (shiftBy.months ?? 0));
  copiedDate.setDate(copiedDate.getDate() + (shiftBy.days ?? 0));
  return copiedDate;
}
