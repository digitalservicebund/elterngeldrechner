import classNames from "classnames";
import type { ReactNode } from "react";
import type { Bezug } from "./erstellePlanungsuebersicht";
import { Variante, compareVarianten } from "@/features/planer/domain";
import { Geldbetrag } from "@/features/planer/user-interface/component/Geldbetrag";
import { Variantenplakette } from "@/features/planer/user-interface/component/zusammenfassung/Variantenplakette";

type Props = {
  readonly bezuegeProVariante: Record<Variante, Bezug>;
  readonly pseudonymDesElternteils: string | undefined;
};

export function ListeMitBezuegenProVariante({
  bezuegeProVariante,
  pseudonymDesElternteils,
}: Props): ReactNode {
  const ariaLabel =
    "Bezüge pro Elterngeldvariante" +
    (pseudonymDesElternteils ? ` von ${pseudonymDesElternteils}` : "");

  return (
    <ul
      className={classNames(
        "list-none",
        "divide-x-0 divide-y-2 divide-solid divide-off-white",
        "border-x-0 border-y-2 border-solid border-off-white",
      )}
      aria-label={ariaLabel}
    >
      {listeBezuegeAuf(bezuegeProVariante).map(([variante, bezug]) => {
        const { anzahlMonate, elterngeld, bruttoeinkommen } = bezug;

        const optionalesElterngeld = elterngeld > 0 && (
          <Geldbetrag className="font-bold" betrag={elterngeld} />
        );

        const optionalesEinkommen = bruttoeinkommen > 0 && (
          <span>
            &nbsp;+ Einkommen <Geldbetrag betrag={bruttoeinkommen} />
            &nbsp;(brutto)
          </span>
        );

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
