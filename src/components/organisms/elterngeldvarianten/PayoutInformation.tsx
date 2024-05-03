import PermIdentityIcon from "@digitalservicebund/icons/PermIdentity";
import { ReactNode } from "react";

type Props = {
  parentName?: string;
  amount: number;
};

export function PayoutInformation({ parentName, amount }: Props): ReactNode {
  const formattedAmount = formatAsCurrency(amount);

  return (
    <div className="inline-flex items-center gap-4">
      <PermIdentityIcon className="inline h-20" />
      <span>
        {parentName && `${parentName} | `}
        <strong>{formattedAmount}</strong> pro Monat
      </span>
    </div>
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
