import { ReactNode } from "react";
import { AbschnittMitPlanungsdetails } from "./abschnitt-mit-planungsdetails";
import { AbschnittMitPlanungsuebersicht } from "./abschnitt-mit-planungsuebersicht";
import { type PlanMitBeliebigenElternteilen } from "@/monatsplaner";

type Props = {
  readonly plan: PlanMitBeliebigenElternteilen;
};

export function Zusammenfassung({ plan }: Props): ReactNode {
  return (
    <div className="flex flex-col gap-y-80 print:gap-y-20">
      <AbschnittMitPlanungsuebersicht plan={plan} />
      <AbschnittMitPlanungsdetails plan={plan} />
    </div>
  );
}
