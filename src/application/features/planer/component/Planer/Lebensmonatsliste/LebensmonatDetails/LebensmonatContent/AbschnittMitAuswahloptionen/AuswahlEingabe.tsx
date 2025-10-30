import { ReactNode, useId } from "react";
import { AuswahloptionLabel } from "./AuswahloptionLabel";
import {
  type GridColumnDefinitionPerElternteil,
  useGridColumnPerElternteil,
} from "@/application/features/planer/layout";
import {
  type Auswahlmoeglichkeiten,
  type Auswahloption,
  Auswahloptionen,
  type Elterngeldbezug,
  Elternteil,
  KeinElterngeld,
  Variante,
} from "@/monatsplaner";

type Props = {
  readonly legend: string;
  readonly elternteil: Elternteil;
  readonly auswahlmoeglichkeiten: Auswahlmoeglichkeiten;
  readonly imMutterschutz: boolean;
  readonly bruttoeinkommenIsMissing: boolean;
  readonly gewaehlteOption?: Auswahloption;
  readonly waehleOption: (option: Auswahloption | undefined) => void;
};

export function AuswahlEingabe({
  legend,
  elternteil,
  imMutterschutz,
  bruttoeinkommenIsMissing,
  gewaehlteOption,
  auswahlmoeglichkeiten,
  waehleOption,
}: Props): ReactNode {
  const fieldsetColumns = useGridColumnPerElternteil(
    FIELDSET_COLUMN_DEFINITION,
  );
  const inputColumns = useGridColumnPerElternteil(INPUT_COLUMN_DEFINITIONS);

  const baseIdentifier = useId();

  return (
    <div
      className="grid grid-cols-subgrid gap-y-10"
      style={fieldsetColumns[elternteil]}
    >
      <fieldset className="contents" role="radiogroup">
        <legend className="sr-only">{legend}</legend>

        {Auswahloptionen.sort(sortByAuswahloption).map(
          (option, optionIndex) => {
            const {
              elterngeldbezug,
              istAuswaehlbar,
              grundWiesoNichtAuswaehlbar,
            } = auswahlmoeglichkeiten[option];

            const inputIdentifier = `${baseIdentifier}-input-${option}`;
            const inputDescriptionIdentifier = `${baseIdentifier}-input-description-${option}`;
            const inputAriaLabel = composeAriaLabelForAuswahloption(
              option,
              elterngeldbezug,
            );

            const istAusgewaehlt = gewaehlteOption === option;
            const waehleDieseOption = () =>
              istAuswaehlbar && waehleOption(option);

            const setzeAuswahlZurueckWennBereitsAusgewaehlt = () =>
              istAusgewaehlt && waehleOption(undefined);

            const gridRowStart = optionIndex + 1;

            const istBasisImMutterschutz =
              option === Variante.Basis && imMutterschutz;
            const istBonusWithMissingBruttoeinkommen =
              option === Variante.Bonus &&
              istAusgewaehlt &&
              bruttoeinkommenIsMissing;

            return (
              <div
                key={option}
                className="rounded"
                style={{ gridRowStart, ...inputColumns[elternteil] }}
              >
                <input
                  id={inputIdentifier}
                  type="radio"
                  className="peer absolute appearance-none opacity-0 focus:border-none focus:outline-none"
                  name={legend}
                  value={option}
                  checked={istAusgewaehlt}
                  onChange={waehleDieseOption}
                  onClick={setzeAuswahlZurueckWennBereitsAusgewaehlt}
                  aria-disabled={!istAuswaehlbar}
                  aria-label={inputAriaLabel}
                  aria-describedby={inputDescriptionIdentifier}
                />

                <AuswahloptionLabel
                  option={option}
                  istBasisImMutterschutz={istBasisImMutterschutz}
                  istBonusWithMissingBruttoeinkommen={
                    istBonusWithMissingBruttoeinkommen
                  }
                  elterngeldbezug={elterngeldbezug}
                  istAusgewaehlt={istAusgewaehlt}
                  istAuswaehlbar={istAuswaehlbar}
                  htmlFor={inputIdentifier}
                />

                <span
                  id={inputDescriptionIdentifier}
                  className="sr-only"
                  aria-hidden
                >
                  {grundWiesoNichtAuswaehlbar}
                </span>
              </div>
            );
          },
        )}
      </fieldset>
    </div>
  );
}

function composeAriaLabelForAuswahloption(
  option: Auswahloption,
  elterngeldbezug: Elterngeldbezug,
): string {
  return elterngeldbezug
    ? `${option} mit ${formattiereGeldbetragMitWaehrung(elterngeldbezug)}`
    : option;
}

function formattiereGeldbetragMitWaehrung(betrag: number): string {
  return Math.round(betrag).toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
    currencyDisplay: "symbol",
    maximumFractionDigits: 0,
  });
}

function sortByAuswahloption(
  left: Auswahloption,
  right: Auswahloption,
): number {
  return AUSWAHLOPTION_SORT_RANK[left] - AUSWAHLOPTION_SORT_RANK[right];
}

const AUSWAHLOPTION_SORT_RANK: Record<Auswahloption, number> = {
  [Variante.Basis]: 1,
  [Variante.Plus]: 2,
  [Variante.Bonus]: 3,
  [KeinElterngeld]: 4,
};

const FIELDSET_COLUMN_DEFINITION: GridColumnDefinitionPerElternteil = {
  1: {
    [Elternteil.Eins]: ["left-middle", "right-outside"],
  },
  2: {
    [Elternteil.Eins]: ["et1-outside", "et1-inside"],
    [Elternteil.Zwei]: ["et2-inside", "et2-outside"],
  },
};

const INPUT_COLUMN_DEFINITIONS: GridColumnDefinitionPerElternteil = {
  1: {
    [Elternteil.Eins]: ["left-middle", "right-middle"],
  },
  2: {
    [Elternteil.Eins]: ["et1-middle", "et1-inside"],
    [Elternteil.Zwei]: ["et2-inside", "et2-middle"],
  },
};
