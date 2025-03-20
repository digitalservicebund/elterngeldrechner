import RestartAltIcon from "@digitalservicebund/icons/RestartAlt";
import classNames from "classnames";
import { ReactNode, useCallback, useId, useRef } from "react";
import { Anleitung } from "./Anleitung";
import { BeispielAuswahl } from "./BeispielAuswahl";
import { KontingentUebersicht } from "./KontingentUebersicht";
import { Lebensmonatsliste } from "./Lebensmonatsliste";
import { Validierungsfehlerbox } from "./Validierungsfehlerbox";
import { Gesamtsummenanzeige } from "./gesamtsummenanzeige";
import { Button, PrintButton } from "@/application/components";
import {
  type Callbacks as PlanerServiceCallbacks,
  type InitialInformation,
  useBeispieleService,
  usePlanerService,
} from "@/application/features/planer/hooks";
import {} from "@/monatsplaner";
import { GridLayoutProvider } from "@/application/features/planer/layout/grid-layout";
import { type BerechneElterngeldbezuegeCallback } from "@/monatsplaner";

type Props = {
  readonly initialInformation: InitialInformation;
  readonly berechneElterngeldbezuege: BerechneElterngeldbezuegeCallback;
  readonly callbacks: PlanerServiceCallbacks & {
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
}: Props): ReactNode {
  // Intermediate "cache" to resolve mutual parameter dependency between hooks
  const setzeBeispielauswahlZurueckCallback = useRef<() => void>();

  const {
    onOpenLebensmonat,
    onOpenErklaerung,
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
    validierungsfehler,
    erstelleUngeplantenLebensmonat,
    bestimmeAuswahlmoeglichkeiten,
    waehleOption,
    erstelleVorschlaegeFuerAngabeDesEinkommens,
    gebeEinkommenAn,
    setzePlanZurueck,
    ueberschreibePlan,
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
  } = useBeispieleService(plan.ausgangslage, ueberschreibePlan);

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
          className="mt-56"
          beschreibungenDerBeispiele={beschreibungenDerBeispiele}
          waehleBeispielAus={waehleBeispielAus}
          istBeispielAusgewaehlt={istBeispielAusgewaehlt}
        />

        <Button
          className="my-16 print:hidden"
          buttonStyle="link"
          label="Neue leere Planung erstellen"
          iconBefore={<RestartAltIcon />}
          onClick={neueLeerePlanungErstellen}
          disabled={!mindestensEinLebensmonatGeplant}
        />

        <GridLayoutProvider
          anzahlElternteile={plan.ausgangslage.anzahlElternteile}
        >
          <div
            className={classNames(
              "mx-[-15px] flex flex-col sm:mx-0",
              "divide-x-0 divide-y-2 divide-solid divide-off-white",
              "border-2 border-solid border-off-white",
            )}
          >
            <KontingentUebersicht className="bg-off-white py-10" plan={plan} />

            <Gesamtsummenanzeige
              className="border-t-2 border-solid !border-white bg-off-white py-10"
              plan={plan}
            />

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
              onOpenLebensmonat={onOpenLebensmonat}
            />

            <div className="p-32">
              <PrintButton />
            </div>
          </div>
        </GridLayoutProvider>

        <Validierungsfehlerbox
          className="mt-40"
          validierungsfehler={validierungsfehler}
        />
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
