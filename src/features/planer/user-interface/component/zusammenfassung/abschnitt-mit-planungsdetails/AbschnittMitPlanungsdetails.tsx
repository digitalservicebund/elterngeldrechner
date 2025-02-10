import { ReactNode, useId } from "react";
import { TabelleMitLebensmonaten } from "./TabelleMitLebensmonaten";
import { erstellePlanungsdetails } from "./erstellePlanungsdetails";
import {
  type PlanMitBeliebigenElternteilen,
  listeElternteileFuerAusgangslageAuf,
} from "@/features/planer/domain";

type Props = {
  readonly plan: PlanMitBeliebigenElternteilen;
};

export function AbschnittMitPlanungsdetails({ plan }: Props): ReactNode {
  const headingIdentifier = useId();
  const planungsdetails = erstellePlanungsdetails(plan);
  const elternteile = listeElternteileFuerAusgangslageAuf(plan.ausgangslage);

  return (
    <section
      className="@container/planungs-details print:break-inside-avoid"
      aria-labelledby={headingIdentifier}
    >
      <h3 id={headingIdentifier}>Planung der Monate im Detail</h3>

      <div className="flex flex-col gap-y-32 @2xl/planungs-details:hidden print:hidden">
        {elternteile.map((elternteil) => (
          <TabelleMitLebensmonaten
            key={elternteil}
            ausgangslage={plan.ausgangslage}
            lebensmonate={planungsdetails.geplanteLebensmonate}
            elternteileToShow={[elternteil]}
          />
        ))}
      </div>

      <div className="hidden @2xl/planungs-details:block print:block">
        <TabelleMitLebensmonaten
          ausgangslage={plan.ausgangslage}
          lebensmonate={planungsdetails.geplanteLebensmonate}
          elternteileToShow={elternteile}
        />
      </div>
    </section>
  );
}
