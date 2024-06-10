import { ReactNode } from "react";
import AddIcon from "@digitalservicebund/icons/Add";
import classNames from "classnames";
import { ElterngeldType } from "@/monatsplaner";

type Props = {
  readonly variante: ElterngeldType;
  readonly className?: string;
};

export function ElterngeldvarianteBadge({
  variante,
  className,
}: Props): ReactNode {
  const label = variante ? LABELS[variante] : <AddIcon />;
  const variantClassName = CLASS_NAME[variante];

  return (
    <span
      className={classNames(
        "py-8 px-4 rounded text-center font-bold flex items-center justify-center",
        className,
        variantClassName,
      )}
    >
      {label}
    </span>
  );
}

const LABELS: Record<ElterngeldType, string> = {
  BEG: "Basis",
  "EG+": "Plus",
  PSB: "Bonus",
  None: "kein Elterngeld",
};

const CLASS_NAME: Record<ElterngeldType, string> = {
  BEG: "bg-Basis text-white",
  "EG+": "bg-Plus text-black",
  PSB: "bg-Bonus text-black",
  None: "bg-white text-black border-grey border-2",
};
