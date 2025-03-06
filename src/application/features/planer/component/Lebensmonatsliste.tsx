import AddIcon from "@digitalservicebund/icons/Add";
import RemoveIcon from "@digitalservicebund/icons/Remove";
import classNames from "classnames";
import {
  type ForwardedRef,
  ReactNode,
  forwardRef,
  useId,
  useRef,
  useState,
} from "react";
import { LebensmonatDetails } from "./lebensmonat-details";
import type {
  BestimmeAuswahlmoeglichkeiten,
  ErstelleUngeplantenLebensmonat,
  ErstelleVorschlaegeFuerAngabeDesEinkommens,
  GebeEinkommenAn,
  WaehleOption,
} from "@/application/features/planer/service/callbackTypes";
import {
  type Ausgangslage,
  type ElternteileByAusgangslage,
  Lebensmonatszahlen,
  type Plan,
} from "@/monatsplaner";
import { findeLetztenVerplantenLebensmonatOrDefault } from "@/monatsplaner/lebensmonate/operation/findeLetztenVerplantenLebensmonatOrDefault";

type Props<A extends Ausgangslage> = {
  readonly plan: Plan<A>;
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
  readonly onOpenLebensmonat?: () => void;
  readonly className?: string;
};

export const Lebensmonatsliste = forwardRef(function Lebensmonatsliste<
  A extends Ausgangslage,
>(
  {
    plan,
    erstelleUngeplantenLebensmonat,
    bestimmeAuswahlmoeglichkeiten,
    waehleOption,
    erstelleVorschlaegeFuerAngabeDesEinkommens,
    gebeEinkommenAn,
    onOpenLebensmonat,
    className,
  }: Props<A>,
  ref?: ForwardedRef<HTMLElement>,
): ReactNode {
  const headingIdentifier = useId();

  const findeLetztenVerplantenLebensmonat =
    findeLetztenVerplantenLebensmonatOrDefault.bind(
      null,
      plan.lebensmonate,
      14,
    );

  const [lastVisibleLebensmonatszahl, setLastVisibleLebensmonatszahl] =
    useState(14);

  const lebensmonatElements = useRef(
    new Map<number, HTMLDetailsElement | null>(),
  );

  const canCollapse =
    lastVisibleLebensmonatszahl >= findeLetztenVerplantenLebensmonat() + 2;

  const collapse = () =>
    setLastVisibleLebensmonatszahl(findeLetztenVerplantenLebensmonat());

  function expand(): void {
    setLastVisibleLebensmonatszahl(findeLetztenVerplantenLebensmonat() + 2);

    const focusIndex = findeLetztenVerplantenLebensmonat() + 1;
    const elementToFocus = lebensmonatElements.current.get(focusIndex);
    if (elementToFocus) {
      setTimeout(() => elementToFocus.focus());
    }
  }

  function triggerOnOpenLebensmonatWhenMatching(event: ToggleEvent): void {
    if (event.newState === "open") {
      onOpenLebensmonat?.();
    }
  }

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
          plan.lebensmonate[lebensmonatszahl] ??
          erstelleUngeplantenLebensmonat(lebensmonatszahl);
        const isHidden = lebensmonatszahl > lastVisibleLebensmonatszahl;

        return (
          <LebensmonatDetails
            key={lebensmonatszahl}
            className={classNames({ hidden: isHidden })}
            ref={(el) => {
              if (el) {
                lebensmonatElements.current.set(lebensmonatszahl, el);
              } else {
                lebensmonatElements.current.delete(lebensmonatszahl);
              }
            }}
            aria-hidden={isHidden}
            ausgangslage={plan.ausgangslage}
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
            onToggle={triggerOnOpenLebensmonatWhenMatching}
          />
        );
      })}

      <button
        type="button"
        className={classNames(
          "border-none bg-white py-10 font-bold text-primary",
        )}
        onClick={canCollapse ? collapse : expand}
      >
        {canCollapse ? (
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
