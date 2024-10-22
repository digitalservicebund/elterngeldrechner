import { ReactNode, useId } from "react";
import PersonIcon from "@digitalservicebund/icons/PersonOutline";
import { ListeMitBezuegenProVariante } from "./ListeMitBezuegenProVariante";
import { ListeMitZeitraeumen } from "./ListeMitZeitraeumen";
import {
  Elternteil,
  listePseudonymeAuf,
  type Planungsuebersicht,
  type PseudonymeDerElternteile,
} from "@/features/planer/user-interface/service";
import { formatAsCurrency } from "@/utils/formatAsCurrency";

type Props<E extends Elternteil> = {
  readonly planungsuebersicht: Planungsuebersicht<E>;
  readonly pseudonymeDerElternteile: PseudonymeDerElternteile<E>;
};

export function AbschnittMitPlanungsuebersicht<E extends Elternteil>({
  planungsuebersicht,
  pseudonymeDerElternteile,
}: Props<E>): ReactNode {
  const headingIdentifier = useId();
  const descriptionIdentifier = useId();

  return (
    <section
      className="flex flex-wrap gap-16 *:grow"
      aria-labelledby={headingIdentifier}
      aria-describedby={descriptionIdentifier}
    >
      <h3 id={headingIdentifier} className="sr-only">
        Planungsübersicht
      </h3>

      <p id={descriptionIdentifier} className="basis-full">
        Hier finden sie eine Übersicht Ihrer Planung der Elterngeldmonate
      </p>

      {listePseudonymeAuf(pseudonymeDerElternteile, true).map(
        ([elternteil, pseudonym]) => {
          const {
            zeitraeumeMitDurchgaenigenBezug,
            gesamtbezug,
            bezuegeProVariante,
          } = planungsuebersicht[elternteil];

          return (
            <div key={elternteil} className="flex flex-col gap-8">
              <h4 className="text-base">
                <PersonIcon /> {pseudonym}
              </h4>

              <span>
                {gesamtbezug.anzahlMonate} Monate Elterngeld |{" "}
                <span className="font-bold">
                  insgesamt{" "}
                  {formatAsCurrency(gesamtbezug.totalerElterngeldbezug)}
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
