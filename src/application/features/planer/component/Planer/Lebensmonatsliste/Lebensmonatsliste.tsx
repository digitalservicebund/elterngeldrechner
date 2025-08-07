import AddIcon from "@digitalservicebund/icons/Add";
import RemoveIcon from "@digitalservicebund/icons/Remove";
import classNames from "classnames";
import {
  type ForwardedRef,
  ReactNode,
  forwardRef,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  LebensmonatDetails,
  LebensmonatDetailsHTMLElement,
} from "./LebensmonatDetails";
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

export interface LebensmonatslisteHTMLElement extends HTMLElement {
  openLebensmonatsSummary: (monat: number) => void;
}

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
  ref?: ForwardedRef<LebensmonatslisteHTMLElement>,
): ReactNode {
  const headingIdentifier = useId();

  const referenceLebensmonate = useRef<
    (LebensmonatDetailsHTMLElement | null)[]
  >([]);

  const referenceLebensmonatsliste = useRef<LebensmonatslisteHTMLElement>(null);

  if (referenceLebensmonate.current.length !== 32) {
    referenceLebensmonate.current = Array.from(
      { length: 32 },
      (_, i) => referenceLebensmonate.current[i] ?? null,
    );
  }

  useImperativeHandle(ref, () => {
    const current = referenceLebensmonatsliste.current;
    if (!current) throw new Error("lebensmonatslisteElement is not mounted");

    const openLebensmonatsSummary = (monat: number) => {
      const index = monat - 1;

      // Compensate for render delay to possibly create new element (non critical).
      setTimeout(() => referenceLebensmonate.current[index]?.openSummary());
    };

    return {
      ...current,
      openLebensmonatsSummary,
    };
  }, [referenceLebensmonate]);

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

  const kannMehrLebensmonateAnzeigen = letzterSichtbarerLebensmonat < 32;

  function zeigeMehrLebensmonateAn(): void {
    setManuellGesetzterLetzterSichtbarerLebensmonat(
      Math.min(letzterSichtbarerLebensmonat + 2, LetzteLebensmonatszahl),
    );
    referenceLebensmonate.current[letzterGeplanterLebensmonat ?? 0]?.focus();
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
      ref={referenceLebensmonatsliste}
      className={classNames("flex flex-col", className)}
      aria-labelledby={headingIdentifier}
      tabIndex={-1}
    >
      <h4 id={headingIdentifier} className="sr-only">
        Lebensmonate
      </h4>

      {Lebensmonatszahlen.filter(
        (lebensmonatszahl) => lebensmonatszahl <= letzterSichtbarerLebensmonat,
      ).map((lebensmonatszahl, index) => {
        const lebensmonat =
          plan.lebensmonate[lebensmonatszahl] ??
          erstelleUngeplantenLebensmonat(lebensmonatszahl);

        return (
          <LebensmonatDetails
            key={lebensmonatszahl}
            ref={(reference) =>
              (referenceLebensmonate.current[index] = reference)
            }
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

      <div className="m-10 mx-80 border border-solid border-off-white"></div>

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
  props: Props<A> & { ref?: ForwardedRef<LebensmonatslisteHTMLElement> },
) => ReactNode;
