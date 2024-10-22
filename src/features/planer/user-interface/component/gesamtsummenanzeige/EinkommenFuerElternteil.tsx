import PersonIcon from "@digitalservicebund/icons/PersonOutline";
import BusinessCenterOutlined from "@digitalservicebund/icons/BusinessCenterOutlined";
import type { ReactNode } from "react";
import classNames from "classnames";
import type { SummeFuerElternteil } from "@/features/planer/user-interface/service";
import { formatAsCurrency } from "@/utils/formatAsCurrency";

type Props = {
  readonly pseudonum: string;
  readonly summe: SummeFuerElternteil;
  readonly className?: string;
};

export function EinkommenFuerElternteil({
  pseudonum,
  summe,
  className,
}: Props): ReactNode {
  const einkommen =
    summe.bruttoeinkommen > 0 ? (
      <span>{formatAsCurrency(summe.bruttoeinkommen)} (brutto)</span>
    ) : (
      "-"
    );

  return (
    <div className={classNames("flex flex-col items-center", className)}>
      <span className="font-bold">
        <PersonIcon /> {pseudonum}: Einkommen
      </span>

      <span>
        <BusinessCenterOutlined className="mr-4" /> {einkommen}
      </span>
    </div>
  );
}
