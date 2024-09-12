import type { ReactNode } from "react";
import PersonIcon from "@digitalservicebund/icons/PersonOutline";
import classNames from "classnames";
import {
  Elternteil,
  listePseudonymeAuf,
  type PseudonymeDerElternteile,
} from "@/features/planer/user-interface/service";

type Props<E extends Elternteil> = {
  readonly pseudonymeDerElternteile: PseudonymeDerElternteile<E>;
  readonly className?: string;
};

export function KopfleisteMitPseudonymen<E extends Elternteil>({
  pseudonymeDerElternteile,
  className,
}: Props<E>): ReactNode {
  return (
    <div className={classNames("flex items-center justify-evenly", className)}>
      {listePseudonymeAuf(pseudonymeDerElternteile)
        .sort(sortByElternteilKey)
        .map(([elternteil, pseudonym]) => (
          <span key={elternteil} className="basis-160 text-center font-bold">
            <PersonIcon /> {pseudonym}
          </span>
        ))}
    </div>
  );
}

function sortByElternteilKey(
  [left]: [Elternteil, any],
  [right]: [Elternteil, any],
): number {
  return ELTERNTEIL_SORT_RANK[left] - ELTERNTEIL_SORT_RANK[right];
}

const ELTERNTEIL_SORT_RANK: Record<Elternteil, number> = {
  [Elternteil.Eins]: 1,
  [Elternteil.Zwei]: 2,
};
