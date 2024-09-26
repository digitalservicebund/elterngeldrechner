import { ReactNode, useCallback, useId, useRef } from "react";
import classNames from "classnames";
import { KontingentUebersicht } from "./KontingentUebersicht";
import { Lebensmonatsliste } from "./Lebensmonatsliste";
import { KopfleisteMitPseudonymen } from "./KopfleisteMitPseudonymen";
import { Funktionsleiste } from "./Funktionsleiste";
import { Gesamtsummenanzeige } from "./gesamtsummenanzeige";
import { Validierungsfehlerbox } from "./Validierungsfehlerbox";
import { usePlanerService } from "@/features/planer/user-interface/service/usePlanerService";
import { type PlanMitBeliebigenElternteilen } from "@/features/planer/user-interface/service";

type Props = {
  readonly initialPlan: PlanMitBeliebigenElternteilen | undefined;
  readonly onPlanChanged: (
    plan: PlanMitBeliebigenElternteilen | undefined,
  ) => void;
  readonly className?: string;
};

export function Planer({
  initialPlan,
  onPlanChanged,
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
    setzePlanZurueck,
  } = usePlanerService(initialPlan, onPlanChanged);

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
    istPlanGueltig && window.print();
  }, [istPlanGueltig]);

  return (
    <section className={className} aria-labelledby={headingIdentifier}>
      <h3 id={headingIdentifier} className="sr-only">
        Monatsplaner
      </h3>

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
