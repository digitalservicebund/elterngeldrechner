import classNames from "classnames";
import { ReactNode } from "react";
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
  const gesamtsumme = berechneGesamtsumme(plan);
  const showGesamtsumme = gesamtsumme.elterngeldbezug > 0;
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
    >
      {listeElternteileFuerAusgangslageAuf(plan.ausgangslage).map(
        (elternteil) => (
          <ElterngeldFuerElternteil
            key={elternteil}
            pseudonym={plan.ausgangslage.pseudonymeDerElternteile?.[elternteil]}
            summe={gesamtsumme.proElternteil[elternteil]}
            showSumme={showGesamtsumme}
          />
        ),
      )}

      {!!hasMultipleElternteile && !!showGesamtsumme && (
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
    </section>
  );
}
