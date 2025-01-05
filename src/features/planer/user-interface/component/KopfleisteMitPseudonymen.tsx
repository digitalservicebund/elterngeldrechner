import PersonIcon from "@digitalservicebund/icons/PersonOutline";
import classNames from "classnames";
import type { ReactNode } from "react";
import {
  type Ausgangslage,
  Elternteil,
  listeElternteileFuerAusgangslageAuf,
} from "@/features/planer/domain";
import {
  type GridColumnDefinitionPerElternteil,
  useGridColumnPerElternteil,
  useGridLayout,
} from "@/features/planer/user-interface/layout/grid-layout";

type Props = {
  readonly ausgangslage: Ausgangslage;
  readonly className?: string;
};

export function KopfleisteMitPseudonymen({
  ausgangslage,
  className,
}: Props): ReactNode {
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
      {listeElternteileFuerAusgangslageAuf(ausgangslage).map((elternteil) => (
        <span
          key={elternteil}
          className="text-center font-bold"
          style={pseudonymColumns[elternteil]}
        >
          <PersonIcon /> {ausgangslage.pseudonymeDerElternteile?.[elternteil]}
        </span>
      ))}
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
