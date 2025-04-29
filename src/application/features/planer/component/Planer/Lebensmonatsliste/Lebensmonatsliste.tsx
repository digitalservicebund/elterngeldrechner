import AddIcon from "@digitalservicebund/icons/Add";
import RemoveIcon from "@digitalservicebund/icons/Remove";
import classNames from "classnames";
import {
  type ForwardedRef,
  ReactNode,
  forwardRef,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { LebensmonatDetails } from "./LebensmonatDetails";
import { findeLetztenVerplantenLebensmonat } from "./findeLetztenVerplantenLebensmonat";
import {
  type Ausgangslage,
  type Auswahlmoeglichkeiten,
  type Auswahloption,
  type ElternteileByAusgangslage,
  type Lebensmonat,
  type Lebensmonatszahl,
  Lebensmonatszahlen,
  LetzteLebensmonatszahl,
  type Plan,
} from "@/monatsplaner";

type Props<A extends Ausgangslage> = {
  readonly plan: Plan<A>;

  readonly erstelleUngeplantenLebensmonat: (
    lebensmonatszahl: Lebensmonatszahl,
  ) => Lebensmonat<ElternteileByAusgangslage<A>>;

  readonly bestimmeAuswahlmoeglichkeiten: (
    lebensmonatszahl: Lebensmonatszahl,
    elternteil: ElternteileByAusgangslage<A>,
  ) => Auswahlmoeglichkeiten;

  readonly waehleOption: (
    lebensmonatszahl: Lebensmonatszahl,
    elternteil: ElternteileByAusgangslage<A>,
    option: Auswahloption | undefined,
  ) => void;

  readonly erstelleVorschlaegeFuerAngabeDesEinkommens: (
    lebensmonatszahl: Lebensmonatszahl,
    elternteil: ElternteileByAusgangslage<A>,
  ) => number[];

  readonly gebeEinkommenAn: (
    lebensmonatszahl: Lebensmonatszahl,
    elternteil: ElternteileByAusgangslage<A>,
    bruttoeinkommen: number,
  ) => void;

  readonly ergaenzeBruttoeinkommenFuerPartnerschaftsbonus: () => void;
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
    ergaenzeBruttoeinkommenFuerPartnerschaftsbonus,
    onOpenLebensmonat,
    className,
  }: Props<A>,
  ref?: ForwardedRef<HTMLElement>,
): ReactNode {
  const headingIdentifier = useId();

  const letzterGeplanterLebensmonat = useMemo(
    () => findeLetztenVerplantenLebensmonat(plan.lebensmonate),
    [plan.lebensmonate],
  );

  const [
    manuellGesetzterLetzterSichtbarerLebensmonat,
    setManuellGesetzterLetzterSichtbarerLebensmonat,
  ] = useState(14);

  const letzterSichtbarerLebensmonat = Math.max(
    letzterGeplanterLebensmonat ?? 0,
    manuellGesetzterLetzterSichtbarerLebensmonat,
  );

  const naechsterZuPlanenderLebensmonat = useRef<HTMLDetailsElement>(null);
  const kannMehrLebensmonateAnzeigen = letzterSichtbarerLebensmonat < 32;

  function zeigeMehrLebensmonateAn(): void {
    setManuellGesetzterLetzterSichtbarerLebensmonat(
      Math.min(letzterSichtbarerLebensmonat + 2, LetzteLebensmonatszahl),
    );
    naechsterZuPlanenderLebensmonat.current?.focus();
  }

  function zeigeWenigerMonateAn(): void {
    setManuellGesetzterLetzterSichtbarerLebensmonat(
      Math.max(letzterGeplanterLebensmonat ?? 0, 14),
    );
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

      {Lebensmonatszahlen.filter(
        (lebensmonatszahl) => lebensmonatszahl <= letzterSichtbarerLebensmonat,
      ).map((lebensmonatszahl) => {
        const lebensmonat =
          plan.lebensmonate[lebensmonatszahl] ??
          erstelleUngeplantenLebensmonat(lebensmonatszahl);

        const istNaechsterZuPlanenderLebensmonat =
          lebensmonatszahl === (letzterGeplanterLebensmonat ?? 0) + 1;

        const reference = istNaechsterZuPlanenderLebensmonat
          ? naechsterZuPlanenderLebensmonat
          : undefined;

        return (
          <LebensmonatDetails
            key={lebensmonatszahl}
            ref={reference}
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
            ergaenzeBruttoeinkommenFuerPartnerschaftsbonus={
              ergaenzeBruttoeinkommenFuerPartnerschaftsbonus
            }
            onToggle={triggerOnOpenLebensmonatWhenMatching}
          />
        );
      })}

      <button
        type="button"
        className={classNames(
          "border-none bg-white py-10 font-bold text-primary",
        )}
        onClick={
          kannMehrLebensmonateAnzeigen
            ? zeigeMehrLebensmonateAn
            : zeigeWenigerMonateAn
        }
      >
        {kannMehrLebensmonateAnzeigen ? (
          <>
            <AddIcon /> mehr Monate anzeigen
          </>
        ) : (
          <>
            <RemoveIcon /> weniger Monate anzeigen
          </>
        )}
      </button>
    </section>
  );
}) as <A extends Ausgangslage>(
  props: Props<A> & { ref?: ForwardedRef<HTMLElement> },
) => ReactNode;
