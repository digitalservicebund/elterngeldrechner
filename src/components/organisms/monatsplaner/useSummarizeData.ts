import { EgrConst } from "../../../globals/js/egr-configuration";
import { ElterngeldType, Month } from "../../../monatsplaner";
import { createAppSelector, useAppSelector } from "../../../redux/hooks";
import { stepAllgemeineAngabenSelectors } from "../../../redux/stepAllgemeineAngabenSlice";
import {
  ElterngeldRow,
  ElterngeldRowsResult,
} from "../../../redux/stepRechnerSlice";
import { SummationDataForParent } from "./types";

export function useSummarizeData(): SummationDataForParent[] {
  const applicant = useAppSelector(
    (state) => state.stepAllgemeineAngaben.antragstellende,
  );
  const isSingleParent = applicant === "EinElternteil";

  const parentNames = useAppSelector(
    stepAllgemeineAngabenSelectors.getElternteilNames,
  );

  const months = useAppSelector(monthsSelector);
  const amounts = useAppSelector(amountsSelector);

  const data = [
    {
      name: parentNames.ET1,
      monthCount: countNumberOfPlannedMonths(months.ET1),
      totalPayoutAmount: sumUpTotalPayoutAmount(months.ET1, amounts.ET1),
      totalIncomeAmount: sumUpTotalIncomeAmount(amounts.ET1),
    },
  ];

  if (!isSingleParent) {
    data.push({
      name: parentNames.ET2,
      monthCount: countNumberOfPlannedMonths(months.ET2),
      totalPayoutAmount: sumUpTotalPayoutAmount(months.ET2, amounts.ET2),
      totalIncomeAmount: sumUpTotalIncomeAmount(amounts.ET2),
    });
  }

  return data;
}

const monthsSelector = createAppSelector(
  (state) => state.monatsplaner.elternteile.ET1.months,
  (state) => state.monatsplaner.elternteile.ET2.months,
  (monthsET1, monthsET2) => ({ ET1: monthsET1, ET2: monthsET2 }),
);

const amountsSelector = createAppSelector(
  (state) => state.stepRechner.ET1.elterngeldResult,
  (state) => state.stepRechner.ET2.elterngeldResult,
  (monthsET1, monthsET2) => ({ ET1: monthsET1, ET2: monthsET2 }),
);

function countNumberOfPlannedMonths(months: readonly Month[]): number {
  return months.filter((month) => month.type !== "None").length;
}

function sumUpTotalPayoutAmount(
  months: readonly Month[],
  amounts: ElterngeldRowsResult,
): number {
  const rows = amounts.state === "success" ? amounts.data : [];
  const amountsPerMonth = getAmountsPerMonth(rows);
  const payoutPerMonth = amountsPerMonth.map((row, index) =>
    getPayoutAmount(row, months[index]?.type),
  );
  return sumUp(payoutPerMonth);
}

function sumUpTotalIncomeAmount(amounts: ElterngeldRowsResult): number {
  const rows = amounts.state === "success" ? amounts.data : [];
  const amountsPerMonth = getAmountsPerMonth(rows);
  const incomePerMonth = amountsPerMonth.map((row) => row.nettoEinkommen);
  return sumUp(incomePerMonth);
}

function getPayoutAmount(row: ElterngeldRow, type?: ElterngeldType): number {
  switch (type) {
    case "BEG":
      return row.basisElternGeld;
    case "EG+":
    case "PSB":
      return row.elternGeldPlus;
    case "None":
    case undefined:
      return 0;
  }
}

function getAmountsPerMonth(rows: ElterngeldRow[]): ElterngeldRow[] {
  return Array.from(
    { length: EgrConst.lebensMonateMaxNumber },
    (_, monthIndex) =>
      rows.find((row) => rowIncludesMonthIndex(row, monthIndex)) ??
      getEmptyElterngeldRow(monthIndex),
  );
}

function rowIncludesMonthIndex(
  row: ElterngeldRow,
  monthIndex: number,
): boolean {
  const fromMonthIndex = row.vonLebensMonat - 1;
  const tillMonthIndex = row.bisLebensMonat - 1;
  return fromMonthIndex <= monthIndex && monthIndex <= tillMonthIndex;
}

function getEmptyElterngeldRow(monthIndex: number): ElterngeldRow {
  return {
    vonLebensMonat: monthIndex,
    bisLebensMonat: monthIndex,
    basisElternGeld: 0,
    elternGeldPlus: 0,
    nettoEinkommen: 0,
  };
}

function sumUp(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0);
}
