import type { ReactNode } from "react";
import { AuswahlEingabe } from "./AuswahlEingabe";
import { HinweisFuerNichtAuswaehlbareOptionen } from "./HinweisFuerNichtAuswaehlbareOptionen";
import {
  type BestimmeAuswahlmoeglichkeiten,
  useInformationenZumLebensmonat,
} from "@/application/features/planer/component/Planer/Lebensmonatsliste/LebensmonatDetails/informationenZumLebensmonat";
import {
  type Ausgangslage,
  type Lebensmonatszahl,
  listeElternteileFuerAusgangslageAuf,
} from "@/monatsplaner";

export function AbschnittMitAuswahloptionen(): ReactNode {
  const {
    ausgangslage,
    lebensmonatszahl,
    lebensmonat,
    bestimmeAuswahlmoeglichkeiten,
    waehleOption,
  } = useInformationenZumLebensmonat();

  // TODO: This is super inefficient right now.
  const showHinweis = isAnyAuswahloptionNotSelectable(
    ausgangslage,
    bestimmeAuswahlmoeglichkeiten,
  );

  return (
    <>
      {listeElternteileFuerAusgangslageAuf(ausgangslage).map((elternteil) => {
        const pseudonym = ausgangslage.pseudonymeDerElternteile?.[elternteil];
        const legend = composeLegendForAuswahl(lebensmonatszahl, pseudonym);
        const { imMutterschutz, gewaehlteOption, bruttoeinkommen } =
          lebensmonat[elternteil];
        const auswahlmoeglichkeiten = bestimmeAuswahlmoeglichkeiten(elternteil);
        const bruttoeinkommenIsMissing = !bruttoeinkommen;

        return (
          <AuswahlEingabe
            key={elternteil}
            legend={legend}
            elternteil={elternteil}
            imMutterschutz={imMutterschutz}
            bruttoeinkommenIsMissing={bruttoeinkommenIsMissing}
            gewaehlteOption={gewaehlteOption}
            auswahlmoeglichkeiten={auswahlmoeglichkeiten}
            waehleOption={waehleOption.bind(null, elternteil)}
          />
        );
      })}

      {!!showHinweis && (
        <HinweisFuerNichtAuswaehlbareOptionen className="mt-16" />
      )}
    </>
  );
}

function isAnyAuswahloptionNotSelectable<A extends Ausgangslage>(
  ausgangslage: A,
  bestimmeAuswahlmoeglichkeiten: BestimmeAuswahlmoeglichkeiten<A>,
): boolean {
  return listeElternteileFuerAusgangslageAuf(ausgangslage).some((elternteil) =>
    Object.values(bestimmeAuswahlmoeglichkeiten(elternteil)).some(
      (auswahlmoeglichkeit) => !auswahlmoeglichkeit.istAuswaehlbar,
    ),
  );
}
function composeLegendForAuswahl(
  lebensmonatszahl: Lebensmonatszahl,
  pseudonym: string | undefined,
): string {
  return pseudonym
    ? `Auswahl von ${pseudonym} für den ${lebensmonatszahl}. Lebensmonat`
    : `Auswahl für den ${lebensmonatszahl}. Lebensmonat`;
}
