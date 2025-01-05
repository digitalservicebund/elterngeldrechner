import type { ReactNode } from "react";
import { AuswahlEingabe } from "./AuswahlEingabe";
import {
  type Lebensmonatszahl,
  listeElternteileFuerAusgangslageAuf,
} from "@/features/planer/domain";
import { useInformationenZumLebensmonat } from "@/features/planer/user-interface/component/lebensmonat-details/informationenZumLebensmonat";

export function AbschnittMitAuswahloptionen(): ReactNode {
  const {
    ausgangslage,
    lebensmonatszahl,
    lebensmonat,
    bestimmeAuswahlmoeglichkeiten,
    waehleOption,
  } = useInformationenZumLebensmonat();

  return (
    <>
      {listeElternteileFuerAusgangslageAuf(ausgangslage).map((elternteil) => {
        const pseudonym = ausgangslage.pseudonymeDerElternteile?.[elternteil];
        const legend = composeLegendForAuswahl(lebensmonatszahl, pseudonym);
        const { imMutterschutz, gewaehlteOption } = lebensmonat[elternteil];
        const auswahlmoeglichkeiten = bestimmeAuswahlmoeglichkeiten(elternteil);

        return (
          <AuswahlEingabe
            key={elternteil}
            legend={legend}
            elternteil={elternteil}
            imMutterschutz={imMutterschutz}
            gewaehlteOption={gewaehlteOption}
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
  pseudonym: string | undefined,
): string {
  return pseudonym
    ? `Auswahl von ${pseudonym} für den ${lebensmonatszahl}. Lebensmonat`
    : `Auswahl für den ${lebensmonatszahl}. Lebensmonat`;
}
