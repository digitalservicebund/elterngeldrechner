import type { ReactNode } from "react";
import React from "react";
import type { Zeitraum } from "@/features/planer/user-interface/service";

type Props = {
  readonly zeitraum: Zeitraum;
  readonly htmlElementType?: keyof React.ReactHTML;
  readonly prefix?: string;
  readonly id?: string;
  readonly className?: string;
};

export function ZeitraumLabel({
  zeitraum,
  prefix,
  htmlElementType,
  id,
  className,
}: Props): ReactNode {
  const shortVisualLabel = composeShortVisualLabel(zeitraum, prefix);
  const longReadOutLabel = composeLongReadOutLabel(zeitraum, prefix);

  return React.createElement(
    htmlElementType ?? "span",
    {
      id,
      className,
      ["aria-label"]: longReadOutLabel,
      ["data-testid"]: "label",
    },
    shortVisualLabel,
  );
}

function composeShortVisualLabel(zeitraum: Zeitraum, prefix?: string): string {
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

function composeLongReadOutLabel(zeitraum: Zeitraum, prefix?: string): string {
  const { from, to } = zeitraum;
  const isSpanningTwoYears = from.getFullYear() < to.getFullYear();

  const formattedFrom = from.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: isSpanningTwoYears ? "numeric" : undefined,
  });

  const formattedTo = to.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const withoutPrefix = `vom ${formattedFrom} bis zum ${formattedTo}`;
  return prefix ? `${prefix} ${withoutPrefix}` : withoutPrefix;
}
