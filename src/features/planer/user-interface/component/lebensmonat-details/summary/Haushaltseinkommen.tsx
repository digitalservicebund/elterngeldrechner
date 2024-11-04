import { ReactNode, type CSSProperties } from "react";
import BusinessCenterIcon from "@digitalservicebund/icons/BusinessCenterOutlined";
import classNames from "classnames";
import type {
  Einkommen,
  Elterngeldbezug,
} from "@/features/planer/user-interface/service";
import { formatAsCurrency } from "@/utils/formatAsCurrency";
import { InfoDialog } from "@/components/molecules/info-dialog";

type Props = {
  readonly elterngeldbezug?: Elterngeldbezug;
  readonly bruttoeinkommen?: Einkommen;
  readonly imMutterschutz?: boolean;
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly ariaHidden?: boolean;
};
export function Haushaltseinkommen({
  elterngeldbezug,
  bruttoeinkommen,
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
          <span className="font-bold">{formatAsCurrency(elterngeldbezug)}</span>
        )}

        {!!bruttoeinkommen && (
          <span>
            <BusinessCenterIcon /> {formatAsCurrency(bruttoeinkommen)}
          </span>
        )}
      </div>
    );
  }
}
