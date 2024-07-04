import { ReactNode } from "react";
import classNames from "classnames";
import { ElterngeldType } from "@/monatsplaner";
import { formatAsCurrency } from "@/utils/locale-formatting";

type Props = {
  readonly inputGroupName: string;
  readonly checkedVariante?: ElterngeldType;
  readonly auszahlungen: Record<Exclude<ElterngeldType, "None">, number>;
  readonly onChange: (value: ElterngeldType) => void;
};

export function ElterngeldvariantenRadioButtonGroup({
  inputGroupName,
  checkedVariante,
  auszahlungen,
  onChange,
}: Props): ReactNode {
  return (
    <>
      {OPTIONS.map(({ variante, label, className, checkedClassName }) => {
        const isChecked = variante === checkedVariante;
        const auszahlung = variante !== "None" && auszahlungen[variante];
        const checkThisOption = () => onChange(variante);

        return (
          <label
            key={variante}
            className={classNames(
              "p-8 rounded min-h-56 flex justify-center items-center hover:underline",
              { [checkedClassName]: isChecked },
              className,
            )}
          >
            <input
              type="radio"
              className="appearance-none focus:outline-none"
              name={inputGroupName}
              value={variante}
              checked={isChecked}
              onChange={checkThisOption}
            />
            <span className="font-bold">{label}</span>
            {!!auszahlung && <>&nbsp;{formatAsCurrency(auszahlung)}</>}
          </label>
        );
      })}
    </>
  );
}

const SHARED_CHECKED_CLASS_NAME = "ring-4";
const OPTIONS: Option[] = [
  {
    variante: "BEG",
    label: "Basis",
    className: "bg-Basis text-white",
    checkedClassName: classNames("ring-Plus", SHARED_CHECKED_CLASS_NAME),
  },
  {
    variante: "EG+",
    label: "Plus",
    className: "bg-Plus text-black",
    checkedClassName: classNames("ring-Basis", SHARED_CHECKED_CLASS_NAME),
  },
  {
    variante: "PSB",
    label: "Bonus",
    className: "bg-Bonus text-black",
    checkedClassName: classNames("ring-Basis", SHARED_CHECKED_CLASS_NAME),
  },
  {
    variante: "None",
    label: "kein Elterngeld",
    className: "bg-white text-black border-grey border-2 border-solid",
    checkedClassName: classNames(
      "ring-Basis border-none",
      SHARED_CHECKED_CLASS_NAME,
    ),
  },
];

type Option = {
  variante: ElterngeldType;
  label: string;
  className: string;
  checkedClassName: string;
};
