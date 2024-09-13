import { ReactNode, useCallback, useId, useRef } from "react";
import { KontingentUebersicht } from "./KontingentUebersicht";
import { Lebensmonatsliste } from "./Lebensmonatsliste";
import { KopfleisteMitPseudonymen } from "./KopfleisteMitPseudonymen";
import { Funktionsleiste } from "./Funktionsleiste";
import { Gesamtsummenanzeige } from "./gesamtsummenanzeige";
import type {
  BestimmeAuswahlmoeglichkeiten,
  ErstelleUngeplantenLebensmonat,
  WaehleOption,
} from "@/features/planer/user-interface/service/callbackTypes";
import {
  type Elternteil,
  type Gesamtsumme,
  type Lebensmonate,
  type PseudonymeDerElternteile,
  type VerfuegbaresKontingent,
  type VerplantesKontingent,
} from "@/features/planer/user-interface/service";

type Props<E extends Elternteil> = {
  readonly pseudonymeDerElternteile: PseudonymeDerElternteile<E>;
  readonly geburtsdatumDesKindes: Date;
  readonly lebensmonate: Lebensmonate<E>;
  readonly verfuegbaresKontingent: VerfuegbaresKontingent;
  readonly verplantesKontingent: VerplantesKontingent;
  readonly gesamtsumme: Gesamtsumme<E>;
  readonly erstelleUngeplantenLebensmonat: ErstelleUngeplantenLebensmonat<E>;
  readonly bestimmeAuswahlmoeglichkeiten: BestimmeAuswahlmoeglichkeiten<E>;
  readonly waehleOption: WaehleOption<E>;
  readonly setzePlanZurueck: () => void;
  readonly className?: string;
};

export function Planer<E extends Elternteil>({
  pseudonymeDerElternteile,
  geburtsdatumDesKindes,
  lebensmonate,
  verfuegbaresKontingent,
  verplantesKontingent,
  gesamtsumme,
  erstelleUngeplantenLebensmonat,
  bestimmeAuswahlmoeglichkeiten,
  waehleOption,
  setzePlanZurueck,
  className,
}: Props<E>): ReactNode {
  const headingIdentifier = useId();

  const elementToViewOnPlanungWiederholen = useRef<HTMLDivElement>(null);

  const planungWiederholen = useCallback(() => {
    setzePlanZurueck();
    elementToViewOnPlanungWiederholen.current?.scrollIntoView({
      behavior: "smooth",
    });
    elementToViewOnPlanungWiederholen.current?.focus({ preventScroll: true });
  }, [setzePlanZurueck]);

  const downloadePlan = useCallback(() => window.print(), []);

  return (
    <section className={className} aria-labelledby={headingIdentifier}>
      <h3 id={headingIdentifier} className="sr-only">
        Monatsplaner
      </h3>

      <div
        className="mx-[-15px] flex flex-col divide-x-0 divide-y-2 divide-solid divide-off-white border-2 border-solid border-off-white sm:mx-0"
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
      />
    </section>
  );
}
