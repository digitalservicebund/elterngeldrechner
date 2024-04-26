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
  const formattedAmount = formatAsCurrency(amount, testLocales);

  return (
    <div className="inline-flex items-center gap-4">
      <PermIdentityIcon className="inline h-20" />
      <span>
        {parentName} | <strong>{formattedAmount}</strong> pro Monat
      </span>
    </div>
  );
}

function formatAsCurrency(
  amount: number,
  locales?: Intl.LocalesArgument,
): string {
  const rounded = Math.floor(amount);
  return rounded.toLocaleString(locales, {
    style: "currency",
    currency: "EUR",
    currencyDisplay: "symbol",
    maximumFractionDigits: 0,
  });
}
