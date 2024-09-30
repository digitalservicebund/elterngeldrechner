import { ReactNode } from "react";
import { AuswahlEingabe } from "./AuswahlEingabe";
import { HinweisZumBonus } from "./HinweisZumBonus";
import { AbschnittMitEinkommen } from "./abschnitt-mit-einkommen/AbschnittMitEinkommen";
import {
  useGridColumn,
  useGridLayout,
  type GridColumnDefinition,
} from "@/features/planer/user-interface/layout/grid-layout";
import type {
  BestimmeAuswahlmoeglichkeitenFuerLebensmonat,
  GebeEinkommenInLebensmonatAn,
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
  readonly bestimmeAuswahlmoeglichkeiten: BestimmeAuswahlmoeglichkeitenFuerLebensmonat<E>;
  readonly waehleOption: WaehleOptionInLebensmonat<E>;
  readonly gebeEinkommenAn: GebeEinkommenInLebensmonatAn<E>;
};

export function LebensmonatContent<E extends Elternteil>({
  lebensmonatszahl,
  lebensmonat,
  pseudonymeDerElternteile,
  zeitraum,
  zeitraumLabelIdentifier,
  bestimmeAuswahlmoeglichkeiten,
  waehleOption,
  gebeEinkommenAn,
}: Props<E>): ReactNode {
  const gridLayout = useGridLayout();
  const descriptionArea = useGridColumn(DESCRIPTION_COLUMN_DEFINITION);
  const hinweisZumBonusArea = useGridColumn(
    HINWEIS_ZUM_BONUS_COLUMN_DEFINITION,
  );

  const hasMultipleElternteile = Object.keys(lebensmonat).length > 1;

  const isBonusHintVisible =
    AlleElternteileHabenBonusGewaehlt.asPredicate(lebensmonat);

  return (
    <div
      className="pb-20 pt-8"
      style={gridLayout}
      data-testid="details-content"
    >
      <div
        className="mb-24 flex flex-col text-center"
        style={descriptionArea}
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

      <AbschnittMitEinkommen
        lebensmonatszahl={lebensmonatszahl}
        lebensmonat={lebensmonat}
        pseudonymeDerElternteile={pseudonymeDerElternteile}
        gebeEinkommenAn={gebeEinkommenAn}
      />

      {!!isBonusHintVisible && (
        <HinweisZumBonus
          className="mt-24"
          style={hinweisZumBonusArea}
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

const DESCRIPTION_COLUMN_DEFINITION: GridColumnDefinition = {
  1: ["left-outside", "right-outside"],
  2: ["et1-outside", "et2-outside"],
};

const HINWEIS_ZUM_BONUS_COLUMN_DEFINITION: GridColumnDefinition = {
  1: ["left-middle", "right-middle"],
  2: ["et1-middle", "et2-middle"],
};
