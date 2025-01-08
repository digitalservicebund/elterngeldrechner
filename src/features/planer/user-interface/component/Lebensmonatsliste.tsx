import AddIcon from "@digitalservicebund/icons/Add";
import RemoveIcon from "@digitalservicebund/icons/Remove";
import classNames from "classnames";
import {
  type ForwardedRef,
  ReactNode,
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
} from "react";
import { LebensmonatDetails } from "./lebensmonat-details";
import {
  type Ausgangslage,
  type ElternteileByAusgangslage,
  type Lebensmonate,
  Lebensmonatszahlen,
  LetzteLebensmonatszahl,
} from "@/features/planer/domain";
import type {
  BestimmeAuswahlmoeglichkeiten,
  ErstelleUngeplantenLebensmonat,
  ErstelleVorschlaegeFuerAngabeDesEinkommens,
  GebeEinkommenAn,
  WaehleOption,
} from "@/features/planer/user-interface/service/callbackTypes";

type Props<A extends Ausgangslage> = {
  readonly ausgangslage: A;
  readonly lebensmonate: Lebensmonate<ElternteileByAusgangslage<A>>;
  readonly erstelleUngeplantenLebensmonat: ErstelleUngeplantenLebensmonat<
    ElternteileByAusgangslage<A>
  >;
  readonly bestimmeAuswahlmoeglichkeiten: BestimmeAuswahlmoeglichkeiten<
    ElternteileByAusgangslage<A>
  >;
  readonly waehleOption: WaehleOption<ElternteileByAusgangslage<A>>;
  readonly erstelleVorschlaegeFuerAngabeDesEinkommens: ErstelleVorschlaegeFuerAngabeDesEinkommens<
    ElternteileByAusgangslage<A>
  >;
  readonly gebeEinkommenAn: GebeEinkommenAn<ElternteileByAusgangslage<A>>;
  readonly className?: string;
};

export const Lebensmonatsliste = forwardRef(function Lebensmonatsliste<
  A extends Ausgangslage,
>(
  {
    ausgangslage,
    lebensmonate,
    erstelleUngeplantenLebensmonat,
    bestimmeAuswahlmoeglichkeiten,
    waehleOption,
    erstelleVorschlaegeFuerAngabeDesEinkommens,
    gebeEinkommenAn,
    className,
  }: Props<A>,
  ref?: ForwardedRef<HTMLElement>,
): ReactNode {
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
      ref={ref}
      className={classNames("flex flex-col", className)}
      aria-labelledby={headingIdentifier}
      tabIndex={-1}
    >
      <h4 id={headingIdentifier} className="sr-only">
        Lebensmonate
      </h4>

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
            ausgangslage={ausgangslage}
            lebensmonatszahl={lebensmonatszahl}
            lebensmonat={lebensmonat}
            bestimmeAuswahlmoeglichkeiten={bestimmeAuswahlmoeglichkeiten.bind(
              null,
              lebensmonatszahl,
            )}
            erstelleVorschlaegeFuerAngabeDesEinkommens={erstelleVorschlaegeFuerAngabeDesEinkommens.bind(
              null,
              lebensmonatszahl,
            )}
            waehleOption={waehleOption.bind(null, lebensmonatszahl)}
            gebeEinkommenAn={gebeEinkommenAn.bind(null, lebensmonatszahl)}
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
}) as <A extends Ausgangslage>(
  props: Props<A> & { ref?: ForwardedRef<HTMLElement> },
) => ReactNode;
