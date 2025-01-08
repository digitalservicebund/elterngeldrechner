import { ReactNode } from "react";
import { AbschnittMitPlanungsdetails } from "./abschnitt-mit-planungsdetails";
import { AbschnittMitPlanungsuebersicht } from "./abschnitt-mit-planungsuebersicht";
import {
  type PlanMitBeliebigenElternteilen,
  fassePlanZusammen,
} from "@/features/planer/domain";

type Props = {
  readonly plan: PlanMitBeliebigenElternteilen;
};

export function Zusammenfassung({ plan }: Props): ReactNode {
  const { planungsuebersicht, planungsdetails } = fassePlanZusammen(plan);

  return (
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
  );
}
