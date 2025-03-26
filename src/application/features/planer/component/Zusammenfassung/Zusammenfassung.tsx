import classNames from "classnames";
import { ReactNode } from "react";
import { AbschnittMitPlanungsdetails } from "./AbschnittMitPlanungsdetails";
import { AbschnittMitPlanungsuebersicht } from "./AbschnittMitPlanungsuebersicht";
import { type PlanMitBeliebigenElternteilen } from "@/monatsplaner";

type Props = {
  readonly plan: PlanMitBeliebigenElternteilen;
  readonly className?: string;
};

export function Zusammenfassung({ plan, className }: Props): ReactNode {
  return (
    <div
      className={classNames("flex flex-col gap-y-80 print:gap-y-20", className)}
    >
      <AbschnittMitPlanungsuebersicht plan={plan} />
      <AbschnittMitPlanungsdetails plan={plan} />
    </div>
  );
}
