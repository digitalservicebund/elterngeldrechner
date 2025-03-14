import classNames from "classnames";
import { ReactNode, useId } from "react";
import { ElterngeldFuerElternteil } from "./ElterngeldFuerElternteil";
import { berechneGesamtsumme } from "./berechneGesamtsumme";
import { Geldbetrag } from "@/application/features/planer/component/Geldbetrag";
import { EinkommenFuerElternteil } from "@/application/features/planer/component/gesamtsummenanzeige/EinkommenFuerElternteil";
import {
  type PlanMitBeliebigenElternteilen,
  listeElternteileFuerAusgangslageAuf,
} from "@/monatsplaner";

type Props = {
  readonly plan: PlanMitBeliebigenElternteilen;
  readonly className?: string;
};

export function Gesamtsummenanzeige({ plan, className }: Props): ReactNode {
  const headingIdentifier = useId();
  const gesamtsumme = berechneGesamtsumme(plan);
  const hasMultipleElternteile = plan.ausgangslage.anzahlElternteile > 1;
  const jemandHatEinkommen = listeElternteileFuerAusgangslageAuf(
    plan.ausgangslage,
  )
    .map((elternteil) => gesamtsumme.proElternteil[elternteil].bruttoeinkommen)
    .reduce((sum, bruttoeinkommen) => sum + (bruttoeinkommen ?? 0), 0);

  return (
    <section
      className={classNames(
        "flex flex-wrap justify-evenly gap-y-16 text-center",
        className,
      )}
      aria-labelledby={headingIdentifier}
    >
      <h4 id={headingIdentifier} className="sr-only">
        Gesamtsumme
      </h4>

      {listeElternteileFuerAusgangslageAuf(plan.ausgangslage).map(
        (elternteil) => (
          <ElterngeldFuerElternteil
            key={elternteil}
            pseudonym={plan.ausgangslage.pseudonymeDerElternteile?.[elternteil]}
            summe={gesamtsumme.proElternteil[elternteil]}
          />
        ),
      )}

      {!!hasMultipleElternteile && (
        <span className="basis-full font-bold">
          Gesamtsumme Elterngeld:{" "}
          <Geldbetrag betrag={gesamtsumme.elterngeldbezug} />
        </span>
      )}

      {!!jemandHatEinkommen &&
        listeElternteileFuerAusgangslageAuf(plan.ausgangslage).map(
          (elternteil) => (
            <EinkommenFuerElternteil
              key={elternteil}
              pseudonym={
                plan.ausgangslage.pseudonymeDerElternteile?.[elternteil]
              }
              summe={gesamtsumme.proElternteil[elternteil]}
            />
          ),
        )}

      <span className="basis-full text-14">
        Hinweis: Mutterschaftsleistungen werden nicht in der Summe
        berücksichtigt.
        <br />
        Sie bekommen Elterngeld in der Höhe, die angegeben ist, ohne dass etwas
        abgezogen wird. Auf das angezeigte Einkommen müssen noch Steuern
        entrichtet werden.
      </span>
    </section>
  );
}
