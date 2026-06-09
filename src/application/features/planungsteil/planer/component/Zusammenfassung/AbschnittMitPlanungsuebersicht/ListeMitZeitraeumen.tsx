import type { ReactNode } from "react";
import { ZeitraumLabel } from "@/application/features/planungsteil/planer/component/common";
import type { Zeitraum } from "@/lebensmonatrechner";

type Props = {
  readonly zeitraeume: Zeitraum[];
  readonly nameDesElternteils: string | undefined;
};

export function ListeMitZeitraeumen({
  zeitraeume,
  nameDesElternteils,
}: Props): ReactNode {
  const ariaLabel =
    "Zeiträume mit Elterngeldbezug" +
    (nameDesElternteils ? ` von ${nameDesElternteils}` : "");

  return (
    <ul className="list-none" aria-label={ariaLabel}>
      {zeitraeume.map((zeitraum, index) => (
        <ZeitraumLabel key={index} zeitraum={zeitraum} htmlElementType="li" />
      ))}
    </ul>
  );
}
