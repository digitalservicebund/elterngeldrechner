import type { ReactNode } from "react";
import React from "react";
import type { Zeitraum } from "@/features/planer/domain";

type Props = {
  readonly zeitraum: Zeitraum;
  readonly htmlElementType?: keyof React.ReactHTML;
  readonly prefix?: string;
  readonly className?: string;
};

export function ZeitraumLabel({
  zeitraum,
  prefix,
  htmlElementType,
  className,
}: Props): ReactNode {
  return React.createElement(
    htmlElementType ?? "span",
    {
      className,
      ["data-testid"]: "label",
    },
    composeLabel(zeitraum, prefix),
  );
}

function composeLabel(zeitraum: Zeitraum, prefix?: string): string {
  const { from, to } = zeitraum;
  const isSpanningTwoYears = from.getFullYear() < to.getFullYear();

  const formattedFrom = from.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: isSpanningTwoYears ? "numeric" : undefined,
  });

  const formattedTo = to.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const withoutPrefix = `${formattedFrom} bis ${formattedTo}`;
  return prefix ? `${prefix}: ${withoutPrefix}` : withoutPrefix;
}
