import classNames from "classnames";
import { ReactNode, useCallback, useId, useRef } from "react";
import { Funktionsleiste } from "./Funktionsleiste";
import { KontingentUebersicht } from "./KontingentUebersicht";
import { KopfleisteMitPseudonymen } from "./KopfleisteMitPseudonymen";
import { Lebensmonatsliste } from "./Lebensmonatsliste";
import { Validierungsfehlerbox } from "./Validierungsfehlerbox";
import { Gesamtsummenanzeige } from "./gesamtsummenanzeige";
import { Alert } from "@/components/molecules/alert";
import type { BerechneElterngeldbezuegeCallback } from "@/features/planer/domain";
import { Zusammenfassung } from "@/features/planer/user-interface";
import { GridLayoutProvider } from "@/features/planer/user-interface/layout/grid-layout";
import {
  OptionSelectedCallback,
  PlanChangedCallback,
  PlanResettedCallback,
} from "@/features/planer/user-interface/service/callbackTypes";
import {
  type InitialInformation,
  usePlanerService,
} from "@/features/planer/user-interface/service/usePlanerService";

type Props = {
  readonly initialInformation: InitialInformation;
  readonly berechneElterngeldbezuege: BerechneElterngeldbezuegeCallback;
  readonly onPlanChanged: PlanChangedCallback;
  readonly onOptionSelected?: OptionSelectedCallback;
  readonly onPlanResetted?: PlanResettedCallback;
  readonly className?: string;
};

export function Planer({
  initialInformation,
  berechneElterngeldbezuege,
  onPlanChanged,
  onOptionSelected,
  onPlanResetted,
  className,
}: Props): ReactNode {
  const {
    plan,
    validierungsfehler,
    erstelleUngeplantenLebensmonat,
    bestimmeAuswahlmoeglichkeiten,
    waehleOption,
    erstelleVorschlaegeFuerAngabeDesEinkommens,
    gebeEinkommenAn,
    setzePlanZurueck,
  } = usePlanerService(
    initialInformation,
    berechneElterngeldbezuege,
    onPlanChanged,
    onOptionSelected,
    onPlanResetted,
  );
  const headingIdentifier = useId();
  const descriptionIdentifier = useId();

  const lebensmonatslistenElement = useRef<HTMLElement>(null);

  const planungWiederholen = useCallback(() => {
    setzePlanZurueck();
    // Compensate for rendering delay after reset call.
    setTimeout(() =>
      lebensmonatslistenElement.current?.scrollIntoView({
        behavior: "smooth",
      }),
    );
    lebensmonatslistenElement.current?.focus({ preventScroll: true });
  }, [setzePlanZurueck]);

  return (
    <>
      <div className="hidden w-full print:block">
        <Zusammenfassung plan={plan} />
      </div>

      <section
        className={`${className} print:hidden`}
        aria-labelledby={headingIdentifier}
        aria-describedby={descriptionIdentifier}
      >
        <h3 id={headingIdentifier} className="sr-only">
          Planer Anwendung
        </h3>

        <p id={descriptionIdentifier}>
          Mit dem Rechner und Planer können Sie Ihr Elterngeld für jeden Monat
          einzeln planen. Sie können ausprobieren, welche Variante in jedem
          Monat am besten passt, und die Elterngeldvarianten kombinieren. Wenn
          Sie Einkommen haben, können Sie es pro Monat angeben. Mit den Angaben
          bekommen Sie einen Überblick über Ihr voraussichtliches
          Haushaltseinkommen, während Sie Elterngeld beziehen.
        </p>

        <Alert headline="Bitte beachten Sie" className="my-32">
          Sie bekommen Elterngeld in der Höhe, die angegeben ist, ohne dass
          etwas abgezogen wird. Auf das angezeigte Einkommen müssen noch Steuern
          entrichtet werden.
        </Alert>

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
            <KopfleisteMitPseudonymen
              className="py-10"
              ausgangslage={plan.ausgangslage}
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
            />

            <KontingentUebersicht className="bg-off-white py-16" plan={plan} />

            <Gesamtsummenanzeige
              className="border-t-2 border-solid !border-grey bg-off-white py-16"
              plan={plan}
            />
          </div>
        </GridLayoutProvider>

        <Funktionsleiste
          className="my-40"
          planungWiederholen={planungWiederholen}
        />

        <Validierungsfehlerbox validierungsfehler={validierungsfehler} />
      </section>
    </>
  );
}
