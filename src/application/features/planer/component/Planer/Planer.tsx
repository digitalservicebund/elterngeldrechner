import RestartAltIcon from "@digitalservicebund/icons/RestartAlt";
import classNames from "classnames";
import {
  ReactNode,
  SyntheticEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Anleitung } from "./Anleitung";
import { Gesamtsummenanzeige } from "./Gesamtsummenanzeige";
import { KontingentUebersicht } from "./KontingentUebersicht";
import { Lebensmonatsliste } from "./Lebensmonatsliste";
import { LebensmonatslisteHTMLElement } from "./Lebensmonatsliste/Lebensmonatsliste";
import { findeLetztenVerplantenLebensmonat } from "./Lebensmonatsliste/findeLetztenVerplantenLebensmonat";
import { Button } from "@/application/components";
import { BeispielAuswahl } from "@/application/features/beispiele/component/BeispielAuswahl";
import {
  type BeispielServiceCallbacks,
  useBeispieleService,
} from "@/application/features/beispiele/hooks";
import { Pruefbuttonbox } from "@/application/features/planer/component/Pruefbutton/Pruefbuttonbox";
import {
  type InitialInformation,
  type PlanerServiceCallbacks,
  usePlanerService,
} from "@/application/features/planer/hooks";
import { GridLayoutProvider } from "@/application/features/planer/layout";
import { Lebensmonatszahl } from "@/lebensmonatrechner/Lebensmonatszahl";
import {
  type Ausgangslage,
  type BerechneElterngeldbezuegeCallback,
} from "@/monatsplaner";

type Props = {
  readonly initialInformation: InitialInformation;
  readonly berechneElterngeldbezuege: BerechneElterngeldbezuegeCallback;
  readonly planInAntragUebernehmen: () => void;
  readonly callbacks: PlanerServiceCallbacks &
    BeispielServiceCallbacks<Ausgangslage> & {
      onOpenLebensmonat?: () => void;
      onOpenErklaerung: () => void;
    };
  readonly className?: string;
};

