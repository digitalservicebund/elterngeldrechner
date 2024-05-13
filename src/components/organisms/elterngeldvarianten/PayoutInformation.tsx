import PermIdentityIcon from "@digitalservicebund/icons/PermIdentity";
import { ReactNode } from "react";
import { formatAsCurrency } from "../../../utils/locale-formatting";

type Props = {
  name?: string;
  amount: number;
};

export function PayoutInformation({ name, amount }: Props): ReactNode {
  const formattedAmount = formatAsCurrency(amount);

  return (
    <div className="inline-flex items-center gap-4">
      <PermIdentityIcon />
      <span>
        {name && `${name} | `}
        <strong>{formattedAmount}</strong> pro Monat
      </span>
    </div>
  );
}
