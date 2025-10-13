import BusinessCenterOutlined from "@digitalservicebund/icons/BusinessCenterOutlined";
import type { ReactNode } from "react";
import { Geldbetrag } from "@/application/components";
import type { SummeFuerElternteil } from "@/monatsplaner";

type Props = {
  readonly summe: SummeFuerElternteil;
};

export function EinkommenFuerElternteil({ summe }: Props): ReactNode {
  return (
    <div>
      <span className="pr-4">Einkommen:</span>

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
