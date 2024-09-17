import { ReactNode } from "react";
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
  const elternteile = listElternteile(planungsdetails);
  const elternteile = listElternteile(pseudonymeDerElternteile);

  return (
    <div className="@container/planungs-details" data-testid="planungsdetails">
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
    </div>
  );
}

function listElternteile<E extends Elternteil>(
  pseudonymeDerElternteile: PseudonymeDerElternteile<E>,
): E[] {
  return Object.keys(pseudonymeDerElternteile) as E[];
}
