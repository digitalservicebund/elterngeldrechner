import GehaltIcon from "@digitalservicebund/icons/BusinessCenterOutlined";
import { Variante } from "./types";
import { ElterngeldvarianteBadge } from "@/components/atoms/ElterngeldVarianteBadge";
import { formatAsCurrency } from "@/utils/locale-formatting";

type Props = {
  readonly month: {
    type: string;
    isMutterschutzMonth?: boolean;
    elterngeld?: number;
    nettoEinkommen?: number;
    verfuegbaresEinkommen?: number;
  };
};

export function PlanungsdetailsMonth({ month = { type: "None" } }: Props) {
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
          {typeof nettoEinkommen === "number" ? (
            <div>
              <div>
                {typeof elterngeld === "number"
                  ? formatAsCurrency(elterngeld)
                  : ""}{" "}
                {nettoEinkommen ? (
                  <span>
                    | <GehaltIcon /> Gehalt {formatAsCurrency(nettoEinkommen)}
                  </span>
                ) : (
                  ""
                )}
              </div>
              {nettoEinkommen && verfuegbaresEinkommen ? (
                <div className="font-bold leading-[0.5]">
                  = <span className="sr-only">verfügbares Einkommen</span>
                  {formatAsCurrency(verfuegbaresEinkommen)}
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            <span className="font-bold">
              {typeof elterngeld === "number"
                ? formatAsCurrency(elterngeld)
                : ""}
            </span>
          )}
        </>
      ) : (
        ""
      )}
    </div>
  );
}
