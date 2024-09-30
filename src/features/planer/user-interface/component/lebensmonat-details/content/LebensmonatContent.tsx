import { ReactNode } from "react";
import { HinweisZumBonus } from "./HinweisZumBonus";
import { AbschnittMitEinkommen } from "./abschnitt-mit-einkommen";
import { AbschnittMitAuswahloptionen } from "./abschnitt-mit-auswahloptionen";
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

      <AbschnittMitAuswahloptionen
        lebensmonatszahl={lebensmonatszahl}
        lebensmonat={lebensmonat}
        pseudonymeDerElternteile={pseudonymeDerElternteile}
        bestimmeAuswahlmoeglichkeiten={bestimmeAuswahlmoeglichkeiten}
        waehleOption={waehleOption}
      />

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

const DESCRIPTION_COLUMN_DEFINITION: GridColumnDefinition = {
  1: ["left-outside", "right-outside"],
  2: ["et1-outside", "et2-outside"],
};

const HINWEIS_ZUM_BONUS_COLUMN_DEFINITION: GridColumnDefinition = {
  1: ["left-middle", "right-middle"],
  2: ["et1-middle", "et2-middle"],
};
