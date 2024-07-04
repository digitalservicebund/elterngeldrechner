import GehaltIcon from "@digitalservicebund/icons/BusinessCenterOutlined";
import { Variante, type Lebensmonat } from "./types";
import { ElterngeldvarianteBadge } from "@/components/atoms/ElterngeldVarianteBadge";
import { formatAsCurrency } from "@/utils/locale-formatting";

type Props = {
  readonly month: Lebensmonat;
};

export function PlanungsdetailsMonth({ month }: Props) {
  const {
    type,
    isMutterschutzMonth,
    elterngeld,
    nettoEinkommen,
    verfuegbaresEinkommen,
  } = month;
  const isVariant =
    ["BEG", "EG+", "PSB"].includes(type) && !isMutterschutzMonth;

  return (
    <div className="flex items-start gap-x-8">
      {type === "None" ? "– kein Elterngeld –" : ""}
      {isMutterschutzMonth ? "Mutterschutz" : ""}

      {isVariant ? (
        <>
          <ElterngeldvarianteBadge
            variante={type as Variante}
            className="min-w-[7ch]"
          />
          {nettoEinkommen > 0 ? (
            <div>
              <div>
                {elterngeld > 0 && formatAsCurrency(elterngeld)}{" "}
                <span>
                  | <GehaltIcon /> Einkommen {formatAsCurrency(nettoEinkommen)}
                </span>
              </div>
              {verfuegbaresEinkommen > 0 && (
                <div className="font-bold leading-[0.5]">
                  = <span className="sr-only">verfügbares Einkommen</span>
                  {formatAsCurrency(verfuegbaresEinkommen)}
                </div>
              )}
            </div>
          ) : (
            <span className="font-bold">
              {elterngeld > 0 && formatAsCurrency(elterngeld)}
            </span>
          )}
        </>
      ) : null}
    </div>
  );
}
