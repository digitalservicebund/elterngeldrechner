import PersonIcon from "@digitalservicebund/icons/PersonOutline";
import { ReactNode, useId } from "react";
import { ListeMitBezuegenProVariante } from "./ListeMitBezuegenProVariante";
import { ListeMitZeitraeumen } from "./ListeMitZeitraeumen";
import { erstellePlanungsuebersicht } from "./erstellePlanungsuebersicht";
import {
  type PlanMitBeliebigenElternteilen,
  listeElternteileFuerAusgangslageAuf,
} from "@/features/planer/domain";
import { Geldbetrag } from "@/features/planer/user-interface/component/Geldbetrag";

type Props = {
  readonly plan: PlanMitBeliebigenElternteilen;
};

export function AbschnittMitPlanungsuebersicht({ plan }: Props): ReactNode {
  const headingIdentifier = useId();
  const descriptionIdentifier = useId();
  const planungsuebersicht = erstellePlanungsuebersicht(plan);

  return (
    <section
      className="flex flex-wrap gap-32 *:grow"
      aria-labelledby={headingIdentifier}
      aria-describedby={descriptionIdentifier}
    >
      <h3 id={headingIdentifier} className="sr-only">
        Planungsübersicht
      </h3>

      <p id={descriptionIdentifier} className="basis-full print:hidden">
        Hier finden sie eine Übersicht Ihrer Planung der Elterngeldmonate
      </p>

      {listeElternteileFuerAusgangslageAuf(plan.ausgangslage).map(
        (elternteil) => {
          const {
            zeitraeumeMitDurchgaenigenBezug,
            gesamtbezug,
            bezuegeProVariante,
          } = planungsuebersicht[elternteil];

          const pseudonym =
            plan.ausgangslage.pseudonymeDerElternteile?.[elternteil];

          return (
            <div key={elternteil} className="flex flex-col gap-8">
              <h4 className="text-base">
                <PersonIcon /> {pseudonym || "Ihre Planung"}
              </h4>

              <span>
                {gesamtbezug.anzahlMonate} Monate Elterngeld |{" "}
                <span className="font-bold">
                  insgesamt <Geldbetrag betrag={gesamtbezug.elterngeld} />
                </span>
              </span>

              <div className="mb-auto">
                <span className="text-basis">Elterngeld im Zeitraum:</span>

                <ListeMitZeitraeumen
                  zeitraeume={zeitraeumeMitDurchgaenigenBezug}
                  pseudonymDesElternteils={pseudonym}
                />
              </div>

              <ListeMitBezuegenProVariante
                bezuegeProVariante={bezuegeProVariante}
                pseudonymDesElternteils={pseudonym}
              />
            </div>
          );
        },
      )}
    </section>
  );
}
