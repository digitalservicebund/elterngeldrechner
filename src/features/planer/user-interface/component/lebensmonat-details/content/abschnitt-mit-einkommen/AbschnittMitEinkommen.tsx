import { ReactNode, useState } from "react";
import classNames from "classnames";
import ToggleOnIcon from "@digitalservicebund/icons/ToggleOn";
import ToggleOffIcon from "@digitalservicebund/icons/ToggleOff";
import { BruttoeinkommenInput } from "./BruttoeinkommenInput";
import { InfoZumEinkommen } from "./InfoZumEinkommen";
import {
  type Lebensmonat,
  type LebensmonatMitBeliebigenElternteilen,
  type Lebensmonatszahl,
  type PseudonymeDerElternteile,
  Elternteil,
  listeMonateAuf,
  Variante,
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

  const mustInputsBeVisible = checkIfInputsMustBeVisible(lebensmonat);
  const [visibilityToggleState, setVisibilityToggleState] = useState(false);
  const areInputsVisible = mustInputsBeVisible || visibilityToggleState;
  function toggleVisibilityState() {
    setVisibilityToggleState(!visibilityToggleState);
  }

  const isSingleElternteil = Object.keys(lebensmonat).length === 1;

  return (
    <div className={classNames("contents", className)}>
      <div
        className="mb-16 mt-32 flex flex-wrap justify-center gap-6"
        style={headingColumn}
      >
        <span className="font-bold">Sie haben in diesem Monat Einkommen?</span>

        <InfoDialog
          ariaLabelForDialog="Informationen zu Einkommen während des Elterngeldbezugs"
          info={<InfoZumEinkommen />}
        />

        <button
          className="flex basis-full items-center justify-center gap-6 border-none bg-[transparent]"
          type="button"
          onClick={toggleVisibilityState}
          aria-expanded={areInputsVisible}
        >
          <ToggleIcon isOn={areInputsVisible} />
          Bruttoeinkommen hinzufügen
        </button>
      </div>

      {!!areInputsVisible && (
        <>
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
            *Sie dürfen in diesem Monat nur maximal 32 Stunden pro Woche
            arbeiten
          </p>
        </>
      )}
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

function checkIfInputsMustBeVisible(
  lebensmonat: LebensmonatMitBeliebigenElternteilen,
): boolean {
  const hasAnyElternteilEinkommen = Object.values(lebensmonat).some(
    (monat) => !!monat.bruttoeinkommen,
  );

  const isBonusSelected = Object.values(lebensmonat).some(
    (monat) => monat.gewaehlteOption === Variante.Bonus,
  );

  return hasAnyElternteilEinkommen || isBonusSelected;
}

function ToggleIcon({ isOn }: { readonly isOn: boolean }) {
  return isOn ? (
    <ToggleOnIcon className="size-40 pt-2" />
  ) : (
    <ToggleOffIcon className="size-40 pt-2" />
  );
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
