import { ElterngeldType, Elternteile } from "@/monatsplaner";
import { useAppSelector } from "@/redux/hooks";
import { ContingentPerVariant } from "@/components/molecules/planning-contingent/types";

export function usePlanningContingentMonths(): ContingentPerVariant {
  const elternteile = useAppSelector((state) => state.monatsplaner.elternteile);

  const basisAvailable = elternteile.remainingMonths.basiselterngeld;
  const plusAvailable = elternteile.remainingMonths.elterngeldplus;
  const bonusAvailable = elternteile.remainingMonths.partnerschaftsbonus;

  const basisTaken = countTakenMonthsByBothParents(elternteile, "BEG");
  const plusTaken = countTakenMonthsByBothParents(elternteile, "EG+");
  const bonusTaken = countTakenMonthsByBothParents(elternteile, "PSB");

  return {
    basis: {
      available: basisAvailable,
      taken: basisMonthsTakenIncludingPlusMonths(basisTaken, plusTaken),
    },
    plus: {
      available: plusAvailable,
      taken: plusMonthsTakenIncludingBasisMonths(plusTaken, basisTaken),
    },
    bonus: {
      available: bonusAvailable,
      taken: bonusMonthsTakenInParallel(bonusTaken),
    },
  };
}

function countTakenMonthsByBothParents(
  elternteile: Elternteile,
  variant: ElterngeldType,
): number {
  const allMonths = [...elternteile.ET1.months, ...elternteile.ET2.months];
  return allMonths.filter(({ type }) => type === variant).length;
}

function basisMonthsTakenIncludingPlusMonths(
  basisTaken: number,
  plusTaken: number,
): number {
  return basisTaken + Math.ceil(plusTaken / 2);
}

function plusMonthsTakenIncludingBasisMonths(
  plusTaken: number,
  basisTaken: number,
): number {
  return plusTaken + basisTaken * 2;
}

function bonusMonthsTakenInParallel(bonusTaken: number): number {
  return bonusTaken / 2;
}
