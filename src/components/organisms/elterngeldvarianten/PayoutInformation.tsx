import PermIdentityIcon from "@digitalservicebund/icons/PermIdentity";
import { ReactNode } from "react";
import { formatAsCurrency } from "../../../utils/locale-formatting";

type Props = {
  parentName?: string;
  amount: number;
};

export function PayoutInformation({ parentName, amount }: Props): ReactNode {
  const formattedAmount = formatAsCurrency(amount);

  return (
    <div className="inline-flex items-center gap-4">
      <PermIdentityIcon className="inline h-20" />
      <span>
        {parentName && `${parentName} | `}
        <strong>{formattedAmount}</strong> pro Monat
      </span>
    </div>
  );
}
