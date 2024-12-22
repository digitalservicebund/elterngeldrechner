import type { ReactNode } from "react";

type Props = {
  readonly betrag: number;
  readonly className?: string;
};

export function Geldbetrag({ betrag, className }: Props): ReactNode {
  const gerundeterBetrag = Math.round(betrag);
  const formattedBetrag = gerundeterBetrag.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
    currencyDisplay: "symbol",
    maximumFractionDigits: 0,
  });

  return className ? (
    <span className={className}>{formattedBetrag}</span>
  ) : (
    formattedBetrag
  );
}
