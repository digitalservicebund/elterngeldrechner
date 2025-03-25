import type { ReactNode } from "react";
import { ZeitraumLabel } from "@/application/features/planer/component/common";
import type { Zeitraum } from "@/lebensmonatrechner";

type Props = {
  readonly zeitraeume: Zeitraum[];
  readonly pseudonymDesElternteils: string | undefined;
};

export function ListeMitZeitraeumen({
  zeitraeume,
  pseudonymDesElternteils,
}: Props): ReactNode {
  const ariaLabel =
    "Zeiträume mit Elterngeldbezug" +
    (pseudonymDesElternteils ? ` von ${pseudonymDesElternteils}` : "");

  return (
    <ul className="list-none" aria-label={ariaLabel}>
      {zeitraeume.map((zeitraum, index) => (
        <ZeitraumLabel key={index} zeitraum={zeitraum} htmlElementType="li" />
      ))}
    </ul>
  );
}
