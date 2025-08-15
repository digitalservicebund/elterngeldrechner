import CloseIcon from "@digitalservicebund/icons/Close";
import classNames from "classnames";
import type { CSSProperties, ReactNode } from "react";
import { Auswahloption, KeinElterngeld, Variante } from "@/monatsplaner";

type Props = {
  readonly auswahloption: Auswahloption;
  readonly style?: CSSProperties;
  readonly className?: string;
};

export function BeispielAuswahloptionPlakette({
  auswahloption,
  style,
  className,
}: Props): ReactNode {
  const baseClasses = "flex items-center justify-center";

  switch (auswahloption) {
    case KeinElterngeld:
      return (
        <div
          className={classNames(
            baseClasses,
            className,
            "bg-white border border-solid border-grey",
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
    case Variante.Bonus:
      return (
        <div
          className={classNames(baseClasses, className, "bg-Bonus")}
          aria-hidden="true"
          style={style}
        >
          B
        </div>
      );
  }
}
