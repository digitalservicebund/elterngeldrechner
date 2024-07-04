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
        "px-8 pt-6 pb-10 text-center rounded font-bold flex items-center justify-center leading-[1.444]",
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