export function Planer({
  initialInformation,
  berechneElterngeldbezuege,
  callbacks,
  className,
  planInAntragUebernehmen,
}: Props): ReactNode {
  // Intermediate "cache" to resolve mutual parameter dependency between hooks
  const setzeBeispielauswahlZurueckCallback = useRef<() => void>(undefined);

  const {
    onPlanungDrucken,
    onOpenLebensmonat,
    onOpenErklaerung,
    onWaehleBeispielAus,
    onWaehleOption: onWaehleOptionFromProps,
    onSetzePlanZurueck: onSetzePlanZurueckFromProps,
    ...remaingingPlanerServiceCallbacks
  } = callbacks;

  const planerServiceCallbacks = {
    ...remaingingPlanerServiceCallbacks,
    onWaehleOption: fanOut(
      onWaehleOptionFromProps,
      setzeBeispielauswahlZurueckCallback.current,
    ),
    onSetzePlanZurueck: fanOut(
      onSetzePlanZurueckFromProps,
      setzeBeispielauswahlZurueckCallback.current,
    ),
  };

  const {
    plan,
    erstelleUngeplantenLebensmonat,
    bestimmeAuswahlmoeglichkeiten,
    waehleOption,
    erstelleVorschlaegeFuerAngabeDesEinkommens,
    gebeEinkommenAn,
    ergaenzeBruttoeinkommenFuerPartnerschaftsbonus,
    setzePlanZurueck,
    ueberschreibePlan,
    ueberpruefePlanung,
    schalteBonusFrei,
  } = usePlanerService(
    initialInformation,
    berechneElterngeldbezuege,
    planerServiceCallbacks,
  );

  const {
    beschreibungenDerBeispiele,
    waehleBeispielAus,
    istBeispielAusgewaehlt,
    setzeBeispielauswahlZurueck,
  } = useBeispieleService(plan.ausgangslage, ueberschreibePlan, {
    onWaehleBeispielAus,
  });

  setzeBeispielauswahlZurueckCallback.current = setzeBeispielauswahlZurueck;

  const headingIdentifier = useId();

  const lebensmonatslistenElement = useRef<LebensmonatslisteHTMLElement>(null);

  const neueLeerePlanungErstellen = useCallback(() => {
    setzePlanZurueck();
    lebensmonatslistenElement.current?.focus({ preventScroll: true });
  }, [setzePlanZurueck]);

  const mindestensEinLebensmonatGeplant =
    Object.keys(plan.lebensmonate).length > 0;

  const { triggerEffectBySignal: fokusAufLebensmonat } = useEffectWithSignal(
    (lebensmonatszahl: Lebensmonatszahl) =>
      lebensmonatslistenElement.current?.fokusAufLebensmonat(
        lebensmonatszahl - 3,
      ),
  );

  function bonusFreischalten(event: SyntheticEvent) {
    // The click event emitted by the bonus freischalten button
    // triggers both this function and thus the focusOnBonus and
    // the onClickOutside listener resulting in a race condition
    // setting the open state of the LebensmonatDetail to false.
    //
    // The stopPropagation() prevents the onClickOutside listener
    // from beeing triggered.
    event.stopPropagation();

    const nextPlan = schalteBonusFrei();

    const monat = findeLetztenVerplantenLebensmonat(nextPlan.lebensmonate);

    if (monat) {
      fokusAufLebensmonat(monat);
    }
  }

  return (
    <>
      <section
        className={classNames(className, "print:hidden")}
        aria-labelledby={headingIdentifier}
      >
        <h3 id={headingIdentifier} className="sr-only">
          Planer Anwendung
        </h3>

        <Anleitung onOpenErklaerung={onOpenErklaerung} />

        <BeispielAuswahl
          className={classNames(
            "mt-56",
            CLASS_NAME_ERASE_MARGIN_ON_SMALL_SCREENS,
          )}
          beschreibungenDerBeispiele={beschreibungenDerBeispiele}
          waehleBeispielAus={waehleBeispielAus}
          istBeispielAusgewaehlt={istBeispielAusgewaehlt}
        />

        <Button
          className="my-16 print:hidden"
          type="button"
          buttonStyle="link"
          onClick={neueLeerePlanungErstellen}
          disabled={!mindestensEinLebensmonatGeplant}
        >
          <RestartAltIcon /> Neue leere Planung erstellen
        </Button>

        <GridLayoutProvider
          anzahlElternteile={plan.ausgangslage.anzahlElternteile}
        >
          <div
            className={classNames(
              CLASS_NAME_ERASE_MARGIN_ON_SMALL_SCREENS,
              "flex flex-col",
              "divide-x-0 divide-y-2 divide-solid divide-off-white",
              "border-2 border-solid border-off-white",
            )}
          >
            <KontingentUebersicht className="bg-off-white py-10" plan={plan} />

            <Gesamtsummenanzeige
              className="border-t-2 border-solid !border-white bg-off-white py-10"
              plan={plan}
            />

            <div>
              <Lebensmonatsliste
                ref={lebensmonatslistenElement}
                className="py-2"
                plan={plan}
                erstelleUngeplantenLebensmonat={erstelleUngeplantenLebensmonat}
                bestimmeAuswahlmoeglichkeiten={bestimmeAuswahlmoeglichkeiten}
                waehleOption={waehleOption}
                erstelleVorschlaegeFuerAngabeDesEinkommens={
                  erstelleVorschlaegeFuerAngabeDesEinkommens
                }
                gebeEinkommenAn={gebeEinkommenAn}
                ergaenzeBruttoeinkommenFuerPartnerschaftsbonus={
                  ergaenzeBruttoeinkommenFuerPartnerschaftsbonus
                }
                onOpenLebensmonat={onOpenLebensmonat}
              />

              <Pruefbuttonbox
                className="p-16"
                plan={plan}
                ueberpruefePlanung={ueberpruefePlanung}
                planInAntragUebernehmen={planInAntragUebernehmen}
                bonusFreischalten={bonusFreischalten}
                onPlanungDrucken={onPlanungDrucken}
              />
            </div>
          </div>
        </GridLayoutProvider>
      </section>
    </>
  );
}

function fanOut<Parameters extends unknown[]>(
  ...functions: Array<((...parameters: Parameters) => void) | undefined>
): (...parameters: Parameters) => void {
  return (...parameters: Parameters) => {
    functions.forEach((fn) => fn?.(...parameters));
  };
}

//TODO: docs to explan --> Compensate for render delay to possibly create new element (non critical).
function useEffectWithSignal<CallbackArgument>(
  // TODO: Use unique internal symbol for initial state
  effectCallback: (argument: CallbackArgument) => void,
) {
  // Argument can technically be undefined on first render
  const [signal, setSignal] = useState<Signal<CallbackArgument>>({
    nonce: 0,
    argument: undefined,
  });

  useEffect(() => {
    if (signal.argument !== undefined) {
      effectCallback(signal.argument);
    }
  }, [signal, effectCallback]);

  const triggerEffectBySignal = (argument: CallbackArgument) => {
    setSignal({ nonce: signal.nonce + 1, argument });
  };

  return { triggerEffectBySignal };
}

type Signal<T> = { nonce: number; argument: T | undefined };

const CLASS_NAME_ERASE_MARGIN_ON_SMALL_SCREENS = "mx-[-15px] sm:mx-0";
