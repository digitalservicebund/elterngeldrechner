import { ReactNode } from "react";
import { DetailsOfVariante, Variante } from "./types";
import { ElterngeldvarianteBadge } from "@/components/atoms/ElterngeldVarianteBadge";
import { formatAsCurrency } from "@/utils/locale-formatting";

type Props = {
  readonly variante: Variante;
  readonly details: DetailsOfVariante;
};

export function VariantenDetails({ variante, details }: Props): ReactNode {
  const label = LABEL_PER_VARIANTE[variante];
  const { elterngeld, nettoEinkommen, numberOfMonths } = details;
  const formattedElterngeld = formatAsCurrency(elterngeld);
  const formattedNettoEinkommen = formatAsCurrency(nettoEinkommen);

  return (
    <>
      <ElterngeldvarianteBadge variante={variante} className="min-w-[7ch]" />

      <span>
        {label} | {numberOfMonths} Monate
        <br />
        <strong>{formattedElterngeld}</strong>
        {nettoEinkommen > 0 &&
          ` | zusätzliches Einkommen ${formattedNettoEinkommen}`}
      </span>
    </>
  );
}

const LABEL_PER_VARIANTE: Record<Variante, string> = {
  BEG: "BasisElterngeld",
  "EG+": "ElterngeldPlus",
  PSB: "Partnerschaftsbonus",
  None: "kein Elterngeld",
};
