import { Fragment, ReactNode, useId } from "react";
import classNames from "classnames";
import { AuswahloptionLabel } from "./AuswahloptionLabel";
import { formatAsCurrency } from "@/utils/formatAsCurrency";
import {
  KeinElterngeld,
  Variante,
  type Auswahlmoeglichkeiten,
  type Auswahloption,
  Auswahloptionen,
  type Elterngeldbezug,
} from "@/features/planer/user-interface/service";
import { InfoDialog } from "@/components/molecules/info-dialog";

type Props = {
  readonly legend: string;
  readonly auswahlmoeglichkeiten: Auswahlmoeglichkeiten;
  readonly gewaehlteOption?: Auswahloption;
  readonly gridLayout: GridLayout;
  readonly waehleOption: (option: Auswahloption) => void;
};

export function AuswahlEingabe({
  legend,
  gewaehlteOption,
  auswahlmoeglichkeiten,
  gridLayout,
  waehleOption,
}: Props): ReactNode {
  const baseIdentifier = useId();

  return (
    <fieldset
      className={classNames(
        "grid grid-cols-subgrid gap-y-10",
        gridLayout.areaClassNames.fieldset,
      )}
      role="radiogroup"
    >
      <legend className="sr-only">{legend}</legend>

      {Auswahloptionen.sort(sortByAuswahloption).map((option, optionIndex) => {
        const { elterngeldbezug, isDisabled, hintWhyDisabled } =
          auswahlmoeglichkeiten[option];

        const infoIdentifier = `${baseIdentifier}-info-${option}`;
        const infoAriaLabel = `Informationen wieso ${option} nicht verfügbar ist`;

        const inputIdentifier = `${baseIdentifier}-input-${option}`;
        const inputDescriptionIdentifier = `${baseIdentifier}-input-description-${option}`;
        const inputAriaLabel = composeAriaLabelForAuswahloption(
          option,
          elterngeldbezug,
        );

        const isChecked = gewaehlteOption === option;
        const waehleDieseOption = () => !isDisabled && waehleOption(option);

        const gridRowStart = gridLayout.firstRowIndex + optionIndex;

        return (
          <Fragment key={option}>
            <InfoDialog
              id={infoIdentifier}
              className={classNames(
                "min-w-24 self-center justify-self-center",
                gridLayout.areaClassNames.info,
                {
                  invisible: !hintWhyDisabled,
                },
              )}
              style={{ gridRowStart }}
              ariaLabelForDialog={infoAriaLabel}
              info={hintWhyDisabled}
            />

            <div
              className={classNames(
                "rounded",
                "outline-2 outline-offset-6 outline-primary focus-within:underline focus-within:outline",
                gridLayout.areaClassNames.input,
              )}
              style={{ gridRowStart }}
            >
              <AuswahloptionLabel
                option={option}
                elterngeldbezug={elterngeldbezug}
                isChecked={isChecked}
                isDisabled={isDisabled}
                hintWhyDisabled={hintWhyDisabled}
                htmlFor={inputIdentifier}
                inputDescriptionIdentifier={inputDescriptionIdentifier}
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
            </div>
          </Fragment>
        );
      })}
    </fieldset>
  );
}

function composeAriaLabelForAuswahloption(
  option: Auswahloption,
  elterngeldbezug: Elterngeldbezug,
): string {
  return elterngeldbezug
    ? `${option} mit ${formatAsCurrency(elterngeldbezug)}`
    : option;
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

type GridLayout = {
  firstRowIndex: number;
  areaClassNames: {
    fieldset: string;
    info: string;
    input: string;
  };
};
