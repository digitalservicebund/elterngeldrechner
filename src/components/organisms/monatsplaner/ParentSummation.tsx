import PermIdentityIcon from "@digitalservicebund/icons/PermIdentity";
import { ReactNode } from "react";
import { SummationDataForParent } from "./types";
import { formatAsCurrency } from "../../../utils/locale-formatting";

interface Props extends SummationDataForParent {
  hideSum?: boolean;
}

export function ParentSummation({
  name,
  monthCount,
  totalPayoutAmount,
  totalIncomeAmount,
  hideSum,
}: Props): ReactNode {
  const formattedMonthText = `${monthCount} Monat${monthCount > 1 ? "e" : ""}`;
  const formattedTotalPayoutAmount = formatAsCurrency(totalPayoutAmount);
  const formattedTotalIncomeAmount = formatAsCurrency(totalIncomeAmount);
  const formattedTotalSum = formatAsCurrency(
    totalPayoutAmount + totalIncomeAmount,
  );

  return (
    <>
      <span className="flex flex-wrap items-center justify-center gap-4 text-center">
        <PermIdentityIcon className="inline size-28" />
        <strong>{name}</strong> {formattedMonthText}
      </span>

      <span className="mt-auto">Elterngeld: {formattedTotalPayoutAmount}</span>
      <span>Einkommen: {formattedTotalIncomeAmount}</span>
      {!hideSum && <strong>Summe: {formattedTotalSum}</strong>}
    </>
  );
}
