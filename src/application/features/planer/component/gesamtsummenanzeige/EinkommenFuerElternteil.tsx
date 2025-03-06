import BusinessCenterOutlined from "@digitalservicebund/icons/BusinessCenterOutlined";
import PersonIcon from "@digitalservicebund/icons/PersonOutline";
import classNames from "classnames";
import type { ReactNode } from "react";
import type { SummeFuerElternteil } from "./berechneGesamtsumme";
import { Geldbetrag } from "@/application/features/planer/component/Geldbetrag";

type Props = {
  readonly pseudonym: string | undefined;
  readonly summe: SummeFuerElternteil;
  readonly className?: string;
};

export function EinkommenFuerElternteil({
  pseudonym,
  summe,
  className,
}: Props): ReactNode {
  return (
    <div className={classNames("flex flex-col items-center", className)}>
      <span className="font-bold">
        {!!pseudonym && (
          <>
            <PersonIcon /> {pseudonym}:{" "}
          </>
        )}
        Einkommen
      </span>

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
