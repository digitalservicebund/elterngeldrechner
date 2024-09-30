import type { ReactNode } from "react";
import classNames from "classnames";
import { BruttoeinkommenInput } from "./BruttoeinkommenInput";
import { InfoZumEinkommen } from "./InfoZumEinkommen";
import {
  type Lebensmonat,
  type Lebensmonatszahl,
  type PseudonymeDerElternteile,
  Elternteil,
  listeMonateAuf,
} from "@/features/planer/user-interface/service";
import {
  type GridColumnDefinition,
  type GridColumnDefinitionPerElternteil,
  useGridColumn,
  useGridColumnPerElternteil,
} from "@/features/planer/user-interface/layout/grid-layout";
import type { GebeEinkommenInLebensmonatAn } from "@/features/planer/user-interface/service/callbackTypes";
import { InfoDialog } from "@/components/molecules/info-dialog";

type Props<E extends Elternteil> = {
  readonly lebensmonatszahl: Lebensmonatszahl;
  readonly lebensmonat: Lebensmonat<E>;
  readonly pseudonymeDerElternteile: PseudonymeDerElternteile<E>;
  readonly gebeEinkommenAn: GebeEinkommenInLebensmonatAn<E>;
  readonly className?: string;
};

export function AbschnittMitEinkommen<E extends Elternteil>({
  lebensmonatszahl,
  lebensmonat,
  pseudonymeDerElternteile,
  gebeEinkommenAn,
  className,
}: Props<E>): ReactNode {
  const headingColumn = useGridColumn(HEADING_COLUMN_DEFINITION);
  const bruttoeinkommenColumns = useGridColumnPerElternteil(
    BRUTTOEINKOMMEN_COLUMN_DEFINITIONS,
  );
  const hinweisZuWochenstundenColumn = useGridColumn(
    HINWEIS_ZU_WOCHENSTUNDEN_COLUMN_DEFINITION,
  );

  const isSingleElternteil = Object.keys(lebensmonat).length === 1;

  return (
    <div className={classNames("contents", className)}>
      <div
        className="mb-16 mt-32 flex justify-center gap-6"
        style={headingColumn}
      >
        <span className="font-bold">Sie haben in diesem Monat einkommen?</span>

        <InfoDialog
          ariaLabelForDialog="Informationen zu Einkommen während des Elterngeldbezugs"
          info={<InfoZumEinkommen />}
        />
      </div>

      {listeMonateAuf(lebensmonat, true).map(([elternteil, monat]) => {
        const ariaLabel = composeAriaLabelForBruttoeinkommen(
          pseudonymeDerElternteile[elternteil],
          lebensmonatszahl,
          isSingleElternteil,
        );

        return (
          <BruttoeinkommenInput
            style={bruttoeinkommenColumns[elternteil]}
            key={elternteil}
            bruttoeinkommen={monat.bruttoeinkommen}
            ariaLabel={ariaLabel}
            gebeEinkommenAn={gebeEinkommenAn.bind(null, elternteil)}
          />
        );
      })}

      <p style={hinweisZuWochenstundenColumn}>
        *Sie dürfen in diesem Monat nur maximal 32 Stunden pro Woche arbeiten
      </p>
    </div>
  );
}

function composeAriaLabelForBruttoeinkommen(
  pseudonym: string,
  lebensmonatszahl: Lebensmonatszahl,
  isSingleElternteil: boolean,
): string {
  return isSingleElternteil
    ? `Bruttoeinkommen im ${lebensmonatszahl}. Lebensmonat`
    : `Bruttoeinkommen von ${pseudonym} im ${lebensmonatszahl}. Lebensmonat`;
}

const HEADING_COLUMN_DEFINITION: GridColumnDefinition = {
  1: ["left-outside", "right-inside"],
  2: ["et1-outside", "et2-outside"],
};

const BRUTTOEINKOMMEN_COLUMN_DEFINITIONS: GridColumnDefinitionPerElternteil = {
  1: {
    [Elternteil.Eins]: ["left-middle", "right-middle"],
  },
  2: {
    [Elternteil.Eins]: ["et1-middle", "et1-inside"],
    [Elternteil.Zwei]: ["et2-inside", "et2-middle"],
  },
};

const HINWEIS_ZU_WOCHENSTUNDEN_COLUMN_DEFINITION: GridColumnDefinition = {
  1: ["left-middle", "right-middle"],
  2: ["et1-middle", "et2-middle"],
};
