import { ReactNode, useCallback, useId, useRef } from "react";
import classNames from "classnames";
import { KontingentUebersicht } from "./KontingentUebersicht";
import { Lebensmonatsliste } from "./Lebensmonatsliste";
import { KopfleisteMitPseudonymen } from "./KopfleisteMitPseudonymen";
import { Funktionsleiste } from "./Funktionsleiste";
import { Gesamtsummenanzeige } from "./gesamtsummenanzeige";
import { Validierungsfehlerbox } from "./Validierungsfehlerbox";
import {
  BerechneElterngeldbezuegeCallback,
  OptionSelectedCallback,
  PlanChangedCallback,
  PlanResettedCallback,
} from "@/features/planer/user-interface/service/callbackTypes";
import { GridLayoutProvider } from "@/features/planer/user-interface/layout/grid-layout";
import {
  usePlanerService,
  type InitialInformation,
} from "@/features/planer/user-interface/service/usePlanerService";
import { Alert } from "@/components/molecules/alert";

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
    pseudonymeDerElternteile,
    geburtsdatumDesKindes,
    lebensmonate,
    verfuegbaresKontingent,
    verplantesKontingent,
    gesamtsumme,
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

  // FIXME: get value from service by Ausgangslage
  const anzahlElternteile = Object.keys(pseudonymeDerElternteile).length as
    | 1
    | 2;

  const headingIdentifier = useId();
  const descriptionIdentifier = useId();

  const elementToViewOnPlanungWiederholen = useRef<HTMLDivElement>(null);

  const planungWiederholen = useCallback(() => {
    setzePlanZurueck();
    elementToViewOnPlanungWiederholen.current?.scrollIntoView({
      behavior: "smooth",
    });
    elementToViewOnPlanungWiederholen.current?.focus({ preventScroll: true });
  }, [setzePlanZurueck]);

  const istPlanGueltig = validierungsfehler.length === 0;

  const downloadePlan = useCallback(() => {
    if (istPlanGueltig) {
      window.print();
    }
  }, [istPlanGueltig]);

  return (
    <section
      className={className}
      aria-labelledby={headingIdentifier}
      aria-describedby={descriptionIdentifier}
    >
      <h2 id={headingIdentifier} className="mb-10">
        Monatsplaner
      </h2>

      <p id={descriptionIdentifier}>
        Mit dem Rechner und Planer können Sie Ihr Elterngeld für jeden Monat
        einzeln planen. Sie können ausprobieren, welche Variante in jedem Monat
        am besten passt, und die Elterngeldvarianten kombinieren. Wenn Sie
        Einkommen haben, können Sie es pro Monat angeben. Mit den Angaben
        bekommen Sie einen Überblick über Ihr voraussichtliches
        Haushaltseinkommen, während Sie Elterngeld beziehen.
      </p>

      <Alert headline="Bitte beachten Sie" className="my-32">
        Sie bekommen Elterngeld in der Höhe, die angegeben ist, ohne dass etwas
        abgezogen wird. Auf das angezeigte Einkommen müssen noch Steuern
        entrichtet werden.
      </Alert>

      <GridLayoutProvider anzahlElternteile={anzahlElternteile}>
        <div
          className={classNames(
            "mx-[-15px] flex flex-col sm:mx-0",
            "divide-x-0 divide-y-2 divide-solid divide-off-white",
            "border-2 border-solid border-off-white",
          )}
          ref={elementToViewOnPlanungWiederholen}
        >
          <KopfleisteMitPseudonymen
            className="py-10"
            pseudonymeDerElternteile={pseudonymeDerElternteile}
          />

          <Lebensmonatsliste
            className="py-8"
            lebensmonate={lebensmonate}
            pseudonymeDerElternteile={pseudonymeDerElternteile}
            geburtsdatumDesKindes={geburtsdatumDesKindes}
            erstelleUngeplantenLebensmonat={erstelleUngeplantenLebensmonat}
            bestimmeAuswahlmoeglichkeiten={bestimmeAuswahlmoeglichkeiten}
            waehleOption={waehleOption}
            erstelleVorschlaegeFuerAngabeDesEinkommens={
              erstelleVorschlaegeFuerAngabeDesEinkommens
            }
            gebeEinkommenAn={gebeEinkommenAn}
          />

          <KontingentUebersicht
            className="bg-off-white py-16"
            verfuegbaresKontingent={verfuegbaresKontingent}
            verplantesKontingent={verplantesKontingent}
          />

          <Gesamtsummenanzeige
            className="border-t-2 border-solid !border-grey bg-off-white py-16"
            pseudonymeDerElternteile={pseudonymeDerElternteile}
            gesamtsumme={gesamtsumme}
          />
        </div>
      </GridLayoutProvider>

      <Funktionsleiste
        className="my-40"
        planungWiederholen={planungWiederholen}
        downloadePlan={downloadePlan}
        isDownloadDisabled={!istPlanGueltig}
      />

      <Validierungsfehlerbox validierungsfehler={validierungsfehler} />
    </section>
  );
}
