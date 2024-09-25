import { ReactNode } from "react";
import classNames from "classnames";
import { AuswahlEingabe } from "./AuswahlEingabe";
import { HinweisZumBonus } from "./HinweisZumBonus";
import type {
  BestimmeAuswahlmoeglichkeitenFuerLebensmonat,
  WaehleOptionInLebensmonat,
} from "@/features/planer/user-interface/service/callbackTypes";
import { ZeitraumLabel } from "@/features/planer/user-interface/component/ZeitraumLabel";
import {
  AlleElternteileHabenBonusGewaehlt,
  Elternteil,
  listeMonateAuf,
  type Lebensmonat,
  type Lebensmonatszahl,
  type PseudonymeDerElternteile,
  type Zeitraum,
} from "@/features/planer/user-interface/service";

type Props<E extends Elternteil> = {
  readonly lebensmonatszahl: Lebensmonatszahl;
  readonly lebensmonat: Lebensmonat<E>;
  readonly pseudonymeDerElternteile: PseudonymeDerElternteile<E>;
  readonly zeitraum: Zeitraum;
  readonly zeitraumLabelIdentifier: string;
  readonly gridLayout: GridLayout<E>;
  readonly bestimmeAuswahlmoeglichkeiten: BestimmeAuswahlmoeglichkeitenFuerLebensmonat<E>;
  readonly waehleOption: WaehleOptionInLebensmonat<E>;
};

export function LebensmonatContent<E extends Elternteil>({
  lebensmonatszahl,
  lebensmonat,
  pseudonymeDerElternteile,
  zeitraum,
  zeitraumLabelIdentifier,
  gridLayout,
  bestimmeAuswahlmoeglichkeiten,
  waehleOption,
}: Props<E>): ReactNode {
  const isBonusHintVisible =
    AlleElternteileHabenBonusGewaehlt.asPredicate(lebensmonat);

  const hasMultipleElternteile = Object.keys(lebensmonat).length > 1;

  return (
    <div
      className={classNames("pb-20 pt-8", gridLayout.templateClassName)}
      data-testid="details-content"
    >
      <div
        className={classNames(
          "mb-24 flex flex-col text-center",
          gridLayout.areaClassNames.description,
        )}
        aria-hidden
      >
        <span>{lebensmonatszahl}. Lebensmonat</span>

        <ZeitraumLabel
          id={zeitraumLabelIdentifier}
          zeitraum={zeitraum}
          prefix="Zeitraum"
        />
      </div>

      {listeMonateAuf(lebensmonat, true).map(([elternteil, monat]) => {
        const pseudonym = pseudonymeDerElternteile[elternteil];
        const legend = composeLegendForAuswahl(
          lebensmonatszahl,
          pseudonym,
          !hasMultipleElternteile,
        );
        const auswahlmoeglichkeiten = bestimmeAuswahlmoeglichkeiten(elternteil);
        const auswahlGridLayout = {
          areaClassNames: gridLayout.areaClassNames[elternteil].auswahl,
        };

        return (
          <AuswahlEingabe
            key={elternteil}
            legend={legend}
            gewaehlteOption={monat.gewaehlteOption}
            auswahlmoeglichkeiten={auswahlmoeglichkeiten}
            gridLayout={auswahlGridLayout}
            waehleOption={waehleOption.bind(null, elternteil)}
          />
        );
      })}

      {!!isBonusHintVisible && (
        <HinweisZumBonus
          className={classNames(
            "mt-24",
            gridLayout.areaClassNames.hinweisZumBonus,
          )}
          hasMultipleElternteile={hasMultipleElternteile}
        />
      )}
    </div>
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

type GridLayout<E extends Elternteil> = {
  templateClassName: string;
  areaClassNames: { description: string; hinweisZumBonus: string } & Record<
    E,
    GridAreasForElternteil
  >;
};

type GridAreasForElternteil = {
  auswahl: {
    fieldset: string;
    info: string;
    input: string;
  };
};
