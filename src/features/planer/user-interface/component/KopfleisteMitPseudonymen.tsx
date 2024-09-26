import type { ReactNode } from "react";
import PersonIcon from "@digitalservicebund/icons/PersonOutline";
import classNames from "classnames";
import {
  useGridColumnPerElternteil,
  useGridLayout,
  type GridColumnDefinitionPerElternteil,
} from "@/features/planer/user-interface/layout/grid-layout";
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
  const gridLayout = useGridLayout();
  const pseudonymColumns = useGridColumnPerElternteil(
    PSEUDONYM_COLUMN_DEFINITIONS,
  );

  return (
    <div
      className={classNames("grid", className)}
      style={gridLayout}
      aria-hidden
    >
      {listePseudonymeAuf(pseudonymeDerElternteile, true).map(
        ([elternteil, pseudonym]) => (
          <span
            key={elternteil}
            className="text-center font-bold"
            style={pseudonymColumns[elternteil]}
          >
            <PersonIcon /> {pseudonym}
          </span>
        ),
      )}
    </div>
  );
}

const PSEUDONYM_COLUMN_DEFINITIONS: GridColumnDefinitionPerElternteil = {
  1: {
    [Elternteil.Eins]: ["left-inside", "right-inside"],
  },
  2: {
    [Elternteil.Eins]: "et1-inside",
    [Elternteil.Zwei]: "et2-inside",
  },
};
