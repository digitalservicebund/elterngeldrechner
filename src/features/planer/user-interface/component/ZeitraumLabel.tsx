import type { ReactNode } from "react";
import type { Zeitraum } from "@/features/planer/user-interface/service";

type Props = {
  readonly zeitraum: Zeitraum;
  readonly id?: string;
  readonly className?: string;
};

export function ZeitraumLabel({ zeitraum, id, className }: Props): ReactNode {
  const { from, to } = zeitraum;
  const isSpanningTwoYears = from.getFullYear() < to.getFullYear();

  const formattedFrom = from.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: isSpanningTwoYears ? "numeric" : undefined,
  });

  const formattedTo = to.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const textContent = `Zeitraum: ${formattedFrom} bis ${formattedTo}`;

  return (
    <span id={id} className={className}>
      {textContent}
    </span>
  );
}
