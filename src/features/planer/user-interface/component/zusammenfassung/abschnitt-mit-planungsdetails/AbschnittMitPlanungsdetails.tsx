import { ReactNode, useId } from "react";
import { TabelleMitLebensmonaten } from "./TabelleMitLebensmonaten";
import { type Planungsdetails } from "@/features/planer/user-interface/service";
import {
  type Ausgangslage,
  type ElternteileByAusgangslage,
  listeElternteileFuerAusgangslageAuf,
} from "@/features/planer/domain";

type Props<A extends Ausgangslage> = {
  readonly ausgangslage: A;
  readonly planungsdetails: Planungsdetails<ElternteileByAusgangslage<A>>;
};

export function AbschnittMitPlanungsdetails<A extends Ausgangslage>({
  planungsdetails,
  ausgangslage,
}: Props<A>): ReactNode {
  const headingIdentifier = useId();
  const elternteile = listeElternteileFuerAusgangslageAuf(ausgangslage);

  return (
    <section
      className="@container/planungs-details"
      aria-labelledby={headingIdentifier}
    >
      <h3 id={headingIdentifier}>Planung der Monate im Detail</h3>

      <div className="flex flex-col gap-y-32 @2xl/planungs-details:hidden">
        {elternteile.map((elternteil) => (
          <TabelleMitLebensmonaten
            key={elternteil}
            ausgangslage={ausgangslage}
            lebensmonate={planungsdetails.geplanteLebensmonate}
            elternteileToShow={[elternteil]}
          />
        ))}
      </div>

      <div className="hidden @2xl/planungs-details:block">
        <TabelleMitLebensmonaten
          ausgangslage={ausgangslage}
          lebensmonate={planungsdetails.geplanteLebensmonate}
          elternteileToShow={elternteile}
        />
      </div>
    </section>
  );
}
