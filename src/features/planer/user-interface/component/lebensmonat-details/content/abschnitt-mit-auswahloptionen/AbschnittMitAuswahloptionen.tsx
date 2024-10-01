import type { ReactNode } from "react";
import { AuswahlEingabe } from "./AuswahlEingabe";
import { useInformationenZumLebensmonat } from "@/features/planer/user-interface/component/lebensmonat-details/informationenZumLebensmonat";
import {
  type Lebensmonatszahl,
  listeMonateAuf,
} from "@/features/planer/user-interface/service";

export function AbschnittMitAuswahloptionen(): ReactNode {
  const {
    lebensmonatszahl,
    lebensmonat,
    pseudonymeDerElternteile,
    bestimmeAuswahlmoeglichkeiten,
    waehleOption,
  } = useInformationenZumLebensmonat();

  const isSingleElternteil = Object.keys(lebensmonat).length === 1;

  return (
    <>
      {listeMonateAuf(lebensmonat, true).map(([elternteil, monat]) => {
        const pseudonym = pseudonymeDerElternteile[elternteil];
        const legend = composeLegendForAuswahl(
          lebensmonatszahl,
          pseudonym,
          isSingleElternteil,
        );
        const auswahlmoeglichkeiten = bestimmeAuswahlmoeglichkeiten(elternteil);

        return (
          <AuswahlEingabe
            key={elternteil}
            legend={legend}
            elternteil={elternteil}
            gewaehlteOption={monat.gewaehlteOption}
            auswahlmoeglichkeiten={auswahlmoeglichkeiten}
            waehleOption={waehleOption.bind(null, elternteil)}
          />
        );
      })}
    </>
  );
}

function composeLegendForAuswahl(
  lebensmonatszahl: Lebensmonatszahl,
  pseudonym: string,
  isSingleElternteil: boolean,
): string {
  return isSingleElternteil
    ? `Auswahl für den ${lebensmonatszahl}. Lebensmonat`
    : `Auswahl von ${pseudonym} für den ${lebensmonatszahl}. Lebensmonat`;
}
