import { ReactNode } from "react";
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
  return (
    <span
      className={classNames(
        "flex items-center justify-center rounded px-8 pb-10 pt-6 text-center font-bold leading-[1.444]",
        className,
        CLASS_NAME[variante],
      )}
    >
      {LABELS[variante]}
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
