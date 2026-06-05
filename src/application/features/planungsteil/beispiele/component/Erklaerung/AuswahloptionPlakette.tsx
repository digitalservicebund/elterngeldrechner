import CloseIcon from "@digitalservicebund/icons/Close";
import classNames from "classnames";
import type { CSSProperties, ReactNode } from "react";
import { Auswahloption, KeinElterngeld, Variante } from "@/monatsplaner";

type Props = {
  readonly auswahloption: Auswahloption;
  readonly style?: CSSProperties;
  readonly className?: string;
};

export function AuswahloptionPlakette({
  auswahloption,
  style,
  className,
}: Props): ReactNode {
  switch (auswahloption) {
    case KeinElterngeld:
      return (
        <div
          className={classNames(
            className,
            "flex items-center justify-center",
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
          className={classNames(className, "bg-Basis text-white text-center")}
          aria-hidden="true"
          style={style}
        >
          B
        </div>
      );
    case Variante.Plus:
      return (
        <div
          className={classNames(className, "bg-Plus text-center")}
          aria-hidden="true"
          style={style}
        >
          P
        </div>
      );
    case Variante.Bonus:
      return (
        <div
          className={classNames(className, "bg-Bonus text-center")}
          aria-hidden="true"
          style={style}
        >
          B
        </div>
      );
  }
}
