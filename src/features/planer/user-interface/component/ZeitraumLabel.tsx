import type { ReactNode } from "react";
import type { Zeitraum } from "@/features/planer/user-interface/service";

type Props = {
  readonly zeitraum: Zeitraum;
  readonly id?: string;
  readonly className?: string;
};

export function ZeitraumLabel({ zeitraum, id, className }: Props): ReactNode {
  const shortVisualLabel = composeShortVisualLabel(zeitraum);
  const longReadOutLabel = composeLongReadOutLabel(zeitraum);

  return (
    <span
      id={id}
      className={className}
      aria-label={longReadOutLabel}
      data-testid="label"
    >
      {shortVisualLabel}
    </span>
  );
}

function composeShortVisualLabel(zeitraum: Zeitraum): string {
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

  return `Zeitraum: ${formattedFrom} bis ${formattedTo}`;
}

function composeLongReadOutLabel(zeitraum: Zeitraum): string {
  const { from, to } = zeitraum;
  const isSpanningTwoYears = from.getFullYear() < to.getFullYear();

  const formattedFrom = from.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: isSpanningTwoYears ? "numeric" : undefined,
  });

  const formattedTo = to.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `Zeitraum vom ${formattedFrom} bis zum ${formattedTo}`;
}
