import type { ReactNode } from "react";
import type { Zeitraum } from "@/features/planer/domain";
import { ZeitraumLabel } from "@/features/planer/user-interface/component/ZeitraumLabel";

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
