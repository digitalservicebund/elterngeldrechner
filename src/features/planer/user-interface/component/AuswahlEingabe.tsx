import { ReactNode } from "react";
import classNames from "classnames";
import { formatAsCurrency } from "@/utils/locale-formatting";
import {
  KeinElterngeld,
  Variante,
  type Auswahlmoeglichkeiten,
  type Auswahloption,
  Auswahloptionen,
} from "@/features/planer/user-interface/service";
import { InfoDialog } from "@/components/molecules/info-dialog";

type Props = {
  readonly legend: string;
  readonly auswahlmoeglichkeiten: Auswahlmoeglichkeiten;
  readonly gewaehlteOption?: Auswahloption;
  readonly waehleOption: (option: Auswahloption) => void;
  readonly showDisabledHintRight?: boolean;
  readonly className?: string;
};

export function AuswahlEingabe({
  legend,
  gewaehlteOption,
  auswahlmoeglichkeiten,
  waehleOption,
  showDisabledHintRight,
  className,
}: Props): ReactNode {
  return (
    <fieldset className={classNames("flex flex-col gap-10", className)}>
      <legend className="sr-only">{legend}</legend>

      {Auswahloptionen.sort(sortByAuswahloption).map((option) => {
        const { elterngeldbezug, isDisabled, hintWhyDisabled } =
          auswahlmoeglichkeiten[option];
        const { label, className, checkedClassName } =
          RENDER_PROPERTIES[option];
        const infoAriaLabel = `Informationen wieso ${option} nicht verfügbar ist`;
        const isChecked = gewaehlteOption === option;
        const waehleDieseOption = () => !isDisabled && waehleOption(option);

        return (
          <div
            key={option}
            className={classNames("flex items-center justify-end gap-8", {
              "flex-row-reverse": showDisabledHintRight,
            })}
          >
            <InfoDialog
              className={classNames("min-w-24", {
                invisible: !hintWhyDisabled,
              })}
              ariaLabelForDialog={infoAriaLabel}
              info={hintWhyDisabled}
            />

            <label
              className={classNames(
                "p-9 col-start-2 flex min-h-56 max-w-[25ch] grow items-center justify-center rounded bg-Basis p-8 text-center",
                { "!bg-grey !text-black": isDisabled },
                { "hover:cursor-pointer hover:underline": !isDisabled },
                { [checkedClassName]: isChecked && !isDisabled },
                className,
              )}
            >
              <input
                type="radio"
                className="appearance-none focus:outline-none"
                aria-describedby=""
                name={legend}
                value={option}
                aria-disabled={isDisabled}
                checked={isChecked}
                onChange={waehleDieseOption}
              />
              <span className="font-bold">{label}</span>
              {!!elterngeldbezug && (
                <>&nbsp;{formatAsCurrency(elterngeldbezug)}</>
              )}
            </label>
          </div>
        );
      })}
    </fieldset>
  );
}

const SHARED_CHECKED_CLASS_NAME = "ring-4";
const RENDER_PROPERTIES: Record<Auswahloption, RenderProperties> = {
  [Variante.Basis]: {
    label: "Basis",
    className: "bg-Basis text-white",
    checkedClassName: classNames("ring-Plus", SHARED_CHECKED_CLASS_NAME),
  },
  [Variante.Plus]: {
    label: "Plus",
    className: "bg-Plus text-black",
    checkedClassName: classNames("ring-Basis", SHARED_CHECKED_CLASS_NAME),
  },
  [Variante.Bonus]: {
    label: "Bonus",
    className: "bg-Bonus text-black",
    checkedClassName: classNames("ring-Basis", SHARED_CHECKED_CLASS_NAME),
  },
  [KeinElterngeld]: {
    label: "kein Elterngeld",
    className: "bg-white text-black border-grey border-2 border-solid",
    checkedClassName: classNames(
      "ring-Basis border-none",
      SHARED_CHECKED_CLASS_NAME,
    ),
  },
};

type RenderProperties = {
  label: string;
  className: string;
  checkedClassName: string;
};

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
