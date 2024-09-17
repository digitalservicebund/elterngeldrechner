import classNames from "classnames";
import type { ReactNode } from "react";
import {
  compareVarianten,
  Variante,
  type Bezug,
} from "@/features/planer/user-interface/service";
import { formatAsCurrency } from "@/utils/locale-formatting";

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
        const { shortName, className } =
          RENDER_PROPERTIES[variante as Variante];
        const { anzahlMonate, totalerElterngeldbezug } = bezug;

        return (
          <li key={variante} className="flex items-start gap-24 py-8">
            <span
              className={classNames(
                "flex min-w-[7ch] items-center justify-center rounded px-8 pb-10 pt-6 font-bold leading-[1.444]",
                className,
              )}
            >
              {shortName}
            </span>

            <span>
              {variante} | {anzahlMonate} Monate
              <br />
              <strong>{formatAsCurrency(totalerElterngeldbezug)}</strong>
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

const RENDER_PROPERTIES: Record<Variante, RenderProperties> = {
  [Variante.Basis]: {
    shortName: "Basis",
    className: "bg-Basis text-white",
  },
  [Variante.Plus]: {
    shortName: "Plus",
    className: "bg-Plus text-black",
  },
  [Variante.Bonus]: {
    shortName: "Bonus",
    className: "bg-Bonus text-black",
  },
};

type RenderProperties = {
  shortName: string;
  className: string;
};
