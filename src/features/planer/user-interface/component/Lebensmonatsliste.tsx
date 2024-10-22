import { ReactNode, useCallback, useId, useRef, useState } from "react";
import AddIcon from "@digitalservicebund/icons/Add";
import RemoveIcon from "@digitalservicebund/icons/Remove";
import classNames from "classnames";
import { LebensmonatDetails } from "./lebensmonat-details";
import type {
  ErstelleUngeplantenLebensmonat,
  BestimmeAuswahlmoeglichkeiten,
  WaehleOption,
} from "@/features/planer/user-interface/service/callbackTypes";
import {
  Lebensmonatszahlen,
  LetzteLebensmonatszahl,
  type Elternteil,
  type Lebensmonate,
  type PseudonymeDerElternteile,
} from "@/features/planer/user-interface/service";

type Props<E extends Elternteil> = {
  readonly lebensmonate: Lebensmonate<E>;
  readonly pseudonymeDerElternteile: PseudonymeDerElternteile<E>;
  readonly geburtsdatumDesKindes: Date;
  readonly erstelleUngeplantenLebensmonat: ErstelleUngeplantenLebensmonat<E>;
  readonly bestimmeAuswahlmoeglichkeiten: BestimmeAuswahlmoeglichkeiten<E>;
  readonly waehleOption: WaehleOption<E>;
  readonly className?: string;
};

export function Lebensmonatsliste<E extends Elternteil>({
  lebensmonate,
  pseudonymeDerElternteile,
  geburtsdatumDesKindes,
  erstelleUngeplantenLebensmonat,
  bestimmeAuswahlmoeglichkeiten,
  waehleOption,
  className,
}: Props<E>): ReactNode {
  const headingIdentifier = useId();

  const [lastVisibleLebensmonatszahl, setLastVisibleLebensmonatszahl] =
    useState(14);

  const isFinalLebensmonatVisible =
    lastVisibleLebensmonatszahl >= LetzteLebensmonatszahl;

  const fifteenthLebensmonatElement = useRef<HTMLDetailsElement>(null);

  const toggleVisibilityOfFinalLebensmomate = useCallback(() => {
    setLastVisibleLebensmonatszahl((lastVisibleLebensmonatszahl) =>
      lastVisibleLebensmonatszahl < LetzteLebensmonatszahl
        ? LetzteLebensmonatszahl
        : 14,
    );

    // Compensate for render delay to make element visible (non critical).
    setTimeout(() => fifteenthLebensmonatElement.current?.focus());
  }, []);

  return (
    <section
      className={classNames("flex flex-col", className)}
      aria-labelledby={headingIdentifier}
    >
      <h3 id={headingIdentifier} className="sr-only">
        Lebensmonate
      </h3>

      {Lebensmonatszahlen.map((lebensmonatszahl) => {
        const lebensmonat =
          lebensmonate[lebensmonatszahl] ??
          erstelleUngeplantenLebensmonat(lebensmonatszahl);
        const isHidden = lebensmonatszahl > lastVisibleLebensmonatszahl;
        const ref =
          lebensmonatszahl === 15 ? fifteenthLebensmonatElement : undefined;

        return (
          <LebensmonatDetails
            key={lebensmonatszahl}
            className={classNames({ hidden: isHidden })}
            ref={ref}
            aria-hidden={isHidden}
            lebensmonatszahl={lebensmonatszahl}
            lebensmonat={lebensmonat}
            pseudonymeDerElternteile={pseudonymeDerElternteile}
            geburtsdatumDesKindes={geburtsdatumDesKindes}
            bestimmeAuswahlmoeglichkeiten={bestimmeAuswahlmoeglichkeiten.bind(
              null,
              lebensmonatszahl,
            )}
            waehleOption={waehleOption.bind(null, lebensmonatszahl)}
          />
        );
      })}

      <button
        type="button"
        className={classNames(
          "border-none bg-white py-10 font-bold text-primary hover:cursor-s-resize",
          isFinalLebensmonatVisible
            ? "hover:cursor-n-resize"
            : "hover:cursor-s-resize",
        )}
        onClick={toggleVisibilityOfFinalLebensmomate}
      >
        {isFinalLebensmonatVisible ? (
          <>
            <RemoveIcon /> weniger Monate anzeigen
          </>
        ) : (
          <>
            <AddIcon /> mehr Monate anzeigen
          </>
        )}
      </button>
    </section>
  );
}
