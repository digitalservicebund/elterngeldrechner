import classNames from "classnames";
import { ReactNode, useId } from "react";
import { AuswahloptionLabel } from "./AuswahloptionLabel";
import { InfoDialog } from "@/components/molecules/info-dialog";
import {
  type Auswahlmoeglichkeiten,
  type Auswahloption,
  Auswahloptionen,
  type Elterngeldbezug,
  Elternteil,
  KeinElterngeld,
  Variante,
} from "@/features/planer/domain";
import {
  type GridColumnDefinitionPerElternteil,
  useGridColumnPerElternteil,
} from "@/features/planer/user-interface/layout/grid-layout";

type Props = {
  readonly legend: string;
  readonly elternteil: Elternteil;
  readonly auswahlmoeglichkeiten: Auswahlmoeglichkeiten;
  readonly imMutterschutz: boolean;
  readonly gewaehlteOption?: Auswahloption;
  readonly waehleOption: (option: Auswahloption) => void;
};

export function AuswahlEingabe({
  legend,
  elternteil,
  imMutterschutz,
  gewaehlteOption,
  auswahlmoeglichkeiten,
  waehleOption,
}: Props): ReactNode {
  const fieldsetColumns = useGridColumnPerElternteil(
    FIELDSET_COLUMN_DEFINITION,
  );
  const infoColumns = useGridColumnPerElternteil(INFO_COLUMN_DEFINITIONS);
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
            const { isDisabled, hintWhyDisabled } =
              auswahlmoeglichkeiten[option];
            const infoIdentifier = getInfoIdentifier(
              baseIdentifier,
              option,
              isDisabled,
            );
            const infoAriaLabel = `Informationen wieso ${option} nicht verfügbar ist`;
            const gridRowStart = optionIndex + 1;

            return (
              isDisabled && (
                <InfoDialog
                  key={option}
                  id={infoIdentifier}
                  className={classNames(
                    "min-w-24 self-center justify-self-center",
                    { invisible: !hintWhyDisabled },
                  )}
                  style={{ gridRowStart, ...infoColumns[elternteil] }}
                  ariaLabelForDialog={infoAriaLabel}
                  info={hintWhyDisabled}
                />
              )
            );
          },
        )}

        {Auswahloptionen.sort(sortByAuswahloption).map(
          (option, optionIndex) => {
            const { elterngeldbezug, isDisabled, hintWhyDisabled } =
              auswahlmoeglichkeiten[option];
            const infoIdentifier = getInfoIdentifier(
              baseIdentifier,
              option,
              isDisabled,
            );
            const inputIdentifier = `${baseIdentifier}-input-${option}`;
            const inputDescriptionIdentifier = `${baseIdentifier}-input-description-${option}`;
            const inputAriaLabel = composeAriaLabelForAuswahloption(
              option,
              elterngeldbezug,
            );

            const isChecked = gewaehlteOption === option;
            const waehleDieseOption = () => !isDisabled && waehleOption(option);
            const gridRowStart = optionIndex + 1;

            const istBasisImMutterschutz =
              option === Variante.Basis && imMutterschutz;

            return (
              <div
                key={option}
                className={classNames(
                  "rounded",
                  "outline-2 outline-offset-6 outline-primary focus-within:underline focus-within:outline",
                )}
                style={{ gridRowStart, ...inputColumns[elternteil] }}
              >
                <AuswahloptionLabel
                  option={option}
                  istBasisImMutterschutz={istBasisImMutterschutz}
                  elterngeldbezug={elterngeldbezug}
                  isChecked={isChecked}
                  isDisabled={isDisabled}
                  htmlFor={inputIdentifier}
                />

                <input
                  id={inputIdentifier}
                  type="radio"
                  className="absolute appearance-none opacity-0 focus:border-none focus:outline-none"
                  name={legend}
                  value={option}
                  checked={isChecked}
                  onChange={waehleDieseOption}
                  aria-disabled={isDisabled}
                  aria-label={inputAriaLabel}
                  aria-describedby={inputDescriptionIdentifier}
                  aria-details={infoIdentifier}
                />

                <span
                  id={inputDescriptionIdentifier}
                  className="sr-only"
                  aria-hidden
                >
                  {hintWhyDisabled}
                </span>
              </div>
            );
          },
        )}
      </fieldset>
    </div>
  );
}

function getInfoIdentifier(
  baseIdentifier: string,
  option: Auswahloption,
  isDisabled: boolean,
): string | undefined {
  return isDisabled ? `${baseIdentifier}-info-${option}` : undefined;
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

const INFO_COLUMN_DEFINITIONS: GridColumnDefinitionPerElternteil = {
  1: {
    [Elternteil.Eins]: "right-outside",
  },
  2: {
    [Elternteil.Eins]: "et1-outside",
    [Elternteil.Zwei]: "et2-outside",
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
