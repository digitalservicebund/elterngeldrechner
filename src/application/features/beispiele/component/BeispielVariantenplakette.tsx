import CloseIcon from "@digitalservicebund/icons/Close";
import classNames from "classnames";
import type { CSSProperties, ReactNode } from "react";
import { BeispielVariante } from "@/application/features/beispiele/types";
import { KeinElterngeld, Variante } from "@/monatsplaner";

type Props = {
  readonly variante: BeispielVariante;
  readonly style?: CSSProperties;
  readonly className?: string;
};

export function BeispielVariantenplakette({
  variante,
  style,
  className,
}: Props): ReactNode {
  const baseClasses = "flex items-center justify-center";

  switch (variante) {
    case KeinElterngeld:
      return (
        <div
          className={classNames(
            baseClasses,
            className,
            "border border-solid border-grey",
          )}
          aria-hidden="true"
          style={style}
        >
          <CloseIcon aria-hidden="true" focusable="false" />
        </div>
      );
    case Variante.Basis:
      return (
        <div
          className={classNames(baseClasses, className, "bg-Basis text-white")}
          aria-hidden="true"
          style={style}
        >
          B
        </div>
      );
    case Variante.Plus:
      return (
        <div
          className={classNames(baseClasses, className, "bg-Plus")}
          aria-hidden="true"
          style={style}
        >
          P
        </div>
      );
  }
}
