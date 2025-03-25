import ToggleOffIcon from "@digitalservicebund/icons/ToggleOff";
import ToggleOnIcon from "@digitalservicebund/icons/ToggleOn";
import { ReactNode, useId, useState } from "react";
import { BruttoeinkommenInput } from "./BruttoeinkommenInput";
import { HinweisZuWochenstunden } from "./HinweisZuWochenstunden";
import { HinweisZumMutterschutz } from "./HinweisZumMutterschutz";
import { InfoZumEinkommen } from "./InfoZumEinkommen";
import { InfoDialog } from "@/application/components";
import { useInformationenZumLebensmonat } from "@/application/features/planer/component/planer/lebensmonatsliste/lebensmonat-details/informationenZumLebensmonat";
import {
  type GridColumnDefinition,
  type GridColumnDefinitionPerElternteil,
  useGridColumn,
  useGridColumnPerElternteil,
} from "@/application/features/planer/layout";
import {
  Elternteil,
  type LebensmonatMitBeliebigenElternteilen,
  type Lebensmonatszahl,
  Variante,
  listeElternteileFuerAusgangslageAuf,
  listeMonateAuf,
} from "@/monatsplaner";

export function AbschnittMitEinkommen(): ReactNode {
  const headingColumn = useGridColumn(HEADING_COLUMN_DEFINITION);
  const bruttoeinkommenColumns = useGridColumnPerElternteil(
    BRUTTOEINKOMMEN_COLUMN_DEFINITIONS,
  );
  const hinweisZuWochenstundenColumn = useGridColumn(
    HINWEIS_ZU_WOCHENSTUNDEN_COLUMN_DEFINITION,
  );

  const {
    ausgangslage,
    lebensmonatszahl,
    lebensmonat,
    erstelleVorschlaegeFuerAngabeDesEinkommens,
    gebeEinkommenAn,
  } = useInformationenZumLebensmonat();

  const mustInputsBeVisible = checkIfInputsMustBeVisible(lebensmonat);
  const [visibilityToggleState, setVisibilityToggleState] = useState(false);
  const areInputsVisible = mustInputsBeVisible || visibilityToggleState;
  function toggleVisibilityState() {
    // Fix rendering issues, especially for "clicked-outside-events".
    setTimeout(() => setVisibilityToggleState(!visibilityToggleState));
  }

  const istLebensmonatMitMutterschutz = listeMonateAuf(lebensmonat).some(
    ([, monat]) => monat.imMutterschutz,
  );

  const hinweisZuWochenstundenIdentifier = useId();

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
          className="flex basis-full items-center justify-center gap-6 border-none bg-transparent text-black"
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
          {listeElternteileFuerAusgangslageAuf(ausgangslage).map(
            (elternteil) => {
              const { imMutterschutz, bruttoeinkommen } =
                lebensmonat[elternteil];

              if (imMutterschutz) {
                return (
                  <HinweisZumMutterschutz
                    key={elternteil}
                    style={bruttoeinkommenColumns[elternteil]}
                  />
                );
              } else {
                const vorschlaege =
                  erstelleVorschlaegeFuerAngabeDesEinkommens(elternteil);
                const ariaLabel = composeAriaLabelForBruttoeinkommen(
                  ausgangslage.pseudonymeDerElternteile?.[elternteil],
                  lebensmonatszahl,
                );

                return (
                  <div
                    key={elternteil}
                    style={bruttoeinkommenColumns[elternteil]}
                  >
                    <BruttoeinkommenInput
                      key={elternteil}
                      bruttoeinkommen={bruttoeinkommen}
                      vorschlaege={vorschlaege}
                      ariaLabel={ariaLabel}
                      ariaDescribedBy={hinweisZuWochenstundenIdentifier}
                      gebeEinkommenAn={gebeEinkommenAn.bind(null, elternteil)}
                    />

                    {!!istLebensmonatMitMutterschutz && (
                      <HinweisZuWochenstunden
                        id={hinweisZuWochenstundenIdentifier}
                      />
                    )}
                  </div>
                );
              }
            },
          )}

          {!istLebensmonatMitMutterschutz && (
            <HinweisZuWochenstunden
              id={hinweisZuWochenstundenIdentifier}
              style={hinweisZuWochenstundenColumn}
            />
          )}
        </>
      )}
    </div>
  );
}

function composeAriaLabelForBruttoeinkommen(
  pseudonym: string | undefined,
  lebensmonatszahl: Lebensmonatszahl,
): string {
  return pseudonym
    ? `Bruttoeinkommen von ${pseudonym} im ${lebensmonatszahl}. Lebensmonat`
    : `Bruttoeinkommen im ${lebensmonatszahl}. Lebensmonat`;
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
