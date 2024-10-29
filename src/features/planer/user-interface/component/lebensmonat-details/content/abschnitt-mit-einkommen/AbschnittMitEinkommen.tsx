import { ReactNode, useState } from "react";
import ToggleOnIcon from "@digitalservicebund/icons/ToggleOn";
import ToggleOffIcon from "@digitalservicebund/icons/ToggleOff";
import { BruttoeinkommenInput } from "./BruttoeinkommenInput";
import { InfoZumEinkommen } from "./InfoZumEinkommen";
import { HinweisZumMutterschutz } from "./HinweisZumMutterschutz";
import { HinweisZuWochenstunden } from "./HinweisZuWochenstunden";
import { useInformationenZumLebensmonat } from "@/features/planer/user-interface/component/lebensmonat-details/informationenZumLebensmonat";
import {
  type LebensmonatMitBeliebigenElternteilen,
  type Lebensmonatszahl,
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
import { InfoDialog } from "@/components/molecules/info-dialog";

export function AbschnittMitEinkommen(): ReactNode {
  const headingColumn = useGridColumn(HEADING_COLUMN_DEFINITION);
  const bruttoeinkommenColumns = useGridColumnPerElternteil(
    BRUTTOEINKOMMEN_COLUMN_DEFINITIONS,
  );
  const hinweisZuWochenstundenColumn = useGridColumn(
    HINWEIS_ZU_WOCHENSTUNDEN_COLUMN_DEFINITION,
  );

  const {
    lebensmonatszahl,
    lebensmonat,
    pseudonymeDerElternteile,
    gebeEinkommenAn,
  } = useInformationenZumLebensmonat();

  const mustInputsBeVisible = checkIfInputsMustBeVisible(lebensmonat);
  const [visibilityToggleState, setVisibilityToggleState] = useState(false);
  const areInputsVisible = mustInputsBeVisible || visibilityToggleState;
  function toggleVisibilityState() {
    // Fix rendering issues, especially for "clicked-outside-events".
    setTimeout(() => setVisibilityToggleState(!visibilityToggleState));
  }

  const isSingleElternteil = Object.keys(lebensmonat).length === 1;
  const istLebensmonatMitMutterschutz = Object.values(lebensmonat).some(
    (monat) => monat.imMutterschutz,
  );

  return (
    <div className="contents">
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
          className="flex basis-full items-center justify-center gap-6 border-none bg-[transparent] text-black"
          type="button"
          onClick={toggleVisibilityState}
          aria-expanded={areInputsVisible}
        >
          <ToggleIcon isOn={areInputsVisible} />
          Brutto-Einkommen hinzufügen
        </button>
      </div>

      {!!areInputsVisible && (
        <>
          {listeMonateAuf(lebensmonat, true).map(([elternteil, monat]) => {
            if (monat.imMutterschutz) {
              return (
                <HinweisZumMutterschutz
                  key={elternteil}
                  style={bruttoeinkommenColumns[elternteil]}
                />
              );
            } else {
              const ariaLabel = composeAriaLabelForBruttoeinkommen(
                pseudonymeDerElternteile[elternteil],
                lebensmonatszahl,
                isSingleElternteil,
              );

              return (
                <div
                  key={elternteil}
                  style={bruttoeinkommenColumns[elternteil]}
                >
                  <BruttoeinkommenInput
                    key={elternteil}
                    bruttoeinkommen={monat.bruttoeinkommen}
                    ariaLabel={ariaLabel}
                    gebeEinkommenAn={gebeEinkommenAn.bind(null, elternteil)}
                  />

                  {!!istLebensmonatMitMutterschutz && (
                    <HinweisZuWochenstunden />
                  )}
                </div>
              );
            }
          })}

          {!istLebensmonatMitMutterschutz && (
            <HinweisZuWochenstunden style={hinweisZuWochenstundenColumn} />
          )}
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
    ? `Brutto-Einkommen im ${lebensmonatszahl}. Lebensmonat`
    : `Brutto-Einkommen von ${pseudonym} im ${lebensmonatszahl}. Lebensmonat`;
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
  const className = "size-40 pt-2";
  return isOn ? (
    <ToggleOnIcon className={className} />
  ) : (
    <ToggleOffIcon className={className} />
  );
}

const HEADING_COLUMN_DEFINITION: GridColumnDefinition = {
  1: ["left-outside", "right-outside"],
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
