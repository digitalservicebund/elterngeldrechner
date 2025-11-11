import BusinessCenterOutlined from "@digitalservicebund/icons/BusinessCenterOutlined";
import classNames from "classnames";
import type { ReactNode } from "react";
import { Geldbetrag } from "@/application/components";
import type { SummeFuerElternteil } from "@/monatsplaner";

type Props = {
  readonly summe: SummeFuerElternteil;
  readonly className?: string;
};

export function EinkommenFuerElternteil({
  summe,
  className,
}: Props): ReactNode {
  return (
    <div
      className={classNames("flex flex-col sm:gap-4 sm:flex-row", className)}
    >
      <span>Einkommen:</span>

      <span>
        <BusinessCenterOutlined className="mr-4" />

        {summe.bruttoeinkommen > 0 ? (
          <span>
            <Geldbetrag betrag={summe.bruttoeinkommen} />
            &nbsp;(brutto)
          </span>
        ) : (
          "-"
        )}
      </span>
    </div>
  );
}
