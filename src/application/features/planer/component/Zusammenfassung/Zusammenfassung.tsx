import { ReactNode } from "react";
import { AbschnittMitPlanungsdetails } from "./AbschnittMitPlanungsdetails";
import { AbschnittMitPlanungsuebersicht } from "./AbschnittMitPlanungsuebersicht";
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
