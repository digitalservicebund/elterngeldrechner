import classNames from "classnames";
import type { ReactNode } from "react";
import { Variantenplakette } from "@/features/planer/user-interface/component/zusammenfassung/Variantenplakette";
import {
  compareVarianten,
  Variante,
  type Bezug,
} from "@/features/planer/user-interface/service";
import { formatAsCurrency } from "@/utils/formatAsCurrency";

type Props = {
  readonly bezuegeProVariante: Record<Variante, Bezug>;
  readonly pseudonymDesElternteils: string;
};

export function ListeMitBezuegenProVariante({
  bezuegeProVariante,
  pseudonymDesElternteils,
}: Props): ReactNode {
  return (
    <ul
      className={classNames(
        "list-none",
        "divide-x-0 divide-y-2 divide-solid divide-off-white",
        "border-x-0 border-y-2 border-solid border-off-white",
      )}
      aria-label={`Bezüge pro Elterngeldvariante von ${pseudonymDesElternteils}`}
    >
      {listeBezuegeAuf(bezuegeProVariante).map(([variante, bezug]) => {
        const { anzahlMonate, elterngeld, bruttoeinkommen } = bezug;

        const optionalesElterngeld =
          elterngeld > 0 ? (
            <span>
              <strong>{formatAsCurrency(elterngeld)}</strong> (netto)
            </span>
          ) : null;

        const optionalesEinkommen =
          bruttoeinkommen > 0 ? (
            <span>
              &nbsp;+ Einkommen {formatAsCurrency(bruttoeinkommen)} (brutto)
            </span>
          ) : null;

        return (
          <li key={variante} className="flex items-center gap-24 py-8">
            <Variantenplakette variante={variante} />

            <span>
              {variante} | {anzahlMonate} Monate
              <br />
              {optionalesElterngeld}
              {optionalesEinkommen}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function listeBezuegeAuf(
  bezuege: Record<Variante, Bezug>,
): [Variante, Bezug][] {
  const unsorted = Object.entries(bezuege) as [Variante, Bezug][];
  return unsorted.sort(([left], [right]) => compareVarianten(left, right));
}
