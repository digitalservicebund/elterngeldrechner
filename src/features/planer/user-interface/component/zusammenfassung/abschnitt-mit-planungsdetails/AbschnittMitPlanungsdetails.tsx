import { ReactNode, useId } from "react";
import { TabelleMitLebensmonaten } from "./TabelleMitLebensmonaten";
import {
  type Elternteil,
  type Planungsdetails,
  type PseudonymeDerElternteile,
} from "@/features/planer/user-interface/service";

type Props<E extends Elternteil> = {
  readonly planungsdetails: Planungsdetails<E>;
  readonly pseudonymeDerElternteile: PseudonymeDerElternteile<E>;
  readonly geburtsdatumDesKindes: Date;
};

export function AbschnittMitPlanungsdetails<E extends Elternteil>({
  planungsdetails,
  pseudonymeDerElternteile,
  geburtsdatumDesKindes,
}: Props<E>): ReactNode {
  const headingIdentifier = useId();
  const elternteile = listElternteile(pseudonymeDerElternteile);

  return (
    <section
      className="@container/planungs-details"
      aria-labelledby={headingIdentifier}
    >
      <h4 id={headingIdentifier}>Planung der Monate im Detail</h4>

      <div className="flex flex-col gap-y-32 @2xl/planungs-details:hidden">
        {elternteile.map((elternteil) => (
          <TabelleMitLebensmonaten
            key={elternteil}
            lebensmonate={planungsdetails.geplanteLebensmonate}
            pseudonymeDerElternteile={pseudonymeDerElternteile}
            geburtsdatumDesKindes={geburtsdatumDesKindes}
            elternteileToShow={[elternteil]}
          />
        ))}
      </div>

      <div className="hidden @2xl/planungs-details:block">
        <TabelleMitLebensmonaten
          lebensmonate={planungsdetails.geplanteLebensmonate}
          pseudonymeDerElternteile={pseudonymeDerElternteile}
          geburtsdatumDesKindes={geburtsdatumDesKindes}
          elternteileToShow={elternteile}
        />
      </div>
    </section>
  );
}

function listElternteile<E extends Elternteil>(
  pseudonymeDerElternteile: PseudonymeDerElternteile<E>,
): E[] {
  return Object.keys(pseudonymeDerElternteile) as E[];
}
