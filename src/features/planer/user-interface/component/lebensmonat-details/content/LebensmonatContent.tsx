import { ReactNode } from "react";
import { HinweisZumBonus } from "./HinweisZumBonus";
import { AbschnittMitEinkommen } from "./abschnitt-mit-einkommen";
import { AbschnittMitAuswahloptionen } from "./abschnitt-mit-auswahloptionen";
import { useInformationenZumLebensmonat } from "@/features/planer/user-interface/component/lebensmonat-details/informationenZumLebensmonat";
import {
  useGridColumn,
  useGridLayout,
  type GridColumnDefinition,
} from "@/features/planer/user-interface/layout/grid-layout";
import { ZeitraumLabel } from "@/features/planer/user-interface/component/ZeitraumLabel";
import {
  AlleElternteileHabenBonusGewaehlt,
  berechneZeitraumFuerLebensmonat,
} from "@/features/planer/user-interface/service";

type Props = {
  readonly zeitraumLabelIdentifier: string;
};

export function LebensmonatContent({
  zeitraumLabelIdentifier,
}: Props): ReactNode {
  const gridLayout = useGridLayout();
  const descriptionArea = useGridColumn(DESCRIPTION_COLUMN_DEFINITION);
  const hinweisZumBonusArea = useGridColumn(
    HINWEIS_ZUM_BONUS_COLUMN_DEFINITION,
  );

  const { lebensmonatszahl, lebensmonat, geburtsdatumDesKindes } =
    useInformationenZumLebensmonat();

  const zeitraum = berechneZeitraumFuerLebensmonat(
    geburtsdatumDesKindes,
    lebensmonatszahl,
  );

  const isBonusHintVisible =
    AlleElternteileHabenBonusGewaehlt.asPredicate(lebensmonat);
  const hasMultipleElternteile = Object.keys(lebensmonat).length > 1;

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

      <AbschnittMitAuswahloptionen />
      <AbschnittMitEinkommen />

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
