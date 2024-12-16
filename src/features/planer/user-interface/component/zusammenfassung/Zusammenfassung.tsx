import { ReactNode, useId } from "react";
import { AbschnittMitPlanungsuebersicht } from "./abschnitt-mit-planungsuebersicht";
import { AbschnittMitPlanungsdetails } from "./abschnitt-mit-planungsdetails";
import {
  fassePlanZusammen,
  PlanMitBeliebigenElternteilen,
} from "@/features/planer/user-interface/service";

type Props = {
  readonly plan: PlanMitBeliebigenElternteilen;
};

export function Zusammenfassung({ plan }: Props): ReactNode {
  const headingIdentifier = useId();
  const { planungsuebersicht, planungsdetails } = fassePlanZusammen(plan);

  return (
    <section aria-labelledby={headingIdentifier}>
      <h2 id={headingIdentifier}>Zusammenfassung</h2>

      <div className="flex flex-col gap-y-80">
        <AbschnittMitPlanungsuebersicht
          planungsuebersicht={planungsuebersicht}
          ausgangslage={plan.ausgangslage}
        />

        <AbschnittMitPlanungsdetails
          planungsdetails={planungsdetails}
          ausgangslage={plan.ausgangslage}
        />
      </div>
    </section>
  );
}
