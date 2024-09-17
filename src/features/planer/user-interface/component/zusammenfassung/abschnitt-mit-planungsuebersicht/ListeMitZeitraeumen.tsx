import type { ReactNode } from "react";
import { ZeitraumLabel } from "@/features/planer/user-interface/component/ZeitraumLabel";
import type { Zeitraum } from "@/features/planer/user-interface/service";

type Props = {
  readonly zeitraeume: Zeitraum[];
  readonly pseudonymDesElternteils: string;
};

export function ListeMitZeitraeumen({
  zeitraeume,
  pseudonymDesElternteils,
}: Props): ReactNode {
  return (
    <ul
      className="list-none"
      aria-label={`Zeiträume mit Elterngeldbezug von ${pseudonymDesElternteils}`}
    >
      {zeitraeume.map((zeitraum, index) => (
        <ZeitraumLabel key={index} zeitraum={zeitraum} htmlElementType="li" />
      ))}
    </ul>
  );
}
