import PermIdentityIcon from "@digitalservicebund/icons/PermIdentity";
import { ReactNode } from "react";

type Props = {
  parentName: string;
  amount: number;

  /**
   * For testing purposes only.
   * Leave undefined to fallback on environment settings.
   */
  testLocales?: Intl.LocalesArgument;
};

export function PayoutInformation({
  parentName,
  amount,
  testLocales,
}: Props): ReactNode {
  const formattedAmount = amount.toLocaleString(testLocales, {
    style: "currency",
    currency: "EUR",
    currencyDisplay: "symbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <span>
      <PermIdentityIcon className="inline" /> {parentName}
      <span aria-hidden="true"> | </span>
      <strong>{formattedAmount}</strong> pro Monat
    </span>
  );
}
