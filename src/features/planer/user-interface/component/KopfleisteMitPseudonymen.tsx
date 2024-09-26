import type { ReactNode } from "react";
import PersonIcon from "@digitalservicebund/icons/PersonOutline";
import classNames from "classnames";
import {
  GRID_LAYOUT_KOPFLEISTE_AREA_CLASS_NAMES,
  GRID_LAYOUT_TEMPLATES,
} from "./grid-styling";
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
  const anzahlElternteile = Object.keys(pseudonymeDerElternteile).length;
  const gridLayoutTemplateClassName = GRID_LAYOUT_TEMPLATES[anzahlElternteile];

  return (
    <div
      className={classNames("grid", gridLayoutTemplateClassName, className)}
      aria-hidden
    >
      {listePseudonymeAuf(pseudonymeDerElternteile, true).map(
        ([elternteil, pseudonym]) => (
          <span
            key={elternteil}
            className={classNames(
              "text-center font-bold",
              GRID_LAYOUT_KOPFLEISTE_AREA_CLASS_NAMES[elternteil].pseudonym,
            )}
          >
            <PersonIcon /> {pseudonym}
          </span>
        ),
      )}
    </div>
  );
}
