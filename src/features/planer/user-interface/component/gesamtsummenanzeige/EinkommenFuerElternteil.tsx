import PersonIcon from "@digitalservicebund/icons/PersonOutline";
import BusinessCenterOutlined from "@digitalservicebund/icons/BusinessCenterOutlined";
import type { ReactNode } from "react";
import classNames from "classnames";
import { Geldbetrag } from "@/features/planer/user-interface/component/Geldbetrag";
import type { SummeFuerElternteil } from "@/features/planer/domain";

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
