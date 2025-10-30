import BusinessCenterIcon from "@digitalservicebund/icons/BusinessCenterOutlined";
import ErrorIcon from "@digitalservicebund/icons/Error";
import classNames from "classnames";
import { type CSSProperties, ReactNode } from "react";
import { Geldbetrag } from "@/application/components";
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
      <div
        className={classNames(
          "flex flex-col items-center text-14 italic",
          className,
        )}
        style={style}
        aria-hidden={ariaHidden}
      >
        Mutterschutz
      </div>
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
