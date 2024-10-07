import { ReactNode, useCallback, useId, useRef } from "react";
import classNames from "classnames";
import { KontingentUebersicht } from "./KontingentUebersicht";
import { Lebensmonatsliste } from "./Lebensmonatsliste";
import { KopfleisteMitPseudonymen } from "./KopfleisteMitPseudonymen";
import { Funktionsleiste } from "./Funktionsleiste";
import { Gesamtsummenanzeige } from "./gesamtsummenanzeige";
import { Validierungsfehlerbox } from "./Validierungsfehlerbox";
import type {
  BerechneElterngeldbezuegeCallback,
  PlanChangedCallback,
} from "@/features/planer/user-interface/service/callbackTypes";
import { GridLayoutProvider } from "@/features/planer/user-interface/layout/grid-layout";
import {
  usePlanerService,
  type InitialInformation,
} from "@/features/planer/user-interface/service/usePlanerService";

type Props = {
  readonly initialInformation: InitialInformation;
  readonly onPlanChanged: PlanChangedCallback;
  readonly berechneElterngeldbezuege: BerechneElterngeldbezuegeCallback;
  readonly className?: string;
};

export function Planer({
  initialInformation,
  onPlanChanged,
  berechneElterngeldbezuege,
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
    gebeEinkommenAn,
    setzePlanZurueck,
  } = usePlanerService(
    initialInformation,
    onPlanChanged,
    berechneElterngeldbezuege,
  );

  // FIXME: get value from service by Ausgangslage
  const anzahlElternteile = Object.keys(pseudonymeDerElternteile).length as
    | 1
    | 2;

  const headingIdentifier = useId();

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
    <section className={className} aria-labelledby={headingIdentifier}>
      <h2 id={headingIdentifier} className="sr-only">
        Monatsplaner
      </h2>

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
