import RestartAltIcon from "@digitalservicebund/icons/RestartAlt";
import classNames from "classnames";
import { ReactNode, useCallback, useId, useRef } from "react";
import { Anleitung } from "./Anleitung";
import { Gesamtsummenanzeige } from "./Gesamtsummenanzeige";
import { KontingentUebersicht } from "./KontingentUebersicht";
import { Lebensmonatsliste } from "./Lebensmonatsliste";
import { Pruefbuttonbox } from "./Pruefbuttonbox";
import { Button } from "@/application/components";
import { BeispielAuswahl } from "@/application/features/beispiele/component/BeispielAuswahl";
import {
  type BeispielServiceCallbacks,
  useBeispieleService,
} from "@/application/features/beispiele/hooks";
import {
  type InitialInformation,
  type PlanerServiceCallbacks,
  usePlanerService,
} from "@/application/features/planer/hooks";
import { GridLayoutProvider } from "@/application/features/planer/layout";
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

  const lebensmonatslistenElement = useRef<HTMLElement>(null);

  const neueLeerePlanungErstellen = useCallback(() => {
    setzePlanZurueck();
    lebensmonatslistenElement.current?.focus({ preventScroll: true });
  }, [setzePlanZurueck]);

  const mindestensEinLebensmonatGeplant =
    Object.keys(plan.lebensmonate).length > 0;

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
                bonusFreischalten={schalteBonusFrei}
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

const CLASS_NAME_ERASE_MARGIN_ON_SMALL_SCREENS = "mx-[-15px] sm:mx-0";
