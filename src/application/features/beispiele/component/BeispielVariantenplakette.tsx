import CloseIcon from "@digitalservicebund/icons/Close";
import classNames from "classnames";
import type { ReactNode } from "react";
import { Variante } from "@/monatsplaner";

export type BeispielVariante =
  | Exclude<Variante, Variante.Bonus>
  | "Kein Elterngeld";

type Props = {
  readonly variante: BeispielVariante;
  readonly className?: string;
};

export function BeispielVariantenplakette({ variante }: Props): ReactNode {
  const baseClasses = "flex items-center justify-center h-[32px] w-[64px]";

  switch (variante) {
    case "Kein Elterngeld":
      return (
        <span
          className={classNames(baseClasses, "border border-solid border-grey")}
          aria-hidden="true"
        >
          <CloseIcon aria-hidden="true" focusable="false" />
        </span>
      );
    case Variante.Basis:
      return (
        <span
          className={classNames(baseClasses, "bg-Basis text-white")}
          aria-hidden="true"
        >
          B
        </span>
      );
    case Variante.Plus:
      return (
        <span className={classNames(baseClasses, "bg-Plus")} aria-hidden="true">
          P
        </span>
      );
  }
}
