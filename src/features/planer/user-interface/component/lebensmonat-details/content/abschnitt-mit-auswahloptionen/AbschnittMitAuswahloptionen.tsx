import type { ReactNode } from "react";
import { AuswahlEingabe } from "./AuswahlEingabe";
import {
  type Lebensmonat,
  type Lebensmonatszahl,
  type PseudonymeDerElternteile,
  Elternteil,
  listeMonateAuf,
} from "@/features/planer/user-interface/service";
import type {
  BestimmeAuswahlmoeglichkeitenFuerLebensmonat,
  WaehleOptionInLebensmonat,
} from "@/features/planer/user-interface/service/callbackTypes";

type Props<E extends Elternteil> = {
  readonly lebensmonatszahl: Lebensmonatszahl;
  readonly lebensmonat: Lebensmonat<E>;
  readonly pseudonymeDerElternteile: PseudonymeDerElternteile<E>;
  readonly bestimmeAuswahlmoeglichkeiten: BestimmeAuswahlmoeglichkeitenFuerLebensmonat<E>;
  readonly waehleOption: WaehleOptionInLebensmonat<E>;
};

export function AbschnittMitAuswahloptionen<E extends Elternteil>({
  lebensmonatszahl,
  lebensmonat,
  pseudonymeDerElternteile,
  bestimmeAuswahlmoeglichkeiten,
  waehleOption,
}: Props<E>): ReactNode {
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
