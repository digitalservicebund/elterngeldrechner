import RestartAltIcon from "@digitalservicebund/icons/RestartAlt";
import classNames from "classnames";
import { ReactNode, useCallback, useId, useRef } from "react";
import { BeispielAuswahl } from "./BeispielAuswahl";
import { KontingentUebersicht } from "./KontingentUebersicht";
import { Lebensmonatsliste } from "./Lebensmonatsliste";
import { Validierungsfehlerbox } from "./Validierungsfehlerbox";
import { Variantenplakette } from "./Variantenplakette";
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
import {
  type BerechneElterngeldbezuegeCallback,
  Variante,
} from "@/monatsplaner";

type Props = {
  readonly initialInformation: InitialInformation;
  readonly berechneElterngeldbezuege: BerechneElterngeldbezuegeCallback;
  readonly callbacks?: PlanerServiceCallbacks & {
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
  } = callbacks ?? {};

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

        <p>
          Die ersten Schritte sind geschafft! Jetzt berechnen wir Ihr Elterngeld
          und zeigen Ihnen die nächsten Möglichkeiten.
        </p>
        <ul className="mb-16 list-inside list-disc">
          <li>
            Entscheiden Sie, in welchen Lebensmonaten Sie Elterngeld bekommen
            möchten
          </li>
          <li>Verteilen Sie das Elterngeld für sich</li>
          <li>Der Planer zeigt, wie Elterngeld aufgeteilt werden kann</li>
          <li>
            Geben Sie optional zusätzliches Einkommen an, um eine genauere
            Berechnung zu erhalten
          </li>
        </ul>
        <p>Dieses Elterngeld gibt es:</p>
        <div className="rounded bg-off-white p-16">
          <ul className="mb-16 flex flex-wrap gap-x-32 gap-y-16">
            <li className="flex items-center gap-8">
              <span>
                <Variantenplakette variante={Variante.Basis} />
              </span>
              <span className="whitespace-nowrap">= {Variante.Basis}</span>
            </li>
            <li className="flex items-center gap-8">
              <Variantenplakette variante={Variante.Plus} />
              <span className="whitespace-nowrap">= {Variante.Plus}</span>
            </li>
            <li className="flex items-center gap-8">
              <Variantenplakette variante={Variante.Bonus} />
              <span className="whitespace-nowrap">= {Variante.Bonus}</span>
            </li>
          </ul>
          <Button
            buttonStyle="link"
            label="Weitere Informationen wie Elterngeld funktioniert"
            onClick={onOpenErklaerung}
          />
        </div>

        <Button
          className="my-16 print:hidden"
          buttonStyle="link"
          label="Neue leere Planung erstellen"
          iconBefore={<RestartAltIcon />}
          onClick={neueLeerePlanungErstellen}
          disabled={!mindestensEinLebensmonatGeplant}
        />

        <BeispielAuswahl
          className="mb-24 mt-80"
          beschreibungenDerBeispiele={beschreibungenDerBeispiele}
          waehleBeispielAus={waehleBeispielAus}
          istBeispielAusgewaehlt={istBeispielAusgewaehlt}
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
            <KontingentUebersicht className="bg-off-white py-16" plan={plan} />

            <Gesamtsummenanzeige
              className="border-t-2 border-solid !border-grey bg-off-white py-16"
              plan={plan}
            />

            <Lebensmonatsliste
              ref={lebensmonatslistenElement}
              className="py-8"
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
