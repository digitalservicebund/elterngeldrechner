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
  readonly bestimmeAuswahlmoeglichkeiten: BestimmeAuswahlmoeglichkeitenFuerLebensmonat<E>;
  readonly waehleOption: WaehleOptionInLebensmonat<E>;
  readonly gridClassNames: GridClassNames<E>;
  readonly identifierForSummaryAriaDescription: string;
};

export function LebensmonatContent<E extends Elternteil>({
  lebensmonatszahl,
  lebensmonat,
  pseudonymeDerElternteile,
  zeitraum,
  bestimmeAuswahlmoeglichkeiten,
  waehleOption,
  gridClassNames,
  identifierForSummaryAriaDescription,
}: Props<E>): ReactNode {
  const isBonusHintVisible =
    AlleElternteileHabenBonusGewaehlt.asPredicate(lebensmonat);

  const hasMultipleElternteile = Object.keys(lebensmonat).length > 0;

  return (
    <div
      className={classNames("px-10 pb-20 pt-8", gridClassNames.template)}
      data-testid="details-content"
    >
      <ZeitraumLabel
        id={identifierForSummaryAriaDescription}
        className={classNames(
          "mb-24 text-center",
          gridClassNames.areas.fullWidth,
        )}
        zeitraum={zeitraum}
        prefix="Zeitraum"
      />

      {listeMonateAuf(lebensmonat, true).map(([elternteil, monat]) => {
        const pseudonym = pseudonymeDerElternteile[elternteil];
        const legend = `Auswahl von ${pseudonym} für den ${lebensmonatszahl}. Lebensmonat`;
        const auswahlmoeglichkeiten = bestimmeAuswahlmoeglichkeiten(elternteil);
        const showDisabledHintRight = elternteil === Elternteil.Zwei;

        return (
          <AuswahlEingabe
            key={elternteil}
            className={gridClassNames.areas[elternteil].auswahl}
            legend={legend}
            auswahlmoeglichkeiten={auswahlmoeglichkeiten}
            gewaehlteOption={monat.gewaehlteOption}
            waehleOption={waehleOption.bind(null, elternteil)}
            showDisabledHintRight={showDisabledHintRight}
          />
        );
      })}

      {!!isBonusHintVisible && (
        <HinweisZumBonus
          className={gridClassNames.areas.fullWidth}
          hasMultipleElternteile={hasMultipleElternteile}
        />
      )}
    </div>
  );
}

type GridClassNames<E extends Elternteil> = {
  template: string;
  areas: { fullWidth: string } & Record<E, GridAreasForElternteil>;
};

type GridAreasForElternteil = { auswahl: string };
