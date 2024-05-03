import PermIdentityIcon from "@digitalservicebund/icons/PermIdentity";
import BusinessCenterOutlinedIcon from "@digitalservicebund/icons/BusinessCenterOutlined";
import { ReactNode } from "react";
import { SummationDataForParent } from "./types";

interface Props extends SummationDataForParent {}

export function ParentSummation({
  name,
  monthCount,
  totalPayoutAmount,
  totalIncomeAmount,
}: Props): ReactNode {
  const formattedMonthText = `${monthCount} Monat${monthCount > 1 ? "e" : ""}`;
  const formattedTotalPayoutAmount = formatAsCurrency(totalPayoutAmount);
  const formattedTotalIncomeAmount = formatAsCurrency(totalIncomeAmount);

  return (
    <>
      <span className="flex flex-wrap items-center justify-center gap-4 text-center">
        <PermIdentityIcon className="inline size-28" />
        <strong>{name}</strong> {formattedMonthText}
      </span>

      <strong className="mt-auto">{formattedTotalPayoutAmount}</strong>

      <span className="flex items-center gap-4">
        <BusinessCenterOutlinedIcon className="inline size-24" />
        Gehalt {formattedTotalIncomeAmount}
      </span>
    </>
  );
}

function formatAsCurrency(amount: number): string {
  const rounded = Math.floor(amount);
  return rounded.toLocaleString(undefined, {
    style: "currency",
    currency: "EUR",
    currencyDisplay: "symbol",
    maximumFractionDigits: 0,
  });
}
