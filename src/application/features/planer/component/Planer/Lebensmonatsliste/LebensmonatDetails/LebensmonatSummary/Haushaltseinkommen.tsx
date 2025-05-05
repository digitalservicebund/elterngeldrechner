import BusinessCenterIcon from "@digitalservicebund/icons/BusinessCenterOutlined";
import ErrorIcon from "@digitalservicebund/icons/Error";
import classNames from "classnames";
import { type CSSProperties, ReactNode } from "react";
import {
  Geldbetrag,
  InfoDialog,
} from "@/application/features/planer/component/common";
import type { Einkommen, Elterngeldbezug } from "@/monatsplaner";

type Props = {
  readonly elterngeldbezug?: Elterngeldbezug;
  readonly bruttoeinkommen?: Einkommen;
  readonly bruttoeinkommenIsMissing: boolean;
  readonly imMutterschutz?: boolean;
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly ariaHidden?: boolean;
};
export function Haushaltseinkommen({
  elterngeldbezug,
  bruttoeinkommen,
  bruttoeinkommenIsMissing,
  imMutterschutz,
  className,
  style,
  ariaHidden,
}: Props): ReactNode | undefined {
  if (imMutterschutz) {
    return (
      <InfoDialog
        className={className}
        style={style}
        ariaLabelForDialog="Informationen zum Elterngeldbezug im Mutterschutz"
        info="Sie haben angegeben, dass Sie Mutterschaftsleistungen beziehen. Monate mit Mutterschaftsleistungen gelten als Monate mit Basiselterngeld. Sind die Mutterschaftsleistungen höher als
        das Elterngeld, bekommen Sie nur die Mutterschaftsleistungen."
      />
    );
  } else {
    return (
      <div
        className={classNames("flex flex-col items-center", className)}
        style={style}
        aria-hidden={ariaHidden}
      >
        {!!elterngeldbezug && (
          <Geldbetrag className="font-bold" betrag={elterngeldbezug} />
        )}

        {!!bruttoeinkommen && (
          <span>
            <BusinessCenterIcon />
            &nbsp;
            <Geldbetrag betrag={bruttoeinkommen} />
          </span>
        )}

        {!!bruttoeinkommenIsMissing && (
          <span>
            <ErrorIcon className="text-warning" />
          </span>
        )}
      </div>
    );
  }
}
